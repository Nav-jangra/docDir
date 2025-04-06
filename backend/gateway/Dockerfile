FROM node:22-alpine

WORKDIR /data/gateway

COPY package.json tsconfig.json nest-cli.json /data/gateway/

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start:dev"]
