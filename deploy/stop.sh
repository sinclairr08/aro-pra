#!/usr/bin/env bash
docker compose --env-file .env.${ENV} down
