# Claude Design — Rediseño visual v2 · Línea horizontal

> **Objetivo:** Pasar del diagrama P&ID en grid (caídas ↓, bandas verticales ↓) a una **vista de línea horizontal** tipo HMI de planta (Dieffenbacher / Metso), donde la prensa parece prensa, las esparcidoras esparcidoras, etc.  
> **Motor de simulación:** NO se toca (`process-graph.js`, `trace-engine.js`, `simulation-clock.js`, `app.js` salvo wiring mínimo de tabs).

---

## Cómo usar

1. Abre **Claude Design** en otra pestaña.
2. Sube el **zip de handoff** (comando abajo) + **screenshot HMI Dieffenbacher** (`IMG_2048` o captura de planta) + **screenshot simulador actual** con marcador rosa en marcha.
3. Copia el **prompt completo** de la sección final.
4. Trabaja **una fase por turno** (no “rediseña todo”).
5. Pega los diffs en Cursor cuando termines cada fase.

```bash
cd "parte-2-aglomerados/deck/trazabilidad"
zip -r ~/Desktop/trazabilidad-v2-design.zip \
  index.html css/trazabilidad.css \
  js/ui/track-renderer.js js/ui/stage-rail.js \
  js/core/process-graph.js \
  ARCHITECTURE.md PARAMETROS.md \
  CLAUDE_DESIGN_PROMPT_V2_LINEA.md
```

---

## Referencia visual — imagen Dieffenbacher (NO copiar)

La captura adjunta es **otra línea** (ProGuide Dieffenbacher, “Vista general estación de formación”). Úsala como **lenguaje visual**, no como layout exacto.

| Elemento en HMI | Cómo se ve | Adaptar a NOVOPAN L1 |
|-----------------|------------|----------------------|
| **Esparcidoras** | 3 tolvas azules trapezoidales (SLT / CLB / SLB) sobre banda amarilla | Esp.3 (TOP/SL2), Esp.2 (CORE/CL), Esp.1 (BOTTOM/SL1) — apiladas en Z pero alimentando **una sola manta** |
| **Banda / manta** | Franja amarilla horizontal continua, gruesa | Blanca → roja → metálica negra; grosor proporcional al peso manta |
| **Báscula** | Caja verde “Peso total manta seca” (+9.11 kg/m²) | Badge flotante sobre tramo blanco (~28 % del nodo `white`) |
| **Detector / imán** | Iconos rectangulares verticales azules | Sensor metales en tramo rojo |
| **Pre-prensa / CBV** | Rodillos en trapezoide con % de compactación | Bloque mecánico antes de nariz (~52 % en `white`) |
| **Velocidad** | “Velocidad +379 mm/s” | Badge junto a banda acoplada prensa (convertir a m/min en tooltip) |
| **Datos vivos** | Cajas verdes con PV/setpoint | Mini-badges opcionales (τ, L m) — no duplicar pestaña Parámetros |
| **Estilo** | Gris claro industrial, azul corporativo, verde=dentro tolerancia | Mantener tokens NOVOPAN `#004E38`, amarillo acento, Barlow |

**NO copiar:** menús ProGuide, tablas CBV/HS/PC del footer, orden exacto SLT-CLB-SLB de esa línea, ni flujo derecha→izquierda de esa pantalla si confunde.

---

## Flujo físico que debe leerse en pantalla

### A) Rama upstream (compacta, a la izquierda — 25 % ancho)

Material llega por **caídas** y **una banda inclinada hacia arriba** antes de las esparcidoras:

```
Silos → Dosing bin → Encolador → Banda inclinada ↗ → Divisor fino
                              ↘ (rama gruesa) Dosing → Sprays caída → Encolador gruesa → Inclinada ↗ → Esp.2
```

- Visual: **columna estrecha** o panel colapsable “Encolado / formación”.
- Mantener nodos y IDs existentes (`dosing-fine`, `enc-fine`, `incl-fine`, `esp1-zone`, etc.).
- Flechas ↓ en caídas; inclinada con ángulo ~25–35° (solo dibujo, no cambiar L ni τ).

