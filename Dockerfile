# Use Java 17 runtime
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy Maven project files
COPY pom.xml .
COPY src ./src

# Build the Spring Boot project
RUN apt-get update && apt-get install -y maven
RUN mvn -q -e -DskipTests package

# Expose port
EXPOSE 8080

# Run the jar file
CMD ["java", "-jar", "target/*.jar"]
