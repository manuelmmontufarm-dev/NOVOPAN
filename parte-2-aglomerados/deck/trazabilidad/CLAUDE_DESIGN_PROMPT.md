# Prompt para Claude Design — Simulador Trazabilidad L1

> **Rediseño v2 (línea horizontal tipo HMI):** ver [`CLAUDE_DESIGN_PROMPT_V2_LINEA.md`](CLAUDE_DESIGN_PROMPT_V2_LINEA.md) — prompt nuevo con flujo esparcidoras → blanca → roja → prensa → sensores.

## Objetivo (v1 — pulido CSS sobre P&ID actual)

Mejorar **look & feel**, **animaciones** y **jerarquía visual** del simulador sin romper la lógica de simulación. El resultado debe ser fácil de pegar de vuelta en el repo como **diffs pequeños**.

---

## Cómo usar (paso a paso)

### 1. Prepara el paquete para subir

En Claude Design, adjunta **solo estos archivos** (carpeta `encolados/deck/trazabilidad/`):

| Archivo | Rol |
|---------|-----|
| `index.html` | Shell (sidebar, reloj, canvas) |
| `css/trazabilidad.css` | **Principal objetivo de diseño** |
| `js/ui/track-renderer.js` | Solo para entender clases HTML generadas |
| `js/ui/stage-rail.js` | Barra de etapas |
| `ARCHITECTURE.md` | Qué no tocar |
| `PARAMETROS.md` | Contexto operativo |

**NO subas** (o márcalos como intocables):

- `js/core/process-graph.js`
- `js/core/trace-engine.js`
- `js/core/simulation-clock.js`
- `js/app.js` (salvo que pidas micro-ajustes de clases en HTML estático)

### 2. Abre una captura de referencia

Sube también 1–2 screenshots del simulador corriendo (`Iniciar` con marcadores visibles) para que vea el estado actual.

### 3. Trabaja **una sección por turno**

No pidas “rediseña todo”. Orden recomendado:

1. **Sidebar + controles** (`index.html` + CSS `.sidebar`, `.btn`, `.param-*`)
2. **Reloj + header** (`.app-header`, `.live-clock`)
3. **Barra de etapas** (`.stage-rail`)
4. **Diagrama P&ID** (`.pid-grid`, `.pid-box`, esparcidores, divisor)
5. **Bandas verticales** (`.pid-belt-block`, colores blanca/roja/prensa)
6. **Marcador tablero** (`.path-marker--board`) + animación de movimiento
7. **Conectores SVG** (solo grosor/opacidad vía CSS si aplica; rutas las calcula JS)

Pega el prompt de abajo y luego: *“Empieza por sección 1: Sidebar”*.

### 4. Aplica los diffs aquí (Cursor)

Cuando Claude Design devuelva diffs `ANTES → DESPUÉS`, pégalos en este chat de Cursor con:

> Aplica los diffs de Claude Design en `trazabilidad.css` (y `index.html` si hay).

Verifica con:

```bash
cd encolados/deck && python3 -m http.server 8081
# → http://localhost:8081/trazabilidad/
```

Prueba: **Iniciar**, cambiar τ dosing, **Guardar**, recargar.

---

## El prompt (copy-paste en Claude Design)

