import os
from flask import Flask
from flask_cors import CORS
from routes.skill_routes import skill_bp
from eureka_client import register_eureka
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

app = Flask(__name__)
PORT = int(os.getenv("SKILLS_EXTRACTION_SERVICE_PORT", 5003))

allowed_origins = [
    os.getenv("CLIENT_URL", "").strip().rstrip("/"),
    "http://localhost:5173"
]
allowed_origins = [origin for origin in allowed_origins if origin]

CORS(app, resources={r"/*": {
    "origins": allowed_origins,
    "methods": ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    "allow_headers": ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    "supports_credentials": True,
    "max_age": 86400
}})

app.register_blueprint(skill_bp)

if __name__ == '__main__':
    register_eureka()
    app.run(host='0.0.0.0', port=PORT)
