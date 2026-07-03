# Tiempo de residencia · L1 Sección 2 — ecuaciones y medidas (fuente de verdad)

> **MODELO v3 (2026-07) — feedback del jefe.** La referencia final es **los sensores** del
> final de la línea (después de la cortadora). El merge se modela como una **lógica de
> registro** (último cambio en llegar al esparcidor), y desde ahí se mide **desde el punto
> de SL1** hasta los sensores. Este archivo es la fuente de verdad de las ecuaciones y
> medidas; el deck `presentacion-residencia-seccion2.pptx` ya refleja esto.

---

## 1. Supuestos

- Cada etapa es **recipiente** (Little: `τ = M/F`), **banda** (`t = L/v`) o **prueba**.
- Flujo `F` se conserva a lo largo de la línea (estado estable).
- Sprays: **eliminados** del modelo.
- Encolador: **sin ecuación**, se mide por prueba de trazador.
- Referencia final = **sensores** (después de la cortadora). Enfriadoras + estacado quedan
  **fuera** de la medición (después de los sensores).

## 2. Little's Law

```latex
M\,[\mathrm{kg}] \;=\; F\,[\mathrm{kg/min}]\;\times\;\tau\,[\mathrm{min}]
\qquad\Longrightarrow\qquad
\tau\,[\mathrm{s}] \;=\; \frac{M}{F}\times 60
```

## 3. Ecuaciones por etapa (unidades pegadas a cada variable)

### Silos 5 (gruesa) · 6 (fina) — `HMI` + `Test`
```latex
M\,[\mathrm{kg}] \;=\; \rho\,[\mathrm{kg/m^3}]\;\cdot\;V_{cap}\,[\mathrm{m^3}]\;\cdot\;L_{\%}\,[-]
\qquad
\tau_{silo}\,[\mathrm{s}] \;=\; \frac{M\,[\mathrm{kg}]}{F_{out}\,[\mathrm{kg/min}]}\times 60
```
Usar caudal de **descarga (salida)**. `ρ, V_cap, L%, F_out` — **TBD**.

### Dosing bin (gruesa · fina) — `HMI`
```latex
\tau_{dos}\,[\mathrm{s}] \;=\; \frac{M\,[\mathrm{kg}]}{F\,[\mathrm{kg/min}]}\times 60
```

### Encolador (CE fina · CI gruesa) — `Test`
```latex
t_{enc}\,[\mathrm{s}] \quad\text{— prueba de trazador}
```
HMI da DESCARGA por corriente (CE ≈ 111 kg/min · CI ≈ 282 kg/min); la residencia se mide por prueba.

### Banda inclinada azul (fina · gruesa) — `Medido`
```latex
t_{incl}\,[\mathrm{s}] \;=\; \frac{L\,[\mathrm{m}]}{v_{banda}\,[\mathrm{m/min}]}\times 60
```
- fina: `64.57 / 99.5 × 60 = 38.9 s` · gruesa: `68.5 / 96.5 × 60 = 42.6 s` (velocidad fija HMI)

### Esparcidor (e1 · e2 · e3) — `HMI` + `Medido`
```latex
\tau_{esp}\,[\mathrm{s}] \;=\; \frac{M\,[\mathrm{kg}]}{F\,[\mathrm{kg/min}]}\times 60
```

## 4. Registro del cambio (LÓGICA del merge — v3)

Las tres capas llegan a sus esparcidores con hasta **~2 s de diferencia** (probable). El
cambio se considera **completo** cuando llega la **última** capa — no basta detectarlo en la
CL (media): la SL1 puede **no haberse unido aún**.

Tiempo "antes" de cada capa (silo → su esparcidor):
```latex
T_{antes,e}=\tau_{silo}+\tau_{dos}+t_{enc}+t_{incl}+\tau_{esp,e}
```
Se **registra el último en llegar** (max sobre las tres capas):
```latex
t_{reg}\,[\mathrm{s}] \;=\; \max\!\big(T_{antes,SL1},\,T_{antes,CL},\,T_{antes,SL2}\big)
```
- `e ∈ {SL1, CL, SL2}`. Ruta antes: SL1/SL2 = **fina** (comparten silo/dosing/enc/incl,
  difieren solo en el esparcidor), CL = **gruesa**.

