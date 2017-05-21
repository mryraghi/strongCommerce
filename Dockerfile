FROM node:6.9.4
WORKDIR /apps
RUN node --version
RUN npm --version
RUN npm install
RUN npm install -g angular-cli
RUN npm link angular-cli
RUN ng --version
RUN ng build --prod
EXPOSE 3000
CMD [ "npm", "start" ]
