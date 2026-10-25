# Installs Artboard Range Renamer into every Adobe Illustrator found on this PC.
# Double-click install.bat, or paste this into PowerShell opened as Administrator:
#   irm https://github.com/dark13b/illustrator-artboard-range-renamer/releases/latest/download/install.ps1 | iex
# Illustrator installed somewhere else? Set ADOBE_DIR to the folder that holds "Adobe Illustrator 20xx" first.
$ErrorActionPreference = 'Stop'
$release = 'https://github.com/dark13b/illustrator-artboard-range-renamer/releases/latest/download'
$adobe = if ($env:ADOBE_DIR) { $env:ADOBE_DIR } else { Join-Path $env:ProgramFiles 'Adobe' }

function Finish($msg) {
    Write-Host $msg
    if ($PSCommandPath) { Read-Host 'Press Enter to close' | Out-Null } # keep the double-clicked window open
}

# Use the .jsx next to this file (zip download), otherwise fetch it (one-line install).
$src = if ($PSScriptRoot) { Join-Path $PSScriptRoot 'illustrator-rename-script.jsx' }
if (-not $src -or -not (Test-Path $src)) {
    $src = Join-Path $env:TEMP 'illustrator-rename-script.jsx'
    Invoke-WebRequest "$release/illustrator-rename-script.jsx" -OutFile $src -UseBasicParsing
}

# Each Illustrator has Presets\<locale> (en_US, ar_AE, ...); its menu scripts live in <locale>\Scripts.
$locales = @(Get-ChildItem "$adobe\Adobe Illustrator*\Presets\*" -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -cmatch '^[a-z]{2}_[A-Z]{2}$' })
if ($locales.Count -eq 0) {
    Finish "Adobe Illustrator was not found in $adobe. Set ADOBE_DIR to your Adobe folder and run again."
    return
}

try {
    foreach ($locale in $locales) {
        $dir = New-Item -ItemType Directory -Force (Join-Path $locale.FullName 'Scripts')
        Copy-Item $src (Join-Path $dir.FullName 'Artboard Range Renamer.jsx') -Force
        Write-Host "Installed: $($dir.FullName)"
    }
} catch [System.UnauthorizedAccessException] {
    # Program Files needs admin rights: re-run this file elevated.
    if ($PSCommandPath) {
        Start-Process powershell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
        return
    }
    throw 'Access denied. Open PowerShell as Administrator and run the command again.'
}

Finish 'Done. Restart Illustrator, then run File > Scripts > Artboard Range Renamer.'
