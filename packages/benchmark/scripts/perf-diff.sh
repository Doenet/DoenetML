#!/usr/bin/env bash
# Speed of the cells core on a base commit (default HEAD) against the
# working tree: builds the base's wasm in a worktree and runs the Node
# driver against each, interleaved, then prints new/base ratios of load,
# tick and memory per fixture. Noise is a few percent on loads.
#   scripts/perf-diff.sh [base] [fixture,fixture,...]
set -euo pipefail
here=$(cd "$(dirname "$0")/.." && pwd); root=$(git -C "$here" rev-parse --show-toplevel)
base=${1:-HEAD}; fixtures=${2:-chain-1000,fanout-1000,repeat-1000,symchain-100,answers-100,sir}
wt=$root/../.benchmark-perf-base; S=$here/results/raw/perf-diff; mkdir -p "$S"
git -C "$root" worktree remove --force "$wt" 2>/dev/null || true
git -C "$root" worktree add --detach --quiet "$wt" "$base"
trap 'git -C "$root" worktree remove --force "$wt"' EXIT
(cd "$wt/packages/cells-core" && CARGO_TARGET_DIR="$root/packages/cells-core/target/perf-base" npx wasm-pack build crates/cells-wasm --target web --release --out-dir "$S/base-pkg" --out-name cells_wasm >/dev/null 2>&1)
(cd "$root" && npm run build -w packages/cells-core >/dev/null 2>&1)
: > "$S/base.jsonl"; : > "$S/new.jsonl"
for round in 1 2 3; do
  CELLS_WASM_DIR="$S/base-pkg" node "$here/src/run.mjs" --cores=cells --fixtures="$fixtures" --out="$S/base.jsonl" >/dev/null
  node "$here/src/run.mjs" --cores=cells --fixtures="$fixtures" --out="$S/new.jsonl" >/dev/null
done
node - "$S" <<'JS'
const fs = require("node:fs"); const S = process.argv[2];
const load = (f) => { const m = {}; for (const l of fs.readFileSync(`${S}/${f}`, "utf8").split("\n").filter(Boolean)) { const r = JSON.parse(l); if (r.status === "ok") (m[r.fixture] ??= []).push(r); } return m; };
const b = load("base.jsonl"), n = load("new.jsonl");
const min = (rs, f) => Math.min(...rs.map(f));
console.log("fixture          load    tick  memory   (new/base, per-side minimum)");
for (const k of Object.keys(b)) {
  if (!n[k]) continue;
  const r = (f) => (min(n[k], f) / min(b[k], f)).toFixed(3).padStart(7);
  console.log(k.padEnd(16), r((x) => x.load_ms), r((x) => x.steps[0].p50_ms), r((x) => x.heap_bytes + x.wasm_bytes));
}
JS
