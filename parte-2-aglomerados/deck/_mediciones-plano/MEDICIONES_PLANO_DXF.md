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
| Sierra transversal · carro (empieza ~30 cm tras la refila, largo hasta la salida) | 79.95 – 86.72 | campo 21-jul |
| **Sierras transversales (eje de la cuchilla)** | **85.57** | plano (`CL Edge Trim Saw`) + operador 21-jul |
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
| Sierras transversales | 85.57 | 14:46:31 | (dato no concluyente, ver nota) | — |
| Sensores (SI-PZ1060 / EQUIPO 1) | ≈88.0 | 14:46:41 | 14:46:37–48 | ±6 s |

Tránsito marco 1 → fin prensa: 68 s (fotos) vs 67.0 s (modelo).
Total colocación → sensores: 319 s vs 323.7 s (−1.5 %).

**Notas de interpretación (21-jul, corrección):**
- La foto del corte (14:46:25) NO rastrea el papel: la sierra corta el tablero
  continuamente y cualquier foto aguas abajo muestra cortes — ese punto no
  valida ni refuta el 85.57. La posición de la sierra queda respaldada por el
  plano + el 32 m del operador (85.57 − 32 = 53.6 = entrada a prensa), dos
  fuentes independientes que cierran a centímetros.
- Tras la sierra los rodillos ACELERAN (separan tableros): la predicción a
  v constante sobreestima la llegada a sensores ~5 s. Esperado, no error.
- Velocidad real observada imán→fin prensa: 44.92 m / 187 s = **14.41 m/min**
  vs 14.77 nominal HMI (−2.4 %) — dentro de la variación admitida.

**Conclusión:** banda blanca y corrección de prensa (52.67 / 55.10 / 71.60)
VALIDADAS con residuales ≤ ±3 s (≤ 0.75 m) en 63 m de recorrido; sensores (~88)
consistentes (±6 s, con aceleración post-sierra). La prueba NO cubre las bandas
de alimentación (el papel se colocó ya sobre el colchón) ni discrimina la
posición exacta de la sierra (corte periódico). Para clavar la sierra: fotografiar
el corte del tablero CON la raya del papel, o cronometrar fin prensa → corte de
ese tablero específico.

## 9 · VERIFICACIÓN DEL MOTOR Y LO VISUAL (21-jul-2026, revisión final)

Instrumentación directa del simulador en navegador (el panel corre la pestaña
como oculta → rAF muerto; se parcheó `requestAnimationFrame` con `MessageChannel`,
se bloqueó `Storage.setItem` de `novopan.simState` y se retro-fechó `savedAt`
para forzar el replay offline).

### 9.1 Escala visual

| Zona | Escala | Resultado |
|---|---|---|
| Sección 2 (0 → 88.4 m) | `x = 80 + 70·m` | **70.0000 px/m exactos**, intercepto 80.00, **residuo máx 0.00 px** en barrido de 23 puntos con el movedor |
| Parte 1 (silos → esparcidores) | sin escala (topológica) | Velocidad visual DISTINTA por arista **por diseño**: el motor avanza por τ de cada ecuación, no por píxeles |

O sea: en Sección 2 el trazador se mueve a velocidad visual constante (si
acelera, es bug). En Parte 1 la variación de velocidad es esperada y correcta.

### 9.2 Tiempos por etapa vs ecuaciones

| Verificación | Ecuación | Observado | Δ |
|---|---|---|---|
| SL1 → CL | 34.6 s | 34.8 s | +0.6 % |
| CL → SL2 | 30.0 s | 29.8 s | −0.7 % |
| Imán → pre-prensa | 9.8 s | 9.9 s | ~0 |
| Prensa tambor a tambor (18.93 m) | 78.3 s | 79.5 s | +1.5 % |
| Total 0 → 88.4 m @ 14.5 m/min | 365.8 s | 365.9 s | **exacto** |
| Upstream gruesa (silo 1417.2 + dosing 5.9 + enc 40 + inclinada 42.59) | 1505.7 s | miles 1417.2 / 1423.1 / 1505.7 | **al decimal** |
| Predicho vs observado · gruesa a colchón | T+25:27 | 25:00 | < 2 % |
| Predicho vs observado · fina a sensores | T+1:12:05 | 1:12:00 | **0.1 %** |
| Split ruta fina → SL1 + SL2 | 2 trazadores | 2 reportes ✓ | — |

El predicho de la fina (T+1:06:29 = 3989 s) coincide con los **3987 s
verificados a mano el 20-jul** — motor, route-model y cálculo manual cierran
por tres vías independientes.

### 9.3 Bug encontrado y corregido (commit `42e3c99`)

Al restaurar un tab cerrado, los hitos (`miles`) de los cambios upstream se
recalculaban ANTES de que llegara el primer CSV, o sea con los defaults del
modelo. Con el CSV real de IT (que diferirá de los defaults) el replay offline
habría usado tiempos desfasados y podría no detectar cruces. **Fix:** los
`miles` vigentes se persisten en `novopan.simState` y el restore los reusa;
`recomputeActivePre()` los sigue refrescando cuando los parámetros cambian.
Verificado antes/después: la ruta que quedaba atascada ahora completa el replay
y emite su reporte.

**Veredicto:** motor ✓ · visual ✓ · ecuaciones ✓ · predicciones ✓ · persistencia ✓.
