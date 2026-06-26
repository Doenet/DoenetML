#!/usr/bin/env bash

set -eu

if [ "$#" -eq 0 ]; then
    echo "usage: $0 <npm install command>"
    exit 2
fi

# Operate on the repository root (the parent of this script's directory) so the
# node_modules we wipe and reinstall — and the require('rollup') check below —
# always target the intended workspace-root install, regardless of the caller's
# working directory.
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$script_dir/.."

for attempt in 1 2 3; do
    rm -rf node_modules
    # npm can exit 0 while silently skipping platform-specific optional
    # dependencies (npm/cli#4828). Loading rollup exercises its native binding
    # resolver, so this fails immediately when npm omitted the needed package.
    if "$@" && node -e "require('rollup')"; then
        exit 0
    fi
    if [ "$attempt" -eq 3 ]; then
        echo "$* failed or rollup native dependency missing after $attempt attempts"
        exit 1
    fi
    echo "$* failed or rollup native dependency missing on attempt $attempt, retrying..."
    sleep 15
done
