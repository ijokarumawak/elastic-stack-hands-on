#!/bin/sh

docker run --rm --name es-hands-on-custom-app -it \
  --volume="$(pwd)/custom-app/main.sh:/main.sh:ro" \
  --label co.elastic.logs/exclude_lines="^Input" \
  --label co.elastic.logs/processors.1.add_fields.target="event" \
  --label co.elastic.logs/processors.1.add_fields.fields.dataset='${data.container.name}' \
  --label co.elastic.logs/processors.2.dissect.target_prefix="" \
  --label co.elastic.logs/processors.2.dissect.overwrite_keys="true" \
  --label co.elastic.logs/processors.2.dissect.tokenizer="%{@timestamp} %{message}" \
  alpine /main.sh
