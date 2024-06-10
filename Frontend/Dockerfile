FROM node:latest

RUN apt-get update

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

CMD [ "npm", "start", "--", "-H", "0.0.0.0", "-p", "80"]