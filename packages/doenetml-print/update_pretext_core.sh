#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_DIR="$SCRIPT_DIR/pretext_core"
TMP_ROOT="$SCRIPT_DIR/tmp"
TMP_DIR=""
SUBDIRECTORIES=("pretext" "xsl" "css")
EXTRA_FILES=("COPYING")
DOWNLOADED_BRANCH=""
CURRENT_COMMIT=""

cleanup() {
    if [ -n "${TMP_DIR:-}" ] && [ -d "$TMP_DIR" ]; then
        rm -rf "$TMP_DIR"
    fi
}
trap cleanup EXIT

mkdir -p "$TMP_ROOT"
TMP_DIR="$(mktemp -d "$TMP_ROOT/pretext.XXXXXX")"
ZIP_PATH="$TMP_DIR/pretext.zip"

download_zip() {
    local branch="$1"
    local url="$2"
    echo "Downloading $url to $ZIP_PATH"
    if curl -fL --retry 3 --retry-delay 1 "$url" -o "$ZIP_PATH"; then
        DOWNLOADED_BRANCH="$branch"
        return 0
    fi
    return 1
}

resolve_commit_hash() {
    local branch="$1"
    git ls-remote https://github.com/PreTeXtBook/pretext.git "refs/heads/$branch" | awk '{ print $1 }'
}

BRANCH="master"
echo "Downloading PreTeXt repository zip..."
if ! download_zip "$BRANCH" "https://github.com/PreTeXtBook/pretext/archive/refs/heads/$BRANCH.zip"; then
    echo "master branch not available, trying main..."
    BRANCH="main"
    download_zip "$BRANCH" "https://github.com/PreTeXtBook/pretext/archive/refs/heads/$BRANCH.zip"
fi

CURRENT_COMMIT="$(resolve_commit_hash "$DOWNLOADED_BRANCH")"
if [ -z "${CURRENT_COMMIT:-}" ]; then
    echo "Could not resolve commit hash for branch '$DOWNLOADED_BRANCH'."
    exit 1
fi

echo "Extracting PreTeXt subdirectories: ${SUBDIRECTORIES[*]}"
UNZIP_PATTERNS=()
for subdir in "${SUBDIRECTORIES[@]}"; do
    UNZIP_PATTERNS+=("pretext-${BRANCH}/${subdir}/*")
done
for file in "${EXTRA_FILES[@]}"; do
    UNZIP_PATTERNS+=("pretext-${BRANCH}/${file}")
done
unzip -q "$ZIP_PATH" "${UNZIP_PATTERNS[@]}" -d "$TMP_DIR/extracted"

mkdir -p "$DEST_DIR"

for subdir in "${SUBDIRECTORIES[@]}"; do
    extracted_dir="$(find "$TMP_DIR/extracted" -type d -path "*/${subdir}" | head -n 1)"
    if [ -z "${extracted_dir:-}" ]; then
        echo "Could not find ${subdir} directory in downloaded archive."
        exit 1
    fi

    rm -rf "$DEST_DIR/$subdir"
    cp -a "$extracted_dir" "$DEST_DIR/$subdir"
done

for file in "${EXTRA_FILES[@]}"; do
    extracted_file="$(find "$TMP_DIR/extracted" -type f -path "*/${file}" | head -n 1)"
    if [ -z "${extracted_file:-}" ]; then
        echo "Could not find ${file} in downloaded archive."
        exit 1
    fi

    cp -f "$extracted_file" "$DEST_DIR/$file"
done

printf '%s\n' "$CURRENT_COMMIT" > "$DEST_DIR/CURRENT_COMMIT"

# Make an empty js/ directory if it doesn't exist
# PreTeXt assumes this directory exists and tries to copy files from it.
mkdir -p "$DEST_DIR/js"
touch "$DEST_DIR/js/EMPTY"

echo "Done. Updated: $DEST_DIR/${SUBDIRECTORIES[*]} ${EXTRA_FILES[*]} CURRENT_COMMIT"