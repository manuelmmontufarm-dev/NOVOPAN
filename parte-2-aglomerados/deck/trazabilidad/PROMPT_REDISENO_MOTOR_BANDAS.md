# Prompt — Rediseño del motor de bandas blanca y roja

> **Objetivo:** Hacer el simulador **ultra preciso** en banda blanca y banda roja usando mediciones de campo (jul-2026).  
> **Alcance:** Solo **motor** (`process-graph.js`, `trace-engine.js`) + **anotaciones discretas en el front** (metros / %).  
> **NO tocar:** layout visual, grid P&ID, CSS mayor, `track-renderer.js` salvo wiring mínimo para mostrar medidas.

---

## Archivos de referencia (leer antes de codificar)

| Archivo | Contenido |
|---------|-----------|
| `MEDICIONES_BANDAS_CAMPO.md` | **Fuente de verdad** — sub-segmentos en metros y % |
| `datos/Production_Line_Timing_Averages.xlsx` | Cronómetros crudos (3 corridas) |
| `PARAMETROS.md` | Parámetros globales upstream (mantener) |
| `js/core/process-graph.js` | Schema de nodos actual |
| `js/core/trace-engine.js` | `walkNodes`, `traceDownstream`, merge |
| `js/ui/track-renderer.js` | Solo para badges discretos de m / % |

---

## Prompt copy-paste

