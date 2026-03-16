#!/usr/bin/env zsh

trap 'print -P "\n%F{red}Stopping all services...%f"; kill $(jobs -p) 2>/dev/null; exit' SIGINT SIGTERM

print -P "%F{cyan}Starting Netflix Eureka Server...%f"
cd netflix-eureka-server
npm i
npm run dev &
cd ..

print -P "%F{yellow}Waiting 5 seconds for Eureka to initialize...%f"
sleep 5

print -P "%F{cyan}Starting API Gateway...%f"
cd api-gateway
npm i
npm run dev &
cd ..

print -P "%F{cyan}Starting Auth Service...%f"
cd auth-service
npm i
npm run dev &
cd ..

print -P "%F{cyan}Starting Skills Extraction Service...%f"
cd skills-extraction-service
if [[ -d "venv" ]]; then
    source venv/bin/activate
elif [[ -d ".venv" ]]; then
    source .venv/bin/activate
fi

pip3 install -r requirements.txt || pip install -r requirements.txt
python3 app.py || python app.py &
cd ..

print -P "%F{green}All services are starting up!%f"
print -P "%F{yellow}Press Ctrl+C to stop all services.%f"

wait
