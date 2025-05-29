
FROM node:18.20.3-alpine AS build


RUN npm install -g @angular/cli@16.2.16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY . . 

RUN ng build

FROM nginx:latest
RUN apt-get update && apt-get install -y iputils-ping

COPY --from=build /usr/src/app/dist/projetservice /usr/share/nginx/html

EXPOSE 80
