# Prompt — Rediseño del motor de bandas blanca, roja y prensa

> **Objetivo:** Hacer el simulador **ultra preciso** en banda blanca, banda roja y banda prensa usando mediciones de campo (jul-2026).  
> **Alcance:** Solo **motor** (`process-graph.js`, `trace-engine.js`) + **anotaciones discretas en el front** (metros / %).  
> **NO tocar:** layout visual, grid P&ID, CSS mayor, `track-renderer.js` salvo wiring mínimo para mostrar medidas.

---

## Archivos de referencia (leer antes de codificar)

| Archivo | Contenido |
|---------|-----------|
| `MEDICIONES_BANDAS_CAMPO.md` | **Fuente de verdad** — sub-segmentos en metros y % |
| `datos/Production_Line_Timing_Averages.xlsx` | Cronómetros crudos blanca/roja (3 corridas) |
| `PARAMETROS.md` | Parámetros globales upstream (mantener) |
| `js/core/process-graph.js` | Schema de nodos actual |
| `js/core/trace-engine.js` | `walkNodes`, `traceDownstream`, merge |
| `js/ui/track-renderer.js` | Solo para badges discretos de m / % |

---

## Prompt copy-paste

```
Eres un ingeniero de software en el proyecto NOVOPAN — simulador de trazabilidad L1.

## Tarea

Rediseña el **motor de simulación** para que banda blanca, banda roja y banda prensa usen **sub-segmentos medidos en planta** (metros exactos), en lugar de bloques únicos `len:white` / `len:red` / `len:press` con equipos decorativos.

El **front ya está hecho** (diagrama P&ID, track-renderer, CSS). NO rediseñes la UI. Cambios de front **mínimos y discretos**: mostrar metros y % de waypoints/zonas/marcos donde ya existen equipos en el diagrama.

## Lo que NO cambia

- Rama **upstream** completa: dosing bins, encoladores, bandas inclinadas, esparcidores como nodos de retención (τ = M/F×60), sprays, merge lógico entre rutas.
- Fórmulas globales: `τ = M/F×60`, `t = L/v×60`, buffers manuales `buffer:*`.
- Velocidad prensa como reloj maestro de bandas acopladas.
- API pública usada por `app.js`: `computeAllMarkers`, `arrivalTimeForStage`, `breakdownToStage`, `totalTravelTimeSec`, `resolvePathIds`.
- Persistencia localStorage y pestaña Parámetros (puede **añadir** filas; no romper claves existentes sin migración).
- Retorno de banda metálica (~28 m del circuito ~45 m total): **no modelar** en τ.

## Lo que SÍ cambia — modelo físico

### Convención de medición (campo)

- Solo pares **start + end** tienen longitud (zona).
- Puntos sueltos (imán, sprays, detector, cuchillas, **marcos de prensa**) = **waypoint** sin extensión (centro).
- Entre puntos sin equipo = **transport puro** (banda corriendo con colchón vacío, formándose, ya formado, o manta bajo prensa).

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

### Banda prensa metálica — 16,6 m zona activa

Reemplazar nodo único `press` (transport 16.6 m) por cadena medida con flexómetro (jul-2026).

**Verificación:** `0.10 + 6×0.75 + 12×0.90 + 1.20 = 16.60 m`

| # | id | tipo | L (m) | Notas |
|---|-----|------|-------|-------|
| 1 | gap-pre-m1 | transport | 0.10 | Hasta marco 1 |
| 2 | gap-m1-m2 | transport | 0.75 | Pitch denso (marcos 1–7) |
| 3 | gap-m2-m3 | transport | 0.75 | |
| 4 | gap-m3-m4 | transport | 0.75 | |
| 5 | gap-m4-m5 | transport | 0.75 | |
| 6 | gap-m5-m6 | transport | 0.75 | |
| 7 | gap-m6-m7 | transport | 0.75 | |
| 8 | gap-m7-m8 | transport | 0.90 | Pitch estándar (marcos 7–19) |
| 9 | gap-m8-m9 | transport | 0.90 | |
| 10 | gap-m9-m10 | transport | 0.90 | |
| 11 | gap-m10-m11 | transport | 0.90 | |
| 12 | gap-m11-m12 | transport | 0.90 | |
| 13 | gap-m12-m13 | transport | 0.90 | |
| 14 | gap-m13-m14 | transport | 0.90 | |
| 15 | gap-m14-m15 | transport | 0.90 | |
| 16 | gap-m15-m16 | transport | 0.90 | |
| 17 | gap-m16-m17 | transport | 0.90 | |
| 18 | gap-m17-m18 | transport | 0.90 | |
| 19 | gap-m18-m19 | transport | 0.90 | Fin zona prensado |
| 20 | gap-decompress | transport | 1.20 | Descompresión + salida activa |

**Waypoints — marcos (centro, sin longitud propia):**

| Marco | atM (m) | atPct |
|-------|---------|-------|
| 1 | 0.10 | 0.6 % |
| 2 | 0.85 | 5.1 % |
| 3 | 1.60 | 9.6 % |
| 4 | 2.35 | 14.2 % |
| 5 | 3.10 | 18.7 % |
| 6 | 3.85 | 23.2 % |
| 7 | 4.60 | 27.7 % |
| 8 | 5.50 | 33.1 % |
| 9 | 6.40 | 38.6 % |
| 10 | 7.30 | 44.0 % |
| 11 | 8.20 | 49.4 % |
| 12 | 9.10 | 54.8 % |
| 13 | 10.00 | 60.2 % |
| 14 | 10.90 | 65.7 % |
| 15 | 11.80 | 71.1 % |
| 16 | 12.70 | 76.5 % |
| 17 | 13.60 | 81.9 % |
| 18 | 14.50 | 87.3 % |
| 19 | 15.40 | 92.8 % |
| Fin zona activa | 16.60 | 100.0 % |

Todos los sub-segmentos prensa usan `t = L / v_prensa × 60`. No hay τ de retención en marcos — solo transporte entre waypoints.

### Punto de arranque t₀ en banda blanca

Cuando la inyección es **upstream** (encoladores, dosing, esparcidores en rutas BOTTOM/TOP/CORE):

1. Calcular tiempo hasta que el cambio **llega al inicio físico de banda blanca** (= fin del merge upstream / colchón), como hoy con `max(ruta lenta)`.
2. A partir de ahí, recorrer la **cadena de sub-segmentos** blanca (no saltar directo a “colchón al 12 %”).
3. **Eliminar** la lógica que asume “las tres capas ya están en colchón al entrar a white”: en campo, SL1 empieza 1,42 m después del arranque de banda y las capas se depositan en secuencia.

Cuando t₀ = `white`, el marcador empieza en m=0 de la cadena blanca.  
Cuando t₀ = `press`, empieza en m=0 de la cadena prensa (después de blanca + roja).

### Compatibilidad IDs

- Mantener `id: 'white'`, `id: 'red'`, `id: 'press'` como **contenedores** o alias para inyección / ETA / breakdown.
- Exponer sub-segmentos en schema (`getParameterSchema`) agrupados bajo blanca/roja/prensa, o como claves `len:white:gap-pre-sl1`, `len:press:gap-m7-m8`, etc.
- `len:white`, `len:red`, `len:press` deben seguir siendo editables como **total** (= suma de hijos) o derivarse automáticamente; si el usuario edita el total, escalar proporcionalmente (opcional — documentar decisión).

## Implementación sugerida

### `process-graph.js`

- Añadir `WHITE_SEGMENTS`, `RED_SEGMENTS`, `PRESS_SEGMENTS` arrays con `{ id, type: 'transport'|'zone'|'waypoint', lengthM?, atM?, label, equipmentRef? }`.
- `DOWNSTREAM`: cada nodo con `segments` + `lengthM` total derivado.
- Actualizar `equipment` / `atPct` de equipos visuales usando **posiciones medidas** (ver tablas abajo).
- Marcos prensa: waypoints `press:point:m1` … `press:point:m19` para badges discretos en el bloque prensa existente.
- Actualizar `INJECTION_OPTIONS` si hace falta sub-puntos — opcional fase 2.

### `trace-engine.js`

- Nueva función `walkBeltSegments(segments, elapsed, speed, params)` que itera transport/zone y registra paso por waypoints.
- `traceDownstream`: para nodos con `segments`, usar walker en lugar de un solo `transportForNode`.
- `arrivalTimeForStage` / `breakdownToStage`: desglosar por sub-segmento (label + L + t); soportar `press:point:m19`, etc.
- `computeAllMarkers`: `positionM` absoluto en banda (0–45 blanca, 0–10 roja, 0–16.6 prensa) + `segmentId` + `segmentProgress`.
- Waypoints: cuando `elapsed` cruza `atM / v * 60`, emitir fase `waypoint` sin consumir tiempo extra.

### Posiciones para el front (actualizar `atPct` / badges discretos)

**Banda blanca** — texto pequeño, ej. `27 m · 59 %`:

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

**Banda prensa** — badge por marco, ej. `M7 · 4.6 m · 28 %`:

| Referencia | atM | atPct |
|------------|-----|-------|
| Marco 1 | 0,1 | 1 % |
| Marco 7 | 4,6 | 28 % |
| Marco 13 | 10,0 | 60 % |
| Marco 19 | 15,4 | 93 % |
| Fin zona activa | 16,6 | 100 % |

(Puede mostrarse solo M1, M7, M13, M19 en UI para no saturar — datos completos en schema.)

### Front — cambios mínimos permitidos

En `track-renderer.js` (o helper pequeño):

- Leer `atM` / `atPct` del schema actualizado.
- Renderizar badge discreto: `<span class="belt-measure">26.7 m · 59%</span>` / `<span class="belt-measure">M13 · 10.0 m</span>`.
- Clase CSS sutil (`font-size: 9px`, `opacity: 0.75`, sin mover layout).
- NO cambiar proporciones del grid, colores, ni estructura HTML del P&ID.

## Criterios de aceptación

1. @ v_prensa = **11,11 m/min**, tiempo total banda blanca ≈ **242,9 s** (±1 s).
2. @ v_prensa = **11,11 m/min**, tiempo total banda roja ≈ **54,2 s** (±1 s).
3. @ v_prensa = **14,5 m/min**, totales ≈ **186 s** blanca, **41 s** roja, **68,7 s** prensa.
4. `arrivalTimeForStage('white:point-iman', ...)` ≈ **144 s** @ 11,11 m/min (desde t₀ inicio blanca).
5. `arrivalTimeForStage('press:point:m19', ...)` ≈ **63,7 s** @ 14,5 m/min (desde t₀ inicio prensa).
6. `arrivalTimeForStage('press', ...)` / fin zona activa ≈ **68,7 s** @ 14,5 m/min.
7. Demo pintura (`enc-all`): ETA salida prensa más cerca de planta — documentar en `PARAMETROS.md`.
8. Slider velocidad escala linealmente todos los sub-segmentos.
9. Sin regresiones en upstream (τ esparcidores, encoladores, inclinadas).

## Entregables

1. Diff en `process-graph.js` + `trace-engine.js`.
2. Wiring mínimo front (badges m / % / marco).
3. Actualizar `PARAMETROS.md` y `MEDICIONES_BANDAS_CAMPO.md` si cambian defaults.
4. Breve nota en `ARCHITECTURE.md` sección downstream explicando modelo de cadena en tres bandas.

## Fuera de alcance

- Rediseño visual v2 horizontal (`CLAUDE_DESIGN_PROMPT_V2_LINEA.md`).
- Retorno banda metálica (~28 m bajo prensa).
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
| Marco 19 (desde inicio prensa) | ~83 s | ~63,7 s |
| Fin zona prensa activa | ~90 s | ~68,7 s |
| **Salida prensa** (blanca+roja+prensa) | ~387 s | ~296 s |
