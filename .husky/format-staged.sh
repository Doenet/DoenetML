#!/usr/bin/env bash
#
# Format staged files with Prettier without ever putting unstaged work at risk.
#
# This replaces `lint-staged` in the pre-commit hook. lint-staged handles a
# *partially staged* file (some hunks staged, the rest left in the working
# tree) by checking the staged snapshot out over your file, formatting it,
# then re-applying your unstaged hunks as a `--unified=0` patch. When Prettier
# reformats lines those unstaged hunks also touch, the patch no longer applies
# -- not even with `--3way` -- and the commit dies with:
#
#   ✖ Unstaged changes could not be restored due to a merge conflict!
#     lint-staged failed due to a git error.
#
# Here, partially staged files are formatted *in the index only*: the staged
# blob is piped through Prettier and written back with `git update-index`. The
# working tree is never stashed, checked out, or patched, so that failure mode
# is structurally impossible and unstaged edits are never touched.
#
# Fully staged files take the fast path -- index and working tree already
# agree, so one batched Prettier call plus `git add` is equivalent and avoids
# paying Node startup per file.
#
# Bypass, like any pre-commit hook, with `git commit --no-verify`.
#
# Kept to POSIX-ish bash 3.2 features -- no `declare -A`, no `mapfile` -- so it
# runs on the bash macOS ships.

set -uo pipefail

# Extensions this hook formats. Deliberately narrower than CI, which runs
# `npx prettier . --check` over every extension Prettier recognizes: this is the
# subset that dominates a commit, and per-file Node startup is the cost being
# managed. A staged `.md`/`.yml` therefore passes the hook and can still fail
# `prettier:check`. `.prettierignore` is applied by Prettier itself on both
# paths below, including for `--stdin-filepath`.
EXTENSION_RE='\.(js|jsx|ts|tsx|css|json)$'

repo_root=$(git rev-parse --show-toplevel) || exit 1
cd "$repo_root" || exit 1

# `git diff --cached` needs something to diff against on the very first commit.
if git rev-parse --verify -q HEAD >/dev/null; then
    against=HEAD
else
    against=$(git hash-object -t tree /dev/null)
fi

# Staged, non-deleted paths (renames report the new name), NUL-separated so
# that filenames containing spaces or newlines survive.
staged=()
while IFS= read -r -d '' file; do
    if [[ $file =~ $EXTENSION_RE ]]; then
        staged+=("$file")
    fi
done < <(git diff --cached --name-only -z --diff-filter=ACMR "$against")

[ ${#staged[@]} -eq 0 ] && exit 0

# A staged path that *also* differs between the index and the working tree is
# partially staged, and is the case lint-staged mishandles. Asked per path
# rather than by building a set, because an associative array needs bash 4 and
# a NUL-safe set membership test in bash 3.2 is worse than one `git diff` per
# staged file -- which costs milliseconds against the Prettier run below.
fully_staged=()
partially_staged=()
for file in "${staged[@]}"; do
    if git diff --quiet -- "$file"; then
        fully_staged+=("$file")
    else
        partially_staged+=("$file")
    fi
done

fail() {
    echo "pre-commit: $*" >&2
    echo "pre-commit: commit aborted (use --no-verify to bypass)." >&2
    exit 1
}

# --- Fast path: index and working tree agree, so format in place and re-add.
# Piped through `xargs -0` rather than expanded into one argv: a conflicted
# merge stages every file the merge touched, which is easily enough paths to
# blow the ARG_MAX limit. xargs splits into as many invocations as needed and
# reports 123 if any of them fails.
if [ ${#fully_staged[@]} -gt 0 ]; then
    printf '%s\0' "${fully_staged[@]}" |
        xargs -0 npx --no-install prettier --write --ignore-unknown \
            --log-level warn -- ||
        fail "Prettier failed on staged files."
    printf '%s\0' "${fully_staged[@]}" |
        xargs -0 git add -- ||
        fail "could not re-stage formatted files."
fi

# --- Careful path: rewrite the staged blob only, leaving the working tree be.
for file in "${partially_staged[@]}"; do
    # "<mode> <sha> <stage>\t<path>"; more than one line means an unmerged
    # path, which has no single staged blob to format.
    entries=$(git ls-files --stage -- "$file")
    [ -n "$entries" ] || continue
    [ "$(printf '%s\n' "$entries" | wc -l)" -eq 1 ] || continue

    read -r mode sha _ <<<"$entries"
    # Only regular files. Skip symlinks (120000) and submodules (160000).
    case "$mode" in
    100644 | 100755) ;;
    *) continue ;;
    esac

    staged_blob=$(mktemp) || fail "could not create a temporary file."
    formatted=$(mktemp) || fail "could not create a temporary file."

    git cat-file blob "$sha" >"$staged_blob" ||
        fail "could not read the staged contents of $file."

    if ! npx --no-install prettier --stdin-filepath "$file" \
        <"$staged_blob" >"$formatted"; then
        rm -f "$staged_blob" "$formatted"
        fail "Prettier failed on the staged contents of $file."
    fi

    # Prettier echoes input unchanged for `.prettierignore`d paths, so an
    # identical result covers both "already formatted" and "ignored".
    if ! cmp -s "$staged_blob" "$formatted"; then
        blob=$(git hash-object -w --stdin <"$formatted") ||
            fail "could not write the formatted contents of $file."
        git update-index --cacheinfo "$mode,$blob,$file" ||
            fail "could not update the index entry for $file."
        echo "pre-commit: formatted staged hunks of $file (working tree left as is)"
    fi

    rm -f "$staged_blob" "$formatted"
done

exit 0
