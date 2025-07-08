#!/usr/bin/env bash

FRONTEND_PORT=3000
BACKEND_PORT=8080

fuser -k -n tcp $FRONTEND_PORT 2>/dev/null || true
fuser -k -n tcp $BACKEND_PORT 2>/dev/null || true
