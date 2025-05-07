
FROM openjdk:17-bullseye
RUN apt-get update  && apt-get install -y  maven
WORKDIR /code/projetservice
COPY . .
RUN rm -rf target
RUN mvn clean package -DskipTests --no-transfer-progress -B
RUN mv target/*.jar  /code/projet.jar
RUN rm -rf /code/projetservice  /root/.m2   /root/.cache /tmp/* /var/tmp/*
#set environment varaibles
#ENV SPRING_OUTPUT_AHSI_ENABLED=ALWAYS
EXPOSE  8080
ENTRYPOINT  ["java","-jar" ,"/code/projet.jar"]







