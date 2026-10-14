#!/usr/bin/env bash
# Quick perf check for refactors: the regress example on a base commit
# (default HEAD) and on the working tree, interleaved over 5 rounds; prints
# new/base ratios of the per-side minimum. Noise is about ±5% on loads.
# The base gets this tree's cells-bench src/lib.rs and regress.rs.
set -e
# This package lives inside a larger repository; the worktree checks out the
# whole repository and the base is this package's path within it. Bases
# older than the October 2026 package layout cannot be compared.
repo=$(cd "$(dirname "$0")/.." && pwd); root=$(git -C "$repo" rev-parse --show-toplevel); rel=${repo#$root/}
S="$root/results/raw/perf"; mkdir -p "$S"
base=${1:-HEAD}; wt=$root/../.cells-prototype-perf; bp=$wt/$rel
cd $repo
git worktree remove --force $wt 2>/dev/null || true
git worktree add --detach --quiet $wt $base
trap 'git -C $repo worktree remove --force $wt' EXIT
# The base binary reads fixtures from its own tree; the generated ones are gitignored.
rm -rf $bp/fixtures && ln -s $repo/fixtures $bp/fixtures
cp crates/cells-bench/src/lib.rs $bp/crates/cells-bench/src/lib.rs
# Build both sides with the same flags.
if [ -d .cargo ]; then rm -rf $bp/.cargo && cp -r .cargo $bp/.cargo; fi
cp crates/cells-bench/examples/regress.rs $bp/crates/cells-bench/examples/regress.rs
(cd $bp && CARGO_TARGET_DIR=$repo/target/perf-base cargo build --release -q -p cells-bench --example regress)
cargo build --release -q -p cells-bench --example regress
B=$repo/target/perf-base/release/examples/regress; N=$repo/target/release/examples/regress
F="${PERF_FIXTURES:-chain-100000 points-10000 repeat-10000 fanout-10000 circles3-1000 sticky-1000 curves-100 symchain-1000 wording-1000}"
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
