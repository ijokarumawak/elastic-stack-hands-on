#!/bin/sh

CONTAINER_NAME=es-hands-on-postgres
. $(dirname $0)/../env.sh

docker exec -it ${CONTAINER_NAME} psql -U postgres
