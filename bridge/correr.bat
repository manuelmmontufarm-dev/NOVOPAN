@echo off
cd /d "%~dp0"
title NOVOPAN Bridge - CSV a la nube (no cerrar)
:loop
node bridge.mjs
echo.
echo [correr.bat] el puente se detuvo. Reintento en 5s...  (cierra esta ventana para apagarlo)
timeout /t 5 /nobreak >nul
goto loop
