#!/bin/sh
. $(dirname $0)/../env.sh

docker run --rm --name es-hands-on-filebeat-module-nginx -it \
  --volume="$(pwd)/filebeat/filebeat-module-nginx.yml:/usr/share/filebeat/filebeat.yml:ro" \
  --volume="$(pwd)/nginx/access.log:/var/log/nginx/access.log:ro" \
  docker.elastic.co/beats/filebeat:8.3.2 \
  -E cloud.id=$ELASTIC_CLOUD_ID \
  -E cloud.auth=$ELASTIC_CLOUD_AUTH \
  -strict.perms=false \
  -e