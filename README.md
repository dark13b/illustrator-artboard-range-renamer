# Illustrator Artboard Range Renamer

An ExtendScript for Adobe Illustrator that does find-and-replace on artboard names, limited to the artboards you pick by number (for example `1-3, 5, 7-9`).

## Install

The installer puts the script into every Illustrator version it finds, so it shows up under **File > Scripts > Artboard Range Renamer**. Restart Illustrator afterwards.

**Windows**: download [artboard-range-renamer.zip](https://github.com/dark13b/illustrator-artboard-range-renamer/releases/latest/download/artboard-range-renamer.zip), unzip it, and double-click `install.bat`. Allow the admin prompt, because Illustrator is in Program Files.

Or open PowerShell as Administrator and paste:

```powershell
irm https://github.com/dark13b/illustrator-artboard-range-renamer/releases/latest/download/install.ps1 | iex
```

**macOS**: download the same zip, unzip it, then right-click `install.command` and choose **Open**. macOS asks for your password if the Illustrator folder needs it.

Or paste this into Terminal:

```bash
curl -fsSL https://github.com/dark13b/illustrator-artboard-range-renamer/releases/latest/download/install.command | bash
```

**Manual**: copy `illustrator-rename-script.jsx` into `Adobe Illustrator <version>/Presets/<language>/Scripts`. To run it once without installing, use **File > Scripts > Other Script...** and pick the file.

## Usage

1. Open your document in Illustrator.
2. Go to **File > Scripts > Artboard Range Renamer**.
3. Answer the three prompts:
   - **Text to find**: matched exactly as you type it. Characters like `.`, `(`, `*` and `$` are plain text.
   - **Replace with**: leave it empty to delete the found text.
   - **Artboards**: numbers and ranges, separated by commas, counted from 1 (`1-3, 5, 7-9`). Leave it empty to rename all artboards.
4. An alert tells you how many artboards were renamed.

## Behaviour

- Every occurrence of the text in an artboard name is replaced.
- Reversed ranges (`9-7`) work, and duplicate numbers are counted once.
- If any part of the range input can't be read or falls outside the document (`x`, `0`, `12` in a 10-artboard file), the script renames nothing and lists the bad entries.
- A rename that would leave an artboard with an empty name is skipped and reported.
- Pressing Cancel at any prompt exits without changes.

## Testing

`node test.js` runs the script against a mocked Illustrator and checks the cases above. No dependencies.

## Releasing

Push a version tag (`git tag v1.1.0 && git push origin v1.1.0`). GitHub Actions runs the test, then publishes a release with the zip and installers attached.

## License

MIT
