
FROM node:18.20.3-alpine AS build


RUN npm install -g @angular/cli@16.2.16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN ng build --configuration production --progress --verbose --source-map=false


FROM nginx:latest

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/dist/projetservice /usr/share/nginx/html

EXPOSE 80
