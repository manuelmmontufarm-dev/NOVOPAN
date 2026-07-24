@echo off
cd /d "%~dp0"
echo ============================================================
echo   Instalador del PUENTE NOVOPAN  (CSV del HMI  -^>  la nube)
echo ============================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo   FALTA Node.js en esta compu.
  echo   Instalalo desde  https://nodejs.org  (boton "LTS"), reinicia
  echo   y vuelve a correr este INSTALAR.bat.
  echo.
  pause & exit /b
)

if not exist "%~dp0bridge.config.json" (
  echo   FALTA el archivo  bridge.config.json
  echo   1) Copia  bridge.config.example.json  a  bridge.config.json
  echo   2) Abrelo con el Bloc de notas y pon el TOKEN del Blob store
  echo      y la RUTA del CSV del HMI.
  echo   3) Vuelve a correr este INSTALAR.bat.
  echo.
  pause & exit /b
)

echo Instalando dependencias (solo la primera vez)...
call npm install --omit=dev --no-audit --no-fund
if errorlevel 1 ( echo   Fallo el npm install. Revisa la conexion. & pause & exit /b )

echo.
echo Registrando el puente para que arranque SOLO al iniciar sesion...
schtasks /Create /TN "NOVOPAN Bridge" /TR "\"%~dp0correr.bat\"" /SC ONLOGON /RL LIMITED /F

echo.
echo   LISTO. El puente arrancara solo cada vez que se prenda esta compu.
echo   Lo estoy arrancando ahora en una ventana aparte (dejala abierta).
start "" "%~dp0correr.bat"
echo.
pause
