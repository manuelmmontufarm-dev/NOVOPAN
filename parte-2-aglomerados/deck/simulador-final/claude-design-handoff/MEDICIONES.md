# Mediciones reales · Sección 2 downstream

Fuente: flexómetro planta, jul-2026. Motor en `process-graph.js`.

## Totales

| Banda | Longitud | m absolutos (desde formación colchón) |
|-------|----------|----------------------------------------|
| Blanca | 45.0 m | 0 → 45 |
| Roja | 7.67 m | 45 → 52.67 |
| Prensa | 18.93 m | 52.67 → 71.6 (tambor a tambor · DXF) |
| Post-prensa | 13.55 m | 71.6 → 85.15 |
| **Total** | **85.15 m** | |

**Proporción visual:** 45 : 7.67 : 18.93 ≈ **62.8% : 10.7% : 26.4%**

## Waypoints (m absolutos)

| m | Equipo |
|---|--------|
| 0.00 | Inicio banda blanca |
| 4.89 | Cabezal zona SL1 (capa inferior) |
| 13.90 | Cabezal zona CL (core) |
| 20.66 | Cabezal zona SL2 (capa superior) |
| 26.68 | Imán / tambor banda azul |
| 31.40 | Pre-prensa |
| 35.99 | Sprays anti-pegado |
| 37.69 | Detector de metales |
| 39.56 | Cuchillas / nariz |
| 45.00 | Fin blanca → inicio roja |
| 48.00 | Vapor EVOsteam (centro zona) |
| 52.67 | Fin roja → tambor entrada prensa (CL Press Infeed Drum · DXF) |
| 55.10 | Marco 1 prensa |
| 70.40 | Marco 19 |
| 71.60 | Fin zona activa / tablero |
| 78.30 | Inicio cuchillos de refila |
| 79.65 | Fin cuchillos de refila |
| 80.35 | Inicio sierra transversal |
| 82.65 | Fin sierra transversal |
| 85.15 | Sensores de calidad |

## Banda blanca — sub-tramos (45 m)

| Longitud (m) | Tramo |
|-------------|-------|
| 1.42 | Entrada → SL1 |
| 6.94 | Zona SL1 · capa inferior |
| 3.35 | SL1 → CL |
| 4.38 | Zona CL · core |
| 1.37 | CL → SL2 |
| 6.39 | Zona SL2 · capa superior |
| 2.81 | SL2 → imán |
| 2.40 | Imán → pre-prensa |
| 4.69 | Pre-prensa |
| 2.22 | Pre-prensa → sprays |
| 1.70 | Sprays → detector |
| 1.86 | Detector → cuchillas |
| 5.41 | Cuchillas → nariz #1 |

## Banda roja — sub-tramos (7.67 m · corregido con plano DXF jul-2026)

| Longitud (m) | Tramo |
|-------------|-------|
| 1.86 | Entrada → vapor |
| 2.29 | Zona vapor · Dynasteam |
| 3.52 | Vapor → prensa (tambor entrada) |

## Prensa metálica — sub-tramos (18.93 m tambor a tambor, 19 marcos)

| Longitud (m) | Tramo |
|-------------|-------|
| 2.43 | Tambor entrada → marco 1 |
| 0.75 × 6 | Marcos 1→2 … 6→7 (pitch denso) |
| 0.90 × 12 | Marcos 7→8 … 18→19 (pitch estándar) |
| 1.20 | Descompresión + salida |

Posiciones marcos (m desde tambor de entrada):  
2.43, 3.18, 3.93, 4.68, 5.43, 6.18, 6.93, 7.83, 8.73, 9.63, 10.53, 11.43, 12.33, 13.23, 14.13, 15.03, 15.93, 16.83, 17.73, 18.93 (fin). En m absolutos marco 1 sigue en 55.10.

## Post-prensa — sub-tramos (13.55 m)

| Longitud (m) | Tramo |
|-------------|-------|
| 6.70 | Fin prensa → cuchillos de refila |
| 1.35 | Zona cuchillos de refila |
| 0.70 | Refila → sierra transversal |
| 2.30 | Zona sierra transversal |
| 2.50 | Sierra transversal → sensores |

**Verificación:** `6.70 + 1.35 + 0.70 + 2.30 + 2.50 = 13.55 m`; total desde formación: `71.60 + 13.55 = 85.15 m`.

## Escala SVG sugerida

```
x = x₀ + (absM / 85.15) × anchoÚtil
```

Todos los equipos y la regla 0–70 m deben usar la **misma** escala X.

## Corrección plano DXF Dieffenbacher (21-jul-2026)

Fuente: `PlanoGeneral2022.dwg` (USB planta), bloque `000-Refernce-Point`
(sistema de estaciones del fabricante, residual < 1 mm sobre 130 m).
Anclado con un solo punto: CL Press Outfeed Drum = fin prensa 71.60 m.

- CL Press Infeed Drum (tambor entrada prensa) = **52.67 m** abs (antes 55.0):
  banda roja 10 → 7.67 m; prensa 16.6 → 18.93 m tambor a tambor.
- Marco 1 NO se mueve en absolutos (55.10 m); los 19 marcos empiezan 2.43 m
  después del tambor. Zona de marcos sigue siendo 16.6 m (flexómetro).
- El total 0 → 71.60 m no cambia; la residencia total tampoco (bandas
  acopladas a v_prensa). Cambia dónde se reporta la entrada a prensa.
- Puntos verificados del plano vs modelo (Δ): SL1 +0.39 · imán −0.48 ·
  pre-prensa inicio +0.15 / fin +0.06 · nariz −0.26. Post-prensa pendiente
  (sierra refila del plano difiere +7.3 m; se confirma en campo).