### B) Línea principal horizontal (hero — 75 % ancho, scroll horizontal)

**Sentido: izquierda → derecha** (como el simulador actual en espíritu, pero **todo en una cinta**).

```
┌──────────┐   ┌─────────────────────────────────────────────────────────────────────────────┐
│ UPSTREAM │   │  LÍNEA DE FORMACIÓN + PRENSA (horizontal)                                    │
│ compacto │   │                                                                               │
└────┬─────┘   │  [Esp.3 SL2]──┐                                                               │
     │         │  [Esp.2 CL ]──┼─► COLCHÓN ─► BLANCA ─► ROJA ─► PRENSA ─► SENSORES ─► salida │
     └────────►│  [Esp.1 SL1]──┘      │         │        │        │         │                  │
               └─────────────────────┴─────────┴────────┴────────┴─────────┴──────────────────┘
```

#### Detalle tramo a tramo (orden en banda, izq → der)

| # | Zona visual | Equipos dibujados sobre la banda | Nodo sim (`data-node-id`) | Notas |
|---|-------------|----------------------------------|---------------------------|-------|
| 1 | **Esparcidoras** | 3 tolvas + rodillos diamante; etiquetas SL2 / CL / SL1 | `esp3-zone`, `esp2-zone`, `esp1-zone` | Punto donde convergen las 3 capas |
| 2 | **Colchón 3 capas** | Manta amarilla/crema ensanchándose | inicio de `white` (12 %) | Merge visual; marcador puede ser triple color |
| 3 | **Sprays formación** | Boquillas SL1 → CL → SL2 sobre banda *(decorativo)* | — | Visual HMI; τ ya está upstream en encoladores/sprays caída |
| 4 | **Báscula central** | Puente báscula | `white` (28 %) | Badge kg/m² |
| 5 | **Pre-prensa** | Nip rollers / compactador ~153 bar | `white` (52 %) | Bloque gris con rodillos |
| 6 | **Sprays anti-pegado** | Segundo set de sprays (desmoldante) | `white` (70 %) | Icono `water_drop` / niebla |
| 7 | **Nariz #1** | Punta articulada que abre/cierra (startup) | `white` (90 %) | Forma triangular/hinge; tooltip “apertura cambio” |
| 8 | **Cambio de banda → roja** | Junta de transferencia | `red` inicio | Color rojo claro `#EF9A9A` |
| 9 | **Sensor metales** | Arco detector | `red` (22 %) | Icono imán/detector |
| 10 | **Dynasteam / vapor** | Caja de vapor sobre banda | `red` (55 %) | Ondas/steam CSS |
| 11 | **Cambio → banda prensa** | Entrada prensa continua | `press` inicio | Banda negra/metálica |
| 12 | **19 marcos prensa** | Prensa CPS: marcos repetidos | `press` (50 %) | Bloque grande negro, círculos = marcos (como HMI) |
| 13 | **Salida + sensores** | Espesor, ultrasonido, peso | `done` | Tramo corto post-prensa; sin nodo extra en motor |

Longitudes visuales proporcionales: blanca **45 m**, roja **10 m**, prensa **16,6 m** (escala `PX_PER_M` ~6 px/m).

---

## Vocabulario visual — cómo deben verse las máquinas

Investigar / estilizar como **schematic industrial** (no foto 3D):

| Equipo | Silueta sugerida | Detalles |
|--------|------------------|----------|
| **Encolador** | Caja con 2–3 ejes horizontales (rodillos) + tuberías resina | Icono `sync` o rodillos; sublabel “Resina + parafina + agua” |
| **Esparcidor** | Tolva trapezoidal + **regula volumen** + **rodillos diamante** + báscula capa | Como tolvas azules Dieffenbacher; badge τ en hover |
| **Banda inclinada** | Cinta azul en rampa 25–35° | Ya existe; mantener color azul `#BBDEFB` |
| **Pre-prensa** | Par de rodillos convergentes (V invertida) | Label “~153 bar”; sombra pesada |
| **Nariz** | Wedge/hinge al final del formador | Pequeña animación CSS opcional `is-opening` (demo arranque) |
| **Dynasteam** | Túnel rojo con vapor (`filter_drama` / SVG wavy) | Label “Vapor” |
| **Prensa Dieffenbacher** | Rectángulo negro largo, **círculos** = marcos abiertos | Altura 2–3× banda; sensación de masa |
| **Sensores salida** | Ruedas espesor + sonda US | Iconos Material Symbols pequeños post-`press` |

