#!/usr/bin/env python3
"""Block irreversible / outward-facing shell commands that the prefix-based
permission rules in .claude/settings.json cannot reliably catch.

The `deny`/`ask` permission rules match a command's *text prefix*, so they are
defeated by leading global flags (`git -C <path> push upstream`), reordered
flags (`git push origin main --force`), command chaining (`foo && gh pr merge`),
and the API equivalents of blocked CLI commands (`gh api --method PUT .../merge`).
This hook parses the whole command instead, so it enforces the same intent
regardless of surface form.

Contract (identical to the other PreToolUse hooks in this dir): read the hook
JSON on stdin, inspect `.tool_input.command`; on a match, print an explanation
to stderr and exit 2 (which blocks the tool call). Otherwise exit 0. Parsing
failures fail open (exit 0) so a malformed payload never bricks every command.

Scope note: this is a guardrail against an agent running these by accident or
by misreading an instruction — not a sandbox. It is deliberately conservative
about false positives on the everyday workflow (fork pushes to `origin`,
`gh pr create/view/diff`, `npm run <script>`, GET/POST `gh api` review calls).
"""

import json
import os
import re
import shlex
import sys

# Gap between tokens that must NOT cross a shell command separator (; & |),
# so a rule only fires within a single command segment.
GAP = r"[^;&|]*"
# Gap that may cross a pipe (for "fetch remote | run shell" detection).
PIPE_GAP = r"[^;&]*"

# Absolute-path first components whose recursive removal is catastrophic.
SYSTEM_DIRS = {
    "etc", "usr", "var", "bin", "sbin", "lib", "lib64", "boot", "dev",
    "proc", "sys", "root", "home", "opt", "srv", "run",
    "System", "Applications", "Library", "Users",
}

# (compiled regex, human-readable reason). First match blocks the command.
RULES = [
    (
        rf"\bgit\b{GAP}\bpush\b{GAP}\bupstream\b",
        "Pushing to the `upstream` remote (the canonical Doenet/DoenetML repo). "
        "Agents push branches to the fork `origin` and open a PR; they never "
        "push to `upstream`.",
    ),
    (
        rf"\bgit\b{GAP}\bpush\b{GAP}(?::|\s\+?)(?:main|master)(?:[\s:;&|)]|$)",
        "Pushing directly to the `main`/`master` branch. Changes reach main "
        "through a reviewed PR, never a direct push.",
    ),
    (
        rf"\bgit\b{GAP}\b(?:filter-branch|filter-repo)\b",
        "Rewriting history with filter-branch/filter-repo is destructive and "
        "is never part of this workflow.",
    ),
    (
        rf"\bgh\b{GAP}\bpr\b{GAP}\bmerge\b",
        "Merging a pull request. Merging is a human decision; agents do not "
        "merge PRs in this repo.",
    ),
    (
        rf"\bgh\b{GAP}\brepo\b{GAP}\b(?:delete|edit|rename|archive)\b",
        "Deleting/editing/renaming/archiving a repository is an irreversible "
        "administrative action agents must not take.",
    ),
    (
        rf"\bgh\b{GAP}\brelease\b{GAP}\b(?:create|delete)\b",
        "Creating or deleting a GitHub release is an outward-facing action "
        "agents must not take.",
    ),
    (
        rf"\bgh\b{GAP}\bsecret\b",
        "Managing repository/CI secrets is out of bounds for agents.",
    ),
    (
        rf"\bgh\b{GAP}\bapi\b{GAP}(?:-X|--method[= ])\s*(?:PUT|PATCH|DELETE)\b",
        "A mutating `gh api` call (PUT/PATCH/DELETE) is the API equivalent of "
        "merging a PR or deleting/editing a repo/secret/release. Use a read-only "
        "(GET) or comment-posting (POST) call instead.",
    ),
    (
        rf"\b(?:npm|pnpm|yarn)\b{GAP}\bpublish\b",
        "Publishing packages to the npm registry is effectively irreversible "
        "and is done by the release process, not by agents.",
    ),
    (
        rf"\bchangeset\b{GAP}\bpublish\b",
        "`changeset publish` releases packages to npm; agents must not publish.",
    ),
    (
        r"\bsudo\b",
        "Running commands as root (sudo) is never required for tasks in this "
        "repo and is blocked.",
    ),
    (
        rf"\b(?:curl|wget)\b{PIPE_GAP}\|{PIPE_GAP}"
        r"\b(?:sh|bash|zsh|dash|ksh|python[0-9.]*|node|ruby|perl)\b",
        "Piping downloaded content straight into an interpreter (curl|sh) runs "
        "unreviewed remote code. Download, inspect, then run deliberately.",
    ),
    (
        rf"\b(?:sh|bash|zsh|dash|ksh)\b{GAP}[<$]\([^)]*\b(?:curl|wget)\b",
        "Executing downloaded content via process/command substitution "
        "(bash <(curl ...)) runs unreviewed remote code.",
    ),
    (
        r"--no-preserve-root\b",
        "`--no-preserve-root` exists only to enable `rm -rf /`.",
    ),
    (
        r"\bdd\b[^;&|]*\b(?:if|of)=",
        "Raw disk I/O with `dd` can destroy a device or file irrecoverably.",
    ),
    (
        r"\bmkfs(?:\.[a-z0-9]+)?\b",
        "Formatting a filesystem with mkfs is catastrophic and never needed here.",
    ),
]

