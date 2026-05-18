#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    python3-poetry \
    python3-pytest


# These packages shouldn't be needed because playwright should install a self-contained chromium browser.
# chromium-browser
# chromium-driver

pip install deno --break-system-packages
pip install playwright --break-system-packages

#### Install playwright browsers globally
# 1) choose a shared location
mkdir -p /opt/playwright-browsers
chmod 755 /opt/playwright-browsers

# 2) install browser payloads there
PLAYWRIGHT_BROWSERS_PATH=/opt/playwright-browsers playwright install chromium
chown -R root:root /opt/playwright-browsers
chmod -R a+rX /opt/playwright-browsers
# Allow non-root installs (e.g. npm postinstall) to create/update lock/cache files,
# including nested directories like /opt/playwright-browsers/.links.
chmod -R a+rwX /opt/playwright-browsers

# 3) make the path global for all users
cat >/etc/profile.d/playwright.sh <<'EOF'
export PLAYWRIGHT_BROWSERS_PATH=/opt/playwright-browsers
EOF
chmod 644 /etc/profile.d/playwright.sh

rm -rf /var/lib/apt/lists/*
