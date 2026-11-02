# Build do back-end (Maven + Java 21) e copia do front para dentro do jar.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY Sts/pom.xml ./
RUN mvn -B -q dependency:go-offline

COPY Sts/src ./src
COPY ["Front end", "./src/main/resources/static"]

RUN mvn -B clean package -DskipTests

# Imagem final, somente com o Java necessario para executar o jar.
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
