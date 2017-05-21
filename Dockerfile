FROM node:6.9.4
WORKDIR /app
CMD curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
CMD nvm install stable
RUN ng build --prod
RUN node --version
RUN npm --version
RUN npm install
CMD npm install -g angular-cli
EXPOSE 3000
CMD [ "npm", "start" ]