## 5. Del registro a los sensores

Desde el registro se mide **desde el punto de caída de SL1** (1.42 m, la más atrás) hasta
los **sensores**:

| Tramo | Largo |
|-------|-------|
| Resto banda blanca (1.42 → 45 m) | 43.58 m |
| Banda roja | 10.0 m |
| Prensa metálica (19 marcos) | 16.6 m |
| Corte → sensores | 13.55 m |
| **Total SL1 → sensores** | **83.73 m** |

```latex
t_{SL1\rightarrow sens}\,[\mathrm{s}] \;=\; \frac{83.73\,[\mathrm{m}]}{v_{prensa}\,[\mathrm{m/min}]}\times 60
```
- **346.5 s** @ 14.5 m/min · **452.1 s** @ 11.11 m/min.

### Detalle post-prensa (medido, dentro de los 13.55 m)
| Tramo (desde salida de prensa) | Largo |
|---|---|
| Salida prensa → cuchillas de filo | 6.7 m |
| Cuchillas de filo | 1.35 m |
| gap | 0.7 m |
| Cortadora | 2.3 m |
| gap → sensores | 2.5 m |
| **Total → sensores** | **13.55 m** |

## 6. Ecuación maestra (v3)

```latex
t_{tot}\,[\mathrm{s}] \;=\; \max_e\!\left(T_{antes,e}\right) \;+\; \frac{83.73\,[\mathrm{m}]}{v_{prensa}\,[\mathrm{m/min}]}\times 60
```
- `e ∈ {SL1, CL, SL2}` · `83.73 = 43.58 + 10 + 16.6 + 13.55`.
- Referencia final = sensores. Enfriadoras + estacado: **fuera** de la medición.

## 7. Repetibilidad de bandas (validación de campo)

Cronómetro, 3 corridas @ 11.11 m/min:

| Banda | Corrida 1 | Corrida 2 | Corrida 3 | Promedio | Variación |
|-------|-----------|-----------|-----------|----------|-----------|
| Blanca | 242.0 s | 243.4 s | 243.2 s | **242.9 s** | **±0.3 %** |
| Roja | 53.7 s | 54.5 s | 54.4 s | **54.2 s** | **±0.4 %** |

Tramos individuales varían más (±4–11 % por lap), pero el total converge → confiable.

## 8. Qué va dónde (banda blanca, referencia de posición)

- SL1 · Esparcidor 1 — 1.42–8.37 m
- CL · Esparcidor 2 — 11.72–16.10 m
- SL2 · Esparcidor 3 — 17.47–23.86 m
- Pre-prensa — 29.08–33.78 m
- Imán 26.68 m · Sprays 35.99 m · Detector 37.69 m · Cuchillas 39.56 m

## 9. TBD (dejar como TBD, NO rellenar)

- Silos 5/6: `ρ`, `V_cap`, `L%`, `F_out`.
- Encolador: `t_enc` (prueba de trazador pendiente).
- Split capa superficial `%SL1 / %SL2` (para dimensionar caudal de e1 y e3).
- Enfriadoras estrella + estacado (después de los sensores; fuera de la medición actual).

## 10. Fuentes en el repo

- Mediciones de banda: `MEDICIONES_BANDAS_CAMPO.md`
- Datos crudos cronómetro: `datos/Production_Line_Timing_Averages.xlsx`
- Longitudes/nodos: `js/core/process-graph.js` · Motor: `js/core/trace-engine.js`
- Proceso post-prensa: `../../encolados/PROCESO.md` (secciones 8–10)
- Handoff simulador: `HANDOFF_SIMULADOR.md`
