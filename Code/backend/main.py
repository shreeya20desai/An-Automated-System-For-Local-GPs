from flask import Flask
from application.routes.patientRoutes.auth import auth_bp
from application.routes.staffRoutes.staffAuth import staffauth_bp
from application.routes.staffRoutes.staffAvailability import staffAvailability_bp
from application.routes.patientRoutes.patientBookingAppointment import patientBooking_bp
from application.routes.staffRoutes.doctorManageAppointment import doctorManageAppointments_bp

from flask_cors import CORS

app = Flask(__name__)
app.register_blueprint(auth_bp,url_prefix='/gp')
app.register_blueprint(staffauth_bp,url_prefix='/gp')
app.register_blueprint(staffAvailability_bp,url_prefix='/gp')
app.register_blueprint(patientBooking_bp,url_prefix='/gp')
app.register_blueprint(doctorManageAppointments_bp,url_prefix='/gp')

CORS(app)

if __name__ == '__main__':
    app.run(debug=True)