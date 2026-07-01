# Codex — Prompt para presentación: Excel de mediciones / trazabilidad L1

> **Uso:** Abre **Codex** (o ChatGPT con el archivo), adjunta el **.xlsx** actualizado + este prompt.  
> **Salida esperada:** guion de presentación + slides (HTML o outline PPT) en **español**, para planta / Daniel / operadores.

---

## Archivos que debes adjuntar a Codex

| Archivo | Obligatorio |
|---------|-------------|
| **Tu Excel** (`.xlsx` / `.xlsm`) con las funciones nuevas | ✅ Sí |
| `PARAMETROS.md` (mismo folder) | Recomendado |
| `js/core/process-graph.js` | Si Codex debe mapear claves `len:*`, `mass:*`, `ret:*` |
| Captura del simulador web (`/trazabilidad`) | Opcional |

Si el Excel no está en el repo, súbelo manualmente — Codex debe **leer cada hoja, fórmula y nombre definido** antes de escribir la presentación.

---

## Contexto del proyecto (para Codex)

**NOVOPAN Línea 1 — trazabilidad de cambios (encolado → formación → prensa).**

- Simulador web: `parte-2-aglomerados/deck/trazabilidad/` (modelo **m_dot**).
- El Excel es el **libro de números de campo**: cronómetros, longitudes, τ, validación vs HMI.
- Objetivo del Excel: pasar de medición en planta → parámetro del simulador (`len:white`, `mass:esp2-zone`, etc.).
- **Últimas mediciones confirmadas (jun-2026):**
  - Banda blanca **45 m**
  - Banda roja **10 m**
  - Banda prensa **16,6 m** (zona activa)
- **Prueba pintura:** t₀ en encoladores; se comparó sim vs planta (~15 s de adelanto del sim al inicio; desfase roja/prensa al final).

Fórmulas del motor (deben reflejarse en el Excel si hay columnas derivadas):

| Tipo | Fórmula |
|------|---------|
| Bin / hopper | `τ = M / F × 60` [s] |
| Encolador / sprays fijos | `τ` en segundos (editable) |
| Banda inclinada | `t = L / v_banda × 60` |
| Banda acoplada prensa | `t = L / v_prensa × 60` |
| Longitud desde cronómetro | `L = t × v_prensa / 60` [m] |

Globales HMI típicos: `F_SL` 147,6 · `F_CL` 118 · peso manta 11,5 kg/m² · %SL1 47,1 / %SL2 52,9.

---

## Prompt copy-paste para Codex

