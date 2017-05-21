FROM node:6.9.4
WORKDIR /apps
RUN node --version
RUN npm --version
RUN npm install npm@latest -g
RUN npm cache clean -g
RUN npm install > /dev/null
RUN npm install -g angular-cli > /dev/null
RUN npm link angular-cli@latest
RUN ng --version
RUN ng build --prod
EXPOSE 3000
CMD [ "npm", "start" ]
