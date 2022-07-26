#!/bin/sh
. $(dirname $0)/../env.sh

docker run --rm --name es-hands-on-logstash --user=root -it \
  --volume="$(pwd)/logstash/0003410382.conf:/usr/share/logstash/pipeline/logstash.conf:ro" \
  --volume="$(pwd)/logstash/0003410382.csv:/var/log/0003410379.csv:ro" \
  --env HANDS_ON_KEY \
  --env ELASTIC_CLOUD_ID \
  --env ELASTIC_CLOUD_AUTH \
  docker.elastic.co/logstash/logstash:8.3.2