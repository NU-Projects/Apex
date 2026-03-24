$backendRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

Write-Host "Starting Netflix Eureka Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendRoot\netflix-eureka-server'; npm i; npm run dev"

Write-Host "Waiting 5 seconds for Eureka to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Starting API Gateway..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendRoot\api-gateway'; npm i; npm run dev"

Write-Host "Starting Auth Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendRoot\auth-service'; npm i; npm run dev"

Write-Host "Starting Roadmap Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendRoot\roadmap-service'; npm i; npm run dev"

Write-Host "Starting User Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendRoot\user-service'; npm i; npm run dev"

Write-Host "Starting Job Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendRoot\job-service'; if (Test-Path 'venv') { .\venv\Scripts\activate }; if (Test-Path '.venv') { .\.venv\Scripts\activate }; if (Get-Command pip -ErrorAction SilentlyContinue) { pip install -r requirements.txt } elseif (Get-Command pip3 -ErrorAction SilentlyContinue) { pip3 install -r requirements.txt } elseif (Get-Command py -ErrorAction SilentlyContinue) { py -3 -m pip install -r requirements.txt } else { python -m pip install -r requirements.txt }; if (Get-Command python -ErrorAction SilentlyContinue) { python app.py } elseif (Get-Command python3 -ErrorAction SilentlyContinue) { python3 app.py } else { py -3 app.py }"

Write-Host "Starting Skills Extraction Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendRoot\skills-extraction-service'; if (Test-Path 'venv') { .\venv\Scripts\activate }; if (Test-Path '.venv') { .\.venv\Scripts\activate }; if (Get-Command pip -ErrorAction SilentlyContinue) { pip install -r requirements.txt } elseif (Get-Command pip3 -ErrorAction SilentlyContinue) { pip3 install -r requirements.txt } elseif (Get-Command py -ErrorAction SilentlyContinue) { py -3 -m pip install -r requirements.txt } else { python -m pip install -r requirements.txt }; if (Get-Command python -ErrorAction SilentlyContinue) { python app.py } elseif (Get-Command python3 -ErrorAction SilentlyContinue) { python3 app.py } else { py -3 app.py }"

Write-Host "All services are starting up!" -ForegroundColor Green
