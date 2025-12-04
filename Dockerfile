FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy only pom.xml and src/ to speed up caching
COPY pom.xml .
COPY src ./src

# Install Maven
RUN apt-get update && apt-get install -y maven

# Build the application
RUN mvn -q -e -DskipTests package

# Copy jar to a predictable name (always app.jar)
RUN cp target/url-shortener-0.0.1-SNAPSHOT.jar app.jar

ENV PORT=8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
