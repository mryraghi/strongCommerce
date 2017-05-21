FROM debian:jessie

RUN apt update && apt install -y nodejs
RUN npm install angular-cli -g
WORKDIR /app
RUN ng build --prod
