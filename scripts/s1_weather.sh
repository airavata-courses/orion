cd ../plot-weather-microservice
docker build . -t plot
docker run -d --name orion-adsA1-plot -p 8000:8000 plot
