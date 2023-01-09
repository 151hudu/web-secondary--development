#!/usr/bin/env bash
docker run --name=mediasoup-demo-app --rm -it \
    -p 3000:3000 \
    -p 3001:3001 \
    -e DOMAIN \
    mediasoup-demo-app