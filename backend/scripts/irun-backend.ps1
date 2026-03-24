$backendRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

Write-Host "Starting Netflix Eureka Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendRoot\netflix-eureka-server'; npm i; npm run dev"

Write-Host "Waiting 15 seconds for Eureka to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "Starting API Gateway..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendRoot\api-gateway'; npm i; npm run dev"

Write-Host "Starting Auth Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendRoot\auth-service'; npm i; npm run dev"

Write-Host "Starting User Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendRoot\user-service'; npm i; npm run dev"

Write-Host "Starting Job Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendRoot\job-service'; if (Test-Path 'venv') { .\venv\Scripts\activate }; if (Test-Path '.venv') { .\.venv\Scripts\activate }; pip install -r requirements.txt; python app.py"

Write-Host "Starting Skills Extraction Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendRoot\skills-extraction-service'; if (Test-Path 'venv') { .\venv\Scripts\activate }; if (Test-Path '.venv') { .\.venv\Scripts\activate }; pip install -r requirements.txt; python app.py"

Write-Host "All services are starting up!" -ForegroundColor Green
