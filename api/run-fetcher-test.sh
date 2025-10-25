#!/usr/bin/env bash

set -a
source ../.env.${ENV:dev}
set +a                                                                                                                                                                                      INT ✘  21m 41s  base Py
./gradlew bootRun --args='--spring.profiles.active=secret,daily-json-fetcher-test --daily-json-fetcher-test.enabled=true'
