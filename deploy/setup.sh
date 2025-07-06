#!/usr/bin/env bash

# 0. sudo 권한 체크
if [[ $EUID -ne 0 ]]; then
  echo "You have to start with root"
  exit 1
fi

# 1. node 20 체크 하고 설치 하기
echo "[1] Check node 20"
NODE_VER=$(node -v 2>/dev/null | cut -dv -f2 | cut -d. -f1)
if [[ -z "$NODE_VER" || $NODE_VER -lt 20 ]];  then
  echo "Node version: $NODE_VER, Install node 20 start"
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  apt-get install -y nodejs
  echo "$(node -v) is installed"
else
  echo "$(node -v) is already installed"
fi
