#!/bin/bash
# Servidor local del SIMULADOR NOVOPAN para macOS. Doble clic para abrir.
cd "$(dirname "$0")" || exit 1

PORT=8080
URL="http://localhost:$PORT/@@OPEN@@"

echo ""
echo "  Abriendo el SIMULADOR NOVOPAN en tu navegador..."
echo "  (deja esta ventana ABIERTA mientras lo usas; cierrala para apagarlo)"
echo ""

# Abre el navegador un par de segundos despues, cuando el servidor ya esta arriba
( sleep 2; open "$URL" ) &

if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server "$PORT" --directory sitio
elif command -v ruby >/dev/null 2>&1; then
  ruby -run -e httpd sitio -p "$PORT"
elif command -v npx >/dev/null 2>&1; then
  npx --yes serve -l "$PORT" sitio
else
  echo "No encontre Python, Ruby ni Node en esta Mac."
  echo "Instala Python desde https://www.python.org/downloads/ y vuelve a intentar."
  read -r -p "Presiona ENTER para cerrar."
fi
