from flask import Blueprint, Flask, jsonify, request,make_response
from application.utils.db_helpers import get_db_connection
import pyodbc
import hashlib
from flask_jwt_extended import jwt_required,get_jwt_identity
import os
import datetime
import uuid
import jwt
from azure.storage.blob import BlobServiceClient, PublicAccess


adminRoutes_bp = Blueprint('adminRoutes', __name__)

JWT_SECRET = os.getenv('JWT_SECRET', 'GP_UK')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')

# Connection string for the Azure Blob Storage
CONNECTION_STRING = os.getenv('CONNECTION_STRING')
blob_service_client = BlobServiceClient.from_connection_string(CONNECTION_STRING)

# Utility function to change access level of containers after patinet is registered
def change_container_access(container_name, public_access_level):
    try:
        container_client = blob_service_client.get_container_client(container_name)
        container_client.set_container_access_policy(public_access=public_access_level,signed_identifiers={} )
        print(f"Successfully changed public access for container '{container_name}' to '{public_access_level}'.")
        return True
    except Exception as e:
        print(f"Error changing public access for container '{container_name}': {e}")
        return False
    
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_staff(email):
    try:
        dotIndex = email.index('.')
        atIndex = email.index('@')
        if dotIndex < atIndex:
            return email[dotIndex + 1:atIndex]
        else:
            return None 
    except ValueError:
        return 'No . or @ found'

