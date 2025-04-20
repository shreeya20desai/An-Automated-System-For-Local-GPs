from flask import Blueprint, Flask, jsonify, request,make_response
from application.utils.db_helpers import get_db_connection
from flask_jwt_extended import jwt_required
import azure.cosmos.cosmos_client as cosmos_client
import azure.cosmos.exceptions as exceptions
import pyodbc
import os
from datetime import datetime

prescription_bp = Blueprint('prescription', __name__, url_prefix='/prescription')

COSMOS_ENDPOINT = os.environ.get("COSMOS_ENDPOINT")
COSMOS_KEY = os.environ.get("COSMOS_KEY")
DATABASE_NAME = os.environ.get("DATABASE_NAME")
CONTAINER_NAME = os.environ.get("CONTAINER_NAME")

# Setting up Cosmos DB emulator
client = cosmos_client.CosmosClient(COSMOS_ENDPOINT, {'masterKey': COSMOS_KEY})
database = client.get_database_client(DATABASE_NAME)
container = database.get_container_client(CONTAINER_NAME)

# Helper function to get list of medicines within the prescription
def get_prescription_medicines(prescription_id, cursor):
    cursor.execute("""
        SELECT mp.MedicineName, m.TypicalDosage, m.TypicalQuantity, mp.RefillsAllowed, m.MedicineName AS CatalogMedicineName
        FROM MedicineProvided mp
        LEFT JOIN Medicines m ON mp.CatalogMedicineID = m.MedicineID
        WHERE mp.Prescription_ID = ?
    """, prescription_id)
    medicines_data = cursor.fetchall()
    medicines = []
    for row in medicines_data:
        medicines.append({
            'medicine_name': row.MedicineName,
            'dosage': row.TypicalDosage,
            'quantity': row.TypicalQuantity,
            'refills_allowed': row.RefillsAllowed,
            'catalog_medicine_name': row.CatalogMedicineName
        })
    return medicines


#API Endpoint to Get the prescriptions
@prescription_bp.route('/prescriptions', methods=['GET'])
@jwt_required()
def get_all_prescriptions():
    patient_id = request.args.get('patientId')
    if not patient_id:
        return jsonify({'message': 'Patient ID is required'}), 400

    try:
        query = f'SELECT * FROM c WHERE c.patientid = "{patient_id}"'
        items = list(container.query_items(query=query, enable_cross_partition_query=True))
        return jsonify(items), 200
        

    except exceptions.CosmosHttpResponseError as e:
        return jsonify({'error': f'Cosmos DB Error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500

    
