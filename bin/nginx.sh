#!/bin/sh
target=$1

if [ $# -eq 0 ]; then
  echo "e.g. nginx.sh target. where target is either 'local' or 'docker'."
  exit 1
elif [ $target = "local" ]; then
  network=""
elif [ $target = "docker" ]; then
  network=" --network es-hands-on"
else
  echo "e.g. nginx.sh target. where target is either 'local' or 'docker'."
  exit 1
fi

CONTAINER_NAME=es-hands-on-nginx
. $(dirname $0)/../env.sh

docker ps |grep ${CONTAINER_NAME} > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "Docker container ${CONTAINER_NAME} already exists. Removing it first..."
  docker rm -f ${CONTAINER_NAME}
fi

echo "Creating a docker container ${CONTAINER_NAME}..."
docker run --rm --name ${CONTAINER_NAME} $network -d -p 80:80 \
  --volume="$(pwd)/nginx/templates-$target:/etc/nginx/templates:ro" \
  --volume="$(pwd)/nginx/auth:/etc/nginx/auth:ro" \
  --label co.elastic.logs/module=nginx \
  --label co.elastic.logs/fileset.stdout=access \
  --label co.elastic.logs/fileset.stderr=error \
  --label co.elastic.metrics/module=nginx \
  --label co.elastic.metrics/metricsets=stubstatus \
  --label co.elastic.metrics/hosts='${data.host}:${data.port}' \
  --label co.elastic.metrics/username=${ELASTIC_USERNAME} \
  --label co.elastic.metrics/password=${ELASTIC_PASSWORD} \
  --label co.elastic.metrics/server_status_path="/nginx_status" \
  nginx
