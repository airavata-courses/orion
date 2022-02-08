# Registry Microservice

This microservice is the common database for the distributed system. It uses a MySQL database.

For instructions to set up the developer environment, please check out the Wiki.

## Running the Microservice

There are two ways to run the microservice:
- Building from source
- Running the `jar` file


### Requirements

- MySQL server
- Java 11 - Please

### Building from source

Before running the Java service, please ensure that the MySQL service is running. Steps to run the MySQL service are at the end of this README.

#### Linux and MacOS

##### Step 1: Cloning repository
To build from source, clone the repository using the command:

**Note:** skip this step if you already have cloned the repository

```bash
git clone https://github.com/airavata-courses/orion.git
```

##### Step 2: Configuration

This microservice, by default, uses the following port numbers:
- Spring Boot: 8091
- MySQL: 3306

If any of the following settings are different for your machine, please change them at `registry-service/src/main/resources/application.properties`

```
spring.datasource.url=jdbc:mysql://localhost:PORT_NUMBER/requestlog?useSSL=false
spring.datasource.username=USERNAME
spring.datasource.password=PASSWORD
server.port = SERVER_PORT
```

Please replace the following:
- `PORT_NUMBER` with the port number, for example `3306` for the default setting. This is the default port that MySQL server runs at. So, only change this if MySQL server is running at a different port.
- `USERNAME` with the username to connect to the MySQL server
- `PASSWORD` with the password to connect to the MySQL server
- `SERVER_PORT` with the port number that the spring boot application has to run on; the default value is `8091`


##### Step 2: Change directory to root of Java microservice
Then change to the root of the Java microservice using the command:

```bash
cd ./orion/gateway-service
```


##### Step 4: Running Java service using Maven

Maven is the build tool used. To run it using Maven, use the command:

```bash
./mvnw clean spring-boot:run
```

This should build and run the MySQL

### Running the `jar` file

Change to the root of the Java service (`./orion/gateway-service/`) and run the following command in a terminal(Linux or MacOS) or console(windows):
```
java -jar registry-service-0.1.0.jar
```


## Appendix

### Installing Java SE 11

Please download and install JDK 11 for running this project.

Oracle JDK11 can be downloaded from [here](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html).

### Running the MySQL server

Please start the MySQL service using the following commands:

#### Linux

In linux, after installing MySQL, run the following command to start the MySQL server:
```bash
sudo service mysql start
```

Refer [this link](https://www.mysqltutorial.org/mysql-adminsitration/start-mysql/) to explore more ways to run it on Linux.

#### MacOS

```
mysql.server start
```

#### Windows

1. Open `Run` by pressing `windows + R`
2. Type `cmd` and press the `Enter` key
3. Type `mysqld` and press the `Enter` key

Refer [this link](https://www.mysqltutorial.org/mysql-adminsitration/start-mysql/) if you face issues starting the service.


### Creating a database in MySQL 

After starting the MySQL service, and before running the registry microservice, a database must be created.

#### To create the database

Enter the MySQL shell using the command 
```
mysql -u root -p
```

```
CREATE DATABASE requestlog;
```
