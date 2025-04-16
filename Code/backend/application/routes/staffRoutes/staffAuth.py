from flask import Blueprint, Flask, jsonify, request,make_response
from application.utils.db_helpers import get_db_connection
import pyodbc
import hashlib
import os
import datetime
import jwt
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, set_access_cookies, set_refresh_cookies, unset_jwt_cookies


staffauth_bp = Blueprint('staffAuth', __name__)

JWT_SECRET = os.getenv('JWT_SECRET', 'GP_UK')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')


# Utility Functioncode .

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


# API endpoint to get specialzation based on the staff type
@staffauth_bp.route('/get_specializations', methods=['GET'])
@jwt_required()
def get_specializations():
    try:
        # Retreives the type of staff(Doctor/Nurse) from the query parameter
        staff_type = request.args.get('staff_type')

        if staff_type not in ['Doctor', 'Nurse']:
            return jsonify({'error': 'Invalid staff type. Please choose either "Doctor" or "Nurse".'}), 400

        with get_db_connection() as conn:
            cursor = conn.cursor()

            if staff_type == 'Doctor':
                cursor.execute("""
                    SELECT Specialization_ID, Specialization_Name
                    FROM Specialization 
                """)
            elif staff_type == 'Nurse':
                cursor.execute("""
                    SELECT Specialization_ID, Specialization_Name
                    FROM Nurse_Specialization 

                """)

            rows = cursor.fetchall()

            specializations = []
            for row in rows:
                specializations.append({
                    'Specialization_ID': row.Specialization_ID,
                    'Specialization_Name': row.Specialization_Name
                })

            return jsonify(specializations), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Endpoint for staff Creation
@staffauth_bp.route('/staff/registration',methods=['POST'])
@jwt_required()
def createStaffLogin():
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
    
    print(admin_Email)
    
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



# Endpoint for Patient Creation
@staffauth_bp.route('/gp-patient/registration', methods=['POST'])
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

            # Verifies if the Patient alreday exist
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

            cursor.execute("""
                INSERT INTO Patient (P_FirstName, P_LastName, Gender, DOB, Email_Id, Phone_No, PatientPassword, Registered_By_Admin, StreetAddress, City, Postcode)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (patient_first_name, patient_last_name, gender, dob_date, patient_email, patient_phone, hashed_password, admin_id, street_address, city, postcode))

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
            staff_id = None
            if staff_type == "doctor":
                cursor.execute("""
                    SELECT Doctor_id FROM Doctor 
                    WHERE Doctor_Email = ? AND D_Password = ?
                """, (email, hashed_password))
                row = cursor.fetchone()
                if row:
                    staff_id = row[0]
                

            elif staff_type == "nurse":
                cursor.execute("""
                    SELECT Nurse_id FROM Nurse 
                    WHERE Nurse_Email = ? AND N_Password = ?
                """, (email, hashed_password))
                row = cursor.fetchone()
                if row:
                    staff_id = row[0]
                

            elif staff_type == "admin":
                cursor.execute("""
                    SELECT Admin_id FROM Admin 
                    WHERE Admin_Email = ? AND Admin_Password = ?
                """, (email, hashed_password))
                row = cursor.fetchone()
                if row:
                    staff_id = row[0]
                

            if not row:
                return jsonify({'message': 'Invalid email or password'}), 401
            
            # creates access and refresh tokens 
            access_token = create_access_token(identity=email)
            refresh_token = create_refresh_token(identity=email)

            response = make_response(jsonify({
            'message': 'Staff Login successful',
            'email': email,
            'staffType': staff_type,
            'staffId': staff_id
            }))
            print(f"Staff logged in with ID: {staff_id}")

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
    



#API Endpoint for Staff Profile
@staffauth_bp.route('/staffProfile', methods=['GET'])
@jwt_required()
def getStaffProfile():
    userEmail = get_jwt_identity()

    if not userEmail:
        return jsonify({'message': 'Missing email'}), 400

    userType = verify_staff(userEmail)
    conn = get_db_connection()

    if conn:
        try:
            cursor = conn.cursor()

            if userType == 'doctor':
                cursor.execute("""
                    SELECT D.Doctor_FirstName, D.Doctor_LastName, D.Doctor_Email, D.Doctor_Phone_No, 
                           D.Doctor_Registration_Number, S.Specialization_Name
                    FROM Doctor D
                    JOIN Specialization S ON D.Specialization_ID = S.Specialization_ID
                    WHERE D.Doctor_Email = ?
                """, (userEmail,))

                doctorProfile = cursor.fetchone()

                if not doctorProfile:
                    return jsonify({'message': 'No doctor found with this email'}), 400

                profile = {
                    'FirstName': doctorProfile[0],
                    'LastName': doctorProfile[1],
                    'Email': doctorProfile[2],
                    'PhoneNo': doctorProfile[3],
                    'RegistrationNumber': doctorProfile[4],
                    'Specialization': doctorProfile[5]
                }
                return jsonify({'profile': profile}), 200

            elif userType == 'nurse':
                cursor.execute("""
                    SELECT N.Nurse_FirstName, N.Nurse_LastName, N.Nurse_Email, N.Nurse_Phone_No, 
                           N.Nurse_Registration_Number, S.Specialization_Name
                    FROM Nurse N
                    JOIN Nurse_Specialization S ON N.Specialization_ID = S.Specialization_ID
                    WHERE N.Nurse_Email = ?
                """, (userEmail,))

                nurseProfile = cursor.fetchone()

                if not nurseProfile:
                    return jsonify({'message': 'No nurse found with this email'}), 400

                profile = {
                    'FirstName': nurseProfile[0],
                    'LastName': nurseProfile[1],
                    'Email': nurseProfile[2],
                    'PhoneNo': nurseProfile[3],
                    'RegistrationNumber': nurseProfile[4],
                    'Specialization': nurseProfile[5]
                }
                return jsonify({'profile': profile}), 200

            else:
                return jsonify({'message': 'User type not recognized'}), 400

        except Exception as e:
            return jsonify({'message': f'Error: {e}'}), 500

        finally:
            conn.close()

    else:
        return jsonify({'message': 'Database connection failed'}), 500
