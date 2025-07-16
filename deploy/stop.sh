#!/usr/bin/env bash
docker compose --env-file .env.${ENV} -f deploy/docker-compose.yaml down
