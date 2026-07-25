param(
    [string]$InstallDir = (Join-Path $HOME "JokeHub"),
    [switch]$NoDesktopShortcut,
    [switch]$NoStartMenuShortcut
)

$ErrorActionPreference = "Stop"

$createDesktopShortcut = -not $NoDesktopShortcut
$createStartMenuShortcut = -not $NoStartMenuShortcut

if (-not $PSScriptRoot) {
    $PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
}

$siteFiles = @("index.html", "styles.css", "script.js")

if (-not (Test-Path -LiteralPath $InstallDir)) {
    New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
}

foreach ($fileName in $siteFiles) {
    $sourcePath = Join-Path $PSScriptRoot $fileName
    if (-not (Test-Path -LiteralPath $sourcePath)) {
        throw "Required file not found: $sourcePath"
    }

    Copy-Item -LiteralPath $sourcePath -Destination $InstallDir -Force
}

$launchScriptPath = Join-Path $InstallDir "launch-jokehub.cmd"
$launchScriptContent = @"
@echo off
setlocal
set "SITE_INDEX=%~dp0index.html"
if exist "%SITE_INDEX%" (
    start "" "%SITE_INDEX%"
) else (
    echo Could not find index.html in the installation folder.
    exit /b 1
)
"@
Set-Content -LiteralPath $launchScriptPath -Value $launchScriptContent -Encoding ASCII

$desktopShortcutPath = $null
if ($createDesktopShortcut) {
    $desktopFolder = [Environment]::GetFolderPath("Desktop")
    if (-not (Test-Path -LiteralPath $desktopFolder)) {
        New-Item -ItemType Directory -Path $desktopFolder -Force | Out-Null
    }

    $desktopShortcutPath = Join-Path $desktopFolder "Joke Hub.lnk"
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($desktopShortcutPath)
    $shortcut.TargetPath = $launchScriptPath
    $shortcut.WorkingDirectory = $InstallDir
    $shortcut.IconLocation = $launchScriptPath
    $shortcut.Save()
}

$startMenuShortcutPath = $null
if ($createStartMenuShortcut) {
    $startMenuFolder = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Joke Hub"
    if (-not (Test-Path -LiteralPath $startMenuFolder)) {
        New-Item -ItemType Directory -Path $startMenuFolder -Force | Out-Null
    }

    $startMenuShortcutPath = Join-Path $startMenuFolder "Joke Hub.lnk"
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($startMenuShortcutPath)
    $shortcut.TargetPath = $launchScriptPath
    $shortcut.WorkingDirectory = $InstallDir
    $shortcut.IconLocation = $launchScriptPath
    $shortcut.Save()
}

Write-Host "Installed Joke Hub to: $InstallDir"
if ($desktopShortcutPath) {
    Write-Host "Desktop shortcut created: $desktopShortcutPath"
}
if ($startMenuShortcutPath) {
    Write-Host "Start menu shortcut created: $startMenuShortcutPath"
}
