#!/usr/bin/env bash
#
# Claude Code PreToolUse(Bash) hook: when Claude tries to run `git commit`,
# run `prettier --check` on staged files and refuse the commit if any are
# unformatted. This is a defense in depth alongside CI's `prettier:check`;
# the canonical fix would be a project-level husky/lint-staged pre-commit,
# but this hook protects the Claude Code workflow specifically — including
# the failure mode where Claude writes files via Bash (sed/python/heredoc)
# and bypasses the existing PostToolUse formatter (which only matches
# Write|Edit|MultiEdit|NotebookEdit).
#
# Bypass with: CLAUDE_SKIP_PRETTIER=1 (set in the shell Claude inherits).

set -u

if [ "${CLAUDE_SKIP_PRETTIER:-0}" = "1" ]; then
    exit 0
fi

# Hook input is JSON on stdin; tool_input.command is the bash command.
input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null || true)

# Only act when the command runs `git commit`. Match `git` followed by
# optional flags (-x, --long, --long=val, -C path) and then `commit` as
# a complete token (so `git commit-tree` and `git log --grep=commit`
# don't trigger). Anchor `git` to the start of the command or to a shell
# separator (`;`, `&&`/`&`, `||`/`|`, `(`, `{`, `` ` ``, `!`), with or
# without surrounding whitespace, so that `cmd;git commit` and
# `cmd && git commit` both intercept correctly.
#
# Known limitation: a regex cannot parse shell quoting, so a string like
# `echo '; git commit'` will false-positive. False positives only block
# one Bash call (Claude can retry with CLAUDE_SKIP_PRETTIER=1), so we
# accept this rather than reaching for a real shell tokenizer.
if ! printf '%s' "$cmd" | grep -qE '(^|[;&|`({!])[[:space:]]*git( +-[^ ]+( +[^ -][^ ]*)?)* +commit([^a-zA-Z0-9_-]|$)'; then
    exit 0
fi

repo_root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$repo_root" || exit 0

# Files Claude is about to commit (added/copied/modified/renamed).
# Use NUL separation for correctness with filenames containing newlines.
# Use while loop instead of mapfile for Bash 3.2+ compatibility.
staged_files=()
while IFS= read -r -d '' file; do
    staged_files+=("$file")
done < <(git diff --cached --name-only -z --diff-filter=ACMR 2>/dev/null)
[ ${#staged_files[@]} -eq 0 ] && exit 0

# Run prettier --check; capture both output and status.
# Pass files as explicit arguments rather than via xargs so that prettier's
# exit status (1 = unformatted, 2 = error) is preserved -- xargs would
# translate 1-125 to 123, which would make the case below treat
# "unformatted files" as "infrastructure error" and silently allow the commit.
prettier_output=$(
    npx --no-install prettier --check --ignore-unknown -- "${staged_files[@]}" 2>&1
)
prettier_status=$?

case $prettier_status in
    0)
        # All staged files formatted (or all ignored by prettier).
        exit 0
        ;;
    1)
        # Some staged files would be reformatted -> block.
        cat >&2 <<MSG
Prettier found unformatted staged files; commit blocked.

Fix (mirrors this hook's check; -z + xargs -0 handles spaces in filenames):
  git diff --cached --name-only -z --diff-filter=ACMR | \\
    xargs -0 npx --no-install prettier --write --ignore-unknown --
  git diff --cached --name-only -z --diff-filter=ACMR | \\
    xargs -0 git add --

Prettier output:
$prettier_output

(Set CLAUDE_SKIP_PRETTIER=1 to bypass this check.)
MSG
        exit 2
        ;;
    *)
        # Any other status (e.g., prettier not installed, internal error).
        # Don't block the commit on hook infrastructure failures.
        exit 0
        ;;
esac
