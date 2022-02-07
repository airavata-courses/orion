# Creating a Django Framework for REST
### Installation
Run the following commands:
1. pip install django
2. pip install djangorestframework

### Create a Django Project
Run the following commands
1. django-admin startproject <project_name>
2. django-admin startapp <app_name>

### Creating a Docker Image and executing on Docker
1. Create a Dockerfile in the project directory with the required commands to be executed in runtime
2. Create a requirements.txt file with the packages and their required versions
3. Execute the build and run commands to create the image and container and run the container

### Steps to be followed to run the Plot microservice (Python)
### Option 1: Create an image and run the container
Run the following commands in the project directory
1. docker build . -t plot-graph
2. docker run -d --name adsassignment1-plot -p 8000:8000 plot-graph
<p>The plot microservice will be hosted on localhost:8000</p>

### Option 2: Pull the docker image from the remote docker repository and execute the container
Run the following commands in the project directory
1. docker pull anbadrin/orion-assignment1:plot-graph-v1
2. docker run -d --name adsassignment1-plot -p 8000:8000 plot-graph
<p>The plot microservice will be hosted on localhost:8000</p>
