chmod +x filename.sh#!/bin/bash

trap 'echo -e "\nStopping all services..."; kill $(jobs -p) 2>/dev/null; exit' SIGINT SIGTERM

echo -e "\033[36mStarting Netflix Eureka Server...\033[0m"
cd netflix-eureka-server
npm i
npm run dev &
cd ..

echo -e "\033[33mWaiting 5 seconds for Eureka to initialize...\033[0m"
sleep 5

echo -e "\033[36mStarting API Gateway...\033[0m"
cd api-gateway
npm i
npm run dev &
cd ..

echo -e "\033[36mStarting Auth Service...\033[0m"
cd auth-service
npm i
npm run dev &
cd ..

echo -e "\033[36mStarting Skills Extraction Service...\033[0m"
cd skills-extraction-service
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d ".venv" ]; then
    source .venv/bin/activate
fi

pip3 install -r requirements.txt || pip install -r requirements.txt
python3 app.py || python3 app.py &
cd ..

echo -e "\033[32mAll services are starting up!\033[0m"
echo -e "\033[33mPress Ctrl+C to stop all services.\033[0m"

wait
