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

# SIMULADOR FINAL — versión de planta: Sección 2 completa en una pantalla
# (onepage-layout, dos filas), candado de parámetros de calibración
# (params-auth) y tags de calibración física. Fuente propia en
# deck/simulador-final (rescatada de agent/novopan-hmi-simulator, 17-jul).
mkdir -p "$PUBLIC/simulador-final"
cp -R "$DECK/simulador-final/." "$PUBLIC/simulador-final/"
find "$PUBLIC/simulador-final" -type f \( -name '*.md' -o -name 'CLAUDE_*' -o -name '*.dc.html' \) -delete
# El CSV de la demo local (scripts/hmi-sim.py) JAMÁS sale a producción: en planta
# ese mismo archivo lo escribe Sistemas con datos reales, y una copia simulada
# mostraría flujos inventados con cara de dato de planta. Está en .gitignore,
# así que Vercel (checkout limpio) no lo ve; esto cubre el build local.
rm -f "$PUBLIC/simulador-final/datos/hmi-sistemas.csv"

# Cache-bust del service worker (PWA): cada build sella una versión de caché
# nueva, así un deploy no queda servido con el JS/CSS viejo del caché anterior.
SW_FILE="$PUBLIC/simulador-final/sw.js"
if [ -f "$SW_FILE" ]; then
  SW_STAMP="$(date +%Y%m%d%H%M%S)"
  sed "s/novopan-sim-v2/novopan-sim-$SW_STAMP/" "$SW_FILE" > "$SW_FILE.tmp" && mv "$SW_FILE.tmp" "$SW_FILE"
fi

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
    (public / "simulador-final" / "index.html", "/simulador-final/"),
]:
    inject_base(html_path, base)
PY

# Página de descarga + paquetes ZIP para correr en localhost (offline).
# Los .zip se generan aquí en cada build (NO viven en git); ver .gitignore.
mkdir -p "$PUBLIC/descargar"
cp "$ROOT/vercel/descargar/index.html" "$PUBLIC/descargar/index.html"

python3 - "$ROOT" "$PUBLIC" <<'PY'
import sys, zipfile
from pathlib import Path

root = Path(sys.argv[1])
public = Path(sys.argv[2])
descargar = public / "descargar"
tmpl_dir = root / "vercel" / "descargar" / "_paquete"

# <base> para servir /descargar sin barra final (trailingSlash: false)
idx = descargar / "index.html"
html = idx.read_text(encoding="utf-8")
if '<base href="/descargar/">' not in html:
    idx.write_text(html.replace("<head>", '<head>\n  <base href="/descargar/">', 1), encoding="utf-8")

LAUNCHERS = ["servidor.ps1", "ABRIR SIMULADOR (Windows).bat",
             "ABRIR SIMULADOR (Mac).command", "LEEME.txt"]
tmpl = {n: (tmpl_dir / n).read_text(encoding="utf-8") for n in LAUNCHERS}

def skip(relparts, name):
    return name == ".gitignore" or "claude-design-handoff" in relparts

def add_file(zf, arcname, data, executable=False):
    info = zipfile.ZipInfo(arcname)
    info.compress_type = zipfile.ZIP_DEFLATED
    info.external_attr = (0o755 << 16) if executable else (0o644 << 16)
    zf.writestr(info, data)

def add_tree(zf, src_dir, arc_prefix):
    for p in sorted(src_dir.rglob("*")):
        rel = p.relative_to(src_dir)
        if p.is_file() and not skip(rel.parts, p.name):
            add_file(zf, f"{arc_prefix}/{rel.as_posix()}", p.read_bytes())

def add_launchers(zf, pkg_root, open_path, title):
    for n in LAUNCHERS:
        text = tmpl[n].replace("@@OPEN@@", open_path).replace("@@TITLE@@", title)
        add_file(zf, f"{pkg_root}/{n}", text.encode("utf-8"), executable=n.endswith(".command"))

REDIRECT = ('<!doctype html><meta charset="utf-8"><title>Simulador NOVOPAN</title>\n'
            '<meta http-equiv="refresh" content="0; url=/simulador-final/">\n'
            '<p>Abriendo el simulador... <a href="/simulador-final/">entrar</a></p>\n')

# Paquete 1 — Simulador de planta (liviano): simulador-final + su motor core
pkg = "NOVOPAN-Simulador-planta"
with zipfile.ZipFile(descargar / f"{pkg}.zip", "w", zipfile.ZIP_DEFLATED) as zf:
    add_tree(zf, public / "simulador-final", f"{pkg}/sitio/simulador-final")
    add_tree(zf, public / "trazabilidad" / "js" / "core", f"{pkg}/sitio/trazabilidad/js/core")
    add_file(zf, f"{pkg}/sitio/index.html", REDIRECT.encode("utf-8"))
    add_launchers(zf, pkg, "simulador-final/", "SIMULADOR DE PLANTA - Linea 1 - NOVOPAN")

# Paquete 2 — Hub completo (todo el sitio offline)
pkg = "NOVOPAN-Hub-completo"
with zipfile.ZipFile(descargar / f"{pkg}.zip", "w", zipfile.ZIP_DEFLATED) as zf:
    for p in sorted(public.rglob("*")):
        rel = p.relative_to(public)
        if p.is_file() and "descargar" not in rel.parts and not skip(rel.parts, p.name):
            add_file(zf, f"{pkg}/sitio/{rel.as_posix()}", p.read_bytes())
    add_launchers(zf, pkg, "simulador-final/", "HUB COMPLETO - NOVOPAN")

sizes = ", ".join(f"{f.name} {f.stat().st_size//1024} KB" for f in sorted(descargar.glob("*.zip")))
print(f"  descargar/ zips: {sizes}")
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
