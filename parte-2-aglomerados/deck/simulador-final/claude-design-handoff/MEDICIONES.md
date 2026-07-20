# Mediciones reales · Sección 2 downstream

Fuente: flexómetro planta, jul-2026. Motor en `process-graph.js`.

## Totales

| Banda | Longitud | m absolutos (desde formación colchón) |
|-------|----------|----------------------------------------|
| Blanca | 45.0 m | 0 → 45 |
| Roja | 10.0 m | 45 → 55 |
| Prensa | 16.6 m | 55 → 71.6 |
| Post-prensa | 13.55 m | 71.6 → 85.15 |
| **Total** | **85.15 m** | |

**Proporción visual:** 45 : 10 : 16.6 ≈ **62.8% : 14.0% : 23.2%**

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
| 55.00 | Fin roja → inicio prensa |
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

## Banda roja — sub-tramos (10 m)

| Longitud (m) | Tramo |
|-------------|-------|
| 1.86 | Entrada → vapor |
| 2.29 | Zona vapor · Dynasteam |
| 5.88 | Vapor → prensa |

## Prensa metálica — sub-tramos (16.6 m, 19 marcos)

| Longitud (m) | Tramo |
|-------------|-------|
| 0.10 | Entrada → marco 1 |
| 0.75 × 6 | Marcos 1→2 … 6→7 (pitch denso) |
| 0.90 × 12 | Marcos 7→8 … 18→19 (pitch estándar) |
| 1.20 | Descompresión + salida |

Posiciones marcos (m desde inicio prensa):  
0.10, 0.85, 1.60, 2.35, 3.10, 3.85, 4.60, 5.50, 6.40, 7.30, 8.20, 9.10, 10.00, 10.90, 11.80, 12.70, 13.60, 14.50, 15.40, 16.60 (fin).

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
