#!/bin/sh
. $(dirname $0)/../env.sh

docker run --rm --name es-hands-on-filebeat-csv --user=root -it \
  --volume="$(pwd)/postgres/filebeat-csv.yml:/usr/share/filebeat/filebeat.yml:ro" \
  --volume="$(pwd)/postgres/order_items.csv:/var/log/order_items.csv:ro" \
  docker.elastic.co/beats/filebeat:7.11.1 \
  -E cloud.id=$ELASTIC_CLOUD_ID \
  -E cloud.auth=$ELASTIC_CLOUD_AUTH \
  -strict.perms=false \
  -e
