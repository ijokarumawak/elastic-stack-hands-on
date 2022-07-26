#!/bin/sh

bin/create-docker-network.sh \
  && bin/app-ui.sh \
  && bin/app-api.sh \
  && bin/python.sh \
  && bin/nginx.sh docker