FROM node:6.9.4
WORKDIR /app
RUN npm install
CMD npm install -g angular-cli
CMD alias ng="/root/.nvm/versions/node/*/lib/node_modules/angular-cli/bin/ng"
RUN ng build --prod
EXPOSE 3000
CMD [ "npm", "start" ]
