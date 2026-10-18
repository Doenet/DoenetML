#!/usr/bin/env bash
# Generate the benchmark fixtures: DoenetML text and parsed DAST JSON for each
# spec in the default sweep (or the specs given as arguments).
set -euo pipefail
cd "$(dirname "$0")/.."
cargo build -q --release -p cells-docgen
DOCGEN=target/release/cells-docgen
mkdir -p fixtures
specs=("$@")
# Hand-written fixtures: parsed, not generated.
HANDWRITTEN=(sir)
if [ ${#specs[@]} -eq 0 ]; then
  # The whole set: drop fixtures of shapes no longer in the sweep.
  for f in fixtures/*.doenet fixtures/*.json fixtures/*.cdast; do
    [ -e "$f" ] || continue
    stem=$(basename "${f%.*}")
    if [[ "$f" == *.doenet && " ${HANDWRITTEN[*]} " =~ " $stem " ]]; then continue; fi
    rm -f "$f"
  done
  mapfile -t specs < <($DOCGEN --sweep); specs+=("${HANDWRITTEN[@]}")
fi
for spec in "${specs[@]}"; do
  if [[ " ${HANDWRITTEN[*]} " =~ " $spec " ]]; then
    [ -f "fixtures/$spec.doenet" ] || { echo "missing hand-written fixtures/$spec.doenet" >&2; exit 1; }
  else
    $DOCGEN "$spec" > "fixtures/$spec.doenet"
  fi
  start=$(date +%s%N)
  node --max-old-space-size=8192 --stack-size=65500 scripts/parse-dast.mjs -i "fixtures/$spec.doenet" > "fixtures/$spec.json"
  ms=$(( ($(date +%s%N) - start) / 1000000 ))
  node --max-old-space-size=8192 --stack-size=65500 scripts/parse-dast.mjs --binary -i "fixtures/$spec.doenet" > "fixtures/$spec.cdast"
  printf '%-16s %8d bytes doenet %10d bytes json %10d bytes cdast  parse %6d ms\n' "$spec" "$(stat -c %s fixtures/$spec.doenet)" "$(stat -c %s fixtures/$spec.json)" "$(stat -c %s fixtures/$spec.cdast)" "$ms"
done
