FROM node:20.10.0-alpine3.18

RUN npm ci
RUN npm run build

WORKDIR /usr/app