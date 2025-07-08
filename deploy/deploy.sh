#!/usr/bin/env bash

FRONTEND_PORT=3000
BACKEND_PORT=8080

deploy_frontend() {
  (
    cd frontend || { echo "No frontend folder"; return 1; }

    npm ci
    npm run build
    nohup npm start > ../frontend.log 2>&1 &
  )

  sleep 3

  if curl -f http://localhost:$FRONTEND_PORT > /dev/null 2>&1; then
    echo "frontend STARTED"
  else
    echo "frontend FAILED"
    exit 1
  fi

}

deploy_backend() {
    (
      cd backend || { echo "No backend folder"; return 1; }

      ./gradlew clean build -x test
      nohup ./gradlew bootRun > ../backend.log 2>&1 &
    )

    sleep 3

    if curl -f http://localhost:$BACKEND_PORT/api/v1/links > /dev/null 2>&1; then
      echo "backend STARTED"
    else
      echo "backend FAILED"
      exit 1
    fi
}

main() {
  deploy_frontend
  deploy_backend

  echo "SUCCESS!"
}

main "$@"
