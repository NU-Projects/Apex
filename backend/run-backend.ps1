Write-Host "Starting Netflix Eureka Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd netflix-eureka-server; npm run dev"

Write-Host "Waiting 5 seconds for Eureka to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Starting API Gateway..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd api-gateway; npm run dev"

Write-Host "Starting Auth Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd auth-service; npm run dev"

Write-Host "All services are starting up!" -ForegroundColor Green
