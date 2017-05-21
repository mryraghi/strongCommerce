ENTRYPOINT ["node"]

RUN sudo npm install angular-cli -g
WORKDIR /app
RUN ng build --prod
