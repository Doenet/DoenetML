#!/usr/bin/env bash
# Compare the golden behavior dump (crates/cells-bench/examples/golden.rs)
# of the working tree against a base commit (default HEAD). The base runs in
# a temporary worktree with this tree's harness and documents copied in, so
# both sides use the same script; set GOLDEN_OWN=1 to use the base's own
# harness instead (when the Document API changed between them).
#
# Usage: scripts/golden-diff.sh [base-rev]
set -euo pipefail
repo=$(cd "$(dirname "$0")/.." && pwd)
base=${1:-HEAD}
out="$repo/results/raw/golden"
# The base is a worktree of the whole DoenetML monorepo, beside it; it shares
# the monorepo's node_modules so that scripts/parse-dast.mjs finds @doenet/parser.
root=$(git -C "$repo" rev-parse --show-toplevel)
wtroot="$root/../.cells-golden"
wt="$wtroot/${repo#"$root"/}"

rm -rf "$out/base" "$out/head" "$out/base.programs" "$out/head.programs"
git -C "$repo" worktree remove --force "$wtroot" 2>/dev/null || true
git -C "$repo" worktree add --detach --quiet "$wtroot" "$base"
trap 'git -C "$repo" worktree remove --force "$wtroot"' EXIT
ln -s "$root/node_modules" "$wtroot/node_modules"
if [[ "${GOLDEN_OWN:-0}" != 1 ]]; then
  cp "$repo/crates/cells-bench/examples/golden.rs" "$wt/crates/cells-bench/examples/"
  rm -rf "$wt/crates/cells-bench/golden"
  cp -r "$repo/crates/cells-bench/golden" "$wt/crates/cells-bench/"
fi

(cd "$wt" && CARGO_TARGET_DIR="$repo/target/golden-base" cargo run --release -q -p cells-bench --example golden -- "$out/base")
(cd "$repo" && cargo run --release -q -p cells-bench --example golden -- "$out/head")

if cmp -s "$out/base.programs" "$out/head.programs"; then
  echo "programs: identical"
else
  echo "programs: $(diff "$out/base.programs" "$out/head.programs" | grep -c '^>') documents built differently"
fi
if diff -r "$out/base" "$out/head" > "$out/diff.txt"; then
  echo "golden: identical ($(ls "$out/head" | wc -l) documents)"
else
  echo "golden: DIFFERS from $base; see $out/diff.txt ($(grep -c '^[<>]' "$out/diff.txt") lines)"
  exit 1
fi
