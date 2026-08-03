#!/usr/bin/env bash
# `@doenet/math` does not ship a prebuilt WASM artifact: it compiles the Rust
# core out of the `vendor/math-expressions` submodule as part of `npm run build`
# (see packages/math/scripts/build-wasm.mjs). That makes the wasm32 target and
# `wasm-bindgen` build prerequisites for the *whole repo*, not just for someone
# working on the math package — `npm run build` at the root reaches it.
#
# Installed here rather than in postCreateCommand.sh so it is baked into the
# image layer and cached, instead of recompiling `wasm-bindgen-cli` from source
# on every container create.
set -euo pipefail

VERSION="${WASMBINDGENVERSION:-0.2.126}"

# Features run as root, and the Rust feature installs into a shared prefix
# rather than a user home. Set these explicitly rather than relying on the
# inherited environment, so the binaries land where every user's PATH looks.
export RUSTUP_HOME="${RUSTUP_HOME:-/usr/local/rustup}"
export CARGO_HOME="${CARGO_HOME:-/usr/local/cargo}"
export PATH="${CARGO_HOME}/bin:${PATH}"

if ! command -v cargo >/dev/null 2>&1; then
    echo "wasm-toolchain: cargo not found — this feature must run after the Rust feature." >&2
    exit 1
fi

rustup target add wasm32-unknown-unknown

# `--locked` for a reproducible build; the version must match the crate exactly.
cargo install wasm-bindgen-cli --version "${VERSION}" --locked

# Root installed them; every user needs to run them.
chmod -R a+rX "${CARGO_HOME}/bin"

wasm-bindgen --version