```
Eres un diseñador UI para una herramienta operativa de planta (NOVOPAN Línea 1 — simulador de trazabilidad).

CONTEXTO
- Simulador en HTML/CSS/JS vanilla (sin React, sin build).
- Design system: tokens en `../../_ds/.../tokens/` (colores NOVOPAN verde #004E38, amarillo, etc.).
- El motor de simulación YA funciona: reloj, τ, marcadores tipo tablero de madera, ✓ por etapa, guardado localStorage.
- Tu trabajo es SOLO pulido visual y animaciones suaves.

REGLAS ESTRICTAS — NO ROMPER FUNCIONALIDAD

1. PROHIBIDO tocar lógica de simulación:
   - No editar process-graph.js, trace-engine.js, simulation-clock.js
   - No cambiar fórmulas, IDs de nodos (`dosing-fine`, `esp1-zone`, `white`, etc.)
   - No eliminar `data-node-id`, `data-path-id`, `data-connector-id`, `id="playBtn"`, `id="paramsGrid"`, etc.

2. PROHIBIDO añadir frameworks (React, Vue, Tailwind, GSAP, etc.) ni CDNs nuevos.

3. PROHIBIDO cambiar textos operativos largos ni el flujo del proceso (2 encoladores, 3 esparcidores, colchón, bandas).

4. SÍ puedes cambiar:
   - `css/trazabilidad.css` (colores, spacing, sombras, transiciones, @keyframes)
   - Clases nuevas en HTML estático (`index.html`) si no rompen IDs
   - Animaciones CSS: marcador deslizándose, fill de retención, pulso suave en etapa activa, hover en stage-rail
   - Mejorar legibilidad en tablet de planta (contraste, tamaño mínimo 11px en labels)

5. CUIDADO con track-renderer.js:
   - Si propones cambios ahí, SOLO clases CSS o estructura visual (wrappers), NUNCA lógica de `_drawConnectors`, `computeAllMarkers`, `nodeEls`, `build()`.
   - Preferir resolver todo en CSS usando selectores existentes (`.pid-box`, `.path-marker--board`, `.belt-rail-v`, etc.)

6. ANIMACIONES DESEADAS (sin exagerar):
   - Tablero de madera: movimiento suave left/top (ya hay transition), sombra sutil al avanzar
   - Etapa activa: borde/glow amarillo NOVOPAN (ya existe `.is-active`)
   - Retención: barra `.retention-fill` que crece con easing
   - Reloj: tick visual al avanzar (`.is-ticking`)
   - NO animar SVG paths frame-a-frame (costoso); líneas estáticas o dash-offset opcional

7. FORMATO DE SALIDA — SOLO DIFFS, NUNCA ARCHIVO COMPLETO:
   Para cada cambio:
   ```
   [Sección: ej. Bandas verticales]
   [Archivo: css/trazabilidad.css ~línea 750]
   ANTES: <fragmento exacto>
   DESPUÉS: <fragmento modificado>
   PORQUÉ: <1 línea>
   ```
   Si una sección está bien: `[Sección X] OK — sin cambios.`

8. CRITERIO: operador en planta debe escanear el diagrama en 3 segundos — banda blanca blanca, roja roja, prensa negra, divisor obvio, sin líneas que se crucen encima de bandas.

EMPIEZA por la sección que te indique. Espera la siguiente antes de continuar.
```

---

## Qué puede cambiar Claude vs qué no

| ✅ Seguro | ❌ Peligroso |
|----------|-------------|
| Colores, bordes, sombras, radius | IDs y `data-*` del DOM |
| `@keyframes`, `transition` | `walkNodes`, `computeAllMarkers` |
| Espaciado sidebar / bandas | Claves `ret:*` y `len:*` en motor |
| Iconos Material Symbols (clase `.ms`) | Rutas SVG calculadas en JS |
| Sticky header / param-actions | `localStorage` / botones Guardar |

---

## Checklist al volver a integrar

- [ ] `Iniciar` / `Espacio` play-pause funciona
- [ ] Cambiar τ dosing y Run **sin** salir del input aplica el nuevo tiempo
- [ ] **Guardar** → recargar → valores persisten
- [ ] Marcador (tablero) se mueve por encolador → esparcidor → bandas
- [ ] ✓ aparecen al completar etapas
- [ ] Sin errores en consola del navegador

---

## Atajo: zip para subir

```bash
cd encolados/deck/trazabilidad
zip -r ~/Desktop/trazabilidad-design-handoff.zip \
  index.html css/trazabilidad.css \
  js/ui/track-renderer.js js/ui/stage-rail.js \
  ARCHITECTURE.md PARAMETROS.md CLAUDE_DESIGN_PROMPT.md
```

Sube el zip + 2 screenshots a Claude Design.

---

## Si Claude Design devuelve HTML/CSS completo

Pide explícitamente: *“Convierte esto a diffs ANTES/DESPUÉS por sección”* — es mucho más fácil de integrar que reemplazar archivos enteros.
