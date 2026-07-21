# Mediciones del plano · fuente de verdad

**Fuente:** `PlanoGeneral2022.dwg` (AutoCAD 2018, USB de planta).
**Método:** bloque `000-Refernce-Point` = sistema de estaciones del fabricante (Dieffenbacher).
Calibración `station(m) = −1.5346 − worldX`, residual máx **0.2 mm sobre 130 m** (11 etiquetas).
Una sola ancla al eje del simulador: **CL Press Outfeed Drum = fin prensa 71.60 m** → `sim = station + 48.010`.

**Regla:** estos valores son del plano del fabricante. En el simulador viven detrás del
candado de parámetros (dropdown «Mediciones del plano»); editarlos exige la clave y debe
mostrar la alerta *«Este valor proviene de los planos Dieffenbacher — verifica antes de cambiarlo»*.

**Excluido del wiring:** post-prensa (rodillos → sensores) hasta re-medir en campo.
CORRECCIÓN 21-jul: la máquina de refila del plano EMPIEZA en sim 78.3–78.8 — **confirma**
el 78.30 medido en campo en julio; el `CL Edge Trim Saw` 85.57 es el eje de la cuchilla,
no el inicio (la "discrepancia +7.3 m" reportada antes era una comparación equivocada).

Datos machine-readable: [`mediciones-plano.json`](mediciones-plano.json).

## 1 · Eje de la línea (sim m, 0 = inicio del colchón)

| Punto (CL = eje marcado del fabricante) | sim m |
|---|---|
| CL Infeed / Forming Station | 7.02 |
| CL Matscale (báscula de manta) | 26.20 |
| CL Pre-Press (cabezal salida pre-prensa) | 33.81 |
| CL Reject Hopper (nariz / rechazo) | 44.64 |
| CL Press Infeed Drum (tambor entrada) | 52.67 |
| CL Press Outfeed Drum (tambor salida) — ANCLA | 71.60 |

Distancias entre ejes (verificables con flexómetro):
Infeed→Matscale **19.171** · Matscale→Pre-Press **7.611** · Pre-Press→Nariz **10.830** ·
Nariz→Tambor entrada **8.036** · Tambor→Tambor **18.927** · Infeed→Tambor salida **64.575**.

## 2 · Prensa y banda roja

| Medida | m |
|---|---|
| Banda roja (nariz de banda blanca → tambor entrada) | 7.67 |
| Tambor a tambor | 18.93 |
| Tambor entrada → marco 1 | 2.43 |
| Marco 1 en absolutos | 55.10 |
| Zona de marcos (19: 6×0.75 + 12×0.90) | 16.60 (campo, consistente) |

## 3 · Huellas de equipos

| Equipo | inicio | fin | largo |
|---|---|---|---|
| Diffensor | 18.43 | 20.88 | 2.45 |
| Unidad de medición (Messeinheit) | 27.48 | 28.16 | 0.68 |
| Pre-prensa (capa Vorpresse; incluye transferencia) | 29.21 | 45.87 | 16.67 |
| Banda de transferencia (Übergabeband) | 40.39 | 48.02 | 7.62 |
| Tornillo de rechazo 35.540 (transversal) | 39.58 | — | — |

## 4 · Bandas de alimentación (confirmado en planta 21-jul: fina = derecha → E1+E3; gruesa = izquierda → E2)

**FINA (item 31.170, carril a 7.3 m del eje):**

| Tramo | m | fuente |
|---|---|---|
| Inclinada — proyección horizontal | 38.35 | plano |
| Banda distribución SL2 (poleas 30hp: sim 5.50 → 21.92) | 16.42 | plano |
| Brazo oscilatorio E1/E3 | 6.0 | campo 21-jul (el diagonal dibujado 8.35–8.93 incluye el puente) |
| **Total hasta brazo E3 (SL2)** | **64.57** | campo 25-jun (manda). Suma plano 38.35+16.42+6 = 60.77 → ~3.8 m en subida/transferencias, pendiente altura |
| **Total hasta brazo E1 (SL1, sin distribución)** | **48.15** | derivada: 64.57 − 16.42 |

**GRUESA (item 31.270, sobre el eje):**

| Tramo | m | fuente |
|---|---|---|
| Inclinada — proyección horizontal | 38.35 | plano |
| Flap-CL (posición) | sim −1.0 | plano |
| TKK24 (cruce carril↔eje) | 2.05 | plano |
| Banda flap → E2 (dibujada parcial 8.54–16.70) | ≈23.2 | derivada: 68.5 − 39.3 − 6 — **verificar** |
| Brazo oscilatorio E2 | 6.0 | campo 21-jul (todos los brazos iguales) |
| **Total hasta brazo E2 (CL)** | **68.5** | campo 25-jun (manda) |

