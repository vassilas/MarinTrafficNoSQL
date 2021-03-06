# Marin-Traffic with MongoDB

## Description

![alt text](https://raw.githubusercontent.com/vassilas/MarinTrafficNoSQL/main/public/images/map_sample.png)

## Build and run the Docker image
```bash
# Build the docker image
docker build . -t vasikas/marine-nosql  
# Run in detached mode
docker run --rm -p 8080:8080 -d vasikas/marine-nosql
# Run in none-detached mode
docker run --rm -it -p 8080:8080 vasikas/marine-nosql
# Push image to dockerhub
docker push vasikas/marine-nosql
```
## build and run with docker compose
```bash
docker-compose up -d
docker-compose up --build
```

## Set Enviroment Variable
```bash
[System.Environment]::SetEnvironmentVariable('DB_HOSTNAME','mongo-container')
[System.Environment]::SetEnvironmentVariable('DB_HOSTNAME','0.0.0.0')
```


## Run localy
```bash
docker-compose up -d mongo
npm start
```



## some resources to study
* Leaflet.BoatMarker
https://github.com/thomasbrueggemann/leaflet.boatmarker
* leaflet-marker-vessel
https://github.com/FCOO/leaflet-marker-vessel