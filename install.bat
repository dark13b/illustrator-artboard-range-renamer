@echo off
rem Double-click to install. Windows asks for admin rights because Illustrator lives in Program Files.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"
