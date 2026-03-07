import os
from flask import Flask
from routes.skill_routes import skill_bp
from eureka_client import register_eureka
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

app = Flask(__name__)
PORT = int(os.getenv("SKILLS_EXTRACTION_SERVICE_PORT", 5003))

app.register_blueprint(skill_bp)

if __name__ == '__main__':
    register_eureka()
    app.run(host='0.0.0.0', port=PORT)
