FROM node:latest

WORKDIR /app

COPY . .

RUN apt-get update

RUN npm install \
    && npm build

CMD [ "npm", "start" ]