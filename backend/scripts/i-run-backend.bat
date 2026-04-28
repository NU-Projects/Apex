@echo off

set "SCRIPT_DIR=%~dp0"
pushd "%SCRIPT_DIR%.."
set "BACKEND_DIR=%CD%"

echo Starting Netflix Eureka Server...
start "Netflix Eureka Server" cmd /k "cd /d ""%BACKEND_DIR%\netflix-eureka-server"" && npm i && npm run dev"

echo Waiting 5 seconds for Eureka to initialize...
timeout /t 5 /nobreak

echo Starting API Gateway...
start "API Gateway" cmd /k "cd /d ""%BACKEND_DIR%\api-gateway"" && npm i && npm run dev"

echo Starting Auth Service...
start "Auth Service" cmd /k "cd /d ""%BACKEND_DIR%\auth-service"" && npm i && npm run dev"

echo Starting Roadmap Service...
start "Roadmap Service" cmd /k "cd /d ""%BACKEND_DIR%\roadmap-service"" && npm i && npm run dev"

echo Starting Quiz Service...
start "Quiz Service" cmd /k "cd /d ""%BACKEND_DIR%\quiz-service"" && npm i && npm run dev"

echo Starting User Service...
start "User Service" cmd /k "cd /d ""%BACKEND_DIR%\user-service"" && npm i && npm run dev"

echo Starting Job Service...
start "Job Service" cmd /k "cd /d ""%BACKEND_DIR%\job-service"" && (if exist venv\Scripts\activate.bat call venv\Scripts\activate.bat) && (if exist .venv\Scripts\activate.bat call .venv\Scripts\activate.bat) && (where pip >nul 2>nul && pip install -r requirements.txt --user || where pip3 >nul 2>nul && pip3 install -r requirements.txt --user || where py >nul 2>nul && py -3 -m pip install -r requirements.txt --user || python -m pip install -r requirements.txt --user) && (where python >nul 2>nul && python app.py || where python3 >nul 2>nul && python3 app.py || py -3 app.py)"

echo Starting Skills Extraction Service...
start "Skills Extraction Service" cmd /k "cd /d ""%BACKEND_DIR%\skills-extraction-service"" && (if exist venv\Scripts\activate.bat call venv\Scripts\activate.bat) && (if exist .venv\Scripts\activate.bat call .venv\Scripts\activate.bat) && (where pip >nul 2>nul && pip install -r requirements.txt --user || where pip3 >nul 2>nul && pip3 install -r requirements.txt --user || where py >nul 2>nul && py -3 -m pip install -r requirements.txt --user || python -m pip install -r requirements.txt --user) && (where python >nul 2>nul && python app.py || where python3 >nul 2>nul && python3 app.py || py -3 app.py)"

echo All services are starting up!

popd