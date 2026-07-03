# Handoff — Simulador de trazabilidad L1 · Sección 2 (rehacer desde silos)

> **Para:** Opus (Claude Code).
> **Objetivo:** rehacer el simulador de trazabilidad **empezando desde los silos** y con el
> **modelo v3** (registro del último cambio + medición desde SL1 hasta los sensores).
> **Regla de oro:** primero **funcionalidad** (líneas y círculos, nada bonito), después
> mejorar lo visual con **Claude Design**. No inviertas tiempo en gráficos hasta que los
> tiempos salgan correctos.

---

## 0. Contexto en 5 líneas

- Se rastrea **cuándo un cambio de material** (nueva receta) recorre la línea hasta los sensores.
- Cada etapa = **recipiente** (`τ = M/F`), **banda** (`t = L/v`) o **prueba** (encolador).
- El simulador actual arranca en los **dosing bins** y termina en la **prensa**.
- Hay que: (a) extenderlo **hacia atrás** hasta los **silos**, (b) cambiar la lógica del
  **merge** al modelo v3, (c) extenderlo **hacia adelante** hasta los **sensores**.
- Fuente de verdad de ecuaciones/medidas: [`CODEX_PROMPT_PRESENTACION_ECUACIONES.md`](CODEX_PROMPT_PRESENTACION_ECUACIONES.md).

## 1. Archivos que existen hoy

| Archivo | Rol |
|---|---|
| `js/core/process-graph.js` | Define nodos, rutas, longitudes, sub-segmentos de banda. |
| `js/core/trace-engine.js` | Motor: `tauForNode`, `transportForNode`, `computeAllMarkers`, merge. |
| `js/core/simulation-clock.js` | Reloj de simulación. |
| `js/ui/track-renderer.js`, `stage-rail.js` | Render actual (a simplificar). |
| `../trazabilidad-linea/js/line-app.js`, `line-params.js`, `line-bridge.js` | Vista "línea" Sección 2. |

Léelos antes de tocar nada. **No borres el simulador clásico**; trabaja la vista de línea o una nueva.

## 2. Modelo v3 a implementar (esto es lo que cambia)

### 2.1 τ por nodo (ya existe, mantener)
```
recipiente (silo, dosing, esparcidor):  τ = M / F × 60
banda (inclinada, blanca, roja, prensa): t = L / v × 60
encolador:                               t_enc = valor de prueba (parámetro fijo, editable)
```

### 2.2 Tiempo "antes" por capa (silo → su esparcidor)
```
T_antes,e = τ_silo + τ_dos + t_enc + t_incl + τ_esp,e      e ∈ {SL1, CL, SL2}
```
- SL1 y SL2 comparten la ruta **fina** (silo 6, dosing fina, encolador CE, banda inclinada fina),
  difieren solo en el esparcidor (e1 vs e3).
- CL va por la ruta **gruesa** (silo 5, dosing gruesa, encolador CI, banda inclinada gruesa, e2).

### 2.3 Registro del cambio (NUEVA lógica del merge — reemplaza el merge viejo)
```
t_reg = max( T_antes,SL1 , T_antes,CL , T_antes,SL2 )
```
El cambio se registra cuando llega la **última** capa a su esparcidor (pueden diferir ~2 s).
**No** es una suma de rutas; es un `max`.

### 2.4 Del registro a los sensores (desde el punto de SL1)
```
t_SL1→sens = 83.73 / v_prensa × 60
83.73 m = 43.58 (resto blanca desde 1.42 m) + 10 (roja) + 16.6 (prensa) + 13.55 (corte→sensores)
```

### 2.5 Ecuación maestra
```
t_tot = max_e( T_antes,e ) + 83.73 / v_prensa × 60
```
Endpoint = **sensores**. Enfriadoras + estacado quedan **fuera** (después de los sensores).

## 3. Medidas a usar (cargar como defaults, editables)

