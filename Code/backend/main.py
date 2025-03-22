from flask import Flask
from application.routes.auth import auth_bp
from flask_cors import CORS

app = Flask(__name__)
app.register_blueprint(auth_bp,url_prefix='/gp')
CORS(app)

if __name__ == '__main__':
    app.run(debug=True)