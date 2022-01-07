# Marin-Traffic with MongoDB

## Description

## Build and run the Docker image
```bash
# Build the docker image
docker build . -t vasikas/marine-nosql  
# Run in detached mode
docker run --rm -p 49160:8080 -d vasikas/marine-nosql
# Run in none-detached mode
docker run --rm -it -p 49160:8080 vasikas/marine-nosql
```
## build and run with docker compose
```bash
docker-compose up -d
docker-compose up --build
```

## Set Enviroment Variable
```bash
[System.Environment]::SetEnvironmentVariable('DB_HOSTNAME','mongo-container')
```


## Run localy
```bash
docker-compose up -d mongo
npm start
```