## 5 · Formers (SIN georreferencia — bloque huérfano, cautela)

Longitudes dibujadas: S_1 9.09 · CC_1 8.29 · S_2 9.25 m; pitch inicio-a-inicio 8.72 / 7.75 m.
Los valores de CAMPO de las zonas (6.94 / 4.38 / 6.39) siguen mandando hasta aclarar
si el bloque corresponde a lo instalado.

## 6 · Banda blanca — el plano CONFIRMA el campo (no se cambia)

Deltas plano−modelo: SL1 +0.39 · imán −0.48 · pre-prensa inicio +0.15 / fin +0.06 · nariz −0.26 m.

## 7 · Post-prensa (sierras ya cerradas; rodillos/sensores pendientes)

| Punto | Valor | Fuente |
|---|---|---|
| Grupo de sierras: cuerpo | sim 78.3 – 85.6 | plano — inicio 78.3 = campo julio (refila) |
| **Sierras transversales (eje)** | **85.57** | plano (`CL Edge Trim Saw`) + operador 21-jul |
| Sensores de calidad (Sensor 1) | ≈ 88.00 | campo/HMI — después de las sierras ✓ |
| Maquinaria sim 99–105 (entre dos máquinas idénticas 91.5–100.3 / 107.4–115) | transferencia/enfriadores | plano |
| Otra sierra («saw blade under the line», zona apilado) | ≈ 125.2 | plano |

Cierre del 32 m del operador: 85.57 − 32 = 53.6 = «un poco después del primer tambor»
(tambor de entrada 52.67). Plano, operador y campo de julio coinciden.
La máquina 78.3–85.6 es el grupo completo: refila al inicio, transversales al final.
Pendiente de re-medir: rodillos hacia los sensores y posición exacta de sensores 1-2-3.

## 8 · VALIDACIÓN — Prueba de papel (21-jul-2026, 09:41–09:47 Quito, v = 14.77 m/min)

Papel colocado sobre el colchón en el hueco SL1→CL y fotografiado en cada etapa
(22 fotos con hora EXIF). Con UNA sola ancla (nariz 45.0 m = 14:43:47) la posición
de colocación ajusta a **8.32 m** — exactamente el inicio del hueco SL1→CL (8.36). 

| Etapa | m | Predicho | Foto | Δ |
|---|---|---|---|---|
| Imán ERIEZ | 26.68 | 14:42:32 | 14:42:30 | −2.6 s |
| Entrada pre-prensa | 29.06 | 14:42:42 | 14:42:40 | −2.2 s |
| Salida pre-prensa | 33.75 | 14:43:01 | 14:43:00 | −1.3 s |
| Sprays/desmoldante | 35.99 | 14:43:10 | 14:43:10 | −0.4 s |
| Detector CASSEL | 37.69 | 14:43:17 | 14:43:16 | −1.3 s |
| Cortadores de filo | 39.56 | 14:43:24 | 14:43:24 | −0.9 s |
| Nariz → banda roja | 45.00 | ancla | 14:43:47 | 0 |
| Vapor (banda roja) | 46.86 | 14:43:54 | 14:43:55 | +0.4 s |
| Marco 1 prensa | 55.10 | 14:44:28 | 14:44:29 | +1.0 s |
| Fin prensa (tambor salida) | 71.60 | 14:45:35 | 14:45:37 | +1.9 s |
| Sierras transversales | 85.57 | 14:46:31 | ~14:46:22 (ya cortado 14:46:25) | ≈ −7 s |
| Sensores (SI-PZ1060 / EQUIPO 1) | ≈88.0 | 14:46:41 | 14:46:37–48 | ±6 s |

Tránsito marco 1 → fin prensa: 68 s (fotos) vs 67.0 s (modelo).
Total colocación → sensores: 319 s vs 323.7 s (−1.5 %).

**Conclusión:** banda blanca, corrección de prensa (52.67/55.10/71.60), sierras
transversales (85.57) y sensores (~88) quedan VALIDADOS con residuales ≤ ±7 s
(≤ ±1.7 m) en un recorrido de 80 m. La prueba NO cubre las bandas de alimentación
(el papel se colocó ya sobre el colchón) — esas siguen con sus pendientes.
