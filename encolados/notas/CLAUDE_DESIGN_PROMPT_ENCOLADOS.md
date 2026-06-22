# Claude Design Prompt — Proceso de Encolados (página por etapa)

## Qué construir

Una página web estática (HTML + CSS vanilla, sin frameworks) de **11 páginas/slides** navegables con flechas Anterior / Siguiente.

- **Página 0:** Resumen general (mapa de todas las etapas en una vista)
- **Páginas 1–10:** Una por etapa del proceso

No necesita ser artística. Limpia, legible, útil para una presentación técnica.

---

## Prompt para Claude Design

```
Build a clean, single-file HTML page (no external dependencies) that shows
the "Encolados" particleboard production process at NOVOPAN as a series of
11 slides navigated with Prev / Next buttons.

SLIDE STRUCTURE:
- Each slide fills the full viewport.
- Navigation: fixed bottom bar with "← Anterior" and "Siguiente →" buttons + slide counter (e.g. "3 / 11").
- Colors: white background, dark text (#1a1a1a), accent color #E85D04 (industrial orange) for headers and highlights.
- Font: system sans-serif stack.

------------------------------------------------------------
SLIDE 0 — RESUMEN: Mapa general
------------------------------------------------------------
Title: "Línea de Encolados — Proceso completo"
Show a horizontal numbered flow with all 10 stages + arrows:

1 SILOS → 2 DOSIMBUNCAS → 3 CLASIFICACIÓN → 4 ENCOLADOR →
5 ESPARCIDORES → 6 PREPRENSA → 7 PRENSA → 8 CORTE → 9 ENFRIADORAS → 10 ESTACADO

Below the flow, a 2-column legend:
Left: "Variable maestra: Peso del colchón en báscula central"
Right: "Máster de la línea: Prensa (su velocidad controla todo)"

------------------------------------------------------------
SLIDE 1 — SILOS
------------------------------------------------------------
Title: "1. Silos"
Subtitle: "Almacenamiento de partícula clasificada"

Two-column layout:
LEFT — What's here:
- Partícula fina → capas externas
- Partícula media (biruta) → capa central
- 2 tornillos de descarga por silo

RIGHT — Instrumentación:
- 🔊 Ultrasónico: nivel 0–100% (interpolación lineal)
- 🏴 Paletas on/off: mínimo y máximo de seguridad
- ⚙️ Inductivos: cuentan rotaciones del tornillo

Bottom note (orange): "Polvo hace inviable sensor visual — por eso ultrasónico"

------------------------------------------------------------
SLIDE 2 — DOSIMBUNCAS
------------------------------------------------------------
Title: "2. Dosimbuncas"
Subtitle: "Bunkers dosificadores — 1 por tipo de capa"

Center formula box:
  Descarga (kg/min) = Peso en celda × Velocidad de motor

Three items below:
- 📦 Sensor de volumen: mantiene llenado constante
- ⚖️ Celda de carga: mide kg disponibles
- ⚙️ Encoder / inductivo: cuenta rotaciones del motor

Bottom note: "Nombre en planta: dosimbuncas / dosimil / dosibunker — confirmar tag HMI"

------------------------------------------------------------
SLIDE 3 — CLASIFICACIÓN
------------------------------------------------------------
Title: "3. Clasificación"
Subtitle: "Camas de rodillos moleteados"

Simple visual (ASCII is fine):
  [Rodillo moleteado] [Rodillo moleteado] [Rodillo moleteado]
   ↓ partícula fina pasa      ↓ partícula grande queda

Two lines:
- 2 camas: una para capa externa (fina), una para capa media
- Profundidades de moleteado: 0.3 → 1.3 mm según capa

Bottom note: "Proceso mecánico — sin control PID"

------------------------------------------------------------
SLIDE 4 — ENCOLADOR
------------------------------------------------------------
Title: "4. Encolador"
Subtitle: "Mezcla partícula + resina + parafina"

Two columns:
LEFT:
- 2 líneas paralelas (capa externa / capa media)
- Mezcla: partícula + resina + parafina + agua
- Sistema de enfriamiento por agua (evita que resina reaccione antes de la prensa)

RIGHT — Control PID de bombas:
- SP (rojo): setpoint de flujo L/min
- PV (azul): lectura del flujómetro — debe estar sobre SP
- LMN: salida → velocidad de bomba
- Punto de trabajo sano: 40–50% nominal
- ⚠️ Estado actual: PV oscila, no se estabiliza

------------------------------------------------------------
SLIDE 5 — ESPARCIDORES
------------------------------------------------------------
Title: "5. Esparcidores (Forming Heads)"
Subtitle: "Arman el colchón por capas"

Visual sandwich (centered):
  ▒▒▒▒▒  TOP — Esparcidor 3 — capa externa superior (53% del 30%)
  █████  CORE — Esparcidor 2 — capa media (70%)
  ▒▒▒▒▒  SL1 — Esparcidor 1 — capa externa inferior (43% del 30%)
  ─────  banda formadora

Table below:
| Capa    | Setpoint | Real medido |
| Externa | 30%      | ~33% ⚠️     |
| Core    | 70%      | ~67%        |

Key parameter box (orange border):
  τ (Tau) = Σ esparcidoras − báscula central
  Setpoint: 0  |  Actual: +5 constante ⚠️

Note: "Top ≠ Bottom (53/43) para controlar pandeo del tablero"

------------------------------------------------------------
SLIDE 6 — PREPRENSA
------------------------------------------------------------
Title: "6. Preprensa hidráulica"
Subtitle: "Compacta y expulsa aire antes de la prensa caliente"

Center box:
  Presión: ~153 bar hidráulico

Two items:
- Sube / baja sobre el colchón → compresión suave
- Resultado: colchón uniforme en altura, sin bolsas de aire

Note: "Sin preprensa: el aire se expande con el calor y genera defectos internos"

------------------------------------------------------------
SLIDE 7 — PRENSA PRINCIPAL
------------------------------------------------------------
Title: "7. Prensa caliente continua"
Subtitle: "⭐ Máster de la línea — su velocidad controla todo"

Temperature profile (left to right):
  Entrada → [220°C] → [220°C] → [220°C] → [215°C] → Salida
  Presión:    ALTA  →   ...   →   ...   →   BAJA

Two items:
- Aceite térmico: ~285°C
- Colchón entra grueso → sale al espesor objetivo

Warning box: "⚠️ Sistema de vapor: fuera de servicio (2026-06-22)"

Note: "Prensa determina el ritmo de toda la línea aguas arriba y aguas abajo"

------------------------------------------------------------
SLIDE 8 — CORTE
------------------------------------------------------------
Title: "8. Corte angular en movimiento"
Subtitle: "Sierra corta mientras la banda avanza"

Three items:
- ✂️ Corte diagonal: compensa velocidad → resultado perpendicular
- 📐 Control de diagonales: verifica ortoángulo (tablero cuadrado a 90°)
- 🔊 Medición post-corte: espesor (ultrasónico u óptico) + peso individual

Note: "Calibración periódica de diagonales necesaria para escuadría correcta"

------------------------------------------------------------
SLIDE 9 — ENFRIADORAS ESTRELLA
------------------------------------------------------------
Title: "9. Enfriadoras tipo estrella"
Subtitle: "Enfriamiento uniforme para evitar alabeo"

Three items:
- ⭐ Brazos en estrella: 3 tableros simultáneos
- 🔄 Rotación 180° por ciclo
- 🌡️ Tubos metálicos retiran calor por contacto

Note: "Rotación = ambas caras enfriadas por igual → evita pandeo por desbalance térmico"

------------------------------------------------------------
SLIDE 10 — ESTACADO
------------------------------------------------------------
Title: "10. Estacado"
Subtitle: "Agrupamiento y apilado — fin del área de encolados"

Three items:
- 👁️ Sensores ópticos: cuentan tableros (emisor–receptor)
- 💨 Sistema neumático: ejecuta el apilado
- ⚙️ Encoders en agrupamiento (falla frecuente — se dañan)

Bottom note (orange): "Grupos de 3 tableros. Siguiente área: lijado / calibración."

------------------------------------------------------------
GENERAL NOTES:
- Keep each slide to ~200 words or less of visible text
- No external images or CDN dependencies
- The HTML file must open standalone in any browser
- Navigation must work with keyboard: left/right arrow keys as bonus
- Responsive: must look ok on a 1280x720 laptop screen
```

