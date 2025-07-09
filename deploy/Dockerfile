FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=20.19.1
ENV JAVA_HOME=/opt/microsoft/jdk-21.0.7+7
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

RUN mkdir -p /opt/microsoft \
    && cd /tmp \
    && wget -O microsoft-jdk-21.0.7.tar.gz "https://aka.ms/download-jdk/microsoft-jdk-21.0.7-linux-x64.tar.gz" \
    && tar -xzf microsoft-jdk-21.0.7.tar.gz -C /opt/microsoft \
    && rm microsoft-jdk-21.0.7.tar.gz \
    && ln -sf /opt/microsoft/jdk-21.0.7+7 /opt/microsoft/java-21-microsoft

WORKDIR /app

EXPOSE 3000 8080

CMD ["/bin/bash"]
