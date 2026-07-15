#!/usr/bin/env bash
# Assembles public/ for Vercel static deploy (single project, multiple routes).
# Uses cp/find only — Vercel build images do not include rsync.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PUBLIC="$ROOT/public"

PARTE1="$ROOT/parte-1-preparacion-madera"
PARTE1_FINAL="$PARTE1/instructivos/finales"
PARTE1_APP="$PARTE1/html-app"
DECK="$ROOT/parte-2-aglomerados/deck"

echo "→ Building Vercel public/ from $ROOT"

rm -rf "$PUBLIC"
mkdir -p "$PUBLIC"

# Landing page
cp "$ROOT/vercel/index.html" "$PUBLIC/index.html"

# Trazabilidad simulator — Línea 1 P&ID clásico (parte-2-aglomerados/deck/trazabilidad)
mkdir -p "$PUBLIC/trazabilidad"
cp -R "$DECK/trazabilidad/." "$PUBLIC/trazabilidad/"
find "$PUBLIC/trazabilidad" -type f \( -name '*.md' -o -name 'CLAUDE_*' \) -delete

# Trazabilidad Sección 2 — vista línea horizontal (reusa motor en ../trazabilidad/js/core/)
mkdir -p "$PUBLIC/trazabilidad-linea"
cp -R "$DECK/trazabilidad-linea/." "$PUBLIC/trazabilidad-linea/"
find "$PUBLIC/trazabilidad-linea" -type f \( -name '*.md' -o -name 'CLAUDE_*' -o -name '*.dc.html' \) -delete

# Trazabilidad Parte 1 — preparación de madera + clasificación real HMI 10-jul-2026
mkdir -p "$PUBLIC/trazabilidad-preparacion"
cp -R "$PARTE1_APP/trazabilidad-preparacion/." "$PUBLIC/trazabilidad-preparacion/"

# Trazabilidad total — Parte 1 conectada a Sección 2
mkdir -p "$PUBLIC/trazabilidad-total"
cp -R "$DECK/trazabilidad-total/." "$PUBLIC/trazabilidad-total/"
find "$PUBLIC/trazabilidad-total" -type f \( -name '*.md' -o -name 'CLAUDE_*' -o -name '*.dc.html' \) -delete

# Simulador operativo — solo Sección 2. Reutiliza exactamente el motor,
# las mediciones y los datos HMI del simulador total, con la vista compacta
# apilada para la pantalla de planta.
mkdir -p "$PUBLIC/simulador-seccion-2"
cp -R "$DECK/trazabilidad-total/." "$PUBLIC/simulador-seccion-2/"
find "$PUBLIC/simulador-seccion-2" -type f \( -name '*.md' -o -name 'CLAUDE_*' -o -name '*.dc.html' \) -delete

# Design system tokens — CSS imports ../../_ds/... from trazabilidad/css/
mkdir -p "$PUBLIC/_ds"
cp -R "$DECK/_ds/." "$PUBLIC/_ds/"

# Patios / recepción madera — static HTML (preparación de madera, versión estática)
mkdir -p "$PUBLIC/patios"
cp "$PARTE1_FINAL/NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html" "$PUBLIC/patios/index.html"
mkdir -p "$PUBLIC/patios/NOVOPNHTML1_files"
cp -R "$PARTE1_FINAL/NOVOPNHTML1_files/." "$PUBLIC/patios/NOVOPNHTML1_files/"

# Patios interactivo — React/Babel app (preparación de madera, versión interactiva)
mkdir -p "$PUBLIC/patios-interactivo"
cp "$PARTE1_APP/NOVOPNHTML1.html" "$PUBLIC/patios-interactivo/index.html"
mkdir -p "$PUBLIC/patios-interactivo/NOVOPNHTML1_files"
cp -R "$PARTE1_APP/NOVOPNHTML1_files/." "$PUBLIC/patios-interactivo/NOVOPNHTML1_files/"

# Logo referenced by _ds_bundle.js as ../../assets/novopan-logo.jpg
mkdir -p "$PUBLIC/assets"
cp "$DECK/assets/novopan-logo.jpg" "$PUBLIC/assets/novopan-logo.jpg"

# Inject <base href="..."> for routes served without trailing slash (vercel.json trailingSlash: false).
python3 - "$PUBLIC" <<'PY'
import sys
from pathlib import Path

public = Path(sys.argv[1])

def inject_base(html_path: Path, base_href: str) -> None:
    html = html_path.read_text(encoding="utf-8")
    needle = f'<base href="{base_href}">'
    if needle in html:
        return
    html = html.replace("<head>", f"<head>\n  {needle}", 1)
    html_path.write_text(html, encoding="utf-8")

for html_path, base in [
    (public / "patios" / "index.html", "/patios/"),
    (public / "patios-interactivo" / "index.html", "/patios-interactivo/"),
    (public / "trazabilidad" / "index.html", "/trazabilidad/"),
    (public / "trazabilidad-linea" / "index.html", "/trazabilidad-linea/"),
    (public / "trazabilidad-preparacion" / "index.html", "/trazabilidad-preparacion/"),
    (public / "trazabilidad-total" / "index.html", "/trazabilidad-total/"),
    (public / "simulador-seccion-2" / "index.html", "/simulador-seccion-2/"),
]:
    inject_base(html_path, base)
PY

echo "✓ public/ ready ($(find "$PUBLIC" -type f | wc -l | tr -d ' ') files)"
echo "  /                    → index.html"
echo "  /trazabilidad        → parte-2-aglomerados/deck/trazabilidad + _ds tokens"
echo "  /trazabilidad-linea  → parte-2-aglomerados/deck/trazabilidad-linea (Sección 2)"
echo "  /trazabilidad-preparacion → parte-1-preparacion-madera/html-app/trazabilidad-preparacion"
echo "  /trazabilidad-total → Parte 1 + Sección 2 conectadas"
echo "  /simulador-seccion-2 → Sección 2 operativa (motor del simulador total)"
echo "  /patios              → parte-1-preparacion-madera (guía estática)"
echo "  /patios-interactivo  → parte-1-preparacion-madera/html-app (React/Babel)"
