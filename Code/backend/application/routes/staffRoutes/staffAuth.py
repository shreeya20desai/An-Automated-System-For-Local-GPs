from flask import Blueprint, Flask, jsonify, request,make_response
from application.utils.db_helpers import get_db_connection
import pyodbc
import hashlib
import os
import datetime
import jwt

staffauth_bp = Blueprint('staffAuth', __name__)

JWT_SECRET = os.getenv('JWT_SECRET', 'GP_UK')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')


# Utility Functions provide general support for API building 
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Staff Verification
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

    cursor.execute("""SELECT 1 FROM Doctor WHERE Doctor_Email = ? OR Doctor_Phone_No = ?""", (data['staffEmail'], data['staffPhone']))
    if cursor.fetchone():
        return jsonify({'message': 'Doctor Already Registered'}), 400

    hashed_password = hash_password(data['staffPassword'])

    cursor.execute("""
        INSERT INTO Doctor (Doctor_FirstName, Doctor_LastName, Doctor_Email, Doctor_Phone_No, Doctor_Registration_Number, Specialization, D_Password, Registered_By_Admin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (data['staffFirstName'], data['staffLastName'], data['staffEmail'], data['staffPhone'], data['staffRegistrationNumber'], data['staffSpecialization'], hashed_password, admin_id))
    conn.commit()
    return jsonify({'message': 'Doctor registered successfully'}), 201


# Nurse Registration
def register_nurse(conn, data, admin_id):
    cursor = conn.cursor()
    if not data['staffEmail'] or not data['staffPhone']:
        return jsonify({'message': 'Invalid email or phone number'}), 400

    cursor.execute("""SELECT 1 FROM Nurse WHERE Nurse_Email = ? OR Nurse_Phone_No = ?""", (data['staffEmail'], data['staffPhone']))
    if cursor.fetchone():
        return jsonify({'message': 'Nurse Already Registered'}), 400

    hashed_password = hash_password(data['staffPassword'])

    cursor.execute("""
        INSERT INTO Nurse (Nurse_FirstName, Nurse_LastName, Nurse_Email, Nurse_Phone_No, Nurse_Registration_Number, Specialization, N_Password, Registered_By_Admin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (data['staffFirstName'], data['staffLastName'], data['staffEmail'], data['staffPhone'], data['staffRegistrationNumber'], data['staffSpecialization'], hashed_password, admin_id))
    conn.commit()
    return jsonify({'message': 'Nurse registered successfully'}), 201



# Auth Endpoints ----------------------------------------------------------------------------------------------


# Endpoint for staff Creation
@staffauth_bp.route('/staff/registration',methods=['POST'])
def createStaffLogin():
    data = request.get_json()
    admin_Email = data.get('Admin_Email')
    admin_id = data.get('admin_Id')
    staffType = data.get('staffType')
    staffFirstName = data.get('staffFirstName')
    staffLastName = data.get('staffLastName')
    staffEmail = data.get('staffEmail')
    staffPhone = data.get('staffPhone')
    staffRegistrationNumber = data.get('staffRegistrationNumber')
    staffSpecialization =  data.get('staffSpecialization')
    staffPassword = data.get('staffPassword')

    if not all([admin_id,admin_Email,staffType,staffFirstName,staffLastName,staffEmail,staffPhone,staffRegistrationNumber,staffSpecialization,staffPassword]):
        return jsonify({'message': 'Missing email or password'}), 400

    admin_Email = data['Admin_Email']
    if verify_staff(admin_Email) != 'admin':
        return jsonify({'message': 'Admin level rights required for staff registration'}), 403

    conn = get_db_connection()
    if conn:
        try:
            if data['staffType'] == 'doctor':
                return register_doctor(conn, data, admin_id)
            elif data['staffType'] == 'nurse':
                return register_nurse(conn, data, admin_id)
            else:
                return jsonify({'message': 'Invalid staff type'}), 400
        except Exception as e:
            return jsonify({'message': f'Error: {e}'}), 500
        finally:
            conn.close()
    else:
        return jsonify({'message': 'Database connection failed'}), 500

# Endpoint for Patient Creation
@staffauth_bp.route('/gp-patient/registration', methods=['POST'])
def create_gp_patient():
    data = request.get_json()
    admin_email = data.get('Admin_Email')
    admin_id = data.get('admin_Id')
    patient_first_name = data.get('patientFirstName')
    patient_last_name = data.get('patientLastName')
    patient_email = data.get('patientEmail')
    patient_phone = data.get('patientPhone')
    gender = data.get('gender')
    dob = data.get('dob')
    patient_password = data.get('patientPassword')

    if not all([admin_id, admin_email, patient_first_name, patient_last_name, patient_email, patient_phone, gender, dob, patient_password]):
        return jsonify({'message': 'Missing required fields'}), 400

    if verify_staff(admin_email) != 'admin':
        return jsonify({'message': 'Admin level rights required for patient registration'}), 403

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()

            # Check if patient already exists
            cursor.execute("""
                SELECT 1 FROM Patient WHERE Email_Id = ? OR Phone_No = ?
            """, (patient_email, patient_phone))
            existing_patient = cursor.fetchone()

            if existing_patient:
                return jsonify({'message': 'Patient with this email or phone number already exists'}), 400

            hashed_password = hash_password(patient_password)

            # Convert DOB string to date object
            try:
                dob_date = datetime.datetime.strptime(dob, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'message': 'Invalid date format. Please use YYYY-MM-DD'}), 400

            cursor.execute("""
                INSERT INTO Patient (P_FirstName, P_LastName, Gender, DOB, Email_Id, Phone_No, PatientPassword, Registered_By_Admin)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (patient_first_name, patient_last_name, gender, dob_date, patient_email, patient_phone, hashed_password, admin_id))

            conn.commit()
            return jsonify({'message': 'Patient registered successfully'}), 201

        except pyodbc.IntegrityError:
            return jsonify({'message': 'Patient with this email or phone number already exists'}), 400
        except Exception as e:
            return jsonify({'message': f'Error: {e}'}), 500
        finally:
            conn.close()
    else:
        return jsonify({'message': 'Database connection failed'}), 500


# Endpoint for Admin,Doctor and Nurse Login
@staffauth_bp.route('/staff/login', methods=['POST'])
def staff_login():
    data = request.get_json()
    email = data.get('staffEmail')
    password = data.get('staffPassword')

    if not all([email, password]):
        return jsonify({'message': 'Missing email or password'}), 400

    hashed_password = hash_password(password)
    staff_type = verify_staff(email)

    if not staff_type:
        return jsonify({'message': 'Invalid email format or staff type not recognized'}), 400

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            if staff_type == "doctor":
                cursor.execute("""
                    SELECT Doctor_id FROM Doctor 
                    WHERE Doctor_Email = ? AND D_Password = ?
                """, (email, hashed_password))
                row = cursor.fetchone()
                staff_id_field = 'doctor_id'

            elif staff_type == "nurse":
                cursor.execute("""
                    SELECT Nurse_id FROM Nurse 
                    WHERE Nurse_Email = ? AND N_Password = ?
                """, (email, hashed_password))
                row = cursor.fetchone()
                staff_id_field = 'nurse_id'

            elif staff_type == "admin":
                cursor.execute("""
                    SELECT Admin_id FROM Admin 
                    WHERE Admin_Email = ? AND Admin_Password = ?
                """, (email, hashed_password))
                row = cursor.fetchone()
                staff_id_field = 'admin_id'

            if not row:
                return jsonify({'message': 'Invalid email or password'}), 401

            staff_id = row[0]

            payload = {
                staff_id_field: staff_id,
                'email': email,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

            response = make_response(jsonify({'message': 'Login successful','staffType':staff_type}), 200)
            response.set_cookie('access_token', token, httponly=True, secure=True, samesite='Strict')

            return response


        except Exception as e:
            return jsonify({'message': f'Error: {e}'}), 500
        finally:
            conn.close()
    else:
        return jsonify({'message': 'Database connection failed'}), 500