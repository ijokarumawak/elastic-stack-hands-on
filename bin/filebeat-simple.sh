#!/bin/sh
. $(dirname $0)/../env.sh

docker run --rm --name es-hands-on-filebeat-simple --user=root -it \
  --volume="$(pwd)/filebeat/filebeat-simple.yml:/usr/share/filebeat/filebeat.yml:ro" \
  --volume="$(pwd)/filebeat/simple.log:/var/log/simple.log:ro" \
  docker.elastic.co/beats/filebeat:7.11.1 \
  -strict.perms=false \
  -e
