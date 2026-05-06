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
# optional flags (-x, --long, --long=val, -C path) and then `commit`.
# This avoids false positives like `git log --grep=commit`.
if ! printf '%s' "$cmd" | grep -qE '\bgit( +-[^ ]+( +[^ -][^ ]*)?)* +commit\b'; then
    exit 0
fi

repo_root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$repo_root" || exit 0

# Files Claude is about to commit (added/copied/modified/renamed).
staged=$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null)
[ -z "$staged" ] && exit 0

# Run prettier --check; capture both output and status.
# Pass files as explicit arguments rather than via xargs so that prettier's
# exit status (1 = unformatted, 2 = error) is preserved -- xargs would
# translate 1-125 to 123, which would make the case below treat
# "unformatted files" as "infrastructure error" and silently allow the commit.
mapfile -t staged_files <<<"$staged"
prettier_output=$(
    npx --no-install prettier --check --ignore-unknown "${staged_files[@]}" 2>&1
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

Fix:
  npx prettier --write \$(git diff --cached --name-only --diff-filter=ACMR | xargs)
  git add -u

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
