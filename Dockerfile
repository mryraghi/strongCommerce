FROM node:6.9.2
WORKDIR /app
RUN npm install
RUN $(npm bin)/ng build --prod
EXPOSE 3000
CMD [ "npm", "start" ]
