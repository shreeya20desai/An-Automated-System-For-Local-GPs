from flask import Blueprint, Flask, jsonify, request
from application.utils.db_helpers import get_db_connection
import pyodbc
import hashlib
import os
import datetime
import jwt

auth_bp = Blueprint('auth', __name__)

JWT_SECRET = os.getenv('JWT_SECRET', 'your_secret_key')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

#Patient Register API

@auth_bp.route('/patient/register', methods=['POST'])
def register_patient():
    data = request.get_json()
    p_name = data.get('p_name')
    dob = data.get('dob')
    gender = data.get('gender')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')

    if not all([p_name, dob, gender, email, phone, password]):
        return jsonify({'message': 'Missing required fields'}), 400

    hashed_password = hash_password(password)

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO Patient (P_Name, Gender, DOB, Email_Id, Phone_No, PatientPassword)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (p_name, gender, dob, email, phone, hashed_password))
            conn.commit()
            return jsonify({'message': 'Patient registered successfully'}), 201
        except pyodbc.IntegrityError:
            return jsonify({'message': 'Email or phone number already exists'}), 400
        except Exception as e:
            return jsonify({'message': f'Error: {e}'}), 500
        finally:
            conn.close()
    else:
        return jsonify({'message': 'Database connection failed'}), 500

#Patient Login API

@auth_bp.route('/patient/login', methods=['POST'])
def patient_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'message': 'Missing email or password'}), 400

    hashed_password = hash_password(password)

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT P_id FROM Patient 
                WHERE Email_Id = ? AND PatientPassword = ?
            """, (email, hashed_password))
            row = cursor.fetchone()
            if not row:
                return jsonify({'message': 'Invalid email or password'}), 401

            payload = {
                'patient_id': row.P_id,
                'email': email,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # Token expires in 24 hours
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

            return jsonify({'token': token, 'message': 'Login successful'}), 200

        except Exception as e:
            return jsonify({'message': f'Error: {e}'}), 500
        finally:
            conn.close()
    else:
        return jsonify({'message': 'Database connection failed'}), 500