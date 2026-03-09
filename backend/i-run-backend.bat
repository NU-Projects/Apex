@echo off

echo Starting Netflix Eureka Server...
start "Netflix Eureka Server" cmd /k "cd netflix-eureka-server && npm i && npm run dev"

echo Waiting 5 seconds for Eureka to initialize...
timeout /t 5 /nobreak

echo Starting API Gateway...
start "API Gateway" cmd /k "cd api-gateway && npm i && npm run dev"

echo Starting Auth Service...
start "Auth Service" cmd /k "cd auth-service && npm i && npm run dev"

echo Starting Skills Extraction Service...
start "Skills Extraction Service" cmd /k "cd skills-extraction-service && (if exist venv\Scripts\activate.bat call venv\Scripts\activate.bat) && pip install -r requirements.txt && python app.py"

echo All services are starting up!