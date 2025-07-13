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

EXPOSE 8080

RUN chmod +x ./gradlew
RUN ./gradlew clean build -x test
RUN cp $(ls ./build/libs/*.jar | grep -v plain | head -1) ./app.jar

CMD java -jar ./app.jar
