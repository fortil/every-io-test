FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install && npm install typescript -g

# Bundle app source
COPY . .

EXPOSE 8080

RUN tsc

CMD [ "node", "./dist/server.js" ]