from flask import Blueprint, Flask, jsonify, request,make_response
from application.utils.db_helpers import get_db_connection
from azure.communication.email import EmailClient
import os
from flask_jwt_extended import jwt_required,get_jwt_identity


doctorManageAppointments_bp = Blueprint('doctorManageAppointments', __name__)

JWT_SECRET = os.getenv('JWT_SECRET', 'GP_UK')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')


CONNECTION_STRING = os.environ.get("COMMUNICATION_SERVICES_CONNECTION_STRING")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL_ADDRESS")


#Utility Function inorder to send the cancellation email.
def send_cancellation_email(patient_email, doctor_name, appointment_date, slot_time):

    if not CONNECTION_STRING:
        print("Error: Communication Services connection string not found.")
        return False
    if not SENDER_EMAIL:
        print("Warning: Sender email address not configured. Using default (may have 'via').")

    try:
        email_client = EmailClient.from_connection_string(CONNECTION_STRING)

        message = {
            "senderAddress": SENDER_EMAIL if SENDER_EMAIL else "donotreply@example.com",
            "recipients": {
                "to": [{"address": patient_email}]
            },
            "content": {
                "subject": "Your Appointment Has Been Cancelled",
                "html": f"""
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Appointment Cancellation</title>
                        <style>
                            body {{ font-family: sans-serif; }}
                            .container {{ width: 80%; margin: 0 auto; }}
                            .header {{ background-color: #f0f0f0; padding: 20px; text-align: center; }}
                            .content {{ padding: 20px; }}
                            .important {{ font-weight: bold; }}
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Your Appointment Has Been Cancelled</h1>
                            </div>
                            <div class="content">
                                <p>Dear Patient,</p>
                                <p>Unfortunately, we regret to inform you that your upcoming scheduled appointment with <span class="important">{doctor_name}</span> scheduled for:</p>
                                <ul>
                                    <li><span class="important">Date:</span> {appointment_date}</li>
                                    <li><span class="important">Time:</span> {slot_time}</li>
                                </ul>
                                <p>has been cancelled by the doctor.</p>
                                <p>We apologize for any inconvenience this may cause. Please contact our clinic to reschedule your appointment at your earliest convenience.</p>
                                <p>Sincerely,</p>
                                <p>The HealMe Team</p>
                            </div>
                        </div>
                    </body>
                    </html>
                """
            }
        }
        poller = email_client.begin_send(message)
        print(f"Sending cancellation email to {patient_email}")
        
        result = poller.result()
        print(f"Email sent successfully. Status: {result['status']}, Message ID: {result['id']}")
        
        return True

    except Exception as e:
        print(f"Error sending email via Azure Communication Services: {e}")
        return False

################################################################################################################



#API Endpoint for Getting Patient Booking for particular date
@doctorManageAppointments_bp.route('/get_patient_bookings/<string:date>', methods=['GET'])
@jwt_required()
def get_doctor_appointments_by_date(date):
    doctorEmail = get_jwt_identity()

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            
            cursor.execute("SELECT Doctor_id FROM Doctor WHERE Doctor_Email = ?", (doctorEmail,))
            doctor_row = cursor.fetchone()
            if not doctor_row:
                return jsonify({'error': 'Doctor not found'}), 404

            doctor_id = doctor_row.Doctor_id

           
            cursor.execute("""
                SELECT d.Disease_Name, a.AppointmentID, a.PatientID, 
                       p.P_FirstName, p.P_LastName, s.StartTime, s.EndTime
                FROM Appointment a
                JOIN Patient p ON a.PatientID = p.P_id
                JOIN Slots s ON a.SlotID = s.SlotID
                JOIN Disease d ON a.DiseaseType = d.Disease_id
                WHERE a.Date = ? AND a.DoctorID = ?
            """, (date, doctor_id))
            rows = cursor.fetchall()
    
            appointments = []
            for row in rows:
                appointments.append({
                     'disease_name': row.Disease_Name,
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
    



#API endpoint to canncel doctor appointment based on the appointment id
@doctorManageAppointments_bp.route('/cancel_doctor_appointment/<int:appointment_id>', methods=['DELETE'])
@jwt_required()
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
            email_sent = send_cancellation_email(patient_email, f"{doctor_firstname} {doctor_lastname}", appointment_date.isoformat(), slot_time)

            if email_sent:
                return jsonify({'message': 'Appointment cancelled successfully and cancellation email sent'}), 200
            else:
                return jsonify({'message': 'Appointment cancelled successfully, but email sending failed'}), 200

    except Exception as e:
        return jsonify({'error':str(e)}),500