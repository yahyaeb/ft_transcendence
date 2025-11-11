#!/bin/sh
set -eu

echo "Waiting for Kibana to be ready..."
i=0
until curl -fsS http://kibana:5601/api/status \
  | grep -E '"state":"green"|"level":"available"' >/dev/null; do
  i=$((i+1))
  [ "$i" -ge 60 ] && { echo "Timed out waiting for Kibana"; exit 1; }
  echo "waiting for kibana..."; sleep 3
done

echo "Creating data view (idempotent)..."
curl -fsS -X POST "http://kibana:5601/api/data_views/data_view" \
  -H "kbn-xsrf: bootstrap" -H "Content-Type: application/json" \
  -d '{"data_view":{"title":"app-logs-*","name":"App Logs","timeFieldName":"@timestamp"}}' \
  -o /dev/null -w "%{http_code}\n" \
| grep -Eq '^(200|409)$' && echo "Data view created or already exists."
