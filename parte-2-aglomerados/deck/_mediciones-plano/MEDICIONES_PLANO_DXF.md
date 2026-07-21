# Mediciones del plano · fuente de verdad

**Fuente:** `PlanoGeneral2022.dwg` (AutoCAD 2018, USB de planta).
**Método:** bloque `000-Refernce-Point` = sistema de estaciones del fabricante (Dieffenbacher).
Calibración `station(m) = −1.5346 − worldX`, residual máx **0.2 mm sobre 130 m** (11 etiquetas).
Una sola ancla al eje del simulador: **CL Press Outfeed Drum = fin prensa 71.60 m** → `sim = station + 48.010`.

**Regla:** estos valores son del plano del fabricante. En el simulador viven detrás del
candado de parámetros (dropdown «Mediciones del plano»); editarlos exige la clave y debe
mostrar la alerta *«Este valor proviene de los planos Dieffenbacher — verifica antes de cambiarlo»*.

**Excluido:** post-prensa (rodillos → sensores). El plano pone la sierra de refila en
sim 85.57 vs 78.30 del modelo (+7.3 m) — **re-medir en campo** antes de adoptar nada.

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
| Inclinada — longitud real (subida ≈ 8.2 m) | 39.22 | derivada (64.57 − 16.42 − 8.93) |
| Banda distribución SL2 (poleas 30hp: sim 5.50 → 21.92) | 16.42 | plano |
| Brazo oscilatorio E1/E3 | 8.93 | plano (dibujado 8.35–8.93) |
| **Total hasta brazo E3 (SL2)** | **64.57** | = campo 25-jun ✓ |
| **Total hasta brazo E1 (SL1, sin distribución)** | **48.15** | derivada |

**GRUESA (item 31.270, sobre el eje):**

| Tramo | m | fuente |
|---|---|---|
| Inclinada — proyección horizontal | 38.35 | plano |
| Flap-CL (posición) | sim −1.0 | plano |
| TKK24 (cruce carril↔eje) | 2.05 | plano |
| Banda flap → E2 (descarga sim 16.7) | 17.7 | plano parcial |
| Brazo oscilatorio E2 | 11.6 | **derivada — verificar** |
| **Total hasta brazo E2 (CL)** | **68.5** | = campo 25-jun ✓ |

## 5 · Formers (SIN georreferencia — bloque huérfano, cautela)

Longitudes dibujadas: S_1 9.09 · CC_1 8.29 · S_2 9.25 m; pitch inicio-a-inicio 8.72 / 7.75 m.
Los valores de CAMPO de las zonas (6.94 / 4.38 / 6.39) siguen mandando hasta aclarar
si el bloque corresponde a lo instalado.

## 6 · Banda blanca — el plano CONFIRMA el campo (no se cambia)

Deltas plano−modelo: SL1 +0.39 · imán −0.48 · pre-prensa inicio +0.15 / fin +0.06 · nariz −0.26 m.
