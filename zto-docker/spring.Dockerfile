# Use OpenJDK 21 JDK image as the base image, which is a slim version (smaller footprint)
FROM openjdk:21-jdk-slim

# Set the working directory inside the container
WORKDIR /app
 
# Copy the Maven wrapper and other necessary Maven files into the container
COPY ./zto-spring/.mvn/ ./.mvn
COPY ./zto-spring/mvnw ./zto-spring/pom.xml ./

# Make the Maven wrapper executable inside the container
RUN chmod +x ./mvnw

# Run the Maven command to download all project dependencies in advance (offline)
RUN ./mvnw dependency:go-offline
 
