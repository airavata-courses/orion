FROM node:16
# Create app directory
WORKDIR ./gateway-service
# Install app dependencies
COPY gateway-service/package*.json ./

RUN npm install

COPY gateway-service ./

CMD [ "npm", "run", "start" ]