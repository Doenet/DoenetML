#!/usr/bin/env bash
# Enforce the Claude Code footer on agent-authored GitHub text.
# See AGENTS.md → "Agent-Authored GitHub Activity": gh issue/pr create &
# comment bodies, and gh api posts to /comments, /replies, or /reviews, must
# end with the footer so reviewers can see the text was generated.
#
# Reads the PreToolUse hook JSON on stdin, inspects the Bash command, and
# exits 2 (blocking the tool call) when a matching gh command lacks the footer.
set -uo pipefail

FOOTER_URL="https://claude.com/claude-code"

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""' 2>/dev/null)
[ -n "$cmd" ] || exit 0

# Is this one of the gh commands that posts agent-authored text?
is_posting=0
case "$cmd" in
    *"gh issue create"* | *"gh issue comment"* | *"gh pr create"* | *"gh pr comment"*)
        is_posting=1
        ;;
esac
# gh api write (not a read) to a comment/reply/review endpoint. A write
# supplies a body via a field flag (-f/-F/--field/--raw-field/--input) or an
# explicit POST/PUT/PATCH method; a plain GET (e.g. listing comments) must NOT
# be gated. /reviews is included because a review POST carries inline comments
# plus a body, and review-body updates use PUT.
if printf '%s' "$cmd" | grep -q 'gh api' &&
    printf '%s' "$cmd" | grep -qE '/(comments|replies|reviews)([/?[:space:]"'\'']|$)' &&
    printf '%s' "$cmd" | grep -qE '([[:space:]](-f|-F|--field|--raw-field|--input)[ =]|(-X[ ]*|--method[ =])(POST|PUT|PATCH))'; then
    is_posting=1
fi

[ "$is_posting" -eq 1 ] || exit 0

# 1) Footer present inline (covers --body, -f body=, and heredocs).
case "$cmd" in
*"$FOOTER_URL"*) exit 0 ;;
esac

# 2) Body supplied from a file. For gh issue/pr that's --body-file/-F; for
#    gh api (which sends a JSON payload) it's --input. Inspect the referenced
#    file(s) for the footer. A "-" path (stdin) is not a file, so it is skipped.
if printf '%s' "$cmd" | grep -q 'gh api'; then
    paths=$(printf '%s' "$cmd" |
        grep -oE -- '--input[ =][^[:space:]]+' |
        sed -E 's/^--input[ =]//')
else
    paths=$(printf '%s' "$cmd" |
        grep -oE -- '(--body-file[ =]|-F[ =])[^[:space:]]+' |
        sed -E 's/^(--body-file|-F)[ =]//')
fi
for p in $paths; do
    p=${p%\"}
    p=${p#\"}
    p=${p%\'}
    p=${p#\'}
    if [ -f "$p" ] && grep -qF "$FOOTER_URL" "$p" 2>/dev/null; then
        exit 0
    fi
done

cat >&2 <<EOF
Blocked: Claude Code footer missing from this gh command.

AGENTS.md ("Agent-Authored GitHub Activity") requires that gh issue/pr
create & comment bodies, and gh api posts to /comments, /replies, or
/reviews, end with:

🤖 Generated with [Claude Code]($FOOTER_URL)

Add that line to the --body / -f body= / --body-file content and re-run.
EOF
exit 2
