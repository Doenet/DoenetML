## Included for review purposes only. This file is not used in the devcontainer build process.
## But it was a path explored for resolving the chrome-cypress issue.
#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y --no-install-recommends \
    wget \
    unzip \
    ca-certificates

mkdir -p /opt/chrome-for-testing

ARCH=$(dpkg --print-architecture)

case "$ARCH" in
    amd64)
        PLATFORM="linux64"
        ;;
    arm64)
        PLATFORM="linux-arm64" 
        ;;
    *)
        echo "Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

URL="https://storage.googleapis.com/chrome-for-testing-public/LATEST_RELEASE_${PLATFORM}"

VERSION=$(wget -qO- "$URL")

wget -q \
    "https://storage.googleapis.com/chrome-for-testing-public/${VERSION}/${PLATFORM}/chrome-${PLATFORM}.zip" \
    -O /tmp/chrome.zip

unzip -q /tmp/chrome.zip -d /opt/chrome-for-testing

CHROME_BIN=$(find /opt/chrome-for-testing -type f -name chrome | head -n1)

ln -sf "${CHROME_BIN}" /usr/local/bin/google-chrome
ln -sf "${CHROME_BIN}" /usr/local/bin/google-chrome-stable

"${CHROME_BIN}" --version

rm -f /tmp/chrome.zip
rm -rf /var/lib/apt/lists/*
