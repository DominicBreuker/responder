FROM node:7.5.0

COPY package.json /app/package.json

WORKDIR /app

RUN npm install

COPY app/ /app/

CMD node index.js
