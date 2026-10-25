#!/usr/bin/env bash
# Tick times of the cells core on a base commit (default HEAD) against the
# working tree, natively: builds `examples/tick_cost.rs` at the base in a
# worktree and in the working tree, runs the two alternately seven times,
# then prints new/base ratios of each shape's tick under each evaluator
# (per side, the median of the seven runs' median ticks: a run now and
# then lands fast or slow as a whole, and the median of runs rejects it),
# and whether the two hold the same values (the fingerprint after each
# shape's check drag). For the decisions of
# docs/tick-design-decisions.md; the base must have tick_cost.
#   scripts/tick-diff.sh [base] [shape,shape,...] [size,size,...]
set -euo pipefail
here=$(cd "$(dirname "$0")/.." && pwd); root=$(git -C "$here" rev-parse --show-toplevel)
base=${1:-HEAD}
export CELLS_SHAPES=${2:-depth,breadth,isolated,mixed,cutoff,refs,coords}
export CELLS_SIZES=${3:-10000,100000}
wt=$root/../.tick-diff-base; S=$here/target/tick-diff; mkdir -p "$S"
git -C "$root" worktree remove --force "$wt" 2>/dev/null || true
git -C "$root" worktree add --detach --quiet "$wt" "$base"
trap 'git -C "$root" worktree remove --force "$wt"' EXIT
build() { (cd "$1/packages/cells-core" && CARGO_TARGET_DIR="$here/target/$2" cargo build -q --release -p cells-bench --example tick_cost); }
build "$wt" tick-diff-base
build "$root" tick-diff-new
rm -f "$S/base.jsonl" "$S/new.jsonl"
for round in 1 2 3 4 5 6 7; do
  CELLS_OUT="$S/base.jsonl" "$here/target/tick-diff-base/release/examples/tick_cost" >/dev/null
  CELLS_OUT="$S/new.jsonl" "$here/target/tick-diff-new/release/examples/tick_cost" >/dev/null
done
node - "$S" <<'JS'
const fs = require("node:fs"); const S = process.argv[2];
const read = (f) => {
  const m = new Map();
  for (const l of fs.readFileSync(`${S}/${f}`, "utf8").split("\n").filter(Boolean)) {
    const r = JSON.parse(l); const k = `${r.shape} ${r.n}`;
    if (!m.has(k)) m.set(k, []); m.get(k).push(r);
  }
  return m;
};
const b = read("base.jsonl"), n = read("new.jsonl");
const med = (xs) => [...xs].sort((p, q) => p - q)[xs.length >> 1];
// Per side, the median of the runs' medians.
const tick = (rs, f) => med(rs.map((r) => med(r[f])));
const us = (ns) => (ns / 1e3).toFixed(1);
console.log("| shape | n | instructions (base → new) | dirty, base → new (µs) | new / base | full, base → new (µs) | new / base | same values |");
console.log("|---|---:|---|---|---:|---|---:|---|");
for (const [k, rb] of b) {
  const rn = n.get(k); if (!rn) continue;
  const [shape, size] = k.split(" ");
  const db = tick(rb, "dirty_ns"), dn = tick(rn, "dirty_ns");
  const fb = tick(rb, "full_ns"), fn = tick(rn, "full_ns");
  const same = rb[0].fingerprint === rn[0].fingerprint ? "yes" : "**no**";
  console.log(`| ${shape} | ${size} | ${rb[0].instructions} → ${rn[0].instructions} | ${us(db)} → ${us(dn)} | ${(dn / db).toFixed(2)} | ${us(fb)} → ${us(fn)} | ${(fn / fb).toFixed(2)} | ${same} |`);
}
JS
