#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

apt-get update

apt-get install -y --no-install-recommends \
  wget \
  gnupg \
  ca-certificates

mkdir -p /etc/apt/keyrings

wget -qO- https://dl.google.com/linux/linux_signing_key.pub \
  | gpg --dearmor -o /etc/apt/keyrings/google-chrome.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/google-chrome.gpg] https://dl.google.com/linux/chrome/deb/ stable main" \
  > /etc/apt/sources.list.d/google-chrome.list

apt-get update

apt-get install -y --no-install-recommends google-chrome-stable

# Reduce image size by removing apt metadata
rm -rf /var/lib/apt/lists/*

google-chrome --version
