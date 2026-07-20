# Claude Design — Sección 2 · mediciones reales + UX operador

> **Objetivo:** Actualizar el diseño de **Sección 2 · Línea horizontal** para (1) alinear el SVG a **mediciones reales**, (2) reflejar el **modo operador** que pide planta, y (3) pulir la pestaña **Parámetros**.  
> **Motor JS:** no se rediseña la física; Claude Design entrega **HTML/SVG/CSS** que Cursor conecta después.

---

## ¿Proyecto nuevo en Claude Design o rehacer el viejo?

**Recomendación: proyecto NUEVO.** No intentes “parchear” el handoff original (`Seccion2 Linea.dc.html`).

| | Handoff original (Claude Design v1) | Implementación actual (jul-2026) |
|---|-----------------------------------|--------------------------------|
| Escala | Artística, no proporcional | Motor con 71.6 m medidos + mapeo en código |
| Toolbar | Play / reset / slider | Tabs **Línea \| Parámetros**, chips 2A–2E |
| Parámetros | No existía | Panel completo con ecuaciones (feo para operador) |
| Reloj | Simulación desde t=0 | Tiempo real 1× (ya en código) |
| Trazador | Etiqueta de metros | Solo badge “TRAZADOR” |

**Qué subir al proyecto nuevo:**