Marcador de trazabilidad:
- **Demo pintura:** franja rosa `path-marker--paint` (ya existe).
- **Normal:** tablero madera `path-marker--board`.
- Se mueve **sobre la banda horizontal** (`left` % dentro de `.track-surface`), no vertical.

---

## Arquitectura DOM — reglas para `track-renderer.js`

**SÍ puedes reescribir `build()` y métodos `_spreaderBlock`, `_beltBlock`, etc.** para el layout horizontal, **siempre que:**

1. Cada estación conserve **`data-node-id="<id>"`** exacto del motor.
2. Exista **`.track-surface`** + **`.path-markers`** por nodo (donde aplica marcador).
3. Exista **`.retention-fill`** en nodos con τ (esparcidores, encoladores).
4. Exista **`.node-check`** para ✓ al completar.
5. `this.nodeEls.set(nodeId, el)` sigue registrando los mismos IDs.
6. No romper `update(state)` — posicionamiento del marcador por `progressInNode` y `phase`.
7. Conectores SVG: opcional redibujar en horizontal; si se eliminan, el flujo debe leerse solo con la banda continua.

**Nuevo contenedor sugerido:**

```html
<div class="line-view">
  <aside class="line-view__upstream">…</aside>
  <div class="line-view__main">
    <div class="line-belt line-belt--continuous" data-orientation="horizontal">
      <!-- estaciones con data-node-id -->
    </div>
  </div>
</div>
```

**Nueva pestaña (opcional en `index.html`):**

- Tab **“Línea”** juno a Simulador / Parámetros.
- Mismo canvas `#diagramCanvas` o `#diagramCanvasLine` — si duplicas canvas, `app.js` debe instanciar un renderer o alternar clase; **preferir un solo canvas** y toggle CSS `.view-line` vs `.view-pid` para no tocar motor.

---

## Fases de trabajo (un turno cada una)

| Fase | Entregable |
|------|------------|
| **0** | Wireframe ASCII + mapa node-id → posición en banda |
| **1** | CSS tokens + `.line-view` shell; banda continua horizontal vacía |
| **2** | Esparcidoras + colchón + upstream compacto |
| **3** | Tramo blanco con equipos (báscula, pre-prensa, sprays, nariz) |
| **4** | Tramo rojo (detector + vapor) + prensa + sensores salida |
| **5** | Marcador pintura/madera animado sobre banda horizontal |
| **6** | Stage-rail alineado abajo de la línea; pulido responsive tablet |

Formato salida: **diffs ANTES/DESPUÉS** por archivo, nunca archivo completo.

---

## Prompt copy-paste para Claude Design

