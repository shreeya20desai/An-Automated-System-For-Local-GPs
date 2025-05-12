from flask import Blueprint, Flask, jsonify, request,make_response
from application.utils.db_helpers import get_db_connection
import pyodbc
import hashlib
import os
from datetime import datetime,date 
import jwt
from flask_jwt_extended import jwt_required,get_jwt_identity

patientBooking_bp = Blueprint('patientBooking', __name__)

JWT_SECRET = os.getenv('JWT_SECRET', 'GP_UK')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')


# API endpoint to  get_diseases
@patientBooking_bp.route('/get_diseases', methods=['GET'])
@jwt_required()
def get_diseases():
    try:

        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT Disease_Name, Disease_ID
                FROM Disease
            """, ())

            rows = cursor.fetchall()

            if not rows:
                return jsonify({'message': 'No diseases found'}), 404

            diseases = []
            for row in rows:
                diseases.append({
                    'Disease_ID': row.Disease_ID,
                    'Disease_Name': row.Disease_Name
                })

            return jsonify(diseases), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500




# API endpoint to retrieve the doctor avaiable for the diseases selected by patient.
@patientBooking_bp.route('/get_doctors_list', methods=['POST'])
@jwt_required()
def get_doctors_list():
    try:
        data = request.get_json()
        health_issue = data['health_issue']
        on_date = data['on_date']

        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Get specialization ID based on the disease id 
            cursor.execute("""
                SELECT Specialization_id from Disease
                WHERE Disease_id = ?
            """, (health_issue,))
            specialization_row = cursor.fetchone()

            if not specialization_row:
                return jsonify({'error': 'Specialization not found for this disease'}), 404

            specializationId = specialization_row.Specialization_id

            # Retrieve the doctors that match with the specialization id and are avaiable on the date selected by the patient.
            cursor.execute("""
                SELECT DISTINCT d.Doctor_id, d.Doctor_FirstName, d.Doctor_LastName, d.Specialization_id
                FROM Doctor d
                JOIN DoctorAvailability da ON d.Doctor_id = da.DoctorID
                WHERE d.Specialization_id = ?
                AND da.Date = ?
            """, (specializationId, on_date))
            rows = cursor.fetchall()

            doctors = []
            for row in rows:
                doctors.append({
                    'id': row.Doctor_id,
                    'firstname': row.Doctor_FirstName,
                    'lastname': row.Doctor_LastName,
                    'Specialisation': row.Specialization_id, 
                    'date': on_date
                })

            return jsonify(doctors), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
#API endpoint to get the specific doctor availability
@patientBooking_bp.route('/get_doctor_availability/<int:doctor_id>/<string:date>', methods=['GET'])
@jwt_required()
def get_doctor_availability(doctor_id, date):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT s.SlotID, s.StartTime, s.EndTime
                FROM Slots s
                LEFT JOIN Appointment a ON s.SlotID = a.SlotID AND a.DoctorID = ? AND a.Date = ?
                WHERE a.AppointmentID IS NULL
                AND s.SlotID IN (SELECT SlotID FROM DoctorAvailability WHERE DoctorID = ? AND Date = ?)
            """, doctor_id, date, doctor_id, date)
            rows = cursor.fetchall()
            available_slots = [{'id': row.SlotID, 'start': row.StartTime.isoformat(), 'end': row.EndTime.isoformat()} for row in rows]
            return jsonify(available_slots), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    



    # API endpoint to book appointment  
@patientBooking_bp.route('/book_appointment', methods=['POST'])
@jwt_required()
def book_appointment():
        try:
            data = request.get_json()
            doctor_id = data['doctor_id']
            patient_id = data['patient_id']
            date = data['date']
            slot_id = data['slot_id']
            disease_type = data.get('disease_type')
            disease_description = data.get('disease_description') 

            if not disease_type:
                return jsonify({'error': 'Disease type is required'}), 400
            
            with get_db_connection() as conn:
                cursor = conn.cursor()

                cursor.execute(
                    "SELECT 1 FROM DoctorAvailability WHERE DoctorID = ? AND Date = ? AND SlotID = ?",
                    doctor_id, date, slot_id
                )
                
                slot_exists = cursor.fetchone()

                if not slot_exists:
                    return jsonify({'error': 'No Slot is available on this date'}), 400
                
                #Verifies if the Slot is already booked
                cursor.execute(
                    "SELECT 1 FROM Appointment WHERE DoctorID = ? AND Date = ? AND SlotID = ?",
                    doctor_id, date, slot_id
                )
                if cursor.fetchone():
                    return jsonify({'error': 'Slot is already booked'}), 400

                cursor.execute(
                """
                INSERT INTO Appointment (DoctorID, PatientID, Date, SlotID, DiseaseType, DiseaseDescription)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                doctor_id, patient_id, date, slot_id, disease_type, disease_description
                )
                conn.commit()
                return jsonify({'message': 'Appointment booked successfully'}), 201

                #If incase, two patient try to book the appointment at the same time for the same doctor and slot, the below error will be thrown.
        except pyodbc.IntegrityError:
                    return jsonify({
                    'error': 'Slot is already booked by another patient, please check another slot.'
            }),400

        except Exception as e:
            return jsonify({'error': str(e)}), 500



    # API endpoint to get the my appointment
@patientBooking_bp.route('/my_appointments', methods=['GET'])
@jwt_required()
def get_patient_appointments():
        try:
            patient_email = get_jwt_identity()
            print(patient_email)
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT
                        a.AppointmentID,
                        d.Doctor_FirstName,
                        d.Doctor_LastName,
                        d.Specialization_id,
                        a.Date,
                        s.StartTime,
                        s.EndTime
                    FROM Appointment a
                    JOIN Doctor d ON a.DoctorID = d.Doctor_id
                    JOIN Slots s ON a.SlotID = s.SlotID
                    JOIN Patient p ON a.PatientID = p.P_id
                    WHERE p.Email_Id = ?
                    ORDER BY a.Date, s.StartTime
                """, (patient_email,))
                rows = cursor.fetchall()

                appointments = []
                for row in rows:
                    appointment_date = row.Date  # From the datetime object, only the date will be extracted.
                    status = "Completed" if appointment_date < date.today() else "Scheduled"
                    appointments.append({
                        'appointment_id': row.AppointmentID,
                        'doctor_first_name': row.Doctor_FirstName,
                        'doctor_last_name': row.Doctor_LastName,
                        'doctor_specialization': row.Specialization_id,
                        'date': row.Date.isoformat(),
                        'start_time': row.StartTime.isoformat(),
                        'end_time': row.EndTime.isoformat(),
                        'status':status
                    })

                return jsonify(appointments), 200

        except Exception as e:
            return jsonify({'error':str(e)}),500





    #API ENDPOINT to cancel appointment
@patientBooking_bp.route('/cancel_appointment/<int:appointment_id>', methods=['DELETE'])
@jwt_required()
def cancel_appointment(appointment_id):
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()

            
                cursor.execute("SELECT 1 FROM Appointment WHERE AppointmentID = ?", appointment_id)
                if not cursor.fetchone():
                    return jsonify({'error': 'Appointment not found'}), 404

                cursor.execute("DELETE FROM Appointment WHERE AppointmentID = ?", appointment_id)
                conn.commit()

                return jsonify({'message': 'Appointment cancelled successfully'}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500
        


