# Dev helper: screenshot a prototype page with headless Edge.
# Usage (from repo root):
#   .\scripts\dev\shot.ps1 -Page home.html -Out home-desktop.png
#   .\scripts\dev\shot.ps1 -Page "frame.html?p=home.html&w=390&h=844" -Out home-mobile.png -W 600 -H 860
# Headless Edge has a minimum window width (~500px): for phone sizes use frame.html (iframe at the given size).
# Screenshots go to _reference/shots/ (git-ignored).
param([string]$Page, [string]$Out, [int]$W = 1440, [int]$H = 900, [string]$Dir = "prototypes/E2")
$root = (Resolve-Path "$PSScriptRoot\..\..").Path
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$shots = Join-Path $root "_reference\shots"
New-Item -ItemType Directory -Force $shots | Out-Null
$url = "file:///" + ((Join-Path $root $Dir) -replace '\\', '/') + "/$Page"
$a = @("--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--user-data-dir=$env:TEMP\edge-shot-profile",
       "--virtual-time-budget=5000", "--window-size=$W,$H", "--screenshot=$shots\$Out", $url)
$p = Start-Process -FilePath $edge -ArgumentList $a -Wait -PassThru -WindowStyle Hidden
"$Out -> exit $($p.ExitCode), $((Get-Item "$shots\$Out").Length) bytes"
