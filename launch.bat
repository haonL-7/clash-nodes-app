@echo off
:: Clash Nodes - Native App Window
:: Uses Edge App Mode for a clean, browser-free window
start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="file:///D:/clash-nodes-app/src/index.html" --window-size=980,720 --user-data-dir="%APPDATA%\ClashNodes"