```
Eres un ingeniero de software en el proyecto NOVOPAN — simulador de trazabilidad L1.

## Tarea

Rediseña el **motor de simulación** para que banda blanca y banda roja usen **sub-segmentos medidos en planta** (metros exactos), en lugar de un solo bloque `len:white` / `len:red` con equipos decorativos.

El **front ya está hecho** (diagrama P&ID, track-renderer, CSS). NO rediseñes la UI. Cambios de front **mínimos y discretos**: mostrar metros y % de waypoints/zonas donde ya existen equipos en el diagrama.

## Lo que NO cambia

- Rama **upstream** completa: dosing bins, encoladores, bandas inclinadas, esparcidores como nodos de retención (τ = M/F×60), sprays, merge lógico entre rutas.
- Fórmulas globales: `τ = M/F×60`, `t = L/v×60`, buffers manuales `buffer:*`.
- Velocidad prensa como reloj maestro de bandas acopladas.
- API pública usada por `app.js`: `computeAllMarkers`, `arrivalTimeForStage`, `breakdownToStage`, `totalTravelTimeSec`, `resolvePathIds`.
- Persistencia localStorage y pestaña Parámetros (puede **añadir** filas; no romper claves existentes sin migración).
- Banda prensa metálica: mantener `len:press = 16.6` m como hoy (sin waypoints nuevos).

## Lo que SÍ cambia — modelo físico

### Convención de medición (campo)

- Solo pares **start + end** tienen longitud (zona).
- Puntos sueltos (imán, sprays, detector, cuchillas) = **waypoint** sin extensión (centro).
- Entre puntos sin equipo = **transport puro** (banda corriendo con colchón vacío, formándose o ya formado).

### Banda blanca — 45,0 m total

Reemplazar el nodo único `white` (transport 45 m) por una **cadena ordenada** de sub-segmentos. Usar exactamente estas longitudes (suma = 45,0 m):

| # | id | tipo | L (m) |
|---|-----|------|-------|
| 1 | gap-pre-sl1 | transport | 1.42 |
| 2 | zone-sl1 | zone | 6.94 |
| 3 | gap-sl1-cl | transport | 3.35 |
| 4 | zone-cl | zone | 4.38 |
| 5 | gap-cl-sl2 | transport | 1.37 |
| 6 | zone-sl2 | zone | 6.39 |
| 7 | gap-sl2-iman | transport | 2.81 |
| — | point-iman | waypoint @ 26.68 m (59.3 %) | — |
| 8 | gap-iman-preprensa | transport | 2.40 |
| 9 | zone-preprensa | zone | 4.69 |
| 10 | gap-preprensa-sprays | transport | 2.22 |
| — | point-sprays | waypoint @ 35.99 m (80.0 %) | — |
| 11 | gap-sprays-detector | transport | 1.70 |
| — | point-detector | waypoint @ 37.69 m (83.8 %) | — |
| 12 | gap-detector-cuchillas | transport | 1.86 |
| — | point-cuchillas | waypoint @ 39.56 m (87.9 %) | — |
| 13 | gap-post-cuchillas | transport | 5.41 |

**Fórmula por sub-segmento transport/zone:** `t = L / v_prensa × 60` [s]

**Zonas SL1/CL/SL2:** son esparcido **sobre la banda en movimiento**, NO upstream. El motor downstream debe empezar en `gap-pre-sl1` cuando t₀ = inyección en banda blanca (`white`), o después del merge upstream cuando t₀ es anterior.

### Banda roja — 10,0 m total

Reemplazar nodo único `red` por:

| # | id | tipo | L (m) |
|---|-----|------|-------|
| 1 | gap-pre-vapor | transport | 1.86 |
| 2 | zone-vapor | zone | 2.29 |
| 3 | gap-post-vapor | transport | 5.88 |

Waypoints: vapor start @ 1.86 m (18.6 %), vapor end @ 4.15 m (41.5 %).

### Punto de arranque t₀ en banda blanca

Cuando la inyección es **upstream** (encoladores, dosing, esparcidores en rutas BOTTOM/TOP/CORE):

1. Calcular tiempo hasta que el cambio **llega al inicio físico de banda blanca** (= fin del merge upstream / colchón), como hoy con `max(ruta lenta)`.
2. A partir de ahí, recorrer la **cadena de sub-segmentos** blanca (no saltar directo a “colchón al 12 %”).
3. **Eliminar** la lógica que asume “las tres capas ya están en colchón al entrar a white”: en campo, SL1 empieza 1,42 m después del arranque de banda y las capas se depositan en secuencia.

Cuando t₀ = `white`, el marcador empieza en m=0 de la cadena blanca.

### Compatibilidad IDs

- Mantener `id: 'white'` y `id: 'red'` como **contenedores** o alias para inyección / ETA / breakdown.
- Exponer sub-segmentos en schema (`getParameterSchema`) agrupados bajo blanca/roja, o como claves `len:white:gap-pre-sl1`, etc.
- `len:white` y `len:red` deben seguir siendo editables como **total** (= suma de hijos) o derivarse automáticamente; si el usuario edita el total, escalar proporcionalmente (opcional — documentar decisión).

## Implementación sugerida

### `process-graph.js`

- Añadir `WHITE_SEGMENTS` y `RED_SEGMENTS` arrays con `{ id, type: 'transport'|'zone'|'waypoint', lengthM?, atM?, label, equipmentRef? }`.
- `DOWNSTREAM` pasa de 3 nodos a: `[{ id:'white', segments: WHITE_SEGMENTS, lengthM: 45 }, { id:'red', segments: ... }, { id:'press', ... }]`.
- Actualizar `equipment` / `atPct` de equipos visuales usando **posiciones medidas** (ver tabla abajo).
- Actualizar `INJECTION_OPTIONS` si hace falta sub-puntos (`white:zone-sl1`, etc.) — opcional fase 2.

### `trace-engine.js`

- Nueva función `walkBeltSegments(segments, elapsed, speed, params)` que itera transport/zone y registra paso por waypoints.
- `traceDownstream`: para nodos con `segments`, usar walker en lugar de un solo `transportForNode`.
- `arrivalTimeForStage` / `breakdownToStage`: desglosar por sub-segmento (label + L + t).
- `computeAllMarkers`: `positionM` absoluto en banda (0–45 blanca, 0–10 roja) + `segmentId` + `segmentProgress`.
- Waypoints: cuando `elapsed` cruza `atM / v * 60`, emitir evento o fase `waypoint` sin consumir tiempo extra.

### Posiciones para el front (actualizar `atPct` / badges discretos)

**Banda blanca** — mostrar junto al equipo en diagrama (texto pequeño, ej. `27 m · 59 %`):

| Equipo visual | atM | atPct |
|---------------|-----|-------|
| Inicio SL1 / zona SL1 | 1,4–8,4 | 3–19 % |
| Zona CL | 11,7–16,1 | 26–36 % |
| Zona SL2 | 17,5–23,9 | 39–53 % |
| Imán | 26,7 | 59 % |
| Pre-prensa | 29,1–33,8 | 65–75 % |
| Sprays | 36,0 | 80 % |
| Detector metales | 37,7 | 84 % |
| Cuchillas / nariz | 39,6 | 88 % |

**Banda roja:**

| Equipo | atM | atPct |
|--------|-----|-------|
| Vapor start | 1,9 | 19 % |
| Vapor end | 4,2 | 42 % |

### Front — cambios mínimos permitidos

En `track-renderer.js` (o helper pequeño):

- Leer `atM` / `atPct` del schema actualizado.
- Renderizar badge discreto: `<span class="belt-measure">26.7 m · 59%</span>` con clase CSS existente o nueva muy sutil (`font-size: 9px`, `opacity: 0.75`, sin mover layout).
- NO cambiar proporciones del grid, colores, ni estructura HTML del P&ID.

## Criterios de aceptación

1. @ v_prensa = **11,11 m/min**, tiempo total banda blanca ≈ **242,9 s** (±1 s).
2. @ v_prensa = **11,11 m/min**, tiempo total banda roja ≈ **54,2 s** (±1 s).
3. @ v_prensa = **14,5 m/min**, totales ≈ **186 s** blanca y **41 s** roja.
4. `arrivalTimeForStage('white:point-iman', ...)` o equivalente ≈ **144 s** @ 11,11 m/min (desde t₀ en inicio blanca).
5. Demo pintura (`enc-all`): ETA salida prensa **mejora** vs. modelo anterior (más cerca de planta) — documentar nuevo total en `PARAMETROS.md`.
6. Tests manuales: slider velocidad escala linealmente todos los sub-segmentos.
7. Sin regresiones en upstream (τ esparcidores, encoladores, inclinadas).

## Entregables

1. Diff en `process-graph.js` + `trace-engine.js`.
2. Wiring mínimo front (badges m / %).
3. Actualizar `PARAMETROS.md` y `MEDICIONES_BANDAS_CAMPO.md` si cambian defaults.
4. Breve nota en `ARCHITECTURE.md` sección merge/downstream explicando nuevo modelo de cadena.

## Fuera de alcance

- Rediseño visual v2 horizontal (`CLAUDE_DESIGN_PROMPT_V2_LINEA.md`).
- Banda prensa metálica waypoints.
- Leer velocidad en vivo del HMI (futuro).
```

---

## Handoff zip (opcional)

```bash
cd "parte-2-aglomerados/deck/trazabilidad"
zip -r ~/Desktop/trazabilidad-motor-bandas.zip \
  MEDICIONES_BANDAS_CAMPO.md \
  PROMPT_REDISENO_MOTOR_BANDAS.md \
  PARAMETROS.md ARCHITECTURE.md \
  datos/Production_Line_Timing_Averages.xlsx \
  js/core/process-graph.js \
  js/core/trace-engine.js \
  js/ui/track-renderer.js \
  js/app.js
```

---

## Validación rápida post-implementación

| Checkpoint | v = 11,11 m/min | v = 14,5 m/min |
|------------|-----------------|----------------|
| Fin banda blanca | ~243 s | ~186 s |
| Imán | ~144 s | ~111 s |
| Fin banda roja (desde inicio roja) | ~54 s | ~41 s |
| Vapor start | ~10 s | ~7,7 s |
