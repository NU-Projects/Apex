#!/usr/bin/env zsh

trap 'print -P "\n%F{red}Stopping all services...%f"; kill $(jobs -p) 2>/dev/null; exit' SIGINT SIGTERM

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

PIP_CMD="$(command -v pip3 >/dev/null 2>&1 && echo pip3 || command -v pip >/dev/null 2>&1 && echo pip || true)"
PY_CMD="$(command -v python3 >/dev/null 2>&1 && echo python3 || command -v python >/dev/null 2>&1 && echo python || true)"

print -P "%F{cyan}Starting Netflix Eureka Server...%f"
(
    cd "$BACKEND_ROOT/netflix-eureka-server" || exit 1
    npm i
    npm run dev
) &

print -P "%F{yellow}Waiting 5 seconds for Eureka to initialize...%f"
sleep 5

print -P "%F{cyan}Starting API Gateway...%f"
(
    cd "$BACKEND_ROOT/api-gateway" || exit 1
    npm i
    npm run dev
) &

print -P "%F{cyan}Starting Auth Service...%f"
(
    cd "$BACKEND_ROOT/auth-service" || exit 1
    npm i
    npm run dev
) &

print -P "%F{cyan}Starting Roadmap Service...%f"
(
    cd "$BACKEND_ROOT/roadmap-service" || exit 1
    npm i
    npm run dev
) &

print -P "%F{cyan}Starting Quiz Service...%f"
(
    cd "$BACKEND_ROOT/quiz-service" || exit 1
    npm i
    npm run dev
) &

print -P "%F{cyan}Starting User Service...%f"
(
    cd "$BACKEND_ROOT/user-service" || exit 1
    npm i
    npm run dev
) &

print -P "%F{cyan}Starting Job Service...%f"
(
    cd "$BACKEND_ROOT/job-service" || exit 1
    if [[ -d "venv" ]]; then
        source venv/bin/activate
    elif [[ -d ".venv" ]]; then
        source .venv/bin/activate
    fi

    if [[ -z "$PIP_CMD" || -z "$PY_CMD" ]]; then
        print -P "%F{red}pip/pip3 or python/python3 not found for job-service%f"
        exit 1
    fi

    $PIP_CMD install -r requirements.txt
    $PY_CMD app.py
) &

print -P "%F{cyan}Starting Skills Extraction Service...%f"
(
    cd "$BACKEND_ROOT/skills-extraction-service" || exit 1
    if [[ -d "venv" ]]; then
        source venv/bin/activate
    elif [[ -d ".venv" ]]; then
        source .venv/bin/activate
    fi

    if [[ -z "$PIP_CMD" || -z "$PY_CMD" ]]; then
        print -P "%F{red}pip/pip3 or python/python3 not found for skills-extraction-service%f"
        exit 1
    fi

    $PIP_CMD install -r requirements.txt
    $PY_CMD app.py
) &

print -P "%F{green}All services are starting up!%f"
print -P "%F{yellow}Press Ctrl+C to stop all services.%f"

wait
