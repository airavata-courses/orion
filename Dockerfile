FROM node:16 AS react-build
# Create app directory
WORKDIR ./
# Install app dependencies
COPY package*.json ./

RUN npm install

COPY ./ ./

RUN npm run build

FROM nginx

COPY --from=react-build ./build /usr/share/nginx/html