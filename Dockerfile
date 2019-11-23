FROM node:8
EXPOSE 5000
WORKDIR /home/node/app
VOLUME /home/node/app/public
COPY . .
CMD ["npm","start"]