FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=20.19.1

RUN apt-get update && apt-get install -y \
    curl wget ca-certificates gnupg lsb-release \
    software-properties-common build-essential \
    git unzip \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && node --version \
    && npm --version

WORKDIR /app

COPY . .

RUN npm install

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build
