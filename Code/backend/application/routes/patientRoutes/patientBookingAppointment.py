from flask import Blueprint, Flask, jsonify, request,make_response
from application.utils.db_helpers import get_db_connection
import pyodbc
import hashlib
import os
import datetime
import jwt

patientBooking_bp = Blueprint('patientBooking', __name__)

JWT_SECRET = os.getenv('JWT_SECRET', 'GP_UK')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')

# This endpoint gets all the available doctors for the disease specified by the patient
@patientBooking_bp.route('/get_doctors_list', methods=['POST'])
def get_doctors_list():
    try:
        data = request.get_json()
        health_issue = data['health_issue']
        on_date = data['on_date']  
        # We have performed inner join between doctor and doctor availbility table, this will display only those doctors which are available in that duration.
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT DISTINCT d.Doctor_id, d.Doctor_FirstName, d.Doctor_LastName,d.Specialization
                FROM Doctor d
                JOIN DoctorAvailability da ON d.Doctor_id = da.DoctorID
                WHERE d.Specialization = ?
                AND da.Date = ?
            """, health_issue, on_date)
            rows = cursor.fetchall()

            doctors = []
            for row in rows:
                doctors.append({
                    'id': row.Doctor_id,
                    'firstname': row.Doctor_FirstName,
                    'lastname': row.Doctor_LastName,
                    'Specialisation': row.Specialization,
                    'date': on_date
                })

            return jsonify(doctors), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    



# Retrieves availabilty of specific doctors
@patientBooking_bp.route('/get_doctor_availability/<int:doctor_id>/<string:date>', methods=['GET'])
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
    



# Patient book doctors appointment  
@patientBooking_bp.route('/book_appointment', methods=['POST'])
def book_appointment():
    try:
        data = request.get_json()
        doctor_id = data['doctor_id']
        patient_id = data['patient_id']
        date = data['date']
        slot_id = data['slot_id']

        with get_db_connection() as conn:
            cursor = conn.cursor()

            cursor.execute(
                "SELECT 1 FROM DoctorAvailability WHERE DoctorID = ? AND Date = ? AND SlotID = ?",
                doctor_id, date, slot_id
            )
            
            slot_exists = cursor.fetchone()

            if not slot_exists:
                return jsonify({'error': 'No Slot is available on this date'}), 400
            # Check if the slot is already booked
            cursor.execute(
                "SELECT 1 FROM Appointment WHERE DoctorID = ? AND Date = ? AND SlotID = ?",
                doctor_id, date, slot_id
            )
            if cursor.fetchone():
                return jsonify({'error': 'Slot is already booked'}), 400

            cursor.execute(
                "INSERT INTO Appointment (DoctorID, PatientID, Date, SlotID) VALUES (?, ?, ?, ?)",
                doctor_id, patient_id, date, slot_id
            )
            conn.commit()
            return jsonify({'message': 'Appointment booked successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

#patient cancel their appointment
@patientBooking_bp.route('/cancel_appointment/<int:appointment_id>', methods=['DELETE'])
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