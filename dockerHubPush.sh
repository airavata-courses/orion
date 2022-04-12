#docker run -d --hostname rabbit-host --name orionRabbit -it --network orion_net>

docker build --tag anbadrin/orion-project3:ui ./ui-service
docker push anbadrin/orion-project3:ui

docker build --tag anbadrin/orion-project3:ingestor ./weather-data-ingestor
docker push anbadrin/orion-project3:ingestor

docker build --tag anbadrin/orion-project3:gateway ./gateway-service
docker push anbadrin/orion-project3:gateway

docker build --tag anbadrin/orion-project3:plot ./plot-weather-microservice
docker push anbadrin/orion-project3:plot

docker build --tag anbadrin/orion-project3:merra-plot ./merra-plot-microservice
docker push anbadrin/orion-project3:merra-plot