# -------------utility functions for Doctor and Nurse registration----------------
# Doctor Registration
def register_doctor(conn, data, admin_id):
    cursor = conn.cursor()
    if not data['staffEmail'] or not data['staffPhone']:
        return jsonify({'message': 'Invalid email or phone number'}), 400

    if verify_staff(data['staffEmail']) != 'doctor':
        return jsonify({'message': 'Email should have .doctor'}), 403
    
    cursor.execute("""SELECT 1 FROM Doctor WHERE Doctor_Email = ? OR Doctor_Phone_No = ?""", (data['staffEmail'], data['staffPhone']))
    if cursor.fetchone():
        return jsonify({'message': 'Doctor Already Registered'}), 400

    hashed_password = hash_password(data['staffPassword'])

    cursor.execute("""
        INSERT INTO Doctor (Doctor_FirstName, Doctor_LastName, Doctor_Email, Doctor_Phone_No, Doctor_Registration_Number, Specialization_ID, D_Password, Registered_By_Admin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (data['staffFirstName'], data['staffLastName'], data['staffEmail'], data['staffPhone'], data['staffRegistrationNumber'], data['staffSpecialization'], hashed_password, admin_id))
    conn.commit()
    return jsonify({'message': 'Doctor registered successfully'}), 201


# Nurse Registration
def register_nurse(conn, data, admin_id):
    cursor = conn.cursor()
    if not data['staffEmail'] or not data['staffPhone']:
        return jsonify({'message': 'Invalid email or phone number'}), 400
    
    if verify_staff(data['staffEmail']) != 'nurse':
        return jsonify({'message': 'Email should have .nurse'}), 403

    cursor.execute("""SELECT 1 FROM Nurse WHERE Nurse_Email = ? OR Nurse_Phone_No = ?""", (data['staffEmail'], data['staffPhone']))
    if cursor.fetchone():
        return jsonify({'message': 'Nurse Already Registered'}), 400

    hashed_password = hash_password(data['staffPassword'])

    cursor.execute("""
        INSERT INTO Nurse (Nurse_FirstName, Nurse_LastName, Nurse_Email, Nurse_Phone_No, Nurse_Registration_Number, Specialization_ID, N_Password, Registered_By_Admin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (data['staffFirstName'], data['staffLastName'], data['staffEmail'], data['staffPhone'], data['staffRegistrationNumber'], data['staffSpecialization'], hashed_password, admin_id))
    conn.commit()
    return jsonify({'message': 'Nurse registered successfully'}), 201



# Auth Endpoints ----------------------------------------------------------------------------------------------

#API Endpoint for staff Creation
@adminRoutes_bp.route('/staff/registration',methods=['POST'])
@jwt_required()
def createStaff():
    data = request.get_json()
    admin_Email = get_jwt_identity()
    staffType = data.get('staffType')
    staffFirstName = data.get('staffFirstName')
    staffLastName = data.get('staffLastName')
    staffEmail = data.get('staffEmail')
    staffPhone = data.get('staffPhone')
    staffRegistrationNumber = data.get('staffRegistrationNumber')
    staffSpecialization =  data.get('staffSpecialization')
    staffPassword = data.get('staffPassword')

    if not all([admin_Email,staffType,staffFirstName,staffLastName,staffEmail,staffPhone,staffRegistrationNumber,staffSpecialization,staffPassword]):
        return jsonify({'message': 'Missing email or password'}), 400
    
    
    if verify_staff(admin_Email) != 'admin':
        return jsonify({'message': 'Admin level rights required for staff registration'}), 403

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()

            cursor.execute("""SELECT Specialization_ID FROM Specialization WHERE Specialization_ID = ?""", (staffSpecialization,))
            specialization_row = cursor.fetchone()
            if not specialization_row:
                return jsonify({'message': 'Invalid specialization ID'}), 400
            

            cursor.execute("""SELECT Admin_id FROM Admin WHERE Admin_Email = ?""", (admin_Email,))
            admin_row = cursor.fetchone()
            if not admin_row:
                return jsonify({'message': 'Cannot find Admin id'}), 400
            admin_id = admin_row[0]  

            if data['staffType'] == 'Doctor':
                return register_doctor(conn, data, admin_id)
            elif data['staffType'] == 'Nurse':
                return register_nurse(conn, data, admin_id)
            else:
                return jsonify({'message': 'Invalid staff type'}), 400
        except Exception as e:
            return jsonify({'message': f'Error: {e}'}), 500
        finally:
            conn.close()
    else:
        return jsonify({'message': 'Database connection failed'}), 500
    



#API Endpoint for Patient Creation
@adminRoutes_bp.route('/gp-patient/registration', methods=['POST'])
@jwt_required()
def create_gp_patient():
    data = request.get_json()
    admin_email =  get_jwt_identity()
    patient_first_name = data.get('patientFirstName')
    patient_last_name = data.get('patientLastName')
    patient_email = data.get('patientEmail')
    patient_phone = data.get('patientPhone')
    gender = data.get('gender')
    dob = data.get('dob')
    patient_password = data.get('patientPassword')
    street_address = data.get('streetAddress') 
    city = data.get('city')  
    postcode = data.get('postcode')

    if not all([ admin_email, patient_first_name, patient_last_name, patient_email, patient_phone, gender, dob, patient_password,street_address,city,postcode]):
        return jsonify({'message': 'Missing required fields'}), 400

    if verify_staff(admin_email) != 'admin':
        return jsonify({'message': 'Admin level rights required for patient registration'}), 403

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()

            # Verifies if the Patient already exist
            cursor.execute("""SELECT Admin_id FROM Admin WHERE Admin_Email = ?""", (admin_email,))
            admin_row = cursor.fetchone()
            if not admin_row:
                return jsonify({'message': 'Could not retrieve admin ID from the authenticated user'}), 401
            admin_id = admin_row[0]
            
            cursor.execute("""
                SELECT 1 FROM Patient WHERE Email_Id = ? OR Phone_No = ?
            """, (patient_email, patient_phone))
            existing_patient = cursor.fetchone()

            if existing_patient:
                return jsonify({'message': 'Patient with this email or phone number already exists'}), 400

            hashed_password = hash_password(patient_password)

            # Conversion of DOB string to Date object
            try:
                dob_date = datetime.datetime.strptime(dob, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'message': 'Invalid date format. Please use YYYY-MM-DD'}), 400

            unique_id = uuid.uuid4().hex[:8] # here a unique ID is been created of first 8 digits only
            container_name = f"patient-{patient_first_name.lower()}{patient_last_name.lower()}{dob.replace('-', '')}-{unique_id}"

            cursor.execute("""
                INSERT INTO Patient (P_FirstName, P_LastName, Gender, DOB, Email_Id, Phone_No, PatientPassword, Registered_By_Admin, StreetAddress, City, Postcode,container_name)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
            """, (patient_first_name, patient_last_name, gender, dob_date, patient_email, patient_phone, hashed_password, admin_id, street_address, city, postcode,container_name))

            conn.commit()
            try:
                blob_service_client.create_container(container_name)
                change_container_access(container_name, PublicAccess.BLOB)
                print(f"Container '{container_name}'created sucessfully ")
            except Exception as e:
                print(f"Container '{container_name}'creation failed, :'{e}' ")

            return jsonify({'message': 'Patient registered successfully'}), 201
        

        except pyodbc.IntegrityError:
            return jsonify({'message': 'Patient with this email or phone number already exists'}), 400
        except Exception as e:
            return jsonify({'message': f'Error: {e}'}), 500
        finally:
            conn.close()
    else:
        return jsonify({'message': 'Database connection failed'}), 500
    



#API Endpoint for staff Creation
@adminRoutes_bp.route('/getPatients',methods=['GET'])
@jwt_required()
def getPatientsList():
    admin_Email = get_jwt_identity()

    if not all([admin_Email]):
        return jsonify({'message': 'Missing email or password'}), 400
    
    if verify_staff(admin_Email) != 'admin':
        return jsonify({'message': 'Admin level rights required for staff registration'}), 403

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()

            cursor.execute("""SELECT P_id,P_FirstName,P_LastName,Gender,DOB,Email_Id,Phone_No,StreetAddress,City,Postcode FROM Patient """, )
            #Returns a list of tuples
            patient_List = cursor.fetchall()
            if not patient_List:
                return jsonify({'message': 'No Patients Found'}), 400

            patients = []
            #conversion of data from tuples to dictionary is been done 
            columns = [desc[0] for desc in cursor.description]
            for row in patient_List:
                patient = dict(zip(columns, row))
                patients.append(patient)
            
            return jsonify(patients), 200
        except Exception as e:
            return jsonify({'message': f'Error: {e}'}), 500
        finally:
            conn.close()
    else:
        return jsonify({'message': 'Database connection failed'}), 500
    


