from flask import Blueprint, Flask, jsonify, request, make_response
from application.utils.db_helpers import get_db_connection
import pyodbc
import hashlib
import os
import stripe
import datetime
import jwt
from flask_jwt_extended import jwt_required


buyPrescriptions_bp = Blueprint('buyPrescriptions', __name__)

JWT_SECRET = os.getenv('JWT_SECRET', 'GP_UK')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET") 

def execute_query(conn, query, params=None):
    cursor = conn.cursor()
    cursor.execute(query, params or ())
    conn.commit()
    return cursor


# Utility function to update the payments table
def update_payment_status(stripe_checkout_session_id, status, prescription_id=None):
    conn = get_db_connection()
    if conn:
        try:
            
            query = """
                UPDATE payments
                SET payment_status = ?, payment_date = ?
                WHERE stripe_checkout_session_id = ?  
            """
            params = (status, datetime.datetime.utcnow(), stripe_checkout_session_id)
            execute_query(conn, query, params)

        except pyodbc.Error as ex:
            sqlstate = ex.args[0]
            print(f"Database error during payment status update: {sqlstate}")
            conn.rollback()
        finally:
            conn.close()



#API endpoint to create the payment session.
@buyPrescriptions_bp.route('/create-payment-session', methods=['POST'])
@jwt_required()  
def create_payment():
    try:
        data = request.get_json()
        patientId = data.get('patientId')
        prescription_id = data.get('prescription_id')
        amount = data.get('amount')
        currency = data.get('currency', 'gbp')


        if patientId is None:
            return jsonify({'error': 'Please provide patientId in the request body'}), 400

        if amount is None:
            return jsonify({'error': 'Please provide an amount'}), 400

        conn = get_db_connection()
        if conn:
            try:
                check_query = """
                    SELECT payment_status FROM payments 
                    WHERE prescription_id = ? AND patient_id = ?
                    ORDER BY payment_date DESC
                """
                cursor = conn.cursor()
                cursor.execute(check_query, (prescription_id, patientId))
                existing_payments = cursor.fetchall()
                
                # Checks if the payment already done
                if existing_payments and any(payment[0] == 'succeeded' for payment in existing_payments):
                    return jsonify({'error': 'Payment already completed for this prescription'}), 409
       
            except pyodbc.Error as ex:
                print(f"Database error occurred: {ex.args[0]}")
                return jsonify({'error': 'Failed to check existing payments'}), 500
            finally:
                conn.close()

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],  
            line_items=[{
                'price_data': {
                    'currency': currency,
                    'unit_amount': amount,  # The Amount is in pence/cents
                    'product_data': {
                        'name': f'Prescription Payment - ID: {prescription_id}',
                    },
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f'{request.headers.get("Origin")}/payment-success?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{request.headers.get("Origin")}/payment-cancel',
            client_reference_id=prescription_id, # have provided prescription Id as client reference Id
        )

        conn = get_db_connection()
        if conn:
            try:
                query = """
                    INSERT INTO payments (patient_id, prescription_id, stripe_checkout_session_id, amount, currency, payment_date, payment_status)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """
                params = (patientId, prescription_id,  session.id, amount, currency, datetime.datetime.utcnow(), 'pending')
    
                execute_query(conn, query, params)
            
            except pyodbc.Error as ex:
                sqlstate = ex.args[0]
                print(f"Database error occurred: {sqlstate}")
                conn.rollback()
                return jsonify({'error': 'Failed to record payment intent'}), 500
            finally:
                conn.close()
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

        return jsonify({'sessionId': session.id}), 200
    except stripe.error.StripeError as e:
 
        return jsonify({'error': f'Stripe error: {str(e)}'}), 500
    except Exception as e:
   
        return jsonify({'error': str(e)}), 500
    

#API endpoint for stripe-webhook    
@buyPrescriptions_bp.route('/stripe-webhook', methods=['POST'])
def stripe_webhook():
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('stripe-signature')
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return make_response('Invalid payload', 400)
    except stripe.error.SignatureVerificationError as e:
        return make_response('Invalid signature', 400)

    # Checks the success or fail of stripe event type
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        prescription_id = session.get('client_reference_id')
        stripe_checkout_session_id = session.get('id')

        print(f"Checkout Session for Prescription ID {prescription_id} completed! Session ID: {stripe_checkout_session_id}")
        update_payment_status(stripe_checkout_session_id, 'succeeded', prescription_id)

    elif event['type'] == 'checkout.session.expired':
        session = event['data']['object']
        prescription_id = session.get('client_reference_id')
        stripe_checkout_session_id = session.get('id')
        print(f"Checkout Session for Prescription ID {prescription_id} expired! Session ID: {stripe_checkout_session_id}")
        update_payment_status(stripe_checkout_session_id, 'expired', prescription_id)


    return make_response('Webhook received', 200)




