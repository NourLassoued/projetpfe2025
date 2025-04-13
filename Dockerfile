# Stage 1 : Build Angular application
FROM node:18.20.3-alpine AS build

# Installer Angular CLI
RUN npm install -g @angular/cli@16.2.16

# Définir le dossier de travail
WORKDIR /user/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --force

# Copier le reste du code
COPY . .

# Build de production avec options pour éviter les erreurs liées au budget
RUN ng build --configuration production --no-progress --source-map=false


# Stage 2 : Servir l'application Angular avec Nginx
FROM nginx:latest

COPY   nginx.conf  /etc/nginx/conf.d/default.conf
RUN apt-get update && apt-get install -y iputils-ping 

# Copier les fichiers compilés dans le dossier de Nginx
COPY --from=build /user/src/app/dist/projetservice /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80
