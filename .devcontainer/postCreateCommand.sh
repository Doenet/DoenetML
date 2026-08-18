#!/usr/bin/env bash

set -eu

# Use VIM as the command line git editor. Not everyone's preference, but oh well...
git config core.editor vim

# `@doenet/math` compiles its WASM core from `vendor/math-expressions` at build
# time, and the workspace is bind-mounted from the host clone — so a clone made
# without `--recurse-submodules`, or a Codespace (which does not initialize
# submodules), arrives here with an empty submodule directory and `npm run
# build` below aborts container creation. Idempotent when it is already there.
git submodule update --init --recursive

# Initial build required for development
bash .devcontainer/npm-install-with-rollup-check.sh npm install
npm run build
