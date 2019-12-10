FROM node:8
EXPOSE 5000
COPY . .
RUN apt update && \
 apt install apt-transport-https && \
 curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -  && \
 echo "deb [arch=amd64] http://download.docker.com/linux/debian stretch  stable" >> /etc/apt/sources.list && \
 apt update && \
 apt install docker-ce-cli && \
 chmod u+x scripts/run-R-script.sh
WORKDIR /home/node/app
VOLUME /home/node/app/public
CMD ["npm","start"]