**Bandas inclinadas (velocidad fija HMI):** fina L=64.57 m, v=99.5 → 38.9 s · gruesa L=68.5 m, v=96.5 → 42.6 s.
**Esparcidores (caen sobre banda blanca):** SL1 @ 1.42 m · CL @ 11.72 m · SL2 @ 17.47 m.
**Bandas post-esparcido (a v_prensa):** blanca 45 m · roja 10 m · prensa 16.6 m.
**Post-prensa (a v_prensa, medido):** salida→cuchillas 6.7 · cuchillas 1.35 · gap 0.7 · cortadora 2.3 · gap→sensores 2.5 → **13.55 m** a sensores.
**Caudales HMI (DESCARGA):** CE (fina) 111 kg/min · CI (gruesa) 282 kg/min.
**v_prensa:** default 14.5 m/min (rango operador). Corridas cronómetro a 11.11 m/min.
**TBD (dejar campos vacíos/editables):** silos ρ, V_cap, L%, F_out · t_enc (prueba) · split %SL1/%SL2.

## 4. Tareas concretas (en orden, funcionalidad primero)

### T1 — Agregar los silos como nodos upstream
- En `process-graph.js`: añade `silo-fina` (6) antes de `dosing-fine`, y `silo-thick` (5) antes de `dosing-thick`.
- Modelo `bin`, con parámetros `rho`, `Vcap`, `Lpct`, `Fout` (todos editables, default vacío/TBD).
- `τ_silo = (rho·Vcap·Lpct) / Fout × 60`. Si algún campo es 0/vacío → τ_silo = 0 y márcalo "TBD" en la UI.

### T2 — Implementar T_antes por capa
- En `trace-engine.js`, función `tAntes(layer, params)` que sume silo+dosing+enc+incl+esp de la ruta de esa capa.
- Usa las rutas ya definidas (fina para SL1/SL2, gruesa para CL).

### T3 — Reemplazar el merge por el registro (max)
- Sustituye la lógica de merge por: `t_reg = Math.max(tAntes('SL1'), tAntes('CL'), tAntes('SL2'))`.
- Guarda **cuál** capa gobierna (argmax) para mostrarlo en la UI.

### T4 — Extender downstream hasta los sensores
- Añade nodos post-prensa a `DOWNSTREAM`: `corte-gap` (6.7), `cuchillas` (1.35), `gap1` (0.7), `cortadora` (2.3), `gap-sensores` (2.5), y un waypoint `sensores`.
- El tramo medido es desde el **punto de SL1** (1.42 m en blanca): `t_SL1→sens = 83.73 / v_prensa × 60`.
- `t_tot = t_reg + t_SL1→sens`. Endpoint = `sensores`.

### T5 — Render MÍNIMO (líneas y círculos)
- **Círculo** = recipiente (silo, dosing, esparcidor, encolador). **Línea** = banda.
- Dibuja la cadena en SVG/canvas: silos → dosing → encolador → banda inclinada → esparcidores → colchón → blanca → roja → prensa → corte → **sensores**.
- Un marcador (punto) que avanza con el reloj mostrando dónde está el cambio. Un contador `t_tot`.
- **Sin estilos**: trazos negros, círculos blancos, etiquetas de texto. Nada más.

### T6 — Verificar funcionalidad
- A v_prensa = 14.5: `t_SL1→sens` debe dar **346.5 s**; a 11.11 → **452.1 s**.
- Cambia v_prensa y confirma que los tiempos downstream escalan (los inclinados NO, son fijos).
- Con silos/encolador en TBD, `t_reg` usa solo lo conocido y la UI marca lo pendiente.

### T7 — (después) Mejorar visual con Claude Design
- Solo cuando T1–T6 funcionen. Handoff aparte para Claude Design: colores, iconos de equipo,
  animación del marcador, badges de fuente (HMI/Medido/Test). No antes.

## 5. Próximos pasos (fuera de este handoff, dejar anotado)

1. **Mejores medidas desde los planos** directamente (no a flexómetro): longitudes exactas de
   bandas, posiciones de esparcidores, distancias post-prensa. Reemplazar los defaults actuales.
2. **Arrancar el simulador desde los silos** (T1) es el primer bloque de esta nueva versión.
3. Cerrar los **TBD**: prueba de trazador del encolador, parámetros de silos, split %SL1/%SL2.

## 6. Criterio de "listo"

- El marcador recorre silo → sensores y `t_tot` coincide con las ecuaciones de §2.
- Cambiar v_prensa reescala solo lo acoplado a prensa.
- Todo TBD es editable y visible como pendiente.
- Cero dependencia de estilos para que funcione. Lo visual viene después.
