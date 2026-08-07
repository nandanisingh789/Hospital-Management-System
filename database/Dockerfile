FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=hospital_management_db

# Copy schema.sql to the docker initialization folder to run it on startup
COPY schema.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
