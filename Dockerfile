FROM debian:jessie

RUN sudo npm install angular-cli -g
WORKDIR /app
RUN ng build --prod
