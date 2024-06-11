FROM node:latest

RUN apt-get update

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "start", "--", "-H", "0.0.0.0", "-p", "80"]