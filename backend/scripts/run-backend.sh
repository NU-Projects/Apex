#!/bin/bash

trap 'echo -e "\nStopping all services..."; kill $(jobs -p) 2>/dev/null; exit' SIGINT SIGTERM

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

PIP_CMD="$(command -v pip3 >/dev/null 2>&1 && echo pip3 || command -v pip >/dev/null 2>&1 && echo pip || true)"
PY_CMD="$(command -v python3 >/dev/null 2>&1 && echo python3 || command -v python >/dev/null 2>&1 && echo python || true)"

echo -e "\033[36mStarting Netflix Eureka Server...\033[0m"
(
    cd "$BACKEND_ROOT/netflix-eureka-server" || exit 1
    npm i
    npm run dev
) &

echo -e "\033[33mWaiting 5 seconds for Eureka to initialize...\033[0m"
sleep 5

echo -e "\033[36mStarting API Gateway...\033[0m"
(
    cd "$BACKEND_ROOT/api-gateway" || exit 1
    npm i
    npm run dev
) &

echo -e "\033[36mStarting Auth Service...\033[0m"
(
    cd "$BACKEND_ROOT/auth-service" || exit 1
    npm i
    npm run dev
) &

echo -e "\033[36mStarting Roadmap Service...\033[0m"
(
    cd "$BACKEND_ROOT/roadmap-service" || exit 1
    npm i
    npm run dev
) &

echo -e "\033[36mStarting User Service...\033[0m"
(
    cd "$BACKEND_ROOT/user-service" || exit 1
    npm i
    npm run dev
) &

echo -e "\033[36mStarting Job Service...\033[0m"
(
    cd "$BACKEND_ROOT/job-service" || exit 1
    if [ -d "venv" ]; then
        source venv/bin/activate
    elif [ -d ".venv" ]; then
        source .venv/bin/activate
    fi

    if [ -z "$PIP_CMD" ] || [ -z "$PY_CMD" ]; then
        echo "pip/pip3 or python/python3 not found for job-service"
        exit 1
    fi

    $PIP_CMD install -r requirements.txt
    $PY_CMD app.py
) &

echo -e "\033[36mStarting Skills Extraction Service...\033[0m"
(
    cd "$BACKEND_ROOT/skills-extraction-service" || exit 1
    if [ -d "venv" ]; then
        source venv/bin/activate
    elif [ -d ".venv" ]; then
        source .venv/bin/activate
    fi

    if [ -z "$PIP_CMD" ] || [ -z "$PY_CMD" ]; then
        echo "pip/pip3 or python/python3 not found for skills-extraction-service"
        exit 1
    fi

    $PIP_CMD install -r requirements.txt
    $PY_CMD app.py
) &

echo -e "\033[32mAll services are starting up!\033[0m"
echo -e "\033[33mPress Ctrl+C to stop all services.\033[0m"

wait
