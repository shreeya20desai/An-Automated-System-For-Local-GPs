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
            staff_name=None
            if staff_type == "doctor":
                cursor.execute("""
                    SELECT Doctor_id,Doctor_FirstName,Doctor_LastName FROM Doctor 
                    WHERE Doctor_Email = ? AND D_Password = ?
                """, (email, hashed_password))
                row = cursor.fetchone()
                if row:
                    staff_id = row[0]
                    staff_name = row[1] +" " +row[2]
                

            elif staff_type == "nurse":
                cursor.execute("""
                    SELECT Nurse_id,Nurse_FirstName,Nurse_LastName FROM Nurse 
                    WHERE Nurse_Email = ? AND N_Password = ?
                """, (email, hashed_password))
                row = cursor.fetchone()
                if row:
                    staff_id = row[0]
                    staff_name = row[1] +" " +row[2]
                

            elif staff_type == "admin":
                cursor.execute("""
                    SELECT Admin_id FROM Admin 
                    WHERE Admin_Email = ? AND Admin_Password = ?
                """, (email, hashed_password))
                row = cursor.fetchone()
                if row:
                    staff_id = row[0]
                    staff_name = ""
                

            if not row:
                return jsonify({'message': 'Invalid email or password'}), 401
            
            # creates access and refresh tokens 
            access_token = create_access_token(identity=email)
            refresh_token = create_refresh_token(identity=email)

            response = make_response(jsonify({
            'message': 'Staff Login successful',
            'name' : staff_name,
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
