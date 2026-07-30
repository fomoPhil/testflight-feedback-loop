#!/usr/bin/env bash
# Poll App Store Connect until a TestFlight build's processing state resolves.
# Intended to run in the background (run_in_background: true); notify the user on completion.
#
# Usage: poll_build_status.sh <app-id> <build-number> [max-polls] [interval-seconds]
#   max-polls default 20, interval default 60s (~20 min ceiling).
# Exit: 0 VALID, 1 INVALID/FAILED, 2 timed out still processing.
set -euo pipefail
APP="${1:?app id required}"
BUILD="${2:?build number required}"
MAX="${3:-20}"
INTERVAL="${4:-60}"

for i in $(seq 1 "$MAX"); do
  sleep "$INTERVAL"
  STATE=$(asc builds list --app "$APP" 2>/dev/null | BUILD="$BUILD" python3 -c "
import os, sys, json
target = os.environ['BUILD']
try:
    rows = json.load(sys.stdin).get('data', [])
    for b in rows:
        a = b.get('attributes', {})
        if str(a.get('version')) == target:
            print(a.get('processingState', '?')); break
    else:
        print('ABSENT')
except Exception:
    print('ERR')
")
  echo "[poll $i] build $BUILD: $STATE"
  case "$STATE" in
    VALID)          echo "BUILD $BUILD IS VALID — ready in TestFlight"; exit 0;;
    INVALID|FAILED) echo "BUILD $BUILD PROCESSING FAILED ($STATE)"; exit 1;;
  esac
done
echo "BUILD $BUILD still not VALID after ~$((MAX * INTERVAL))s — check App Store Connect."
exit 2
