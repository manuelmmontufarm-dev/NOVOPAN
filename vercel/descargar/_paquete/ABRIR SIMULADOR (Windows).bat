@echo off
title SIMULADOR NOVOPAN - servidor local
cd /d "%~dp0"

if not exist "%~dp0servidor.ps1" goto :sinextraer
if not exist "%~dp0sitio\" goto :sinextraer

echo.
echo   Abriendo el SIMULADOR NOVOPAN en tu navegador...
echo   (no cierres esta ventana mientras lo usas)
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor.ps1"
echo.
echo   El servidor se detuvo.
pause
exit /b

:sinextraer
echo.
echo   ============================================================
echo     FALTA DESCOMPRIMIR LA CARPETA
echo   ============================================================
echo.
echo   Estas abriendo el .bat desde DENTRO del ZIP (WinRAR), por eso
echo   no encuentra los archivos del simulador.
echo.
echo   Haz esto:
echo     1) Cierra esta ventana.
echo     2) Clic derecho en el archivo .zip  ^>  "Extraer todo".
echo        (En WinRAR es "Extraer en la carpeta especificada".)
echo     3) Entra a la carpeta que se creo.
echo     4) Doble clic en  ABRIR SIMULADOR (Windows).bat  DESDE AHI.
echo.
echo   No necesitas licencia de WinRAR: si te la pide, dale Cerrar.
echo.
pause
exit /b
