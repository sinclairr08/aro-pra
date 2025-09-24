#!/usr/bin/env bash

[[ $(pwd -P) == */aro-pra ]] || { echo "Error: this file must run on project root"; exit 1; }

set -euo pipefail
export TZ=Asia/Seoul

LOG_DIR="$PWD/log"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/$(date +%Y%m%d_%H%M%S).log"

exec 1>>"$LOG_FILE"
exec 2>&1

echo "[start] $(date '+%F %T %Z')"

set +e
"$HOME/miniforge3/bin/python" -u scanner/main.py
EXIT_CODE=$?
set -e

echo "[exit_code=$EXIT_CODE] $(date '+%F %T %Z')"
exit "$EXIT_CODE"
