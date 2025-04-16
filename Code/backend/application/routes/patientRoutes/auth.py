from flask import Blueprint, jsonify, request, make_response
from application.utils.db_helpers import get_db_connection
import hashlib
import os
from datetime import timedelta
import jwt
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, set_access_cookies, set_refresh_cookies, unset_jwt_cookies

auth_bp = Blueprint('auth', __name__)

JWT_SECRET = os.getenv('JWT_SECRET', 'GP_UK')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')


# Utility functions
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()



# API endpoint to Register patient
@auth_bp.route('/patient/register', methods=['POST'])
def register_patient():
    data = request.get_json()
    p_first_name = data.get('firstName')
    p_last_name = data.get('lastName')
    dob = data.get('dob')
    gender = data.get('gender')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    street_address = data.get('streetAddress') 
    city = data.get('city')  
    postcode = data.get('postcode')  

    if not all([p_first_name, p_last_name, dob, gender, email, phone, password,street_address,city,postcode]):
        return jsonify({'message': 'Missing required fields'}), 400

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()

            # Checks if the patient alreday exists.
            cursor.execute("""
                SELECT 1 FROM Patient WHERE Email_Id = ? OR Phone_No = ?
            """, (email, phone))
            existing_user = cursor.fetchone()

            if existing_user:
                return jsonify({'message': 'Email or phone number already exists'}), 400

            hashed_password = hash_password(password)

            cursor.execute("""
                INSERT INTO Patient (P_FirstName, P_LastName, Gender, DOB, Email_Id, Phone_No, PatientPassword, StreetAddress, City, Postcode)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (p_first_name, p_last_name, gender, dob, email, phone, hashed_password, street_address, city, postcode))
            conn.commit()
            return jsonify({'message': 'Patient registered successfully'}), 201

        except Exception as e:
            return jsonify({'message': f'Error: {e}'}), 500
        finally:
            conn.close()
    else:
        return jsonify({'message': 'Database connection failed'}), 500





# API endpoint for Patient login
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
                SELECT P_id, Email_Id, P_FirstName, P_LastName
                FROM Patient
                WHERE Email_Id = ? AND PatientPassword = ?
            """, (email, hashed_password))
            row = cursor.fetchone()

            if not row:
                return jsonify({'message': 'Invalid email or password'}), 401

            patient_id, patient_email, p_first_name, p_last_name = row
            patient_name = f"{p_first_name} {p_last_name}"

            # creates access and refresh tokens 
            access_token = create_access_token(identity=patient_email)
            refresh_token = create_refresh_token(identity=patient_email)

            response = make_response(jsonify({
                'message': 'Login successful',
                'patient_id': patient_id,
                'email': patient_email,
                'patient_name': patient_name
            }))

            # Setting accesss cookie to deal with protected route access 
            set_access_cookies(response, access_token)

            # Setting refresh cookie to deal with browser refresh
            set_refresh_cookies(response, refresh_token)

            return response

        except Exception as e:
            return jsonify({'message': f'Error: {e}'}), 500
        finally:
            conn.close()
    else:
        return jsonify({'message': 'Database connection failed'}), 500



#API Endpoint for Patient profile
@auth_bp.route('/patientProfile', methods=['GET'])
@jwt_required()
def get_patient_profile():
    userEmail = get_jwt_identity()

    if not userEmail:
        return jsonify({'message': 'Missing email'}), 400

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT P_FirstName, P_LastName, Gender, DOB, Email_Id, Phone_No 
                FROM Patient 
                WHERE Email_Id = ?
            """, (userEmail,))
            patientProfile = cursor.fetchone()

            if not patientProfile:
                return jsonify({'message': 'No patient found with this email'}), 404

            # Map the result from the database to the dictionary 
            profile = {
                'FirstName': patientProfile[0],
                'LastName': patientProfile[1],
                'Gender': patientProfile[2],
                'DOB': patientProfile[3].strftime('%Y-%m-%d') if patientProfile[3] else None,
                'Email': patientProfile[4],
                'PhoneNo': patientProfile[5]
            }
            return jsonify({'profile': profile}), 200

        except Exception as e:
            return jsonify({'message': f'Error: {e}'}), 500
        finally:
            conn.close()
    else:
        return jsonify({'message': 'Database connection failed'}), 500



# API endpoint : Logout
@auth_bp.route('/logout', methods=['POST'])
def patient_logout():
    response = jsonify({'message': 'Logout successful'})
    unset_jwt_cookies(response)
    return response