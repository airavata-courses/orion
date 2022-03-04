# Orion



Release branch names:
- `a1-plot-graph-release`
- `a1-data-ingestor-release`
- `a1-registry-release`
- `a1-gateway-release`
- `a1-ui-release`

---
#### Please follow the order of execution of microservices as mentioned in this document
---

## Plot Graph Microservice

Following are the steps for running the microservice:

### Using Docker

For running it with Docker, please pull the repository and run the following commands:
```
git clone https://github.com/airavata-courses/orion
cd orion
git checkout a1-plot-graph-release
cd plot-weather-microservice
```

```
docker build . -t plot
docker run -d --name adsA1-plot -p 8000:8000 plot
```

**NOTE:** This microservice runs at PORT number **`8000`**

### Build from Source


Please pull the repository and run the following commands:
```
git clone https://github.com/airavata-courses/orion
cd orion
git checkout a1-data-ingestor-release
cd plot-weather-microservice
```

```
python3 manage.py runserver
```

## Data Ingestor Microservice

Following are the steps for running the microservice:

### Build from Source


Please pull the repository and run the following commands:
```
git clone https://github.com/airavata-courses/orion
cd orion
git checkout a1-data-ingestor-release
cd weather-data-ingestor-microservice
```

```
npm install
npm start
```

**NOTE:** This microservice runs at PORT number **`3001`**



## Gateway Microservice

Following are the steps for running the microservice:

### Build from Source

Please pull the repository and run the following commands:
```
git clone https://github.com/airavata-courses/orion
cd orion
git checkout a1-gateway-release
cd gateway-service
```

```
npm install
npm start
```

**NOTE:** This microservice runs at PORT number **`3000`**




## Registry Microservice

Run the following commands to run the registry as a docker container


#### MySQL Server

```
docker pull mysql/mysql-server:latest

docker run -it --network registry_network --name registry-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=requestLog -e MYSQL_USER=root -e MYSQL_PASSWORD=root -d mysql/mysql-server:latest

```


#### Maven Docker Build
```
docker build --tag orion-registry . 

docker run -d -it --network registry_network --name adsA2-registry -p 8091:8091 orion-registry
```
Since this microservice has external dependencies (MySQL), please refer its standalone README [here](https://github.com/airavata-courses/orion/blob/a1-registry-release/registry-service/README.md)

**NOTE:** This microservice runs at PORT number **`8091`**


## UI Microservice

Following are the steps for running the microservice:

### Build from Source

Please pull the repository and run the following commands:
```
git clone https://github.com/airavata-courses/orion
cd orion 
git checkout a1-ui-release

```

```
npm install
npm start
```

**NOTE:** This microservice runs at PORT number **`3002`**
