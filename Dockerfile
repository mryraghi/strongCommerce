FROM debian:jessie

RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN apt update && apt install -y nodejs && apt upgrade -y && apt-get install -y build-essential
RUN npm install angular-cli -g
WORKDIR /app
RUN ng build --prod
