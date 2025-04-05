from flask import Blueprint, Flask, jsonify, request,make_response
from application.utils.db_helpers import get_db_connection
import pyodbc
import hashlib
import os
import datetime
import jwt

doctorManageAppointments_bp = Blueprint('doctorManageAppointments', __name__)

JWT_SECRET = os.getenv('JWT_SECRET', 'GP_UK')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')

#Endpoint for Getting Patient Booking for particular date
@doctorManageAppointments_bp.route('/get_patient_bookings/<string:date>', methods=['GET'])
def get_doctor_appointments_by_date(date):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT a.AppointmentID, a.PatientID, p.P_FirstName, p.P_LastName, s.StartTime, s.EndTime
                FROM Appointment a
                JOIN Patient p ON a.PatientID = p.P_id
                JOIN Slots s ON a.SlotID = s.SlotID
                WHERE a.Date = ?
            """,  date)
            rows = cursor.fetchall()

            appointments = []
            for row in rows:
                appointments.append({
                    'appointment_id': row.AppointmentID,
                    'patient_id': row.PatientID,
                    'patient_firstname': row.P_FirstName,
                    'patient_lastname': row.P_LastName,
                    'start_time': row.StartTime.isoformat(),
                    'end_time': row.EndTime.isoformat()
                })

            return jsonify(appointments), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    





#yet to be tested
def send_cancellation_email(patient_email, doctor_name, appointment_date, slot_time):
    """
    Simulates sending an email to the patient.
    Replace with your actual email sending logic (Azure Communication Services).
    """
    print(f"Simulating email: To: {patient_email}, Doctor: {doctor_name}, Date: {appointment_date}, Slot: {slot_time}")
    # In a real implementation, you'd use Azure Communication Services here.
    # Example (replace with your Azure Email code):
    # try:
    #     email_client = EmailClient.from_connection_string(connection_string)
    #     message = EmailMessage(
    #         sender="donotreply@yourdomain.com",
    #         recipients=EmailRecipients(to=[{"address": patient_email}]),
    #         content=EmailContent(
    #             subject="Appointment Cancellation",
    #             html=f"Dear Patient, ... {doctor_name} ... {appointment_date} ... {slot_time} ..."
    #         )
    #     )
    #     email_client.send(message)
    # except Exception as e:
    #     print(f"Error sending email: {e}")
    pass

#Endpoint for Cancel Doctor Appointment
@doctorManageAppointments_bp.route('/cancel_doctor_appointment/<int:appointment_id>', methods=['DELETE'])
def cancel_doctor_appointment(appointment_id):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Get appointment details before deleting
            cursor.execute("""
                SELECT a.PatientID, p.Email_Id, d.Doctor_FirstName, d.Doctor_LastName, a.Date, s.StartTime, s.EndTime
                FROM Appointment a
                JOIN Patient p ON a.PatientID = p.P_id
                JOIN Doctor d ON a.DoctorID = d.Doctor_id
                JOIN Slots s ON a.SlotID = s.SlotID
                WHERE a.AppointmentID = ?
            """, appointment_id)
            appointment_details = cursor.fetchone()

            if not appointment_details:
                return jsonify({'error': 'Appointment not found'}), 404

            patient_id, patient_email, doctor_firstname, doctor_lastname, appointment_date, slot_start, slot_end = appointment_details

            # Delete the appointment
            cursor.execute("DELETE FROM Appointment WHERE AppointmentID = ?", appointment_id)
            conn.commit()

            # Send cancellation email
            slot_time = f"{slot_start.isoformat()} - {slot_end.isoformat()}"
            send_cancellation_email(patient_email, f"{doctor_firstname} {doctor_lastname}", appointment_date.isoformat(), slot_time)

            return jsonify({'message': 'Appointment cancelled successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500