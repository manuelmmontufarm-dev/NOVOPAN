@echo off
title SIMULADOR NOVOPAN - servidor local
cd /d "%~dp0"
echo.
echo   Abriendo el SIMULADOR NOVOPAN en tu navegador...
echo   (no cierres esta ventana mientras lo usas)
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor.ps1"
echo.
echo   El servidor se detuvo.
pause
