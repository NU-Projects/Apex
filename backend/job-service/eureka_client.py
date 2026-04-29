import os
from py_eureka_client import eureka_client
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'), override=True)

def register_eureka():
    e_url = os.getenv("EUREKA_URL", "http://localhost:5001")
    s_name = "JOB-SERVICE"
    s_port = int(os.getenv("JOB_SERVICE_PORT", 5004))
    hostname = os.getenv("HOSTNAME", "localhost")
    
    try:
        eureka_client.init(
            eureka_server=f"{e_url}/eureka",
            app_name=s_name,
            instance_port=s_port,
            instance_host=hostname,
            instance_ip="127.0.0.1",
            should_discover=False,
            renewal_interval_in_secs=30,
            duration_in_secs=90
        )
        print(f"Registered: {s_name} -> 127.0.0.1:{s_port}")
    except Exception as e:
        print(f"Eureka registration failed: {e}")
