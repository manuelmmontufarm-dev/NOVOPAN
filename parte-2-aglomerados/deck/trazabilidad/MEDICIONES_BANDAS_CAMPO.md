# Mediciones de campo — Banda blanca y banda roja

> **Fuente:** `datos/Production_Line_Timing_Averages.xlsx` (6SS Banda Blanca · 3SS Banda Roja)  
> **Corridas:** 3 repeticiones · promedios en fórmulas del Excel  
> **Velocidad medida:** **11,11 m/min** (promedio de las 3 corridas en hoja blanca)  
> **Fecha de análisis:** jul-2026  
> **Valida longitudes del simulador:** blanca **45 m** · roja **10 m**

## Cómo leer las mediciones

| Tipo | En Excel | Tiene longitud | En el simulador |
|------|----------|----------------|-----------------|
| **start + end** | Dos puntos consecutivos | **Sí** — lap = tiempo de zona | Sub-segmento con `lengthM` |
| **Punto solo** | Un solo hito | **No** — se marca el centro | Waypoint (`atM` / `atPct`) |
| **Lap entre otros** | Entre zona/punto y el siguiente | **No** — banda corriendo | Sub-segmento `transport` puro |

Entre puntos medidos sin equipo: la banda corre con colchón **vacío**, **formándose** (dentro de zonas SL) o **ya formado** (después de SL2).

---

## Banda blanca — resumen

| Magnitud | Valor |
|----------|-------|
| Longitud total | **45,0 m** |
| Tiempo total @ 11,11 m/min | **242,9 s** |
| Zonas con longitud (SL1+CL+SL2+pre-prensa) | **22,4 m** (50 %) |
| Tramos banda sola (gaps) | **22,6 m** (50 %) |

### Secuencia de sub-segmentos (orden físico, 0 → 45 m)

Usar esta tabla como **fuente de verdad** para el motor de bandas.

| # | ID sugerido | Tipo | Desde (m) | Hasta (m) | Longitud (m) | % inicio | % fin | Tiempo @ 11,11 m/min |
|---|-------------|------|-----------|-----------|--------------|----------|-------|----------------------|
| 1 | `white:gap:pre-sl1` | transport | 0,00 | 1,42 | **1,42** | 0,0 % | 3,2 % | 7,7 s |
| 2 | `white:zone:sl1` | zone | 1,42 | 8,37 | **6,94** | 3,2 % | 18,6 % | 37,5 s |
| 3 | `white:gap:sl1-cl` | transport | 8,37 | 11,72 | **3,35** | 18,6 % | 26,0 % | 18,1 s |
| 4 | `white:zone:cl` | zone | 11,72 | 16,10 | **4,38** | 26,0 % | 35,8 % | 23,7 s |
| 5 | `white:gap:cl-sl2` | transport | 16,10 | 17,47 | **1,37** | 35,8 % | 38,8 % | 7,4 s |
| 6 | `white:zone:sl2` | zone | 17,47 | 23,86 | **6,39** | 38,8 % | 53,0 % | 34,5 s |
| 7 | `white:gap:sl2-iman` | transport | 23,86 | 26,68 | **2,81** | 53,0 % | 59,3 % | 15,2 s |
| 8 | `white:point:iman` | waypoint | — | — | — | **59,3 %** | — | t = 144,1 s |
| 9 | `white:gap:iman-preprensa` | transport | 26,68 | 29,08 | **2,40** | 59,3 % | 64,6 % | 13,0 s |
| 10 | `white:zone:preprensa` | zone | 29,08 | 33,78 | **4,69** | 64,6 % | 75,1 % | 25,4 s |
| 11 | `white:gap:preprensa-sprays` | transport | 33,78 | 35,99 | **2,22** | 75,1 % | 80,0 % | 12,0 s |
| 12 | `white:point:sprays` | waypoint | — | — | — | **80,0 %** | — | t = 194,4 s |
| 13 | `white:gap:sprays-detector` | transport | 35,99 | 37,69 | **1,70** | 80,0 % | 83,8 % | 9,2 s |
| 14 | `white:point:detector` | waypoint | — | — | — | **83,8 %** | — | t = 203,6 s |
| 15 | `white:gap:detector-cuchillas` | transport | 37,69 | 39,56 | **1,86** | 83,8 % | 87,9 % | 10,1 s |
| 16 | `white:point:cuchillas` | waypoint | — | — | — | **87,9 %** | — | t = 213,6 s |
| 17 | `white:gap:post-cuchillas` | transport | 39,56 | 45,00 | **5,41** | 87,9 % | 100,0 % | 29,2 s |

**Suma longitudes transport + zone:** 1,42 + 6,94 + 3,35 + 4,38 + 1,37 + 6,39 + 2,81 + 2,40 + 4,69 + 2,22 + 1,70 + 1,86 + 5,41 = **45,0 m**

### Zonas con longitud (detalle)

| Zona | Esparcidor / equipo | Inicio (m) | Fin (m) | Longitud (m) | % tramo | Duración (s) |
|------|---------------------|------------|---------|--------------|---------|--------------|
| **SL1** | Esparcidor 1 (BOTTOM) | 1,42 | 8,37 | 6,94 | 3,2 → 18,6 % | 37,5 |
| **CL** | Esparcidor 2 (CORE) | 11,72 | 16,10 | 4,38 | 26,0 → 35,8 % | 23,7 |
| **SL2** | Esparcidor 3 (TOP) | 17,47 | 23,86 | 6,39 | 38,8 → 53,0 % | 34,5 |
| **Pre-prensa** | CBV / pre-prensa | 29,08 | 33,78 | 4,69 | 64,6 → 75,1 % | 25,4 |

