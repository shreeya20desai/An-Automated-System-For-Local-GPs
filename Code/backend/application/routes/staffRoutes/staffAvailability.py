from flask import Blueprint, Flask, jsonify, request,make_response
from application.utils.db_helpers import get_db_connection
import pyodbc
import hashlib
import os
import datetime
import jwt
from flask_jwt_extended import jwt_required,get_jwt_identity

staffAvailability_bp = Blueprint('staffAvail', __name__)

JWT_SECRET = os.getenv('JWT_SECRET', 'GP_UK')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')

# API Endpoint for Set Doctor availbility
@staffAvailability_bp.route('/set_doctor_availability', methods=['POST'])
@jwt_required()
def set_doctor_availability():
    print("Preflight OPTIONS Cookies:", request.cookies)
    try:
        data = request.get_json()
        doctor_id = data['doctor_id']
        date = data['date']
        slot_ids = data['slot_ids']  # array of slot IDs

        with get_db_connection() as conn:
            cursor = conn.cursor()
            for slot_id in slot_ids:
        
                cursor.execute("""
                    SELECT 1
                    FROM DoctorAvailability
                    WHERE DoctorID = ? AND Date = ? AND SlotID = ?
                """, doctor_id, date, slot_id)
                
                existing_availability = cursor.fetchone()

                if existing_availability:
                    return jsonify({'message': f'Doctor availability already set for slot ID: {slot_id}'}), 400
                else:
                    cursor.execute(
                        "INSERT INTO DoctorAvailability (DoctorID, Date, SlotID) VALUES (?, ?, ?)",
                        doctor_id, date, slot_id
                    )

            conn.commit()  

            return jsonify({'message': 'Doctor availability set successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

    
#API Endpoint to cancel doctors availibilty
@staffAvailability_bp.route('/cancel_doctor_availability/<int:doctor_id>/<string:date>/<int:slot_id>', methods=['DELETE'])
@jwt_required()
def cancel_doctor_availability(doctor_id, date, slot_id):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "DELETE FROM DoctorAvailability WHERE DoctorID = ? AND Date = ? AND SlotID = ?",
                doctor_id, date, slot_id
            )
            if cursor.rowcount == 0:
                return jsonify({'message': 'Doctor availability not found'}), 404
            conn.commit()
            return jsonify({'message': 'Doctor availability cancelled successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500




#API Endpoint for Set Nurse Availability
@staffAvailability_bp.route('/set_nurse_availability', methods=['POST'])
@jwt_required()
def set_nurse_availability():
    try:
        data = request.get_json()
        nurse_id = data['nurse_id']
        date = data['date']
        slot_ids = data['slot_ids'] 

        with get_db_connection() as conn:
            cursor = conn.cursor()
            for slot_id in slot_ids:
                
                cursor.execute("""
                    SELECT 1
                    FROM NurseAvailability
                    WHERE NurseID = ? AND Date = ? AND SlotID = ?
                """, nurse_id, date, slot_id)

                existing_availability = cursor.fetchone()

                if existing_availability:
                    return jsonify({'message': f'Nurse availability already set for slot ID: {slot_id}'}), 400
                else:
                    cursor.execute(
                        "INSERT INTO NurseAvailability (NurseID, Date, SlotID) VALUES (?, ?, ?)",
                        nurse_id, date, slot_id
                    )
            conn.commit()  
            return jsonify({'message': 'Nurse availability set successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500




# API Endpoint to cancel nurse availibilty
@staffAvailability_bp.route('/cancel_nurse_availability/<int:nurse_id>/<string:date>/<int:slot_id>', methods=['DELETE'])
@jwt_required()
def cancel_nurse_availability(nurse_id, date, slot_id):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "DELETE FROM NurseAvailability WHERE NurseID = ? AND Date = ? AND SlotID = ?",
                nurse_id, date, slot_id
            )
            if cursor.rowcount == 0:
                return jsonify({'message': 'Nurse availability not found'}), 404
            conn.commit()
            return jsonify({'message': 'Nurse availability cancelled successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500