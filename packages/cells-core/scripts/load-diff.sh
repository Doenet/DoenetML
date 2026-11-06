#!/usr/bin/env bash
# Load times of the cells core on a base commit (default HEAD) against the
# working tree, natively: builds `examples/load_cost.rs` at the base in a
# worktree and in the working tree, runs the two alternately seven times,
# then prints new/base ratios of each shape's load (per side, the median of
# the seven runs' medians, as `tick-diff.sh` takes them). The companion of
# `tick-diff.sh`: a change to the compile or the build reports both, since
# a pass that makes ticks cheaper is paid for at every load. A base without
# `load_cost` gets the working tree's copy, which needs only
# `cells_bench::shapes::load`. `sir` needs `@doenet/parser` built.
#   scripts/load-diff.sh [base] [shape,shape,...] [size,size,...]
set -euo pipefail
here=$(cd "$(dirname "$0")/.." && pwd); root=$(git -C "$here" rev-parse --show-toplevel)
base=${1:-HEAD}
export CELLS_SHAPES=${2:-depth,breadth,isolated,mixed,cutoff,refs,coords,poly}
export CELLS_SIZES=${3:-1000,10000}
export SIR=$here/fixtures/sir.doenet
wt=$root/../.load-diff-base; S=$here/target/load-diff; mkdir -p "$S"
git -C "$root" worktree remove --force "$wt" 2>/dev/null || true
git -C "$root" worktree add --detach --quiet "$wt" "$base"
trap 'git -C "$root" worktree remove --force "$wt"' EXIT
ex=packages/cells-core/crates/cells-bench/examples/load_cost.rs
[ -f "$wt/$ex" ] || cp "$root/$ex" "$wt/$ex"
build() { (cd "$1/packages/cells-core" && CARGO_TARGET_DIR="$here/target/$2" cargo build -q --release -p cells-bench --example load_cost); }
build "$wt" load-diff-base
build "$root" load-diff-new
rm -f "$S/base.jsonl" "$S/new.jsonl"
for round in 1 2 3 4 5 6 7; do
  "$here/target/load-diff-base/release/examples/load_cost" >>"$S/base.jsonl"
  "$here/target/load-diff-new/release/examples/load_cost" >>"$S/new.jsonl"
done
node - "$S" <<'JS'
const fs = require("node:fs"); const S = process.argv[2];
const read = (f) => {
  const m = new Map();
  for (const l of fs.readFileSync(`${S}/${f}`, "utf8").split("\n").filter(Boolean)) {
    const r = JSON.parse(l); const k = `${r.shape} ${r.n}`;
    if (!m.has(k)) m.set(k, []); m.get(k).push(r.ms);
  }
  return m;
};
const b = read("base.jsonl"), n = read("new.jsonl");
const med = (xs) => [...xs].sort((p, q) => p - q)[xs.length >> 1];
console.log("| shape | n | load, base → new (ms) | new / base |");
console.log("|---|---:|---|---:|");
for (const [k, rb] of b) {
  const rn = n.get(k); if (!rn) continue;
  const [shape, size] = k.split(" ");
  const lb = med(rb), ln = med(rn);
  console.log(`| ${shape} | ${size} | ${lb.toFixed(2)} → ${ln.toFixed(2)} | ${(ln / lb).toFixed(2)} |`);
}
JS
