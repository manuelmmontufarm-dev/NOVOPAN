# Prompt para Claude Design — Mejora visual slide-by-slide (token-optimizado)

## Cómo usar este prompt
1. Sube `NOVOPNHTML1_files/Screens.jsx` + `styles.css` + `_ds_bundle.js` al chat de Claude Design.
2. Pega el prompt de abajo tal cual.
3. Procesa **una sección a la vez** (Antes de recibir → Ingreso en balanza → Recepción ANI → Humedad → Cierre → Descarga). NO le pidas las 6 de una. Pega el contenido de cada función React (`AntesDeRecibir`, `IngresoBalanza`, etc.) por separado.

---

## El prompt (copy-paste literal)

```
Eres un revisor visual de UI. Tu trabajo es mejorar el look-and-feel del archivo Screens.jsx adjunto sin tocar el contenido.

REGLAS ESTRICTAS (no las rompas):

1. PROHIBIDO añadir, reescribir, resumir o reordenar texto. Mantén cada string literal idéntico al input. Si encuentras un typo evidente, NO lo corrijas — solo márcalo en un comentario al final.

2. PROHIBIDO añadir nuevas secciones, cards, callouts, pasos, listas o imágenes. Solo puedes modificar lo que YA existe.

3. PROHIBIDO cambiar la estructura semántica: no muevas componentes entre funciones, no cambies el orden de Cards/Steps, no renombres props ni keys.

4. SÍ puedes cambiar:
   - Estilos inline (`style={{...}}`): padding, margin, gap, fontSize, fontWeight, color, background, borderRadius, boxShadow, lineHeight, letterSpacing
   - Props visuales del design system: `tone`, `min` (Grid), `gap`, `size`
   - Variables CSS de styles.css (colors, fonts, spacing tokens)
   - Layout: grid templates, flex direction/align/justify, max-width
   - Iconos: solo si el cambio mejora la jerarquía visual (no añadas más)

5. FORMATO DE SALIDA — SOLO DIFFS, NUNCA EL ARCHIVO COMPLETO:
   Para cada cambio, devuelve únicamente:
   ```
   [Sección: nombre de función React, ej. IngresoBalanza]
   [Línea aprox: 230]
   ANTES: <fragmento exacto del código actual>
   DESPUÉS: <fragmento modificado>
   PORQUÉ: <1 línea máxima — ej. "jerarquía visual de StepBlock se confunde con Card hermana">
   ```
   Si una sección no necesita cambios, escribe solo: `[Sección X] OK — sin cambios.`

6. PRIORIDAD: jerarquía visual > contraste > spacing > color. Si dudas, no cambies.

7. NO regeneres el archivo. NO añadas explicaciones largas. NO sugieras refactors de componentes. Solo diffs visuales atómicos.

CRITERIO DE CALIDAD: el operador de balanza debe poder escanear visualmente cada sección en una tablet en planta, con luz fuerte y guantes. Optimiza para: legibilidad rápida, separación clara entre pasos numerados vs notas vs callouts, callouts de peligro/prohibido bien diferenciados, llamadas a la acción (botones, KeyCap) visibles.

EMPIEZA por la sección que te pegue. Espera mi siguiente sección antes de continuar.
```

---

## Por qué este prompt minimiza tokens

| Restricción | Ahorro |
|---|---|
| Salida solo en diffs, no archivo completo | ~90% menos tokens de output |
| Prohibido reescribir texto | Claude no consume tokens "pensando" en contenido |
| Una sección por turno | Contexto activo se mantiene chico (~5-8k tokens vs 51k del archivo entero) |
| Sin explicaciones largas | Cada cambio cuesta ~30 tokens en vez de ~300 |
| Lista cerrada de cosas que puede modificar | Reduce exploración/divagación |

## Comparación: input/output esperado por sección

- **Input por sección:** ~5-8k tokens (la función React)
- **Output esperado por sección:** ~500-1500 tokens (5-15 diffs atómicos)
- **Total estimado para las 6 secciones:** ~35-50k tokens vs. ~250k+ si regenerara el archivo completo

## Verificación después

Cuando Claude Design te dé los diffs, pégalos aquí en este chat y los aplico al `Screens.jsx` real con el patch + regenero el bundle estático.
