FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=20.19.1
ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

RUN apt-get update && apt-get install -y \
    curl wget ca-certificates gnupg lsb-release \
    software-properties-common build-essential \
    git unzip \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && node --version \
    && npm --version

RUN apt-get update && apt-get install -y openjdk-21-jdk \
   && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./backend ./backend
COPY ./frontend ./frontend
COPY ./deploy/deploy.sh .
COPY ./deploy/stop.sh .

EXPOSE 3000 8080

CMD ["/bin/bash"]
