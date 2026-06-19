# Adenda 2026-06-19 — Contenido nuevo para los IJP

> **Por qué este archivo:** El contenido de abajo NO se pudo insertar automáticamente en los .docx sin riesgo de corromper estilos. Te dejo el texto formateado listo para copiar y pegar en Word en las secciones indicadas.
>
> Ya están en los .docx ACTUALIZADO_2026-06-19: cambios de altura de rumas, tiempo de muestra rolliza, etiquetado desde balanza. Esta adenda queda alineada con la revisión Gabriel del 19-jun-2026.

---

## 1. Insertar en IJP-REC-001 — Sección 4.10 o 4.11 (Análisis en balanza analítica / Etiquetado)

**Ubicación sugerida:** después del párrafo de Tiempo de análisis (25-40 minutos), antes de 4.11 Etiquetado.

**Estilo:** "Heading 3" para el título; cuerpo normal con bullets para la lista.

### 4.10.1  Humedad: último filtro antes del cierre

El % de humedad es el **último dato que se digita en ANI antes del cierre del ingreso**. Sin humedad no se puede completar correctamente el registro cuando aplica. Una vez registrado, corregir el valor puede exigir **anular el ingreso y reingresarlo**, lo cual tiene impacto contable.

Por esto el operador debe:

- Confirmar el valor del equipo **antes** de digitarlo en ANI (lectura directa de la pantalla de la balanza analítica, sin estimaciones).
- Si el QR forestal, el código de barras de terceros o la cuenta-contrato registrada son erróneos, **no digitar la humedad encima**: primero anular el ingreso y reingresarlo con los datos correctos.

**Si la muestra parece perdida o no procesada:**

1. Confirmar con balanza si la muestra fue tomada.
2. Si la muestra no se tomó o no se encuentra, escalar al responsable / supervisor definido.

> No tratar promedios de viajes anteriores o doble muestra en viajes posteriores como práctica regular. Son medidas de excepción que decide el supervisor.

---

## 2. Insertar en IJP-REC-001 — Sección 4.12 (Si el análisis demora) o nueva 4.12.1

**Ubicación sugerida:** justo después del párrafo 4.12 sobre análisis demorado.

**Estilo:** "Heading 4" para el título; cuerpo normal.

### 4.12.1  Verificación de humedad en salida — Balanza 1 (PS1)

Antes de cerrar la salida del camión en Balanza 1, el operador debe verificar que el % de humedad esté digitado en ANI.

- Si quedó en blanco (caso del 4.12), búsquelo por número de ingreso o placa, ingrese el valor manualmente, y solo entonces libere el cierre de salida.
- Para **patios externos**, la humedad en salida es **obligatoria**: no se puede cerrar la salida con humedad en blanco. Si el resultado no está, avise al supervisor y registre el valor antes de liberar el cierre.

---

## 3. Insertar en IJP-REC-001 — Sección 4.14 (Asignación de patio)

**Ubicación sugerida:** al final de 4.14, después del último párrafo.

**Estilo:** "Heading 4" para el título; cuerpo normal.

### 4.14.1  Orden de descarga: FIFO con excepción justificada

Como regla general la descarga sigue **FIFO** (primero en entrar, primero en descargar).

En la práctica, se puede descargar por **especie** o por **patio** cuando lo justifica el esquema del día (RJP-03) o instrucción del Jefe de Patios. Toda excepción al FIFO debe estar:

- **Justificada** (motivo claro: especie crítica, patio saturado, esquema del día).
- **Comunicada al supervisor** antes de ejecutarse.
- **Registrada** en el medio que defina el supervisor (WhatsApp del grupo de patios o nota en hoja de turno).

---

## 4. (Opcional) Insertar en RECEPCION_DE_MADERA_guia_v2 — Sección "Recordatorio para descarga y ruma"

**Ya editado en el docx ACTUALIZADO_2026-06-19:** altura de ruma corregida.

**Pendiente de añadir manualmente si quieres:** la lista de excepciones FIFO arriba (Sección 3), pero en versión condensada porque esta guía es "rápida".

> *Versión condensada para guía rápida:*
> **Orden de descarga:** FIFO por defecto. Si se descarga por especie o patio, debe haber justificación y aviso al supervisor.

---

## Resumen — qué quedó automatizado vs. manual

| Cambio | IJP_FINAL docx | RECEPCION docx | HTML/Screens.jsx | ESTATICO.html |
|---|---|---|---|---|
| Altura ruma 5m/6m + patrón | ✅ auto | ✅ auto | ✅ auto | ✅ auto |
| Tiempo muestra rolliza 25-40 | ✅ auto | (no aplica) | ✅ auto | ✅ auto |
| Etiqueta enviada desde balanza | ✅ auto | (no aplica) | ✅ auto | ✅ auto |
| Humedad último filtro + anulación / muestra perdida | ⚠️ adenda → pegar | ⚠️ adenda opcional | ✅ auto | ❌ rebuild |
| Verificación humedad salida B1 | ⚠️ adenda → pegar | ⚠️ adenda opcional | ✅ auto | ❌ rebuild |
| FIFO con excepción | ⚠️ adenda → pegar | ⚠️ adenda opcional | ✅ auto | ❌ rebuild |

---

**Integración en borradores (19-jun-2026):** Los bloques 4.10.1, 4.12.1 y 4.14.1 están integrados en `IJP-REC-002_Recepcion_Madera_DRAFT.md`. Los docx finales en `docs-finales/` siguen requiriendo pegado manual si aún no se aplicó.
