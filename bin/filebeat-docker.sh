#!/bin/sh
. $(dirname $0)/../env.sh
if [ "$#" -eq 0 ]; then
  detach="--detach"
fi

docker run --rm --name es-hands-on-filebeat-docker --user=root $detach \
  --volume="$(pwd)/filebeat/filebeat-docker.yml:/usr/share/filebeat/filebeat.yml:ro" \
  --volume="/var/lib/docker/containers:/var/lib/docker/containers:ro" \
  --volume="/var/run/docker.sock:/var/run/docker.sock:ro" \
  docker.elastic.co/beats/filebeat:7.11.1 \
  -E cloud.id=$ELASTIC_CLOUD_ID \
  -E cloud.auth=$ELASTIC_CLOUD_AUTH \
  -strict.perms=false \
  $@
