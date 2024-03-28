FROM node:20.11.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci
RUN npm run build

# Bundle app source
COPY . .

USER node

EXPOSE 8080
CMD [ "npm run start" ]