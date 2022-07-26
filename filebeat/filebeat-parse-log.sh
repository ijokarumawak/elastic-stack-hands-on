#!/bin/sh
. $(dirname $0)/../env.sh

docker run --rm --name es-hands-on-filebeat-parse-log --user root -it \
  --volume="$(pwd)/filebeat/filebeat-parse-log.yml:/usr/share/filebeat/filebeat.yml:ro" \
  --volume="$(pwd)/filebeat/simple.log:/var/log/simple.log:ro" \
  docker.elastic.co/beats/filebeat:8.3.2 \
  -strict.perms=false \
  -e
