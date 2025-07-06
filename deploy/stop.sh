#!/usr/bin/env bash

FRONTEND_PORT=3000
BACKEND_PORT=8080

lsof -ti:$FRONTEND_PORT | xargs kill -9 2>/dev/null || true
lsof -ti:$BACKEND_PORT | xargs kill -9 2>/dev/null || true
