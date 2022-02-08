# Creating a Node.js based Rest API
### Installation and setup for node.js microservice
1. Create a file named server.js in the root directory
3. To create a package.json file, run command <i>npm init</i> inside the project folder
4. Run command <i>npm install express request --save</i> (This will create a node_modules folder and a package-lock.json file)
5. Create a folder, api which will support the API calls

### Creating a Docker Image and executing on Docker
1. Create a Dockerfile in the project directory with the required commands to be executed in runtime
2. Execute the build and run commands to create the image and container and run the container

### Steps to be followed to run the Data Ingestor Microservice (Node.js)
### Option 1: Create an image and run the container
Run the following commands in the project directory
1. docker build . -t data-ingestor
2. docker run -d --name adsassignment1-ingestor -p 3001:3001 data-ingestor
<p>The data ingestor microservice will be hosted on localhost:3001</p>

### Option 2: Pull the docker image from the remote docker repository and execute the container
Run the following commands in the project directory
1. docker pull anbadrin/orion-assignment1:data-ingestor-v1
2. docker run -d --name adsassignment1-plot -p 3001:3001 anbadrin/orion-assignment1:data-ingestor-v1
<p>The data ingestor microservice will be hosted on localhost:3001</p>
