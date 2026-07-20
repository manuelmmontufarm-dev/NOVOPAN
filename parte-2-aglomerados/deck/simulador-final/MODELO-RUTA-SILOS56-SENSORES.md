# Modelo de ingeniería — Ruta Silos 5/6 → Sensores 1/2/3

> **Ámbito:** `parte-2-aglomerados/deck/trazabilidad-total/`
> **Módulo:** [`js/route-model.js`](js/route-model.js) · **Pruebas:** [`js/route-model.test.js`](js/route-model.test.js) + [`tests.html`](tests.html)
> **Fecha:** 13-jul-2026 · **Fuente de datos:** `datos/hmi.csv` (HMI Metso/Dieffenbacher)
> **No modifica** el motor de la Sección 1 (`../trazabilidad/js/core/*`), que queda intacto.

Este documento fija el modelo **único y confiable** para la ruta acotada:

```
Silos 5/6 → Dosing → Encoladoras (mixers) → Bandas inclinadas
  → Esparcidoras SL1/CL/SL2 → Registro de capas → Transporte a prensa
  → Sensores de calidad 1/2/3
```

---

## 1 · Ecuaciones finales

Todas las magnitudes de tiempo se expresan en **segundos**. Los flujos se
normalizan a **kg/min** antes de entrar en las ecuaciones.

| # | Etapa | Ecuación | Unidad resultado |
|---|-------|----------|------------------|
| 1 | Residencia en silo | `τ_silo = ρ · V · (L/100) / F · 60` | s |
| 2 | Residencia en dosing | `τ_dosing = M / F · 60` | s |
| 3 | Residencia en encoladora (mixer) | `τ_mixer = 40` (FIJO) | s |
| 4 | Transporte banda inclinada | `t_incline = L / v · 60` | s |
| 5 | Residencia en esparcidora | `τ_esp = 40` (ESTIMADO · por validar) | s |
| 6 | Llegada capa fina inferior | `t_SL1 = ruta_fina + τ_esp1` | s |
| 7 | Llegada capa core | `t_CL = ruta_gruesa + τ_esp2` | s |
| 8 | Llegada capa fina superior | `t_SL2 = ruta_fina + τ_esp3` | s |
| 9 | Registro completo del colchón | `t_registro = max(t_SL1, t_CL, t_SL2)` | s |
| 10 | Llegada a un sensor | `t_sensor = t_registro + d / v_prensa · 60` | s |

donde:

- **ruta_fina** `= τ_silo6 + τ_dosingSL + τ_mixerCE + t_inclSL` (Silo 6 → capas SL)
- **ruta_gruesa** `= τ_silo5 + τ_dosingCL + τ_mixerCI + t_inclCL` (Silo 5 → core CL)
- `ρ` densidad [kg/m³], `V` capacidad [m³], `L` nivel [%], `F` flujo de salida [kg/min],
  `M` masa retenida [kg], `d` distancia del sensor al registro [m], `v_prensa` [m/min].

**Convención de registro (merge).** El colchón sólo existe cuando llega la
**última** capa; por eso el registro es el **máximo** (la ruta más lenta), no el
promedio ni el mínimo. Con los datos actuales, la ruta fina (Silo 6) domina.

**Punto de referencia del registro.** `d` se mide desde el arranque del colchón
(banda blanca, m = 0). La estación de sensores está a 85.15 m (medición
flexómetro jul-2026).

---

## 2 · Validación de conversiones de unidades

El módulo (`convert.*`, `flowToKgMin`) valida explícitamente:

| Conversión | Función | Nota |
|------------|---------|------|
| kg/h → kg/min | `convert.kghToKgmin` (÷60) | Silos 1/2/3 vienen en kg/h; Silos 5/6 en **kg/min**. |
| % → fracción | `convert.pctToFraction` (÷100) | El nivel `L` se convierte antes de multiplicar. |
| min → s / s → min | `convert.minToSec` · `secToMin` | El factor `×60` de cada ecuación convierte min→s. |
| m/min | (directo) | `L[m] / v[m/min] × 60 = s`. |

> **Trampa de unidades documentada.** El `×60` de `τ_silo` sólo da **segundos**
> si `F` está en **kg/min**. Con `F` en kg/h daría minutos. Por eso `flowToKgMin`
> normaliza según la unidad declarada del parámetro y **rechaza** unidades
> desconocidas devolviendo `NaN` (nunca 0). Silos 5 y 6 están en kg/min → el `×60`
> es correcto y el resultado sale en segundos.

---

## 3 · Guardas — nunca se sustituye en silencio

