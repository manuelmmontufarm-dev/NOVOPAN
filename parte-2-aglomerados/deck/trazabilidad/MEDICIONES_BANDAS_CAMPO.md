# Mediciones de campo — Banda blanca, roja y prensa

> **Fuentes:**  
> - Cronometría: `datos/Production_Line_Timing_Averages.xlsx` (6SS Banda Blanca · 3SS Banda Roja)  
> - Flexómetro: banda prensa metálica (jul-2026, planta)  
> **Corridas cronómetro:** 3 repeticiones · promedios en fórmulas del Excel  
> **Velocidad cronómetro:** **11,11 m/min** (promedio de las 3 corridas en hoja blanca)  
> **Fecha de análisis:** jul-2026  
> **Valida longitudes del simulador:** blanca **45 m** · roja **10 m** · prensa activa **16,6 m**

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

## Banda prensa metálica — resumen

> **Método:** flexómetro en planta (jul-2026).  
> **Convención:** huecos entre marcos = longitud; cada marco = waypoint (centro del marco).

| Magnitud | Valor |
|----------|-------|
| Longitud total zona activa | **16,6 m** |
| Marcos de prensado | **19** |
| Tramo pre-marco 1 | **0,10 m** |
| Huecos marcos 1→7 (6 × 75 cm) | **4,50 m** |
| Huecos marcos 7→19 (12 × 90 cm) | **10,80 m** |
| Cola post-marco 19 (descompresión) | **1,20 m** |
| Tiempo total @ 14,5 m/min | **~68,7 s** |
| Tiempo total @ 11,11 m/min | **~89,7 s** |

**Verificación:** `0,10 + 6×0,75 + 12×0,90 + 1,20 = 16,60 m` ✓

El circuito físico total de la banda metálica (~45 m) incluye **retorno** no modelado en τ; solo los **16,6 m activos** (entrada → descompresión).

### Secuencia de sub-segmentos (orden físico, 0 → 16,6 m)

| # | ID sugerido | Tipo | Desde (m) | Hasta (m) | Longitud (m) | % inicio | % fin | Notas |
|---|-------------|------|-----------|-----------|--------------|----------|-------|-------|
| 1 | `press:gap:pre-m1` | transport | 0,00 | 0,10 | **0,10** | 0,0 % | 0,6 % | Hasta marco 1 |
| 2 | `press:gap:m1-m2` | transport | 0,10 | 0,85 | **0,75** | 0,6 % | 5,1 % | Pitch denso |
| 3 | `press:gap:m2-m3` | transport | 0,85 | 1,60 | **0,75** | 5,1 % | 9,6 % | |
| 4 | `press:gap:m3-m4` | transport | 1,60 | 2,35 | **0,75** | 9,6 % | 14,2 % | |
| 5 | `press:gap:m4-m5` | transport | 2,35 | 3,10 | **0,75** | 14,2 % | 18,7 % | |
| 6 | `press:gap:m5-m6` | transport | 3,10 | 3,85 | **0,75** | 18,7 % | 23,2 % | |
| 7 | `press:gap:m6-m7` | transport | 3,85 | 4,60 | **0,75** | 23,2 % | 27,7 % | Último hueco 75 cm |
| 8 | `press:gap:m7-m8` | transport | 4,60 | 5,50 | **0,90** | 27,7 % | 33,1 % | Pitch estándar |
| 9 | `press:gap:m8-m9` | transport | 5,50 | 6,40 | **0,90** | 33,1 % | 38,6 % | |
| 10 | `press:gap:m9-m10` | transport | 6,40 | 7,30 | **0,90** | 38,6 % | 44,0 % | |
| 11 | `press:gap:m10-m11` | transport | 7,30 | 8,20 | **0,90** | 44,0 % | 49,4 % | |
| 12 | `press:gap:m11-m12` | transport | 8,20 | 9,10 | **0,90** | 49,4 % | 54,8 % | |
| 13 | `press:gap:m12-m13` | transport | 9,10 | 10,00 | **0,90** | 54,8 % | 60,2 % | |
| 14 | `press:gap:m13-m14` | transport | 10,00 | 10,90 | **0,90** | 60,2 % | 65,7 % | |
| 15 | `press:gap:m14-m15` | transport | 10,90 | 11,80 | **0,90** | 65,7 % | 71,1 % | |
| 16 | `press:gap:m15-m16` | transport | 11,80 | 12,70 | **0,90** | 71,1 % | 76,5 % | |
| 17 | `press:gap:m16-m17` | transport | 12,70 | 13,60 | **0,90** | 76,5 % | 81,9 % | |
| 18 | `press:gap:m17-m18` | transport | 13,60 | 14,50 | **0,90** | 81,9 % | 87,3 % | |
| 19 | `press:gap:m18-m19` | transport | 14,50 | 15,40 | **0,90** | 87,3 % | 92,8 % | Fin zona prensado |
| 20 | `press:gap:decompress` | transport | 15,40 | 16,60 | **1,20** | 92,8 % | 100,0 % | Descompresión + salida activa |

**Suma:** 0,10 + 6×0,75 + 12×0,90 + 1,20 = **16,60 m**

### Waypoints — posición de cada marco

