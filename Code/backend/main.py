import os
from flask import Flask
from application.routes.patientRoutes.auth import auth_bp
from application.routes.staffRoutes.staffAuth import staffauth_bp
from application.routes.staffRoutes.staffAvailability import staffAvailability_bp
from application.routes.patientRoutes.patientBookingAppointment import patientBooking_bp
from application.routes.staffRoutes.doctorManageAppointment import doctorManageAppointments_bp
from application.routes.staffRoutes.doctorPrescription import doctorPrescriptions_bp
from application.routes.patientRoutes.patientPrescription import prescription_bp
from application.routes.patientRoutes.buyPrescriptions import buyPrescriptions_bp
from application.routes.staffRoutes.adminRoutes import adminRoutes_bp
from application.routes.medicalRecords import medicalRecords_bp

from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta

app = Flask(__name__)


app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET', 'GP_UK')
app.config["JWT_ALGORITHM"] = os.getenv('JWT_ALGORITHM', 'HS256')


if not app.config["JWT_SECRET_KEY"]:
    raise RuntimeError("JWT_SECRET_KEY environment variable not set!")

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
app.config["JWT_COOKIE_SECURE"] = True  
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_HTTPONLY"] = True
app.config["JWT_COOKIE_SAMESITE"] = "None"
app.config['JWT_COOKIE_DOMAIN'] = '.thehealme.com'
app.config["JWT_COOKIE_NAME"] = "access_token_cookie"
app.config["JWT_COOKIE_PATH"] = "/"

# Csrf token which are needed for POST,DELETE
app.config["JWT_CSRF_IN_COOKIES"] = True  
app.config["JWT_CSRF_COOKIE_NAME"] = "csrf_access_token"
app.config["JWT_CSRF_COOKIE_HTTPONLY"] = False
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
jwt = JWTManager(app)


app.register_blueprint(auth_bp, url_prefix='/gp')
app.register_blueprint(medicalRecords_bp, url_prefix='/gp')
app.register_blueprint(adminRoutes_bp, url_prefix='/gp')
app.register_blueprint(buyPrescriptions_bp, url_prefix='/gp')
app.register_blueprint(staffauth_bp, url_prefix='/gp')
app.register_blueprint(staffAvailability_bp, url_prefix='/gp')
app.register_blueprint(patientBooking_bp, url_prefix='/gp')
app.register_blueprint(doctorManageAppointments_bp, url_prefix='/gp')
app.register_blueprint(doctorPrescriptions_bp, url_prefix='/gp')
app.register_blueprint(prescription_bp, url_prefix='/gp')


allowed_origins = [
    os.getenv("CORS_ORIGIN"),  
    "https://frontendgpsystem-bqg6agfud9ayevhk.uksouth-01.azurewebsites.net"    
]

# Configure CORS
CORS(app, supports_credentials=True, resources={r"/gp/*": {"origins": allowed_origins}})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
