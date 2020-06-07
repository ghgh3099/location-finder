FROM node:10-alpine

WORKDIR /usr/src/app

ARG PORT=3000
ENV SERVER_PORT $PORT
EXPOSE $PORT

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "start" ]
