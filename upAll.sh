#docker network create orion_network

docker run -d --hostname rabbit-host --name orionRabbit -it --network orion_network -p 5679:5672 -e RABBITMQ_DEFAULT_USER=guest -e RABBITMQ_DEFAULT_PASS=guest rabbitmq:3-management

# docker pull mysql/mysql-server:latest
# docker run -it --network orion_network --name registry-mysql -e MYSQL_ROOT_PASSWORD=admin -e MYSQL_DATABASE=requestLog -e MYSQL_USER=root -e MYSQL_PASSWORD=admin -d mysql/mysql-server:latest

docker build --tag orion-ui ./ui-service
docker run -d -it --network orion_network --name orionUI -p 3002:3002 orion-ui

# docker build --tag orion-ingestor ./weather-data-ingestor-microservice
# docker run -d -it --network orion_network --name orionIngestor -p 3001:3001 orion-ingestor

docker build --tag orion-gateway ./gateway-service 
docker run -d -it --network orion_network --name orionGateway -p 4000:4000 orion-gateway

# docker build --tag orion-plot ./plot-weather-microservice
# docker run -d -it --network orion_network --name orionPlot -p 8000:8000 orion-plot

docker build --tag orion-merra-plot ./merra-plot-microservice
docker run -d -it --network orion_network --name orionMerraPlot -p 8004:8004 orion-merra-plot

# docker build --tag orion-merra-weather ./merra-weather-microservice
# docker run -d -it --network orion_network --name orionMerraWeather -p 8002:8002 orion-merra-weather

# docker build --tag orion-registry ./registry-service
# docker run -d -it --network orion_network --name orionRegistry -p 8091:8091 orion-registry
