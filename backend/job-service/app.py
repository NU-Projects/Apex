import os
from flask import Flask
from flask_cors import CORS
from routes.job_routes import job_bp
from eureka_client import register_eureka
from dotenv import load_dotenv
import threading
import time
from services.sync_service import SyncService

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'), override=True)

app = Flask(__name__)
PORT = int(os.getenv("JOB_SERVICE_PORT", 5004))

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

app.register_blueprint(job_bp, url_prefix='/jobs')

lookupIntervalHours = 24
timeExpirationDays = 10000000000

def continuous_sync_runner():
    """Background runner to continuously check and execute sync after every interval."""
    sync_service = SyncService()
    while True:
        print("[App] Checking if job sync is needed...")
        try:
            result = sync_service.check_and_sync(time_expiration_days=timeExpirationDays)
            print(f"[App] Sync Check Result: {result}")
        except Exception as e:
            print(f"[App] Sync Check Error: {e}")
            
        print(f"[App] Sleeping for {lookupIntervalHours} hours before next check.")
        time.sleep(lookupIntervalHours * 3600)

if __name__ == '__main__':
    # register_eureka()
    
    threading.Thread(target=continuous_sync_runner, daemon=True).start()
    
    app.run(host='0.0.0.0', port=PORT)
