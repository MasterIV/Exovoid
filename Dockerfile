FROM node:latest

COPY server/server.js /home/node/app/server/
COPY build /home/node/app/build

EXPOSE 3080

WORKDIR /home/node/app

CMD ["node", "server/server.js"]