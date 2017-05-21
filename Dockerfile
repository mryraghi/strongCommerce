FROM node:6.9.2
WORKDIR /app
RUN npm install
RUN $(npm)/ng build --prod
EXPOSE 3000
CMD [ "npm", "start" ]
