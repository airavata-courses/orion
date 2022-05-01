#!/bin/bash
cd plot-weather-microservice/
kubectl delete -f plot.yaml
kubectl apply -f plot.yaml
cd ..
cd merra-plot-microservice/
kubectl delete -f plot.yaml
kubectl apply -f plot.yaml