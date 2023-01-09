FROM node:16

# Install DEB dependencies and others.
RUN \
	set -x \
	&& apt-get update \
	&& apt-get install -y net-tools build-essential python3 python3-pip valgrind

WORKDIR /service

COPY ./server/package.json .
RUN npm install
COPY ./server/server.js .
COPY ./server/config.js .
COPY ./server/lib lib
COPY ./server/certs certs

WORKDIR /mediasoup-demo

COPY ./server/ server/
COPY ./app/ app/

WORKDIR /mediasoup-demo/app
RUN npm install --legacy-peer-deps

WORKDIR /
COPY run-all.sh .

CMD ["sh", "./run-all.sh"]