FROM eclipse-temurin:21-jre
WORKDIR /app
COPY ./apache-maven-3.9.8 /maven
COPY . /src
WORKDIR /src
RUN /maven/bin/mvn -q -DskipTests package
EXPOSE 8080
CMD ["/maven/bin/mvn","spring-boot:run"]
