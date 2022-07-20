#!/bin/sh
. $(dirname $0)/../env.sh

docker run --rm --name es-hands-on-logstash --user=root -it \
  --volume="$(pwd)/logstash/simple.conf:/usr/share/logstash/pipeline/logstash.conf:ro" \
  docker.elastic.co/logstash/logstash:8.3.2