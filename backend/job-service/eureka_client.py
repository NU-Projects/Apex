import os
from py_eureka_client import eureka_client
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'), override=True)

def register_eureka():
    e_url = os.getenv("EUREKA_URL", "http://localhost:5001")
    s_name = "JOB-SERVICE"
    s_port = int(os.getenv("JOB_SERVICE_PORT", 5004))
    
    eureka_client.init(
        eureka_server=f"{e_url}/eureka",
        app_name=s_name,
        instance_port=s_port,
        instance_host=os.getenv("HOSTNAME", "localhost"),
        should_discover=False
    )
