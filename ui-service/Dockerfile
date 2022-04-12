FROM node:16
# Create app directory
WORKDIR ./
# Install app dependencies
COPY package*.json ./

RUN npm install

COPY ./ ./

ENV PORT=3002

EXPOSE 3002

CMD [ "npm", "start" ]