`readParam()` y las ecuaciones devuelven un **estado explícito** en vez de un 0
inventado:

| Estado | Cuándo | Se muestra como |
|--------|--------|-----------------|
| `ok` | valor válido, fuente confiable | valor |
| `estimated` | calculado sobre una entrada estimada (p. ej. V de silo sin confirmar; τ_esp) | **Valor estimado** |
| `not-calibrated` | posición/entrada sin medir (Sensor 2/3) | **Sin calibrar** |
| `missing` | parámetro vacío/ausente | **Falta parámetro** |
| `invalid` | negativo, NaN, ∞, cero no permitido, fuera de rango | **Entrada inválida** |
| `unavailable` | una dependencia falla | **Cálculo no disponible** |

Protecciones incluidas: **flujo cero**, **velocidad cero** (evita ÷0 e ∞),
**negativos**, **faltantes**, **NaN/Infinity**, **fuera de rango** (p. ej. nivel
> 100 %). Un fallo en la ruta fina **no** contamina la ruta gruesa: cada rama
reporta su propio estado, y `computeRoute` nunca produce un número no finito.

---

## 4 · Arquitectura de parámetros

Única fuente de verdad: `ROUTE_PARAMS` en `route-model.js`. Cada parámetro
declara: **key · label · equipment · layer · value · unit · source · min · max ·
editable · description**. Valores por defecto = `datos/hmi.csv`.

| key | equipo | capa | valor | unidad | fuente | editable |
|-----|--------|------|-------|--------|--------|----------|
| `silo5.rho` | Silo 5 | gruesa (CL) | 135 | kg/m³ | hmi | sí |
| `silo5.capacity` | Silo 5 | gruesa | 120 | m³ | **estimated** | sí |
| `silo5.level` | Silo 5 | gruesa | 44 | % | hmi | sí |
| `silo5.flow` | Silo 5 | gruesa | 302 | kg/min | hmi | sí |
| `silo6.rho` | Silo 6 | fina (SL) | 188 | kg/m³ | hmi | sí |
| `silo6.capacity` | Silo 6 | fina | 120 | m³ | **estimated** | sí |
| `silo6.level` | Silo 6 | fina | 31 | % | hmi | sí |
| `silo6.flow` | Silo 6 | fina | 108 | kg/min | hmi | sí |
| `dosingCL.mass` | Dosing gruesa | gruesa | 25 | kg | hmi | sí |
| `dosingCL.flow` | Dosing gruesa | gruesa | 302 | kg/min | hmi | sí |
| `dosingSL.mass` | Dosing fina | fina | 20 | kg | hmi | sí |
| `dosingSL.flow` | Dosing fina | fina | 108 | kg/min | hmi | sí |
| `mixerCE.tau` | Encolador fino (CE) | fina | 40 | s | **fixed** | **no** |
| `mixerCI.tau` | Encolador grueso (CI) | gruesa | 40 | s | **fixed** | **no** |
| `inclSL.length` | Inclinada fina | fina | 64.57 | m | measured | sí |
| `inclSL.speed` | Inclinada fina | fina | 99.5 | m/min | measured | sí |
| `inclCL.length` | Inclinada gruesa | gruesa | 68.5 | m | measured | sí |
| `inclCL.speed` | Inclinada gruesa | gruesa | 96.5 | m/min | measured | sí |
| `spreader1.tau` | Esparcidor 1 | SL1 | 40 | s | **estimated** | sí |
| `spreader2.tau` | Esparcidor 2 | CL | 40 | s | **estimated** | sí |
| `spreader3.tau` | Esparcidor 3 | SL2 | 40 | s | **estimated** | sí |
| `line.speed` | Prensa | común | 14.5 | m/min | hmi | sí |
| `sensor1.distance` | Sensores | común | 85.15 | m | measured | sí |
| `sensor2.distance` | Sensores | común | 85.35 | m | **not-calibrated** | sí |
| `sensor3.distance` | Sensores | común | 85.55 | m | **not-calibrated** | sí |

Las encoladoras (`mixerCE`/`mixerCI`) tienen `min = max = 40`: forzar otro valor
devuelve `invalid` — el modelo **garantiza** que la retención del mixer se
mantiene en 40 s.

---

## 5 · Ejemplos calculados a mano (v_prensa = 14.5 m/min)

Con los valores por defecto del HMI CSV:

```
τ_silo5   = 135 · 120 · 0.44 / 302 · 60 = 7128 / 302 · 60 = 1416.16 s (23.60 min)
τ_silo6   = 188 · 120 · 0.31 / 108 · 60 = 6993.6 / 108 · 60 = 3885.33 s (64.76 min)
τ_dosingCL= 25 / 302 · 60  = 4.97 s
τ_dosingSL= 20 / 108 · 60  = 11.11 s
τ_mixer   = 40.00 s   (CE y CI)
t_inclSL  = 64.57 / 99.5 · 60 = 38.94 s
t_inclCL  = 68.5 / 96.5 · 60  = 42.59 s

ruta_fina   = 3885.33 + 11.11 + 40 + 38.94 = 3975.38 s
ruta_gruesa = 1416.16 + 4.97 + 40 + 42.59  = 1503.72 s

t_SL1 = 3975.38 + 40 = 4015.38 s
t_CL  = 1503.72 + 40 = 1543.72 s
t_SL2 = 3975.38 + 40 = 4015.38 s

t_registro = max(4015.38, 1543.72, 4015.38) = 4015.38 s (66.92 min)   ← lo fija SL1/SL2 (ruta fina)

t_sensor1 = 4015.38 + 85.15 / 14.5 · 60 = 4015.38 + 352.34 = 4367.73 s (72.80 min)
t_sensor2 = 4015.38 + 85.35 / 14.5 · 60 = 4015.38 + 353.17 = 4368.55 s (72.81 min)
t_sensor3 = 4015.38 + 85.55 / 14.5 · 60 = 4015.38 + 354.00 = 4369.38 s (72.82 min)
```

**Otras velocidades (sólo cambia el tramo colchón→sensor; el registro NO):**

| v_prensa | t_sensor1 | Δ tramo colchón→S1 |
|----------|-----------|--------------------|
| 7 m/min | 4745.24 s | 729.86 s |
| 14.5 m/min | 4367.73 s | 352.34 s |
| 16.85 m/min | 4318.55 s | 303.17 s |
| 23 m/min | 4237.51 s | 222.13 s |

Estos números coinciden **exactamente** con el modelo automatizado (ver
`tests.html`, tabla «Cálculo automático vs cálculo a mano», Δ = 0).

---

## 6 · Valores estimados / por confirmar (TBD)

| Parámetro | Estado | Qué falta |
|-----------|--------|-----------|
| `silo5.capacity`, `silo6.capacity` (V = 120 m³) | **estimado** | Volumen real de silos 5 y 6 «pendiente de confirmar» en planta. Afecta directamente a `τ_silo`. |
| `spreader1/2/3.tau` (40 s) | **estimado** | Residencia real de las esparcidoras (entra por arriba → cae al colchón). Cronometrar en planta para validar. |
| `sensor2.distance`, `sensor3.distance` | **sin calibrar** | Separación entre sensores 1-2-3 asumida ≈ 0.20 m (nominal). Medir la posición exacta de cada sensor. |

Mientras estos valores no se midan, el modelo los **marca** (Valor estimado /
Sin calibrar) y propaga el flag aguas abajo — nunca los presenta como confirmados.

**Diferencia consciente con el motor visual (Sección 1).** El grafo
`process-graph.js` modela un paso extra de *sprays a presión (caída ≈ 5 s)* en la
ruta gruesa entre dosing y encolador, y trata la residencia de esparcidoras como
`τ = M_hopper / F`. Este modelo acotado sigue la **ruta y las ecuaciones de la
tarea** (Dosing → Mixer → Inclinada; esparcidora = 40 s fijo estimado), y no
reescribe el motor de la Sección 1. Si se desea incluir los sprays de caída,
añádase un parámetro `sprayCL.tau` y súmese a `coarse_upstream`.

---

## 7 · Cómo correr las pruebas

```bash
# Node (49 pruebas):
node parte-2-aglomerados/deck/trazabilidad-total/js/route-model.test.js

# Navegador (dashboard con predicción + comparación a mano):
#   servir deck/ y abrir /trazabilidad-total/tests.html
```

Cobertura: encoladoras = 40 s · ruta fina · ruta gruesa · registro SL1/CL/SL2 ·
cada sensor · distintas velocidades · parámetro faltante · conversión de
unidades · cero/negativo/NaN/Infinity. **49/49 OK.**

## 8 · Integración con la app

`combined-app.js` importa `computeRoute` y, en modo **read-only**, calcula las
predicciones desde los parámetros HMI en vivo (puente `P1_TO_MODEL`), las expone
en `window.__NOVOPAN_ROUTE_MODEL__` y las registra en consola. No altera la
simulación visual: la app «usa» exactamente las mismas ecuaciones que este
documento y las pruebas.
