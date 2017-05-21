FROM debian:jessie

RUN npm install angular-cli -g
WORKDIR /app
RUN ng build --prod
