FROM node:20.10.0-alpine3.18 as builder

# Create app directory
WORKDIR /tmp/app

COPY . .

RUN npm ci
RUN npm run build

FROM node:20.10.0-alpine3.18

WORKDIR /usr/app

COPY --from=builder /tmp/app/node_modules node_modules
COPY --from=builder /tmp/app/dist dist
COPY --from=builder /tmp/app/package*.json ./

USER node

EXPOSE 8080

CMD [ "sh", "-c", "npm run start" ]