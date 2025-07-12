FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

RUN apt-get update && apt-get install -y \
    curl wget ca-certificates gnupg lsb-release \
    software-properties-common build-essential \
    git unzip \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y openjdk-21-jdk \
   && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN if [ -f "./gradlew" ]; then \
    chmod +x ./gradlew && \
    ./gradlew clean build -x test; \
    fi

EXPOSE 8080

CMD ["java", "-jar", "./build/libs/*.jar"]