1. **Screenshots** del simulador en vivo: [https://novopan.vercel.app/trazabilidad-linea](https://novopan.vercel.app/trazabilidad-linea) (vista Línea + vista Parámetros).
2. **`index.html` actual** de `trazabilidad-linea/` (estado real del repo, no el `.dc.html` viejo).
3. Este prompt (sección **PROMPT** al final).
4. Opcional: el `.dc.html` original **solo como referencia estética** (colores, animaciones, iconografía de equipos).

**No le pidas “continúa el proyecto anterior”** — Claude Design no ve tu repo ni Vercel. Un proyecto nuevo con material actual evita que revierta tabs, mediciones o cambios ya hechos.

---

## Recomendaciones de planta (jefe)

Estas reglas guían el **diseño UX**; Cursor implementa la lógica después.

### 1. La línea siempre está corriendo

- Visualmente: bandas con animación `conveyor` **siempre activa**, colchón en movimiento continuo.
- **No** es un simulador “pulsa play y arranca desde cero”. Es un **HMI en vivo**: la línea nunca para.
- Quitar o minimizar: botón play grande, reset, “0 % del recorrido desde el inicio”.
- El reloj puede mostrar **hora de planta** o **tiempo desde último cambio**, no “simulación desde t=0”.

### 2. Un solo parámetro operador: velocidad de prensa

- En toolbar (vista Línea): **un control visible** → `v_prensa` (m/min), con preset observado (14.5 m/min jun-24).
- Todo lo demás (masas, longitudes, τ, buffers) → **Parámetros avanzados**, no en la barra principal.
- Mensaje implícito: *“La línea corre a la velocidad de prensa; el resto es ficha técnica.”*

### 3. Inyectar cambio desde el punto actual (no desde el principio)

- Cuando el operador **aplica un cambio** (p. ej. marca pintura / confirma setpoint), el **trazador amarillo** aparece **en el equipo donde está parado** y avanza desde ahí — no desde dosing/encolador.
- Diseñar:
  - Botón claro: **“Aplicar cambio aquí”** o **“Marcar cambio”** (icono `flag` / `ink_pen`).
  - Indicador de **punto de inyección** en el SVG (equipo seleccionado o posición actual del trazador).
- La barra de tiempo manual (**slider**) sigue existiendo para **scrub** / revisar, pero el flujo normal es línea corriendo + cambio desde punto actual.

### 4. Producto a la misma velocidad en toda la línea

- En planta, el tablero avanza a **v_prensa** (con factores mecánicos ya en el motor).
- En el dibujo: velocidad visual **uniforme** del colchón/trazador a lo largo de blanca → roja → prensa (no acelerar/ralentizar por tramo en la animación).
- Las **distancias en m** sí varían por tramo; la **velocidad m/min** es la misma.

### 5. Medidas reales en el dibujo

- Layout SVG **proporcional** a metros (ver tablas abajo).
- Regla 0–70 m cada 5 m alineada al mismo eje X.
- Equipos anclados a waypoints medidos, no “a ojo”.

### 6. Pestaña Parámetros más limpia

- **Vista por defecto:** solo inputs editables agrupados (HMI, receta, longitudes, buffers) — **sin** bloques de ecuación visibles.
- **Cálculos / ecuaciones / justificación:** dentro de **`<details>`** o sub-tab **“Ver cálculo”** por etapa (colapsado).
- Badges de origen (HMI, Medido, Manual) se mantienen; ecuaciones `τ = M/F×60` ocultas hasta expandir.
- Botones Guardar / Cargar / Defaults en header del panel, estilo coherente con toolbar verde.

---

## Fuente de verdad — metros

| Banda | Longitud | Metros absolutos (desde inicio banda blanca) |
|-------|----------|-----------------------------------------------|
| Blanca | **45.0 m** | 0 → 45 |
| Roja | **10.0 m** | 45 → 55 |
| Prensa metálica | **16.6 m** | 55 → 71.6 |
| Post-prensa | **13.55 m** | 71.6 → 85.15 |
| **Total medido** | **85.15 m** | |

### Waypoints clave (m absolutos)

| m | Equipo |
|---|--------|
| 0 | Inicio banda blanca |
| 4.89 | Zona SL1 |
| 13.9 | Zona CL |
| 20.66 | Zona SL2 |
| 26.68 | Imán |
| 31.4 | Pre-prensa |
| 35.99 | Sprays |
| 37.69 | Detector metales |
| 39.56 | Cuchillas |
| 45.0 | Fin blanca / inicio roja |
| 48.0 | Vapor EVOsteam |
| 55.0 | Inicio prensa |
| 55.1 | Marco 1 |
| 70.4 | Marco 19 |
| 71.6 | Fin prensa |
| 78.3–79.65 | Cuchillos de refila |
| 80.35–82.65 | Sierra transversal |
| 85.15 | Sensores de calidad |

**Proporción visual bandas:** 45 : 10 : 16.6 ≈ **62.8% : 14.0% : 23.2%** del tramo downstream.

**Prensa:** marcos 1–7 pitch **0.75 m**; marcos 7–19 pitch **0.90 m**.

*(Sub-tramos detallados en `process-graph.js` → `WHITE_SEGMENTS`, `RED_SEGMENTS`, `PRESS_SEGMENTS`.)*

---

## Qué debe entregar Claude Design

1. **`Seccion2 Linea.dc.html`** (o nombre equivalente) — HTML/SVG/CSS vanilla, sin React.
2. **Vista Línea:** SVG a escala, línea “viva”, control `v_prensa`, botón “Aplicar cambio aquí”, slider scrub opcional, chips 2A–2E, trazador amarillo, leyenda.
3. **Vista Parámetros:** layout limpio + ecuaciones en paneles colapsables.
4. **Mantener:** header verde, tokens NOVOPAN, Barlow, animaciones existentes donde aplique.

---

## Qué NO hacer

- No sidebar P&ID clásico.
- No inventar distancias distintas a la tabla.
- No duplicar 20 sliders en la toolbar — solo **v_prensa** ahí.
- No eliminar trazador ni colchón 3 capas.

---

## PROMPT (copiar y pegar en Claude Design — proyecto NUEVO)

```
Diseña la v2 de "NOVOPAN · Sección 2 · Línea horizontal" (trazabilidad L1).

IMPORTANTE — CONTEXTO
- Te adjunto screenshots del simulador ACTUAL en Vercel y/o el index.html implementado (jul-2026).
- NO uses ciegamente un handoff viejo: ya hay tabs Línea|Parámetros, mediciones reales y tiempo real.
- El handoff original (.dc.html) sirve SOLO como referencia de estilo (verde #004E38, amarillo #FFDE00, Barlow, animaciones).

RECOMENDACIONES DE PLANTA (prioridad UX)
1. La línea SIEMPRE está corriendo (bandas animadas, HMI en vivo). No es "play desde cero".
2. En la toolbar de Línea, el ÚNICO control operador visible es velocidad de prensa (m/min). Preset ~14.5.
3. Botón "Aplicar cambio aquí" / "Marcar cambio": el trazador amarillo empieza desde el equipo/punto actual, NO desde el inicio de la línea.
4. Slider de tiempo manual opcional (scrub), pero flujo normal = línea corriendo + cambio desde ahí.
5. El producto se mueve a la MISMA velocidad (v_prensa) en toda la línea; solo cambian las distancias entre equipos.
6. Pestaña Parámetros más limpia: inputs visibles; ecuaciones (τ = M/F×60, t = L/v×60) y justificaciones dentro de paneles colapsables "Ver cálculo".

MEDICIONES REALES (flexómetro jul-2026 — escala del SVG)
- Total medido 85.15 m: blanca 45 m + roja 10 m + prensa 16.6 m + post-prensa 13.55 m.
- Waypoints post-prensa (m): 71.6 fin prensa · 78.3–79.65 refila · 80.35–82.65 sierra transversal · 85.15 sensores.
- Proporción visual bandas ≈ 63% : 14% : 23%.
- Prensa: 19 marcos, pitch 0.75 m (1–7) y 0.90 m (7–19).
- Regla inferior 0–85.15 m cada 5 m, alineada al mismo eje X que los equipos.

TAREA
1. Re-dibuja el SVG con X proporcional a metros (escala lineal 0–85.15 m).
2. Diseña toolbar v2: tabs Línea|Parámetros, v_prensa, "Aplicar cambio aquí", chips 2A–2E, sin play/reset dominantes.
3. Diseña panel Parámetros v2: limpio, ecuaciones colapsadas.
4. Mantén header verde, reloj, leyenda, trazador amarillo, colchón 3 capas, animaciones conveyor/steam/mist.

ENTREGABLE
- Un .dc.html (HTML/SVG/CSS vanilla, sin React), listo para que desarrollo lo convierta a index.html + css/.
- Indica en comentarios HTML los IDs sugeridos para JS (#tracer, #canvasScroll, #tabParams, etc.).
```

---

## Después del handoff (Cursor)

1. Diff vs. `trazabilidad-linea/index.html` + `css/seccion2-linea.css`.
2. Motor: inyección desde nodo actual; línea siempre en marcha; solo `v_prensa` en toolbar.
3. `line-bridge.js`: escala lineal si el SVG quedó proporcional.
4. `line-params.js`: ecuaciones en `<details>`.
5. Deploy → [https://novopan.vercel.app/trazabilidad-linea](https://novopan.vercel.app/trazabilidad-linea).
