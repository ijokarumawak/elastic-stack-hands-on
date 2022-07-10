#!/bin/sh
. $(dirname $0)/../env.sh
if [ "$#" -eq 0 ]; then
  detach="--detach"
fi

docker run --rm --name es-hands-on-metricbeat-docker --user=root $detach \
  --volume="$(pwd)/metricbeat/metricbeat-docker.yml:/usr/share/metricbeat/metricbeat.yml:ro" \
  --volume="/var/run/docker.sock:/var/run/docker.sock:ro" \
  --volume="/sys/fs/cgroup:/hostfs/sys/fs/cgroup:ro" \
  --volume="/proc:/hostfs/proc:ro" \
  --volume="/:/hostfs:ro" \
  docker.elastic.co/beats/metricbeat:8.3.2 \
  -E cloud.id=$ELASTIC_CLOUD_ID \
  -E cloud.auth=$ELASTIC_CLOUD_AUTH -strict.perms=false \
  $@
