from flask import Blueprint, Flask, jsonify, request, make_response
from application.utils.db_helpers import get_db_connection
import os
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from azure.storage.blob import BlobServiceClient
from azure.core.exceptions import ResourceNotFoundError
import urllib.parse
from azure.storage.blob import ContentSettings


medicalRecords_bp = Blueprint('medicalRecords', __name__)

JWT_SECRET = os.getenv('JWT_SECRET', 'GP_UK')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')

# Connection string for Azure Blob Storage
CONNECTION_STRING = os.getenv('CONNECTION_STRING')
blob_service_client = BlobServiceClient.from_connection_string(CONNECTION_STRING)


ALLOWED_RECORD_TYPES = ['X-ray', 'Reports', 'Prescriptions', 'Other']


#API endpoint to upload the docs.
@medicalRecords_bp.route('/upload/<patient_id>', methods=['POST'])
@jwt_required()
def upload_multiple_medical_records(patient_id):
    if 'files' not in request.files:
        return jsonify({'message': 'No files part in the request'}), 400

    files = request.files.getlist('files')
    categories = request.form.getlist('categories')  # gets a list of categories along with its file

    # This checks the length of the list above, to ensure that the number of categories matches the number of files
    if len(files) != len(categories):
        return jsonify({'message': 'Mismatch between number of files and categories'}), 400

    # checks categores from list of allowed records.
    for category in categories:
        if category not in ALLOWED_RECORD_TYPES:
            return jsonify({'message': f'Invalid category: {category}'}), 400

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT container_name FROM Patient WHERE P_id = ?", (patient_id,))
            patient_data = cursor.fetchone()

            if not patient_data:
                return jsonify({'message': f'Patient with ID {patient_id} not found'}), 404

            container_name = patient_data[0]
            uploaded_files = []

            # Upload files under their categorie names
            for file, category in zip(files, categories):
                if file.filename != '':
                    subfolder_name = category  #category is used for providing the subfolder name
                    blob_client = blob_service_client.get_blob_client(
                        container=container_name,
                        blob=f"{subfolder_name}/{file.filename}"
                    )
                    blob_client.upload_blob(
                        file.stream.read(),
                        overwrite=True,  # we are overwriting if file already exists
                        content_settings=ContentSettings(content_type=file.content_type)
                    )
                    uploaded_files.append(f"{subfolder_name}/{file.filename}")

            if uploaded_files:
                return jsonify({
                    'message': f'Files "{", ".join(uploaded_files)}" uploaded successfully to container "{container_name}"'
                }), 201
            else:
                return jsonify({'message': 'No valid files were selected for upload'}), 400

        except Exception as e:
            return jsonify({'message': f'Error uploading files: {str(e)}'}), 500

        finally:
            conn.close()

    else:
        return jsonify({'message': 'Database connection failed'}), 500



#API endpoint to get the patients file for Patients
@medicalRecords_bp.route('/patient/files', methods=['GET'])
@jwt_required()
def get_patient_files():
    patient_id = request.args.get('patient_id')
  

    if not patient_id:
        return jsonify({'message': 'Missing required parameters: firstName, lastName, dob'}), 400

    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT container_name
            FROM Patient
            WHERE P_id = ?
        """, (patient_id))
        patient_data = cursor.fetchone()
      
        conn.close()

        if not patient_data:
            return jsonify({'message': 'Patient not found with the provided details'}), 404

        container_name = patient_data[0]
        file_list = []

        try:
            container_client = blob_service_client.get_container_client(container=container_name)
            blobs = container_client.list_blobs()
            for blob in blobs:
                file_list.append({'name': blob.name, 'url': container_client.get_blob_client(blob=blob.name).url})
            return jsonify({'patient_files': file_list}), 200
        except ResourceNotFoundError:
            return jsonify({'message': f'Container "{container_name}" not found for the patient'}), 404
        except Exception as e:
            return jsonify({'message': f'Error retrieving files: {e}'}), 500
    else:
        return jsonify({'message': 'Database connection failed'}), 500
    

#API endpoint to get the patients file for Doctors
@medicalRecords_bp.route('/patient/medicalRecords', methods=['POST'])
@jwt_required()
def get_patient_files_for_doctor():
    docEmail = get_jwt_identity()
    data = request.get_json()
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    dob = data.get('dob')

    if not docEmail:
        return jsonify({'message': 'Not Authorised'}), 401

    if not first_name or not last_name or not dob:
        return jsonify({'message': 'Missing required parameters: firstName, lastName, dob'}), 400


    conn = None
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'message': 'Database connection failed'}), 500

        cursor = conn.cursor()
        cursor.execute("""
            SELECT container_name
            FROM Patient
            WHERE P_FirstName=? AND P_LastName=? AND DOB=?
        """, (first_name, last_name, dob))
        patient_data = cursor.fetchone()
   
        if not patient_data:
            return jsonify({'message': 'Patient not found with the provided details'}), 404

        container_name = patient_data[0]
        container_client = blob_service_client.get_container_client(container=container_name)
        folders = set()
        blob_list = container_client.list_blobs()

        for blob in blob_list:
            parts = blob.name.split('/')
            if len(parts) > 1:
                folders.add(parts[0])

        folder_structure = {}
        for folder in folders:
            folder_structure[folder] = []
            blobs_in_folder = container_client.list_blobs(name_starts_with=f"{folder}/")
            for blob in blobs_in_folder:
                folder_structure[folder].append({
                    'name': blob.name.split('/')[-1],
                    'url': container_client.get_blob_client(blob=blob.name).url
                })

        return jsonify({'folders': folder_structure}), 200

    except ResourceNotFoundError:
        return jsonify({'message': f'Container "{container_name}" not found for the patient'}), 404
    except Exception as e:
        return jsonify({'message': f'Error fetching medical records: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()