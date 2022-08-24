FROM node:16
ENV NODE_ENV=development
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install && npm install typescript nodemon concurrently jest -g

# Bundle app source
COPY . .

RUN chmod +x ./scripts/migrations.sh

EXPOSE 8080

RUN tsc

CMD [ "node", "./dist/index.js" ]