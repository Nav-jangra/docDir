FROM node:22-alpine

WORKDIR /data/directory

COPY package.json tsconfig.json nest-cli.json /data/directory/

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start:dev"]
