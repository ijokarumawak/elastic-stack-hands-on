#!/bin/sh

CONTAINER_NAME=es-hands-on-postgres
. $(dirname $0)/../env.sh

docker ps |grep ${CONTAINER_NAME} > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "Docker container ${CONTAINER_NAME} already exists. Removing it first..."
  docker rm -f ${CONTAINER_NAME}
fi

echo "Creating a docker container ${CONTAINER_NAME}..."
docker run --rm --name ${CONTAINER_NAME} --network es-hands-on -d \
  --volume="$(pwd)/postgres:/var/lib/postgresql/share:rw" \
  --label co.elastic.logs/module=postgresql \
  --label co.elastic.metrics/module=postgresql \
  --label co.elastic.metrics/hosts='postgres://${data.host}:${data.port}' \
  -e POSTGRES_PASSWORD='Password!123' \
  postgres