```
Eres redactor técnico y diseñador de presentaciones para NOVOPAN (plantas de tableros MDF/aglomerado).

## TU TAREA
Crear una **presentación clara en español** (10–14 diapositivas) que explique **cómo funcionan las cosas nuevas del Excel adjunto** de mediciones / trazabilidad Línea 1, y cómo ese Excel se conecta con el simulador web de trazabilidad.

**NO inventes hojas ni fórmulas:** primero inspecciona el .xlsx adjunto (todas las pestañas, celdas con fórmula, tablas, validaciones, macros si hay). Si algo no está en el archivo, márcalo [POR CONFIRMAR].

## AUDIENCIA
- Daniel Sotalin (gestión / ISO)
- Operadores y mantenimiento L1
- Manuel (pasante) como quien presenta

Tono: operativo, directo, sin marketing. Como instructivo de planta, no paper académico.

## ANTES DE ESCRIBIR SLIDES
1. Lista cada **hoja** del Excel y su propósito en 1 línea.
2. Lista cada **función nueva** (columnas calculadas, desplegables, botones, tablas dinámicas, validación datos, export, etc.).
3. Para cada función nueva, documenta:
   - **Qué entra** (inputs del operador)
   - **Qué calcula** (fórmula en lenguaje llano)
   - **Qué sale** (parámetro simulador o decisión)
   - **Clave sim** si aplica (ej. `len:white`, `ret:enc-fine`, `_global:F_SL`)
4. Mapea Excel → simulador web (pestaña Parámetros / localStorage `novopan-trazabilidad-params-v9`).

## ESTRUCTURA OBLIGATORIA DE LA PRESENTACIÓN

### Slide 1 — Título
"Trazabilidad L1 — Libro de mediciones (Excel) y simulador"
Subtítulo: para qué sirve y quién lo usa.

### Slide 2 — Problema que resuelve
Sin Excel vs con Excel: cronometrar pintura/cambios, saber dónde está el cambio, calibrar metros y τ.

### Slide 3 — Mapa del Excel (vista general)
Diagrama o tabla: nombre de cada hoja → para qué sirve. (Sacado del archivo real.)

### Slide 4 — Cómo medir en planta (protocolo)
- Punto t₀ (encolador / dosing / esparcidor — según hoja del Excel)
- Anotar v_prensa HMI al medir
- Cronómetro: inicio / fin
- Prueba pintura: ambos encoladores, pulsar Iniciar en sim cuando sale el color

### Slide 5 — Función nueva #1
[La más importante del Excel — ej. calculadora L = t×v/60 o log de mediciones]
Explicar con **un ejemplo numérico real** de una fila del Excel.

### Slide 6 — Función nueva #2
[Segunda — ej. derivar τ encolador, o split esparcidor a dos velocidades]
Incluir mini tabla antes/después.

### Slide 7 — Función nueva #3
[Tercera — ej. resumen tramo común blanca/roja/prensa con 45 / 10 / 16,6 m]
Mostrar cómo se actualizan defaults.

### Slide 8 — Del Excel al simulador
Flujo paso a paso:
1. Medición en Excel
2. Valor derivado
3. Copiar a pestaña Parámetros del sim / o columna "clave sim"
4. Guardar → Demo pintura → comparar ETA

### Slide 9 — Lecciones de la prueba pintura (jun-2026)
- Sim ~15 s adelantado al ver color en banda → revisar τ encolador y t₀
- En roja el sim iba a prensa → revisar longitudes o v_prensa real
- Qué ajustar primero en el Excel (sin tocar código)

### Slide 10 — Errores comunes
- Olvidar v_prensa del día
- t₀ mal (pintar ≠ salir del encolador)
- Mezclar metros totales prensa (45 m retorno) con zona activa (16,6 m)
- Confundir SL1/CL/SL2 con Esp.1 / Esp.2 / Esp.3

### Slide 11 — Próximos pasos
Qué falta medir; quién valida; cuándo actualizar el Excel.

### Slide 12 — Cierre / Q&A
Una frase: "El Excel no reemplaza el HMI; es el puente entre cronómetro y simulador."

## FORMATO DE SALIDA
Entrega **dos bloques**:

**A) GUION** — texto lo que dice el presentador, 2–4 frases por slide.

**B) SLIDES** — elige UNO:
- Opción 1: HTML single-file (como presentación encolados: fondo blanco, acento #004E38 verde NOVOPAN, navegación Anterior/Siguiente), O
- Opción 2: Outline para PowerPoint (título + bullets por slide).

Incluye **tablas** solo cuando ayuden; máximo 5 filas por tabla en slides.

## REGLAS
- Español (Ecuador), tú/usted según tono planta (preferir "usted" a supervisores).
- Números con coma decimal (14,5 m/min).
- Citar fórmulas en cajas monoespaciadas cortas.
- Si el Excel tiene macros/VBA, explicar qué hace el botón en lenguaje operador.
- No asumir que la audiencia conoce "downstream" — decir "tramo común blanca → roja → prensa".

## SI FALTA EL EXCEL
Detén la presentación y pide el archivo; no rellenes con datos del simulador salvo los defaults documentados arriba.

Empieza con el inventario de hojas y funciones nuevas del Excel adjunto, luego genera A) y B).
```

---

## Después de que Codex responda

1. Revisa que cada **fórmula del Excel** citada exista en el archivo real.
2. Prueba **un ejemplo** fila por fila con la prueba pintura.
3. Si generó HTML, sirve local:
   ```bash
   cd "parte-2-aglomerados/deck" && python3 -m http.server 8082
   ```
4. Integra el HTML en `deck/` o exporta a PDF para Daniel.

---

## Nota para Manuel

Si el Excel tiene nombre distinto (ej. `MEDICIONES_CAMPO.xlsx`, `Trazabilidad_L1.xlsx`), renómbralo o indícaselo a Codex en la primera línea:

> "El archivo adjunto es `[NOMBRE].xlsx` — versión del [fecha]."

Si quieres que el prompt cite **hojas concretas**, pégame la lista de pestañas del Excel y actualizo este doc.