COMPILED = [(re.compile(pat, re.IGNORECASE), reason) for pat, reason in RULES]

# The command a shell actually executes is unquoted; text passed as data
# (commit messages, echo/printf, PR `--body`, heredocs) is quoted. Scrub quoted
# spans and heredoc bodies before pattern-matching so a message that merely
# *mentions* `git push upstream` isn't mistaken for running it. This trades away
# catching a payload hidden inside quotes (e.g. `sh -c "curl x | sh"`) — out of
# scope for an anti-accident guard, and defeatable countless other ways anyway.
# The rm check runs on the raw command instead, because shlex tokenization keeps
# a quoted target like `rm -rf "/"` intact so it is still caught.
#
# Residual false positive: deeply nested quoting the scrub can't balance, e.g.
# `-m "$(printf "... npm publish ...")"`, can still trip a rule. Write such
# messages/bodies with a heredoc (handled) or `git commit -F <file>` /
# `--body-file <file>` instead.
_HEREDOC = re.compile(r"<<-?\s*(['\"]?)([A-Za-z_]\w*)\1.*?^\s*\2\b",
                      re.DOTALL | re.MULTILINE)
_SQUOTE = re.compile(r"'[^']*'")
_DQUOTE = re.compile(r'"(?:[^"\\]|\\.)*"')


def _scrub(command: str) -> str:
    s = _HEREDOC.sub(" ", command)
    s = _SQUOTE.sub(" ", s)
    s = _DQUOTE.sub(" ", s)
    return s


def _strip_quotes(tok: str) -> str:
    if len(tok) >= 2 and tok[0] == tok[-1] and tok[0] in "\"'":
        return tok[1:-1]
    return tok


def _is_catastrophic_rm_target(tok: str, cwd: str = None) -> bool:
    t = _strip_quotes(tok).strip()
    if not t or t.startswith("-"):
        return False
    if t in {"/", "~", "~/", ".", "..", "*", "/*", "./*"}:
        return True
    if t.startswith("~") or "$HOME" in t or "${HOME}" in t:
        return True
    if t == ".git" or t.endswith("/.git"):
        return True
    # A target composed *purely* of upward traversals (`..`, `../..`, `../../..`)
    # always resolves to an ANCESTOR of the current directory, so removing it
    # wipes the cwd and everything around it. Block those. A path that escapes
    # upward into a *named* sibling subdirectory (`../sibling/dist`,
    # `../../node_modules`) is a routine monorepo cleanup and is NOT blocked on
    # the basis of escaping upward alone — only if it resolves onto a protected
    # location (checked below).
    norm = os.path.normpath(t)
    if norm and set(norm.split(os.sep)) == {".."}:
        return True
    # Absolute paths into the filesystem root or a top-level system directory.
    if t.startswith("/"):
        first = t.strip("/").split("/", 1)[0]
        if first == "" or first in SYSTEM_DIRS:
            return True
    # Resolve the target (absolute, or relative to the agent's cwd) and block
    # only if it lands on a protected location: the filesystem root, a top-level
    # system dir, $HOME, or the repo root / an ancestor of it. This catches a
    # mixed relative path like `../../<repo-root-name>` while still allowing a
    # sibling subdirectory that resolves nowhere protected.
    try:
        base = cwd if (cwd and not os.path.isabs(t)) else None
        resolved = os.path.realpath(os.path.join(base, t) if base else t)
    except (OSError, ValueError):
        return False
    if resolved == os.sep:
        return True
    parts = resolved.split(os.sep)
    if len(parts) == 2 and parts[1] in SYSTEM_DIRS:
        return True
    try:
        if resolved == os.path.realpath(os.path.expanduser("~")):
            return True
    except (OSError, ValueError):
        pass
    proj = os.environ.get("CLAUDE_PROJECT_DIR")
    if proj:
        try:
            proj_r = os.path.realpath(proj)
            if resolved == proj_r or proj_r.startswith(resolved.rstrip("/") + os.sep):
                return True
        except (OSError, ValueError):
            pass
    return False


