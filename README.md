# Robotic Service

## About

This service is mainly supporting the robotic portal backend system

- Supporting all the business needs for robotic portal
- Rest API is fully supported
- Deployment is done via Github Action(CI/CD), Automatically containerize and push a Docker container to Docker hub
- Github Runner is being setup up with AWS EC2 to perform automation deployment

## How to install this application and make it run in your local

1. clone this project
2. Run this command: git clone https://github.com/Ken329/robotic-service.git
3. Run this command: npm ci
4. setup the .env file base on the .env.example
5. generate the encryptionKeyPair for encryption purpose
6. Run this command: npm run build && npm run start
7. Feel free to run this application in the development mode by running this command: npm run start:dev

## How to run robotic service with docker compose

This is the docker compose file along with the guide for installation - https://github.com/Ken329/robotic-portal
