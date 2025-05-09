from flask import Blueprint, Flask, jsonify, request,make_response
from application.utils.db_helpers import get_db_connection
from flask_jwt_extended import jwt_required, get_jwt_identity
import pyodbc
import hashlib
import os
from dotenv import load_dotenv
import datetime
import jwt
import azure.cosmos.cosmos_client as cosmos_client
import azure.cosmos.exceptions as exceptions
import uuid
from decimal import Decimal

doctorPrescriptions_bp = Blueprint('doctorPrescriptions', __name__)


load_dotenv()

COSMOS_ENDPOINT = os.getenv("COSMOS_ENDPOINT")
COSMOS_KEY = os.getenv("COSMOS_KEY")
DATABASE_NAME = os.getenv("DATABASE_NAME")
CONTAINER_NAME = os.getenv("CONTAINER_NAME")


# Setting up Cosmos DB emulator
client = cosmos_client.CosmosClient(COSMOS_ENDPOINT, {'masterKey': COSMOS_KEY})
database = client.get_database_client(DATABASE_NAME)
container = database.get_container_client(CONTAINER_NAME)



#API endpoint to get the medicines
@doctorPrescriptions_bp.route('/medicines', methods=['GET'])
@jwt_required()
def get_medicines():
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            query = """
                SELECT medicine_id, medicine_name, disease_id, dosage, form, manufacturer, side_effects, price
                FROM medicine
            """
            cursor.execute(query,)
            columns = [column[0] for column in cursor.description]
            medicines_list = []
            for row in cursor.fetchall():
                medicines_list.append({
                    'medicine_id': row.medicine_id,
                    'medicine_name': row.medicine_name,
                    'disease_id': row.disease_id,
                    'dosage': row.dosage,
                    'form': row.form,
                    'manufacturer': row.manufacturer,
                    'side_effects': row.side_effects,
                    'price': float(row.price) if row.price is not None else None
                })
            return jsonify(medicines_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


#API endpoint to get the Pharmacies
@doctorPrescriptions_bp.route('/pharmacies', methods=['GET'])
@jwt_required()
def get_pharmacies():
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            query = """
                SELECT pharmacy_id, name, street, city, postcode, contact_number, opening_time, closing_time
                FROM pharmacy
            """
            cursor.execute(query)
            pharmacies_list = []
            for row in cursor.fetchall():
                pharmacies_list.append({
                    'pharmacy_id': row.pharmacy_id,
                    'name': row.name,
                    'street': row.street,
                    'city': row.city,
                    'postcode': row.postcode,
                    'contact_number': row.contact_number,
                    'opening_time': str(row.opening_time),
                    'closing_time': str(row.closing_time)
                })
            return jsonify(pharmacies_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


#API endpoint to Verify the patient
@doctorPrescriptions_bp.route('/patients/verify', methods=['GET'])
@jwt_required()
def search_patient():
    first_name = request.args.get('first_name')
    last_name = request.args.get('last_name')
    dob = request.args.get('dob')  

    if not all([first_name, last_name, dob]):
        return jsonify({'error': 'first_name, last_name, and dob are required'}), 400

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            query = """
                SELECT P_id, P_FirstName, P_LastName, DOB, StreetAddress, City, Postcode
                FROM Patient
                WHERE P_FirstName = ? AND P_LastName = ? AND DOB = ?
            """
            cursor.execute(query, (first_name, last_name, dob))
            row = cursor.fetchone()

            if row:
                result = {
                    'p_id' : row.P_id,
                    'first_name': row.P_FirstName,
                    'last_name': row.P_LastName,
                    'dob': row.DOB.strftime('%Y-%m-%d'),
                    'street': row.StreetAddress,
                    'city' : row.City,
                    'postcode' : row.Postcode
                }
                return jsonify(result)
            else:
                return jsonify({'message': 'Patient not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


#API endpoint to provide prescription
@doctorPrescriptions_bp.route('/providePrescription', methods=['POST'])
@jwt_required()
def providePrescription():
    data = request.get_json()
    doctorEmail = get_jwt_identity()  
    patientId = data.get('patientId')
    prescribedMedicineList = data.get('medicines')
    pharmacyName = data.get('pharmacyName')
    collectionMethod = data.get('collectionMethod')
    dateProvided = data.get('dateProvided')
    PatientType = data.get('patientType')

    if not ([PatientType,dateProvided, doctorEmail, patientId, prescribedMedicineList, pharmacyName, collectionMethod]):
        return jsonify({'message': 'Details missing'}), 400

    if not isinstance(prescribedMedicineList, list) or not prescribedMedicineList:
        return jsonify({'message': 'Medicine list must be a non-empty list'}), 400

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Get patients first & last name + dob
            cursor.execute("""
                SELECT P_FirstName, P_LastName
                FROM Patient
                WHERE P_id = ?
            """, (patientId,))
            row = cursor.fetchone()
            if not row:
                return jsonify({'message': 'Patient Not Found'}), 400

            # Map medicine names to respective prices either student / normal from the  medicine table
            cursor.execute("SELECT medicine_name, price, student_price FROM Medicine")
            medicine_price_map = {
                name: {
                    'price': float(price),
                    'student_price': float(student_price)
                }
                for name, price, student_price in cursor.fetchall()
            }

        # Calculate Total price
        total_price = 0.0
        enriched_medicine_list = []

        for med in prescribedMedicineList:
            name = med.get('medicine_name')
            quantity = med.get('quantity')
            instructions = med.get('instructions')

            if not all([name, quantity, instructions]):
                return jsonify({'message': 'Each medicine must include name, quantity, and instructions'}), 400

            pricing = medicine_price_map.get(name)
            if pricing is None:
                return jsonify({'message': f'Medicine "{name}" not found in database'}), 400

            unit_price = pricing['student_price'] if PatientType.lower() == 'student' else pricing['price']
            item_total = unit_price * int(quantity)
            total_price += item_total


            enriched_medicine_list.append({
                'name': name,
                'quantity': quantity,
                'instructions': instructions,
                'unit_price': unit_price,
                'total_price': item_total
            })

        query = f"""
        SELECT * FROM c
        WHERE c.patientid = @patientid AND c.doctorEmail = @doctorEmail AND c.dateProvided = @dateProvided
        """
        params = [
            {"name": "@patientid", "value": patientId},
            {"name": "@doctorEmail", "value": doctorEmail},
            {"name": "@dateProvided", "value": dateProvided}
        ]
        existing_prescriptions = list(container.query_items(
            query=query,
            parameters=params,
            enable_cross_partition_query=True
        ))

        if existing_prescriptions:
            return jsonify({'message': 'A prescription for this patient by this doctor already exists on this date.'}), 409

        # Creates prescription
        prescription_id = str(uuid.uuid4())
        prescription = {
            'id': str(uuid.uuid4()),
            'patientid': patientId,
            'patientFirstName': row.P_FirstName,
            'patientLastName': row.P_LastName,
            'prescriptionid': prescription_id,
            'doctorEmail': doctorEmail,
            'medicines': enriched_medicine_list,
            'pharmacyName': pharmacyName,
            'collectionMethod': collectionMethod,
            'dateProvided': dateProvided,
            'totalCost': total_price
        }

        container.create_item(body=prescription)

        result = {
            'patientid': patientId,
            'prescriptionid': prescription_id,
            'totalCost': total_price,
            'message': 'Prescription created successfully'
        }
        return jsonify(result), 201

    except exceptions.CosmosHttpResponseError as e:
        return jsonify({'error': str(e)}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500



