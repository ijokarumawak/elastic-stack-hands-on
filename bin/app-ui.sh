#!/bin/sh

CONTAINER_NAME=es-hands-on-app-ui
. $(dirname $0)/../env.sh

(cd app/ui && docker build -t ijokarumawak/es-hands-on-app-ui .)

docker ps |grep ${CONTAINER_NAME} > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "Docker container ${CONTAINER_NAME} already exists. Removing it first..."
  docker rm -f ${CONTAINER_NAME}
fi

echo "Creating a docker container ${CONTAINER_NAME}..."
docker run --rm --name ${CONTAINER_NAME} --network es-hands-on -d \
--label co.elastic.logs/processors.1.add_fields.target="event" \
--label co.elastic.logs/processors.1.add_fields.fields.dataset='${data.container.name}' \
-e REACT_APP_KEY="${HANDS_ON_KEY}" \
ijokarumawak/es-hands-on-app-ui \
