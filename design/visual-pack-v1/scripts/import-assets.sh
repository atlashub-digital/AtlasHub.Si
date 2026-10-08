#!/usr/bin/env bash
# Import the separately delivered AtlasHub Visual ZIP to this design branch.
# Does NOT commit, push, alter code, or deploy. Review diff first.
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: bash design/visual-pack-v1/scripts/import-assets.sh /path/to/AtlasHub_Visual_Implementation_Pack_V1_20261008.zip" >&2
  exit 2
fi
ZIP="$(realpath "$1")"
[[ -f "$ZIP" ]] || { echo "Missing ZIP: $ZIP" >&2; exit 2; }
command -v unzip >/dev/null || { echo "Missing required: unzip" >&2; exit 2; }
command -v sha256sum >/dev/null || { echo "Missing required: sha256sum" >&2; exit 2; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACK_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$PACK_DIR/../.." && pwd)"
BRANCH="$(git -C "$REPO_ROOT" branch --show-current)"
if [[ "$BRANCH" != "design/visual-pack-v1-20261008" ]]; then
  echo "Wrong branch: $BRANCH. Checkout design/visual-pack-v1-20261008 before importing." >&2
  exit 3
fi

TEMP="$(mktemp -d)"
trap 'rm -rf "$TEMP"' EXIT
# Reject Zip Slip and unexpected archive paths; import assets only.
if unzip -Z1 "$ZIP" | grep -E '(^/|(^|/)\.\.(/|$))' >/dev/null; then
  echo "Unsafe archive path detected" >&2
  exit 4
fi
unzip -q "$ZIP" -d "$TEMP"
[[ -f "$TEMP/SHA256SUMS.txt" && -f "$TEMP/ASSET_MANIFEST.json" ]] || { echo "Missing integrity manifest" >&2; exit 4; }
( cd "$TEMP" && sha256sum -c SHA256SUMS.txt )
expected_png=8
found_png="$(find "$TEMP/assets/screens" -maxdepth 1 -type f -name '*.png' | wc -l)"
[[ "$found_png" -eq "$expected_png" ]] || { echo "Expected 8 PNG screenshots, got $found_png" >&2; exit 4; }
[[ -f "$TEMP/assets/brand/Logo_Oficial_AtlasHub.png" ]] || { echo "Missing official logo" >&2; exit 4; }

mkdir -p "$PACK_DIR/assets"
cp -a "$TEMP/assets/." "$PACK_DIR/assets/"
cp "$TEMP/SHA256SUMS.txt" "$PACK_DIR/assets/SHA256SUMS.txt"
echo
echo "Imported 8 PNGs, 8 optimized WebPs, 2 concept PNGs and official logo."
echo "Next: review the assets, validate the original logo and commit them:"
echo "  git status --short"
echo "  git add design/visual-pack-v1/assets"
echo "  git commit -m 'design(assets): import approved visual pack images'"
echo "  git push origin design/visual-pack-v1-20261008"
echo "No changes have been committed or pushed by this script."