### Puntos puntuales (sin longitud)

| Punto | Posición (m) | % banda blanca | Tiempo acum. (s) | Notas |
|-------|--------------|----------------|------------------|-------|
| **Imán** | 26,68 | 59,3 % | 144,1 | Magnet / detector previo |
| **Sprays anti-pegado** | 35,99 | 80,0 % | 194,4 | Desmoldante |
| **Detector metales** | 37,69 | 83,8 % | 203,6 | Aún en banda blanca en campo |
| **Cuchillas / nariz #1** | 39,56 | 87,9 % | 213,6 | Antes del cambio a roja |

### Mapa visual (escala aproximada)

```
0m                                                                                    45m
├─vacía─┤──SL1──┤─run─┤─CL─┤run┤──SL2──┤──run──┤●Imán├──run──┤─PreP─┤run┤●Spr●Det●Cuch├──run──┤
0%    3%      19%    26% 36% 39%      53%        59%        65%   75% 80 84 88%          100%
```

---

## Banda roja — resumen

| Magnitud | Valor |
|----------|-------|
| Longitud total | **10,0 m** |
| Tiempo total @ 11,11 m/min | **54,2 s** |
| Zona vapor (start → end) | **2,3 m** (23 %) |
| Banda sola antes / después vapor | **1,9 m + 5,9 m** |

### Secuencia de sub-segmentos

| # | ID sugerido | Tipo | Desde (m) | Hasta (m) | Longitud (m) | % inicio | % fin | Tiempo @ 11,11 m/min |
|---|-------------|------|-----------|-----------|--------------|----------|-------|----------------------|
| 1 | `red:gap:pre-vapor` | transport | 0,00 | 1,86 | **1,86** | 0,0 % | 18,6 % | 10,0 s |
| 2 | `red:zone:vapor` | zone | 1,86 | 4,15 | **2,29** | 18,6 % | 41,5 % | 12,4 s |
| 3 | `red:gap:post-vapor` | transport | 4,15 | 10,00 | **5,88** | 41,5 % | 100,0 % | 31,8 s |

### Puntos de referencia banda roja

| Punto | Posición (m) | % banda roja | Tiempo acum. (s) |
|-------|--------------|--------------|------------------|
| Vapor start | 1,86 | 18,6 % | 10,0 |
| Vapor end | 4,15 | 41,5 % | 22,4 |
| Fin banda roja | 10,00 | 100,0 % | 54,2 |

```
0m                                                          10m
├────run────┤────vapor────┤──────────────run──────────────┤
0%        19%            42%                            100%
```

---

## Banda prensa metálica (sin cronometría nueva)

Sin waypoints en el Excel de jul-2026. Mantener parámetro existente del simulador:

| Tramo | Longitud | Notas |
|-------|----------|-------|
| Zona activa prensado | **16,6 m** | 19 marcos; medido jun-2026 |
| Retorno (no modelado en τ) | ~28 m | Incluido en 45 m totales físicos de circuito |

---

## Conversión tiempo ↔ posición

Para bandas acopladas a prensa:

```
t (s) = L (m) / v_prensa (m/min) × 60
L (m) = t (s) × v_prensa / 60
%     = L / L_total × 100
```

Ejemplo @ **14,5 m/min** (default simulador):

| Tramo | L (m) | Tiempo (s) |
|-------|-------|------------|
| Banda blanca | 45,0 | 186,2 |
| Banda roja | 10,0 | 41,4 |

Ejemplo @ **11,11 m/min** (velocidad de las corridas del Excel):

| Tramo | L (m) | Tiempo (s) |
|-------|-------|------------|
| Banda blanca | 45,0 | 242,9 |
| Banda roja | 10,0 | 54,2 |

---

## Discrepancias vs. modelo actual del simulador

| Aspecto | Campo (este doc) | Simulador hoy (`process-graph.js`) |
|---------|------------------|-------------------------------------|
| Esparcidores SL1/CL/SL2 | Zonas **sobre** la banda blanca (m 1,4 → 23,9) | Nodos **upstream** con τ; merge en colchón |
| Banda vacía inicial | 1,42 m antes de SL1 | No modelado |
| Gaps entre esparcidores | 3,35 m + 1,37 m | No modelado |
| Pre-prensa | Zona 4,69 m @ 64,6–75,1 % | Punto decorativo @ 52 % |
| Detector metales | 83,8 % **blanca** | 22 % **roja** |
| Vapor | Zona 2,29 m @ 18,6–41,5 % roja | Punto @ 55 % roja |
| Longitudes totales | 45 m / 10 m | 45 m / 10 m ✓ |

---

## Archivos relacionados

| Archivo | Rol |
|---------|-----|
| `datos/Production_Line_Timing_Averages.xlsx` | Datos crudos + promedios |
| `PARAMETROS.md` | Parámetros globales del simulador |
| `PROMPT_REDISENO_MOTOR_BANDAS.md` | Prompt para implementar este modelo en el motor |
| `js/core/process-graph.js` | Definición actual de nodos (a actualizar) |
| `js/core/trace-engine.js` | Motor de trazado actual (a actualizar) |
