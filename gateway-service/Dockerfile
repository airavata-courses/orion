FROM node:16
# Create app directory
WORKDIR ./
# Install app dependencies
COPY package*.json ./

RUN npm install

COPY ./ ./

CMD [ "npm", "run", "start" ]