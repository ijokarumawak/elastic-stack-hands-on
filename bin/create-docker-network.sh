#!/bin/sh
docker network ls |grep es-hands-on > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "Docker network 'es-hands-on' already exists. Using it."
else
  echo "Creating a docker network 'es-hands-on' ..."
  docker network create --driver bridge es-hands-on
fi