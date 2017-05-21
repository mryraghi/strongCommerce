FROM node:6.9.4
WORKDIR /app
RUN npm install
RUN npm install angular-cli -g
RUN ng build --prod
EXPOSE 3000
CMD [ "npm", "start" ]
