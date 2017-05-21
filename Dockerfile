FROM node:6.9.4
WORKDIR /app
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
RUN nvm install stable
RUN node --version
RUN npm --version
RUN npm install
RUN npm install -g angular-cli
RUN npm link angular-cli
RUN ng --version
RUN ng build --prod
EXPOSE 3000
CMD [ "npm", "start" ]
