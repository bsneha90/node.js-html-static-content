FROM node:8
EXPOSE 5000
WORKDIR /home/node/app
COPY . .
CMD ["npm","start"]