```
Eres diseñador UI/UX industrial para NOVOPAN Línea 1 — simulador de trazabilidad de cambios (MDF/aglomerado).

## MISIÓN
Rediseñar el diagrama del simulador de un grid P&ID vertical a una **LÍNEA HORIZONTAL** tipo HMI de planta (referencia: captura Dieffenbacher ProGuide “Vista general estación de formación” — NO copiar layout exacto, solo vocabulario visual: tolvas azules, banda amarilla continua, cajas verdes de datos, prensa con marcos circulares).

El operador debe reconocer en 3 segundos: esparcidoras → colchón → banda blanca → roja con vapor → prensa negra → sensores.

## STACK
- HTML/CSS/JS vanilla, sin React/Tailwind/GSAP/CDNs nuevos.
- Fuentes: Barlow + Material Symbols Rounded (ya cargadas).
- Colores marca: verde #004E38, amarillo acento, banda blanca/roja/negra.

## FLUJO VISUAL (izquierda → derecha)

1. Panel upstream compacto (25 %): silos, dosing, encoladores, caídas ↓, banda inclinada ↗, divisor → alimenta esparcidoras.
2. Línea principal (75 %, scroll horizontal):
   - Tres esparcidoras (Esp.3/SL2 arriba, Esp.2/CL centro, Esp.1/SL1 abajo) vertiendo sobre UNA banda.
   - Colchón 3 capas → banda BLANCA con equipos en orden: báscula → pre-prensa → sprays anti-pegado → nariz #1 (bisagra).
   - Cambio a banda ROJA: sensor metales → Dynasteam vapor.
   - Cambio a banda PRENSA metálica: 19 marcos (círculos como en HMI Dieffenbacher).
   - Post-prensa: sensores espesor/ultrasonido → salida (`done`).

Decorativo sobre banda blanca (sin nodo nuevo): iconos sprays SL1 / CL / SL2 en secuencia antes de nariz — solo lectura visual.

## IDs OBLIGATORIOS (motor de simulación — NO cambiar)
dosing-fine, enc-fine, incl-fine, esp3-zone, esp2-zone, esp1-zone, dosing-thick, sprays-caida, enc-thick, incl-thick, white, red, press, done

Cada estación: `data-node-id`, `.track-surface`, `.path-markers`, `.node-check`; nodos con τ: `.retention-fill`.

## ARCHIVOS
- Principal: `css/trazabilidad.css`, `js/ui/track-renderer.js`, `index.html` (tab opcional “Línea”).
- NO tocar: `process-graph.js`, `trace-engine.js`, `simulation-clock.js`, lógica de `app.js` (solo tab switch si hace falta).

## REFERENCIA ADJUNTA
Imagen Dieffenbacher: tolvas trapezoidales, banda amarilla, detector/báscula como bloques, velocidad en mm/s, estilo gris+azul+verde. Adaptar nomenclatura NOVOPAN: SL1=Esp.1/BOTTOM, CL=Esp.2/CORE, SL2=Esp.3/TOP.

## MARCADOR
- Pintura demo: `.path-marker--paint` (rosa) se desliza sobre banda horizontal.
- Retención: barra `.retention-fill` crece en esparcidores/encoladores.
- Etapa activa: borde amarillo NOVOPAN `.is-active`.

## CRITERIOS
- Todo horizontal desde esparcidoras; upstream es columna lateral, no grid 9 columnas.
- Proporciones banda: 45 m blanca, 10 m roja, 16.6 m prensa (~6 px/m).
- Prensa debe verse pesada (bloque negro alto); esparcidoras como tolvas reales; encoladores como cajas con rodillos.
- Tablet planta: min 11px labels, contraste alto, scroll horizontal suave.
- `prefers-reduced-motion`: sin animaciones agresivas.

## FORMATO SALIDA
Por cada fase que te indique, devuelve SOLO diffs:
[Archivo: css/trazabilidad.css ~línea X]
ANTES: ...
DESPUÉS: ...
PORQUÉ: ...

Empieza por Fase 0: wireframe HTML mínimo de `.line-view` con todos los `data-node-id` posicionados left-to-right en una banda continua, sin estilos finos todavía.
```

---

## Checklist al integrar en Cursor

- [ ] Todos los `data-node-id` presentes y registrados en `nodeEls`
- [ ] `Iniciar` / marcador se mueve en banda **horizontal**
- [ ] Demo pintura: marcador rosa visible
- [ ] ✓ por etapa al completar
- [ ] Click stage-rail salta al nodo
- [ ] Sin errores consola
- [ ] Pestaña Parámetros intacta
- [ ] Deploy Vercel: `bash scripts/build-vercel-public.sh` local OK

---

## Mapeo rápido SL1 / CL / SL2 ↔ simulador

| HMI Metso / planta | Esparcidor sim | Ruta |
|--------------------|----------------|------|
| SL1 (capa fina inferior) | Esparcidor 1 | BOTTOM |
| CL (core) | Esparcidor 2 | CORE |
| SL2 (capa fina superior) | Esparcidor 3 | TOP |

PB1 en audio ≈ SL1 — confirmar en HMI el día de demo.
