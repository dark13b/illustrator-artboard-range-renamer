#!/bin/bash
# Installs Artboard Range Renamer into every Adobe Illustrator in /Applications.
# Double-click this file (first time: right-click > Open), or run in Terminal:
#   curl -fsSL https://github.com/dark13b/illustrator-artboard-range-renamer/releases/latest/download/install.command | bash
set -e
release="https://github.com/dark13b/illustrator-artboard-range-renamer/releases/latest/download"
apps="${ADOBE_DIR:-/Applications}"

# Use the .jsx next to this file (zip download), otherwise fetch it (one-line install).
src="$(cd "$(dirname "$0")" && pwd)/illustrator-rename-script.jsx"
if [ ! -f "$src" ]; then
    src="$(mktemp)"
    curl -fsSL "$release/illustrator-rename-script.jsx" -o "$src"
fi

# Each Illustrator (2026, 2025, Beta, ...) has Presets.localized/<locale> (en_US, en_AE, ...);
# menu scripts live in <locale>/Scripts. Folders left by an uninstalled version have no .app and are skipped.
found=0
for locale in "$apps"/Adobe\ Illustrator*/Presets*/[a-z][a-z]_[A-Z][A-Z]; do
    [ -d "$locale" ] || continue
    ls -d "${locale%/Presets*}"/*.app >/dev/null 2>&1 || continue
    dest="$locale/Scripts/Artboard Range Renamer.jsx"
    # Try as the current user first; ask for the password only if the folder needs it.
    { mkdir -p "$locale/Scripts" && cp "$src" "$dest"; } 2>/dev/null ||
        { sudo mkdir -p "$locale/Scripts" && sudo cp "$src" "$dest"; }
    echo "Installed: $locale/Scripts"
    found=1
done

if [ "$found" = 0 ]; then
    echo "Adobe Illustrator was not found in $apps."
    exit 1
fi
echo "Done. Restart Illustrator, then run File > Scripts > Artboard Range Renamer."