def _rm_reason(command: str, cwd: str = None):
    """Return a reason string if the command contains a catastrophic
    `rm -r -f <dangerous target>`, else None. Handled procedurally because
    flag/target parsing is clearer than a single regex."""
    for segment in re.split(r"[;&|\n]+", command):
        if not re.search(r"\brm\b", segment):
            continue
        try:
            tokens = shlex.split(segment)
        except ValueError:
            tokens = segment.split()
        if "rm" not in tokens:
            continue
        args = tokens[tokens.index("rm") + 1 :]
        recursive = force = False
        targets = []
        for a in args:
            if a.startswith("--"):
                if a == "--recursive":
                    recursive = True
                elif a == "--force":
                    force = True
            elif a.startswith("-") and len(a) > 1:
                if "r" in a[1:] or "R" in a[1:]:
                    recursive = True
                if "f" in a[1:]:
                    force = True
            else:
                targets.append(a)
        if recursive and force:
            for t in targets:
                if _is_catastrophic_rm_target(t, cwd):
                    return (
                        f"Recursively force-removing `{t}` would irreversibly "
                        "delete critical files (a system path, your home, the "
                        "repository root, or .git). Remove a specific "
                        "subdirectory instead."
                    )
    return None


def _gh_api_reason(command: str):
    """Return a reason if the command creates/modifies a GitHub *release* via
    `gh api`, else None. The RULES regex catches explicit PUT/PATCH/DELETE, but
    release creation is a POST — issued either explicitly (`-X POST`) or by
    default whenever a field flag (`-f`/`-F`/`--field`/`--raw-field`/`--input`)
    is present. GET listing of releases (no method, no fields) stays allowed, as
    do POST comment/review calls (they don't hit a releases endpoint). Handled
    procedurally because it depends on the effective HTTP method, not surface
    text; shlex keeps quoted commit-message mentions as a single token, so a
    message that merely *mentions* such a call is not misread as running it."""
    for segment in re.split(r"[;&|\n]+", command):
        if "gh" not in segment or "api" not in segment:
            continue
        try:
            toks = shlex.split(segment)
        except ValueError:
            toks = segment.split()
        if "gh" not in toks or "api" not in toks:
            continue
        method = None
        has_field = False
        endpoint_has_releases = False
        i = 0
        while i < len(toks):
            t = toks[i]
            if t in ("-X", "--method"):
                if i + 1 < len(toks):
                    method = toks[i + 1].upper()
                i += 2
                continue
            if t.startswith("-X") and len(t) > 2:
                method = t[2:].upper()
            elif t.startswith("--method="):
                method = t.split("=", 1)[1].upper()
            elif t in ("-f", "-F", "--field", "--raw-field", "--input"):
                # A bare field flag takes its `key=value` (or filename) as the
                # NEXT token; skip that token so a value mentioning a releases
                # URL (`-f body=.../releases/...`) is never read as the endpoint.
                has_field = True
                i += 2
                continue
            elif t.startswith(("--field=", "--raw-field=", "--input=")):
                has_field = True
            elif not t.startswith("-") and "releases" in t and "/" in t:
                endpoint_has_releases = True
            i += 1
        if not endpoint_has_releases:
            continue
        if method is None:
            method = "POST" if has_field else "GET"
        if method in ("POST", "PUT", "PATCH", "DELETE"):
            return (
                "Creating or modifying a GitHub release via `gh api` "
                f"({method} to a releases endpoint) is the API equivalent of "
                "`gh release create`/`gh release delete` — an outward-facing "
                "action agents must not take. Use a read-only (GET) call."
            )
    return None


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0
    command = (payload.get("tool_input") or {}).get("command") or ""
    if not command:
        return 0
    cwd = payload.get("cwd") or None

    scrubbed = _scrub(command)
    for pattern, reason in COMPILED:
        if pattern.search(scrubbed):
            _block(reason)
            return 2

    rm_reason = _rm_reason(command, cwd)
    if rm_reason:
        _block(rm_reason)
        return 2

    gh_api_reason = _gh_api_reason(command)
    if gh_api_reason:
        _block(gh_api_reason)
        return 2

    return 0


def _block(reason: str) -> None:
    sys.stderr.write(
        "Blocked by .claude/hooks/block-dangerous-commands.py "
        "(repository safety policy).\n\n"
        f"{reason}\n\n"
        "This is a deliberate guardrail, not a transient error. Do not retry "
        "the same command or a reworded variant. If a human genuinely needs "
        "this, they must run it themselves outside the agent.\n"
    )


if __name__ == "__main__":
    # Fail open on ANY unexpected error: a guardrail that crashed must never
    # brick every Bash call. `sys.exit(int)` raises SystemExit (a BaseException,
    # not Exception), so a clean 0/2 return still propagates as the exit code.
    try:
        sys.exit(main())
    except Exception:
        sys.exit(0)