# Endpoint for Get Doctors
@adminRoutes_bp.route('/getDoctors', methods=['GET'])
@jwt_required()
def get_doctorsList():
    admin_email = get_jwt_identity()

    if not admin_email:
        return jsonify({'message': 'Missing admin email in token'}), 400

    if verify_staff(admin_email) != 'admin':
        return jsonify({'message': 'Admin level rights required'}), 403

    conn = get_db_connection()
    if not conn:
        return jsonify({'message': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT d.*, s.Specialization_Name
            FROM Doctor d
            LEFT JOIN Specialization s ON d.Specialization_ID = s.Specialization_id
        """)
        doctors = cursor.fetchall()

        if not doctors:
            return jsonify({'message': 'No doctors found'}), 404

        columns = [desc[0] for desc in cursor.description]
        doctor_list = []

        for row in doctors:
            doctor = dict(zip(columns, row))
            doctor.pop('D_Password', None)

            doctor_list.append({
                'Name': f"{doctor.get('Doctor_FirstName', '')} {doctor.get('Doctor_LastName', '')}".strip(),
                'Email': doctor.get('Doctor_Email', ''),
                'Phone': doctor.get('Doctor_Phone_No', ''),
                'RegistrationNumber': doctor.get('Doctor_Registration_Number', ''),
                'Specialization': doctor.get('Specialization_Name', 'N/A')
            })

        return jsonify(doctor_list), 200

    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500
    finally:
        conn.close()


# Endpoint for Get Nurses
@adminRoutes_bp.route('/getNurses', methods=['GET'])
@jwt_required()
def get_nursesList():
    admin_email = get_jwt_identity()

    if not admin_email:
        return jsonify({'message': 'Missing admin email in token'}), 400

    if verify_staff(admin_email) != 'admin':
        return jsonify({'message': 'Admin level rights required'}), 403

    conn = get_db_connection()
    if not conn:
        return jsonify({'message': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT n.*, s.Specialization_Name
            FROM Nurse n
            LEFT JOIN Specialization s ON n.Specialization_ID = s.Specialization_id
        """)
        nurses = cursor.fetchall()

        if not nurses:
            return jsonify({'message': 'No nurses found'}), 404

        columns = [desc[0] for desc in cursor.description]
        nurse_list = []

        for row in nurses:
            nurse = dict(zip(columns, row))
            nurse.pop('N_Password', None)

            nurse_list.append({
                'Name': f"{nurse.get('Nurse_FirstName', '')} {nurse.get('Nurse_LastName', '')}".strip(),
                'Email': nurse.get('Nurse_Email', ''),
                'Phone': nurse.get('Nurse_Phone_No', ''),
                'RegistrationNumber': nurse.get('Nurse_Registration_Number', ''),
                'Specialization': nurse.get('Specialization_Name', 'N/A')
            })

        return jsonify(nurse_list), 200

    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500
    finally:
        conn.close()


#API endpoint to Delete Patient
@adminRoutes_bp.route('/deletePatient', methods=['DELETE'])
@jwt_required()
def delete_patient():
    admin_email = get_jwt_identity()

    if verify_staff(admin_email) != 'admin':
        return jsonify({'message': 'Admin level rights required'}), 403

    email = request.args.get('email')
    if not email:
        return jsonify({'message': 'Missing patient email'}), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Patient WHERE Email_Id =?", (email,))
        if cursor.rowcount == 0:
            return jsonify({'message': 'Patient not found'}), 404
        conn.commit()
        return jsonify({'message': f'Patient with email {email} deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500
    finally:
        conn.close()


#API endpoint to Delete Doctor
@adminRoutes_bp.route('/deleteDoctor', methods=['DELETE'])
@jwt_required()
def delete_doctor():
    admin_email = get_jwt_identity()

    if verify_staff(admin_email) != 'admin':
        return jsonify({'message': 'Admin level rights required'}), 403

    email = request.args.get('email')
    if not email:
        return jsonify({'message': 'Missing doctor email'}), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Doctor WHERE Doctor_Email = ?", (email,))
        if cursor.rowcount == 0:
            return jsonify({'message': 'Doctor not found'}), 404
        conn.commit()
        return jsonify({'message': f'Doctor with email {email} deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500
    finally:
        conn.close()


#API endpoint to delete Nurse
@adminRoutes_bp.route('/deleteNurse', methods=['DELETE'])
@jwt_required()
def delete_nurse():
    admin_email = get_jwt_identity()

    if verify_staff(admin_email) != 'admin':
        return jsonify({'message': 'Admin level rights required'}), 403

    email = request.args.get('email')
    if not email:
        return jsonify({'message': 'Missing nurse email'}), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Nurse WHERE Nurse_Email = ?", (email,))
        if cursor.rowcount == 0:
            return jsonify({'message': 'Nurse not found'}), 404
        conn.commit()
        return jsonify({'message': f'Nurse with email {email} deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500
    finally:
        conn.close()