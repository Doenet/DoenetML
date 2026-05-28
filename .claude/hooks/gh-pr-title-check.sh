#!/usr/bin/env bash
# Block an issue/PR number in a pull-request title.
# See AGENTS.md: don't put the issue number in the PR title. Squash-merge
# appends " (#<PR-number>)" automatically, so "fix: ... (#1179)" becomes
# "fix: ... (#1179) (#1182)" after merge. Reference issues from the PR body.
#
# Reads the PreToolUse hook JSON on stdin and inspects the Bash command. Only
# the --title value is examined (never the body, which legitimately references
# issues, e.g. "Closes #1179"). Exits 2 (blocking the tool call) on a match.
set -uo pipefail

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""' 2>/dev/null)
[ -n "$cmd" ] || exit 0

# Only pr create / pr edit set a title.
case "$cmd" in
*"gh pr create"* | *"gh pr edit"*) ;;
*) exit 0 ;;
esac

# Extract the --title / -t / --title= value. A title is always inline on the
# command line (there is no --title-file), so it can be read from the command.
title=$(printf '%s' "$cmd" |
    grep -oE -- '(--title[ =]|-t[ =])("[^"]*"|'\''[^'\'']*'\''|[^[:space:]]+)' |
    head -n1 |
    sed -E 's/^(--title|-t)[ =]//')
title=${title%\"}
title=${title#\"}
title=${title%\'}
title=${title#\'}
[ -n "$title" ] || exit 0

if printf '%s' "$title" | grep -qE '#[0-9]+'; then
    cat >&2 <<EOF
Blocked: PR title contains an issue/PR number.

AGENTS.md: don't put the issue number in the PR title. Squash-merge appends
" (#<PR-number>)" automatically, so "... (#1179)" becomes "... (#1179) (#1182)"
after merge. Drop the "#<number>" from --title and reference the issue from the
PR body instead (e.g. "Closes #1179.").
EOF
    exit 2
fi
exit 0
