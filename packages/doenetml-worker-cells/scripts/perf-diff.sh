#!/usr/bin/env bash
# Quick perf check for refactors: the regress example on a base commit
# (default HEAD) and on the working tree, interleaved over 5 rounds; prints
# new/base ratios of the per-side minimum. Noise is about ±5% on loads.
# The base gets this tree's cells-bench src/lib.rs and regress.rs.
set -e
repo=$(cd "$(dirname "$0")/.." && pwd); S="$repo/results/raw/perf"; mkdir -p "$S"
base=${1:-HEAD}; wt=$repo/../.cells-prototype-perf
cd $repo
git worktree remove --force $wt 2>/dev/null || true
git worktree add --detach --quiet $wt $base
trap 'git -C $repo worktree remove --force $wt' EXIT
# The base binary reads fixtures from its own tree; the generated ones are gitignored.
rm -rf $wt/fixtures && ln -s $repo/fixtures $wt/fixtures
cp crates/cells-bench/src/lib.rs $wt/crates/cells-bench/src/lib.rs
# Build both sides with the same flags.
if [ -d .cargo ]; then rm -rf $wt/.cargo && cp -r .cargo $wt/.cargo; fi
cp crates/cells-bench/examples/regress.rs $wt/crates/cells-bench/examples/regress.rs
(cd $wt && CARGO_TARGET_DIR=$repo/target/perf-base cargo build --release -q -p cells-bench --example regress)
cargo build --release -q -p cells-bench --example regress
B=$repo/target/perf-base/release/examples/regress; N=$repo/target/release/examples/regress
F="${PERF_FIXTURES:-chain-100000 points-10000 repeat-10000 recur-10000 fanout-10000 circles3-10000 sticky-1000 curves-1000 symchain-1000 wording-10000}"
: > $S/perf-base.jsonl; : > $S/perf-new.jsonl
for r in 1 2 3 4 5; do for f in $F; do
  $B 50 $f >> $S/perf-base.jsonl; $N 50 $f >> $S/perf-new.jsonl
done; done
python3 - "$S" <<'PY'
import json,sys,collections
S=sys.argv[1]
def load(p):
    d=collections.defaultdict(list)
    for l in open(p): j=json.loads(l); d[j['spec']].append(j)
    return d
b,n=load(S+'/perf-base.jsonl'),load(S+'/perf-new.jsonl')
print(f"{'spec':16} {'load':>7} {'tick':>7} {'bytes':>7}   (new/base)")
for k in b:
    r=lambda key: min(x[key] for x in n[k])/min(x[key] for x in b[k])
    print(f"{k:16} {r('load_ms'):7.3f} {r('tick_ms'):7.3f} {r('bytes'):7.3f}")
PY