| Marco | Posición (m) | % zona activa | Tiempo acum. @ 14,5 m/min |
|-------|--------------|---------------|---------------------------|
| 1 | 0,10 | 0,6 % | 0,4 s |
| 2 | 0,85 | 5,1 % | 3,5 s |
| 3 | 1,60 | 9,6 % | 6,6 s |
| 4 | 2,35 | 14,2 % | 9,7 s |
| 5 | 3,10 | 18,7 % | 12,8 s |
| 6 | 3,85 | 23,2 % | 15,9 s |
| 7 | 4,60 | 27,7 % | 19,0 s |
| 8 | 5,50 | 33,1 % | 22,8 s |
| 9 | 6,40 | 38,6 % | 26,5 s |
| 10 | 7,30 | 44,0 % | 30,2 s |
| 11 | 8,20 | 49,4 % | 33,9 s |
| 12 | 9,10 | 54,8 % | 37,7 s |
| 13 | 10,00 | 60,2 % | 41,4 s |
| 14 | 10,90 | 65,7 % | 45,1 s |
| 15 | 11,80 | 71,1 % | 48,8 s |
| 16 | 12,70 | 76,5 % | 52,6 s |
| 17 | 13,60 | 81,9 % | 56,3 s |
| 18 | 14,50 | 87,3 % | 60,0 s |
| 19 | 15,40 | 92,8 % | 63,7 s |
| Fin zona activa | 16,60 | 100,0 % | 68,7 s |

### Mapa visual (escala aproximada)

```
0m                                                              16.6m
├10cm├─75×6 (marcos 1─7)─├──────90×12 (marcos 7─19)──────├descomp.┤
0%  1%        28%                    93%                 100%
```

### Retorno (no modelado en τ)

| Tramo | Longitud | Notas |
|-------|----------|-------|
| Circuito total banda metálica | ~45 m | Incluye retorno bajo prensa |
| Zona activa (este doc) | 16,6 m | Entrada → post-descompresión |
| Retorno estimado | ~28 m | Fuera del modelo de trazabilidad |

---

## Tramo post-prensa — fin prensa → sensores

> **Medición de campo añadida:** 2-jul-2026.
> **Origen absoluto:** fin de la zona activa de prensa = **71,60 m** desde formación del colchón.

| # | ID sugerido | Tipo | Desde abs. (m) | Hasta abs. (m) | Longitud (m) | Evento |
|---|-------------|------|----------------|----------------|--------------|--------|
| 1 | `post:gap:press-refila` | transport | 71,60 | 78,30 | **6,70** | Fin prensa → cuchillos de refila |
| 2 | `post:zone:refila` | zone | 78,30 | 79,65 | **1,35** | Cuchillos de refila |
| 3 | `post:gap:refila-sierra` | transport | 79,65 | 80,35 | **0,70** | Refila → sierra transversal |
| 4 | `post:zone:sierra` | zone | 80,35 | 82,65 | **2,30** | Sierra transversal |
| 5 | `post:gap:sierra-sensores` | transport | 82,65 | 85,15 | **2,50** | Sierra transversal → sensores |

**Verificación:** `6,70 + 1,35 + 0,70 + 2,30 + 2,50 = 13,55 m`.

**Longitud total medida desde formación hasta sensores:** `71,60 + 13,55 = 85,15 m`.

Todos los sub-tramos post-prensa usan:

```text
t_post,i (s) = L_i (m) / v_prensa (m/min) × 60
```

| Tramo post-prensa | L (m) | Tiempo @ 14,5 m/min | Tiempo @ 11,11 m/min |
|-------------------|-------|----------------------|-----------------------|
| Fin prensa → refila | 6,70 | 27,7 s | 36,2 s |
| Cuchillos de refila | 1,35 | 5,6 s | 7,3 s |
| Refila → sierra | 0,70 | 2,9 s | 3,8 s |
| Sierra transversal | 2,30 | 9,5 s | 12,4 s |
| Sierra → sensores | 2,50 | 10,3 s | 13,5 s |
| **Total post-prensa** | **13,55** | **56,1 s** | **73,2 s** |

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
| Banda prensa activa | 16,6 | 68,7 |

Ejemplo @ **11,11 m/min** (velocidad de las corridas del Excel):

| Tramo | L (m) | Tiempo (s) |
|-------|-------|------------|
| Banda blanca | 45,0 | 242,9 |
| Banda roja | 10,0 | 54,2 |
| Banda prensa activa | 16,6 | 89,7 |

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
| Longitudes totales | 45 m / 10 m / 16,6 m | 45 m / 10 m / 16,6 m ✓ |
| Marcos prensa | 19 waypoints; pitch 75 cm (1–7) luego 90 cm | Un bloque; marcos @ 50 % decorativo |
| Descompresión post-M19 | 1,20 m (7 % del tramo) | No modelado |

---

## Archivos relacionados

| Archivo | Rol |
|---------|-----|
| `datos/Production_Line_Timing_Averages.xlsx` | Datos crudos + promedios |
| `PARAMETROS.md` | Parámetros globales del simulador |
| `PROMPT_REDISENO_MOTOR_BANDAS.md` | Prompt para implementar este modelo en el motor |
| `js/core/process-graph.js` | Definición actual de nodos (a actualizar) |
| `js/core/trace-engine.js` | Motor de trazado actual (a actualizar) |
