FROM node:22.17.0

WORKDIR /app

COPY ./package*.json /app

RUN npm install

COPY . /app/

CMD ["node", "."]

