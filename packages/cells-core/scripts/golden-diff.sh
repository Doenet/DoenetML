#!/usr/bin/env bash
# Compare the golden behavior dump (crates/cells-bench/examples/golden.rs)
# of the working tree against a base commit (default HEAD). The base runs in
# a temporary worktree with this tree's harness and documents copied in, so
# both sides use the same script; set GOLDEN_OWN=1 to use the base's own
# harness instead (when the Document API changed between them).
#
# Usage: scripts/golden-diff.sh [base-rev]
set -euo pipefail
# This package lives inside a larger repository; the worktree checks out the
# whole repository and the base is this package's path within it. Bases
# older than the October 2026 package layout cannot be compared.
repo=$(cd "$(dirname "$0")/.." && pwd); root=$(git -C "$repo" rev-parse --show-toplevel); rel=${repo#$root/}
base=${1:-HEAD}
out="$root/results/raw/golden"
wt="$root/../.cells-prototype-golden"; bp="$wt/$rel"

rm -rf "$out/base" "$out/head" "$out/base.programs" "$out/head.programs"
git -C "$repo" worktree remove --force "$wt" 2>/dev/null || true
git -C "$repo" worktree add --detach --quiet "$wt" "$base"
trap 'git -C "$repo" worktree remove --force "$wt"' EXIT
# The fixtures are generated, not committed; the base reads this tree's.
rm -rf "$bp/fixtures" && ln -s "$repo/fixtures" "$bp/fixtures"
# The worktree is outside the repository, so the harness's parser comes
# from this tree's installed packages.
ln -s "$root/node_modules" "$wt/node_modules"
if [[ "${GOLDEN_OWN:-0}" != 1 ]]; then
  cp "$repo/crates/cells-bench/examples/golden.rs" "$bp/crates/cells-bench/examples/"
  rm -rf "$bp/crates/cells-bench/golden"
  cp -r "$repo/crates/cells-bench/golden" "$bp/crates/cells-bench/"
fi

(cd "$bp" && CARGO_TARGET_DIR="$repo/target/golden-base" cargo run --release -q -p cells-bench --example golden -- "$out/base")
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
