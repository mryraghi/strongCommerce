FROM node:6.9.4
WORKDIR /app
RUN npm install
CMD [ "npm", "install", "-g", "angular-cli" ]
RUN ng build --prod
EXPOSE 3000
CMD [ "npm", "start" ]