---

## Fotos para sacar en la próxima visita

Estas van en cada slide para reemplazar texto con imagen:

| Slide | Foto a sacar |
|-------|-------------|
| 1 — Silos | Sensor ultrasónico montado en la parte superior del silo; paleta de nivel visible |
| 2 — Dosimbuncas | Panel o pantalla que muestra los bins activos con kg/min en tiempo real |
| 3 — Clasificación | Vista lateral de los rodillos moleteados (se ven las ranuras) |
| 4 — Encolador | Pantalla PID con SP (rojo) y PV (azul) — captura del problema de oscilación |
| 5 — Esparcidores | Vista desde el lado mostrando los 3 esparcidores en secuencia sobre la banda |
| 5 — Tau | Pantalla donde aparece el valor de tau y el setpoint (buscar en HMI) |
| 6 — Preprensa | Vista del cilindro hidráulico / estructura de la preprensa |
| 7 — Prensa | Vista lateral de la prensa (para ver la escala y longitud) |
| 7 — Pantalla prensa | Pantalla de temperaturas de platos |
| 8 — Corte | Sierra diagonal en movimiento (si es posible con la banda andando) |
| 9 — Enfriadoras | Una estrella completa mostrando los brazos y los tubos metálicos |
| 10 — Estacado | Sensor óptico y el sistema neumático de agrupamiento |

## Observaciones útiles para la próxima visita

- ¿En qué pantalla aparece el valor de tau? (buscar en HMI de esparcidores)
- ¿Los dosimbuncas tienen nombre en pantalla o solo número?
- ¿La prensa tiene alguna placa de marca visible (Siempelkamp / Dieffenbacher)?
- ¿Cuántos silos hay por calidad de partícula (fina / media)?
- ¿La velocidad de línea en m/min se muestra en algún panel central?
