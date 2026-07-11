# Prompt — copiar y pegar en Claude Design

Abre un **proyecto nuevo**. Sube este zip + capturas de https://novopan.vercel.app/trazabilidad-linea (Línea y Parámetros). Luego pega todo lo de abajo:

---

```
Diseña la v2 de "NOVOPAN · Sección 2 · Línea horizontal" (trazabilidad L1).

IMPORTANTE — CONTEXTO
- Te adjunto el paquete handoff: implementación actual (index.html + CSS), handoff v1 (.dc.html) y tablas de mediciones.
- También screenshots del simulador en Vercel (jul-2026).
- NO uses ciegamente el handoff viejo: ya hay tabs Línea|Parámetros, mediciones reales y tiempo real.
- El archivo referencia-original/Seccion2 Linea.dc.html sirve SOLO como referencia de estilo (verde #004E38, amarillo #FFDE00, Barlow, animaciones).

RECOMENDACIONES DE PLANTA (prioridad UX)
1. La línea SIEMPRE está corriendo (bandas animadas, HMI en vivo). No es "play desde cero".
2. En la toolbar de Línea, el ÚNICO control operador visible es velocidad de prensa (m/min). Preset ~14.5.
3. Botón "Aplicar cambio aquí" / "Marcar cambio": el trazador amarillo empieza desde el equipo/punto actual, NO desde el inicio de la línea.
4. Slider de tiempo manual opcional (scrub), pero flujo normal = línea corriendo + cambio desde ahí.
5. El producto se mueve a la MISMA velocidad (v_prensa) en toda la línea; solo cambian las distancias entre equipos.
6. Pestaña Parámetros más limpia: inputs visibles; ecuaciones (τ = M/F×60, t = L/v×60) y justificaciones dentro de paneles colapsables "Ver cálculo".

MEDICIONES REALES (flexómetro jul-2026 — escala del SVG)
- Total medido 85.15 m: blanca 45 m + roja 10 m + prensa 16.6 m + post-prensa 13.55 m.
- Waypoints post-prensa (m): 71.6 fin prensa · 78.3–79.65 refila · 80.35–82.65 sierra transversal · 85.15 sensores.
- Proporción visual bandas ≈ 63% : 14% : 23%.
- Prensa: 19 marcos, pitch 0.75 m (1–7) y 0.90 m (7–19).
- Regla inferior 0–85.15 m cada 5 m, alineada al mismo eje X que los equipos.
- Detalle de sub-tramos: ver MEDICIONES.md en el zip.

TAREA
1. Re-dibuja el SVG con X proporcional a metros (escala lineal 0–85.15 m).
2. Diseña toolbar v2: tabs Línea|Parámetros, v_prensa, "Aplicar cambio aquí", chips 2A–2E, sin play/reset dominantes.
3. Diseña panel Parámetros v2: limpio, ecuaciones colapsadas (ver implementacion-actual/ para lo que hay hoy).
4. Mantén header verde, reloj, leyenda, trazador amarillo, colchón 3 capas, animaciones conveyor/steam/mist.

ENTREGABLE
- Un .dc.html (HTML/SVG/CSS vanilla, sin React), listo para que desarrollo lo convierta a index.html + css/.
- Indica en comentarios HTML los IDs sugeridos para JS (#tracer, #canvasScroll, #tabParams, #tabLinea, etc.).
```
