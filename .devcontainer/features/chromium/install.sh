#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y --no-install-recommends \
    chromium-browser

# On Ubuntu, the `chromium-browser` package in the APT repositories is
# typically just a transitional package that redirects installation to
# the Snap version of Chromium. It does not install a standalone Chromium
# binary from APT, which can be problematic in containers and other
# environments where Snap is unavailable or unsupported.

# Cypress CI scripts currently use:
#   cypress run -b chrome
#
# Provide Chrome-compatible executable names backed by Chromium so
# existing scripts continue to work.

ln -sf /usr/bin/chromium-browser /usr/local/bin/google-chrome
ln -sf /usr/bin/chromium-browser /usr/local/bin/google-chrome-stable

google-chrome --version

rm -rf /var/lib/apt/lists/*
