# NOVOPAN — Recepción de Madera (IJP-REC-001)
# CONTENIDO MAESTRO — fuente única de verdad

> **Este es el documento que se edita PRIMERO.** Cuando cambies algo aquí, después se propaga a los .docx, al HTML y al PDF. Si hay duda entre dos versiones, gana este archivo.
>
> No te preocupes del formato. Solo escribe el contenido correcto.

---

## 📅 Última actualización

**Fecha y hora:** `2026-06-19 16:07 (-05 ECT)`
**Editor:** Manuel Montúfar / Codex
**Cambios:** Follow-up a revisión Gabriel — limpieza de trazabilidad/changelog para retirar frases antiguas literales de verificación; documentos paralelos alineados; HTML estático regenerado desde `Screens.jsx`; DOCX finales actualizados/renderizados; PDF final re-exportado desde HTML estático. Sin cambios operativos nuevos frente a la revisión 15:35.

> **Ver `CHANGELOG.md` al final del archivo para el historial completo.**

---

# 1. Antes de recibir

## Vista general — qué cubre esta guía

Esta guía explica cómo recibir un camión, registrar el ingreso, tomar muestras, asignar patio, cerrar el ingreso y registrar la descarga.

**Flujo operativo por etapas:**

1. **Antes de recibir** — Llega camión a Balanza 2 (BPS2). Operador identifica tipo de carga y proveedor.
2. **Documentos e ingreso de datos** — Revise documentos. Escanee QR forestal (propios/vuelo forestal) o código de barras (terceros). Llene los campos que falten en ANI.
3. **Peso de entrada** — Capture peso con `F4` cuando los datos del ingreso están completos en ANI y la balanza está en cero.
4. **Humedad / muestra** — Tome la muestra según material; balanza entrega etiqueta/papel al transportista para llevarla al punto de muestreo (patio asignado).
5. **Cierre** — Confirme con `F12`, guarde con `F5`. ANI genera número de ingreso. Entregue RJP-01.
6. **Descarga** — Camión va al patio asignado. Operador de máquina descarga, toma foto del camión vacío y la manda al grupo.
7. **Factory Track** — Operador de descarga registra la transferencia de stock en su Factory Track (ver sección 6).

> ⚠️ **Regla de oro:** el camión NO puede pasar a descargar hasta que ANI genere el número de ingreso.
>
> El orden real en balanza es **llenar/revisar datos del ingreso primero y capturar peso cuando corresponda en ANI**, no "ver el camión y capturar peso" como primer acto.

## Definiciones

| Término | Significado |
|---|---|
| Balanza 2 (BPS2) | Balanza camionera dedicada al ingreso de camiones. |
| Balanza 1 (PS1) | Balanza camionera dedicada a la salida de camiones. |
| Sistema ANI | Sistema donde se registra el ingreso, el peso y todos los datos del embarque. |
| QR forestal | Código del proveedor con datos de bosque, transporte, cosechador, categoría y especie. |
| Guía de circulación | Documento forestal obligatorio para transportar madera, exigido por MAATE. |
| Guía de madera | Documento del proveedor con la descripción del producto despachado. |
| Guía de remisión | Documento tributario que ampara el traslado del material. |
| RJP-01 | Comprobante de peso generado por el sistema ANI. |
| LEF-01 | Lista de precios y forma de pago autorizada por Gerencia. |
| **Patio interno** | **Patios 5, 6, 7, 8 y 21.** |
| **Patio externo** | **De los 21 patios, cualquier patio que no sea 5, 6, 7, 8 o 21. Requiere pase de control.** |
| Ruma | Apilamiento de madera formando una unidad. |
| Tonelada húmeda | 1000 kg de madera húmeda medida con balanza camionera. |
| Tonelada seca | 1000 kg de madera sin humedad, calculada con humedad de balanza analítica. |
| Metro cúbico estéreo | Largo × ancho × altura. |
| Metro cúbico neto | m³ estéreo × factor de apilamiento. |

## Quién hace qué

- **Operador de balanza** — Recibe el camión, captura el peso, registra el ingreso en ANI y toma muestra cuando corresponde.
- **Ayudante de balanza** — Apoya en horas pico y en la toma de muestras.
- **Operador de máquina de descarga** — Descarga en patio, registra Factory Track y toma foto del camión vacío para WhatsApp.
- **Conductor** — Presenta documentos, ubica el camión donde se le indique y sale 15-20 min después de descargar.
- **Supervisor de preparación de madera** — Verifica cumplimiento, autoriza excepciones y atiende fuerza mayor.
- **Jefe de Patios y auxiliar de inventario** — Definen patios, esquema diario y asignación de rumas.
- **Departamento Forestal** — Mantiene LEF-01 y autoriza precios.
- **Sistema de Gestión** — Mantiene el IJP actualizado y asegura la trazabilidad ISO.
- **Departamento Contable** — Crea códigos INFOR. Recepción agrupa y traslada datos.

---

# 2. Ingreso en balanza

## 4.1 Llegada del camión

1. El camión entra y se ubica en Balanza 2.
2. Identifique el tipo de carga antes de capturar el peso.

**Tipos de carga:** Rollizo · Subproducto · Combustible · Reciclado · Residuo.
**Subproductos:** chip, aserrín, viruta, lámina, jampa, retazo.

> Si la carga es combustible, residuo o trasbordo → ir a Excepciones.

**Antes de pesar:** balanza en cero, camión totalmente sobre plataforma, sin objetos tocando.

## 4.2 Capturar peso de entrada (F4)

Presione `F4` en ANI. Compare visualmente que el peso capturado coincida con el peso que muestra la balanza.

## 4.3 Recibir documentos

| Tipo de proveedor | Documentos |
|---|---|
| Propio - rolliza | Guía circulación forestal + Guía madera + Guía remisión |
| Tercero - rolliza | Solo Guía circulación forestal |
| Subproductos terceros | Documentos según normativa + factura para Contabilidad |

> ⚠️ **Aserrín:** pida fotografía del producto enviada por WhatsApp con **geolocalización activada**. Debe mostrar el punto más lejano de carga. Archive con el nombre del número de entrada.

## 4.4 Identificar conductor

Si el camión va a un patio diferente de 5, 6, 7, 8 o 21 → **patio externo**: retenga cédula y entregue pase de control. Si va a 5, 6, 7, 8 o 21 → flujo normal de **patio interno**.

## 4.5 Ingreso de datos en ANI

**Tipos de proveedor:** Propios · Terceros · Vuelo Forestal.

- **Propios / Vuelo Forestal con QR forestal:** escanee el QR, revise lo que ANI llenó solo, complete campos verdes que falten.
- **Terceros con código de barras del proveedor:** escanee el código de barras; ayuda a llenar datos del proveedor, pero **varios campos siguen manuales** (placa, transportista, especie, categoría, ubicación, observación con aserradero).
- **Sin QR (propios/vuelo) o sin código de barras (terceros) / QR falla:** llene manualmente placa, proveedor, transportista, servicio de explotación (mano de obra), categoría, especie, ubicación de descarga, operador de entrada. Si hace ingreso manual → avise a supervisores.

> ⚠️ **No confundir:** "QR forestal" aplica solo a propios y vuelo forestal. **Terceros usa código de barras del proveedor**, no QR. No todos los casos "sin QR" son terceros — forestal también tiene rutas con QR y sin QR.

### Verificación visual de especie/material

Antes y durante la captura del peso, el operador de balanza verifica visualmente que la **especie/material** observado en el camión coincida con lo ingresado manualmente. Es un control rápido pero **puede ser más difícil de noche**.

- Si lo observado **no coincide** con el ingreso manual, debe haber un punto adicional de revisión/corrección **antes de continuar** (escalar al supervisor/responsable definido).

## 4.6 Validar guía

ANI verifica automáticamente que la guía no esté duplicada.

> 🚫 **Si ANI rechaza la guía:** informe al conductor, baje el camión de la balanza, proveedor debe reemitir guía nueva, **NO permita la entrada con guía repetida**.

---

# 3. Recepción de madera ANI (apoyo para 4.5)

## Antes de empezar en ANI

1. Revise si el proveedor es Propios, Terceros o Vuelo Forestal.
2. Si hay QR, escanéelo con el lector de la oficina de balanza.
3. Campos verdes = los que el operador debe llenar o revisar.
4. Campos grises = pueden venir como ejemplo o llenarse solos desde QR.
5. NO permita descargar si ANI rechaza la guía o no existe número de ingreso.

## Propios — con QR

1. Tipo de proveedor: **Propios**. El QR es generado por el área forestal; al escanearlo, ANI prellena **bosque, transporte, cosechador, categoría y especie**.
2. Complete a mano: placa, ubicación descarga, operador entrada, operadores y maquinaria si aplica.
3. Capture peso (F4) → confirme con OK → si hay guía circulación forestal escanee su QR → complete fecha inicio/fin si ANI no las llena → F5 para guardar → anote número y devuelva guía al conductor.

## Propios — sin QR

Seleccione Propios. Llene manualmente todos los datos que normalmente vendrían del QR: placa, proveedor, transportista, servicio de explotación, bosque, cosechador, categoría, especie, ubicación. Capture peso, escanee QR de guía forestal (es obligatorio por MAATE), guarde con F5.

## Terceros — con código de barras

1. Tipo de proveedor: **Terceros**. **Terceros usa código de barras del proveedor (no QR forestal).** El código ayuda a llenar datos del proveedor, pero **varios campos siguen manuales**: placa, transportista, especie, categoría, ubicación descarga + **observación con el aserradero de origen** (ejemplo: EDINCA).
2. Capture peso (F4) verificando balanza en cero. Guarde con F5.

## Terceros — sin código de barras

Llene a mano: placa, proveedor, transportista, servicio de explotación, producto, categoría, especie, ubicación. Escriba aserradero en Observación. Capture peso y guarde.

## Vuelo Forestal

Madera del bosque, ligada al programa de aprovechamiento forestal. Camión debe traer guía circulación forestal con QR, guía madera y guía remisión.

1. Tipo de proveedor: **Vuelo Forestal**. Escanee QR del camión; ANI llena bosque, transporte, cosechador, categoría, especie.
2. Complete: placa, ubicación, operador entrada, categoría y certificación si no se llenaron.
3. Verifique balanza en cero → F4 + OK/F12 → escanee QR de guía forestal obligatoria → revise fechas → F5 → anote número.

## Validaciones y casos especiales

- **Guía duplicada/rechazada:** camión sale, proveedor manda guía nueva.
- **Aserrín:** foto con geolocalización por WhatsApp.
- **Cuándo hacer manual:** QR falla o proveedor sin contrato (solo cuenta). Avise a supervisores.
- **Cuándo anular:** cambió precio acordado, error en datos manuales, ANI no se integró con INFOR.

---

# 4. Humedad y muestras

## 4.7 Cuándo tomar muestra

| Material o caso | Frecuencia |
|---|---|
| Proyecto nuevo: al menos 10 seguidas o mín. una semana calendario | 10 |
| Proyecto antiguo: > una semana | 5 / semana |
| Terceros continuas | 5 / semana |
| Terceros ocasionales | 1 de cada 5 vehículos |
| Subproductos y madera pagada en seco | 100% |
| Subproductos CHIP para análisis de corteza | 100% |

> Criterio del supervisor: si el bosque o el producto lo requiere, se puede muestrear con mayor frecuencia.

## 4.8 Cómo tomar la muestra

- **Madera rolliza:** muestree a 0,6 m del extremo de la troza o al cuarto de su longitud. Diámetro promedio representativo. Viruta con taladro + broca de 1/2 pulgada.
- **Chip y aserrín:** 3 muestras durante la descarga (inicio/mitad/final). Homogeneizar. Funda etiquetada. Llevar al secadero.
- **Tablero, jampa, retazo:** viruta de 3 piezas diferentes. Unificar en una sola funda identificada.

## 4.9 Dónde se toma la prueba

- **Rolliza propia** → prueba en **Balanza** (oficina balanza).
- **Rolliza terceros + aserrín + chip + cualquier subproducto** (todo lo no-rolliza) → prueba en **Control Room Secadero 2**, ubicado en Patio 5.

| Personal | Actividad |
|---|---|
| Operador de balanza | Solo rolliza PROPIOS: muestra y prueba en oficina balanza. |
| Operador de balanza / ayudante inventario | Rolliza TERCEROS y subproductos: recibe muestra en Patio 5 y hace prueba en Control Room Secadero 2. |
| Supervisor de secadero | Apoya muestras de rolliza terceros y subproductos. |

## 4.10 Análisis en balanza analítica

| Parámetro | Valor |
|---|---|
| Temperatura | 125 °C |
| Peso muestra | 2,5 – 3,5 g |
| Desconexión | 1/20 mg/s |
| **Tiempo (rolliza)** | **25 a 40 min** |

1. Coloque la muestra en la balanza analítica.
2. Inicie el análisis.
3. Espere el resultado final.
4. **Lo más importante: anote el % de humedad que muestra el equipo** — ese valor se traslada a ANI y se usa para pagar por tonelada seca.

**Fórmulas:**
- % Humedad = ((Peso inicial húmedo − Peso final seco) / Peso final seco) × 100
- Peso seco = Peso húmedo / ((% Humedad / 100) + 1)

## 4.10.1 Humedad: último filtro antes del cierre

El % de humedad es el **último dato que se digita en ANI antes del cierre del ingreso**. Sin humedad no se puede completar correctamente el registro cuando aplica. Una vez registrado, corregir el valor puede exigir **anular el ingreso y reingresarlo**, con impacto contable.

El operador debe:

- Confirmar el valor del equipo **antes** de digitarlo en ANI (lectura directa de la pantalla de la balanza analítica).
- Si el QR o la cuenta-contrato del proveedor son erróneos → **NO digite la humedad encima**; primero anule y reingrese con datos correctos.

### Si la muestra parece perdida o no procesada

1. **Confirmar con balanza** si la muestra fue tomada.
2. Si la muestra no se tomó o no se encuentra, **escalar al responsable / supervisor** definido para decidir el siguiente paso.

> No tratar promedios de viajes anteriores o doble muestra en viajes posteriores como práctica regular. Son medidas de excepción que decide el supervisor.

## 4.11 Etiqueta y registro

- **A. En balanza** — Para rolliza propios, ANI imprime la etiqueta. Campos: Item, Fecha, N° ingreso, Placa, Humedad, Especie, Instrumento. Tome foto del resultado + etiqueta impresa y guárdela con el número de ingreso.
- **B. Etiqueta/papel para muestra (terceros y subproductos)** — Para rolliza de terceros y subproductos, **balanza entrega una etiqueta/papel al transportista** (puede ser impresa o llenada a mano según el flujo del momento). El **transportista lleva la etiqueta/papel al patio asignado** y la entrega al responsable que toma la muestra. Campos: Item, N° ingreso, Placa, Producto. La prueba se hace en Control Room Secadero 2.
- **C. Registro digital** — Registre el resultado en el archivo compartido "14 % HUMEDADES DE INGRESO-REVXX", carpeta PRODUCCIÓN del OneDrive del Control Room del Secadero 2.

## 4.12 Si el análisis demora

En flujo normal, si la prueba tarda más que la permanencia del camión, registre la salida y deje humedad en blanco. Luego busque por número de ingreso o placa e ingrese el % manualmente en ANI.

> 🚫 **Patios externos: humedad obligatoria.** Si va a patio externo y la humedad es obligatoria para salida, NO cierre salida con humedad en blanco. Avise al supervisor y registre el resultado antes de liberar el cierre.

## 4.12.1 Verificación de humedad en salida — Balanza 1 (PS1) ⚠️ NUEVO

Antes de cerrar la salida del camión en Balanza 1, el operador debe verificar que el % de humedad esté digitado en ANI:

- Si quedó en blanco, búsquelo por número de ingreso o placa, ingrese el valor manualmente, y solo entonces libere el cierre de salida.
- Para patios externos, la humedad en salida es **obligatoria**.

## 4.13 Medición de diámetro

Mida diámetro por especie en un área representativa de 1 m² del total de la carga.

---

# 5. Cierre y excepciones

## 4.14 Asignación de patio

1. Consulte la hoja de rumas actualizada.
2. Revise el grupo de WhatsApp de patios.
3. Verifique esquema RJP-03 para el tipo de material.
4. Indique al conductor el patio asignado.

- **Patios internos** — 5, 6, 7, 8 y 21.
- **Patios externos** — Cualquier otro patio (de los 21 totales); requiere pase de control.

> El operador de balanza comunica el patio. El Jefe de Patios y auxiliar de inventario definen la asignación.

## 4.14.1 Orden de descarga: FIFO con excepción justificada

Como regla general la descarga sigue **FIFO** (primero en entrar, primero en descargar).

En la práctica se puede descargar por **especie** o por **patio** cuando lo justifica el esquema del día (RJP-03) o instrucción del Jefe de Patios. Toda excepción debe estar:
- **Justificada** (motivo claro).
- **Comunicada al supervisor** antes de ejecutarse.
- **Registrada** en el medio que defina el supervisor (WhatsApp del grupo de patios o nota en hoja de turno).

## 4.14.2 Patios y rumas digitales

- Si el operador descarga en un **patio o ruma que no sigue la secuencia** definida, **debe avisar** al jefe de patios o responsable definido.
- Si **físicamente se crea una ruma nueva** que **no existe digitalmente**, hay que **pedir habilitación** al jefe de patios o responsable definido antes de seguir.
- La **ruma digital** funciona como **histórico/control**: permite verificar cambios físicos en el patio contra el sistema.

## 4.15 Cerrar el ingreso (F12 / F5)

1. `F12` para confirmar.
2. `F5` para guardar.
3. ANI genera número de ingreso.
4. Entregue RJP-01 al conductor.
5. Libere el camión hacia su patio.

> 🚫 El camión NO puede pasar a descargar hasta que exista número de ingreso.

## Anulación, reliquidación y nota de crédito

Aplica cuando un ingreso ya cerrado tiene datos incorrectos o problemas de integración.

| Caso | Cuándo aplica | Acción | A quién escalar |
|---|---|---|---|
| **Anulación** | Datos del ingreso quedaron mal (QR forestal erróneo, código de barras de terceros mal, ingreso mal digitado por balanza, ANI no se integró con INFOR). | Se **anula el ingreso y se ingresa nuevamente** con los datos correctos. | Supervisor de balanza / contabilidad (Daniel Aguilar). |
| **Reliquidación** | Se pagó **de menos** por mala categoría/material u otro dato. | El proveedor **emite factura por el faltante** que debe pagarse. | Contabilidad / Departamento Forestal. |
| **Nota de crédito** | Se pagó **de más**. | El proveedor **emite nota de crédito** por el valor que debe descontarse. | Contabilidad. |

Motivos posibles: error en QR forestal, error en código de barras de terceros, ingreso mal digitado por balanza, precio mal ingresado, categoría/material incorrecto, integración fallida con INFOR.

## Excepciones principales

- **Aserrín** — peso + distancia. Tome muestra cada camión y registre distancia origen para pago.
- **Patios externos** — De los 21 patios, externos = todos menos 5, 6, 7, 8, 21. Entrada: retener cédula, pase de control, registrar tarjeta cuando aplique. Salida: devolver cédula contra pase + humedad obligatoria.
- **Combustibles** (DSL, GLP, resina) — solo peso entrada/salida para Bodega. NO entran al flujo ANI.
- **Residuos EMASEO** — flujo simplificado. Registre en hoja Google Drive compartida con Sistema de Gestión. NO genera número ANI.
- **Reciclado** — flujo completo ANI como subproducto. Para biomasa o trituración. Retazos internos = registro interno.
- **Trasbordo** — Si descarga en más de una máquina, regresa a balanza por peso de salida adicional. Registre qué máquina descargó cada parte.
- **Guías inválidas** — Repetida, caducada o inválida → baje el camión, guía nueva.
- **Hora pico** — Turno 2 desde 14:00. Si la fila sale de planta, habilite 2 balanzas de entrada con 2 personas.
- **Fuerza mayor** — ANI falla: documento manual secuencial, anote todo, regularice luego. Sin peso salida: use peso vacío histórico por placa; si no existe, capacidad de vehículo similar. Seguridad o Supervisor pueden verificar pesos.

## Equipos y materiales

- **Balanza:** Taladro DEWALT D25133-B3, 1 broca 1/2", 3 balanzas analíticas, 2 baterías. Almacenado en oficina balanza.
- **Patio 5 / Control Room Secadero 2:** Taladro BOSCH GSB 180-LI, 2 brocas 1/2", 7 balanzas analíticas. Almacenado en oficina descortezador.

## Teclas ANI

- `F4` — Captura peso desde balanza.
- `F12` — Confirma / siguiente paso.
- `F5` — Guarda ingreso y genera número.

---

# 6. Descarga y Factory Track

## 8. Tipos de camiones

- **HINO (con remolque)** — capacidad típica lleno ~11 t. Más espacio para maniobra. Puede requerir desenganchar remolque según patio.
- **Chevrolet (sin remolque)** — capacidad típica lleno ~8-9 t. Maniobra más ágil. Llega más cerca de la ruma.

> ⚠️ Verifique siempre la marca del camión real antes de asumir capacidad — la asignación HINO/Chevrolet a "con/sin remolque" se corrigió en esta revisión.

**Referencia:** si no baja llena → ajustar proporcional.

## 8.1 Antes y después de descargar

**Antes:**
1. Camión sube a Patio 5 o al patio indicado.
2. Si necesita humedad en Patio 5, pasa primero por Patio 5.
3. En el patio asignado, espera una máquina NOVOPAN.
4. Operador de máquina elige bien dónde descargar (en qué parte de la ruma).
5. Si ya hay máquina, se coloca al lado. Si no, espera cerca de la ruma más lejana.

**Después:**
1. La máquina se coloca entre el camión y la ruma.
2. Descargue el material.
3. Tome foto del camión vacío.
4. Envíe la foto al grupo de WhatsApp correspondiente.
5. Desde ese momento, camión tiene 15 min (máx. 20) para salir.

> ⚠️ **Cómo debe quedar la ruma:**
> - Extienda la ruma lo más posible hasta llegar al camino, sin bloquear el paso.
> - **Mantenga la ruma hasta 5 m de altura (excepcionalmente 6 m), pareja, recta, simétrica y aireada.**
> - **Patrón de armado: dos rumas + camino + dos rumas, dejando ~1 m de hueco entre pares.**
> - Siga la misma línea de la ruma anterior: debe quedar recta y alineada.
> - Si la ruma de al lado quedó baja o corta, termine de llenarla antes de empezar una nueva.

## Factory Track — cuentas y equipos

- Cada **Factory Track está asociado a un camión/equipo** y tiene **cuenta y contraseña propia**.
- Las **credenciales las conocen/administran** supervisores, jefe de patios y responsable definido.
- El nombre oficial es **Factory Track** (no "Factori Track").

## Factory Track — paso a paso

| Paso | Pantalla | Acción |
|---|---|---|
| FT-1 | Stock | Entrar a Stock desde el menú (3 rayas arriba si no se ve). |
| FT-2 | Transferencias de stock | Dentro de Stock → Transferencias de stock. |
| FT-3 | Formulario | Orden: almacén origen, artículo, ubicación origen, cantidad, almacén destino, Proceso. |
| FT-4 | Almacén origen | Ingrese **ITMADE**. |
| FT-5 | Artic | Código del artículo descargado. Escanee código de barras del papel para autocompletar. |
| FT-6 | Ubicación origen | Ejemplo: `P09070`. |
| FT-7 | Cantidades | Sistema llena Ctd en exis, Ctd libr, U/M. Revise que aparezcan. Ingrese toneladas en Ctd a transferir. |
| FT-8 | Almacén destino | Ingrese **PREMADE**. |
| FT-9 | Proceso | Finalizar. Baje la máquina y repita con el siguiente camión. |

---

# CHANGELOG — historial de cambios al contenido maestro

> **Regla:** cada cambio aquí se registra arriba del todo con fecha + HORA + autor + qué cambió.

## 2026-06-19 16:07 — Manuel Montúfar / Codex

**Follow-up de cierre al trabajo de Claude:**

- PR #6 ya estaba mergeado en `main`; se completó lo que quedaba en documentos paralelos/adendas.
- Se alinearon los `.md/.jsx` paralelos con la revisión Gabriel: QR forestal vs código de barras terceros, guía repetida bloquea entrada, humedad sin pendiente no aprobado, etiqueta/papel transportista, muestra perdida, anulaciones/reliquidación/nota crédito, Factory Track y patios/rumas digitales.
- Se regeneró `NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html` desde `Screens.jsx`.
- Se actualizaron y renderizaron los DOCX finales; el PDF final se re-exportó desde el HTML estático.
- Se limpiaron changelogs y notas de validación para que las búsquedas literales no reporten frases antiguas como contenido pendiente.

## 2026-06-19 15:35 — Manuel Montúfar / Claude

**Revisión HTML contenido GABRIEL** — cambios aprobados:

**Flujo y formato**
- Flujo general reescrito por etapas (antes de recibir / documentos e ingreso / peso / humedad / cierre / descarga / Factory Track) con énfasis en que **primero se llenan/revisan datos y luego se captura peso** (no "ver camión → capturar peso").
- Se mantiene la regla de oro: no descargar hasta que ANI genere número de ingreso.

**QR forestal vs código de barras de terceros**
- 4.5 reescrita: QR forestal solo aplica a propios/vuelo forestal; **terceros usa código de barras del proveedor**.
- Títulos de terceros ajustados a **con/sin código de barras** en lugar de tratarlos como QR forestal.
- Aclaración: el código de barras de terceros llena datos del proveedor pero **varios campos siguen manuales**.
- **No se agregó procedimiento de "proveedor nuevo / asignación de código de barras"** (no aprobado).

**4.6 Guía repetida**
- Redacción ajustada para bloquear la **entrada** cuando la guía está repetida.

**4.10.1 Humedad**
- **Eliminado** el placeholder no aprobado sobre ubicación de bloqueo de edición por humedad en ANI.
- Conservado: humedad es el último dato antes del cierre; corregirla puede exigir anulación/reingreso con impacto contable.
- Agregado: si la **muestra parece perdida**, primero **confirmar con balanza si fue tomada**, luego escalar al responsable/supervisor. **No** se documenta como práctica regular el promedio de últimos viajes ni el doble muestreo.

**4.11 Etiqueta y registro (terceros/subproductos)**
- Reescrito sin afirmar "balanza imprime y envía automáticamente": **balanza entrega una etiqueta/papel al transportista**; el transportista la lleva al **patio asignado** y la entrega al responsable que toma la muestra.

**Verificación visual de especie/material (4.5)**
- Agregado: operador verifica visualmente especie/material; control rápido pero más difícil de noche; si no coincide con el ingreso manual, punto adicional de revisión/corrección antes de continuar.

**Anulación / Reliquidación / Nota de crédito**
- Nuevo bloque operativo con cuadro caso/acción/escalamiento.

**Camiones HINO/Chevrolet (sección 8)**
- **Corrección importante:** estaban invertidos. Ahora HINO = con remolque (~11 t), Chevrolet = sin remolque (~8-9 t).

**Patios y rumas digitales (4.14.2)**
- Nuevo: avisar si descarga fuera de secuencia; pedir habilitación si se crea ruma física sin registro digital; ruma digital como histórico/control.

**Factory Track**
- Agregado: cada Factory Track asociado a un camión/equipo, cuenta/contraseña propias, credenciales con supervisores/jefe de patios/responsable definido. Nombre oficial: Factory Track.

**No incluido (por instrucción explícita):**
- No se agregó procedimiento de proveedor nuevo / asignación de código de barras.
- No se agregó pendiente sobre ubicación exacta de bloqueo de edición por humedad.
- No se documentó como procedimiento formal el promedio de últimos viajes ni doble muestreo en muestra perdida.

## 2026-06-19 09:53 — Manuel Montúfar

**Creación inicial del documento maestro.** Contenido extraído de `html-app/NOVOPNHTML1_files/Screens.jsx`. Incluye:

- ✅ Altura ruma corregida: 4-5 m → **hasta 5 m (excepcional 6 m), patrón 2+camino+2**.
- ✅ Tiempo análisis muestra rolliza: 20-40 → **25-40 min**.
- ✅ Etiquetado Patio 5: llenar manual → **balanza imprime y envía etiqueta**.
- ✅ Sección nueva **4.10.1 — Humedad: último filtro antes del cierre** + procedimiento anulación.
- ✅ Sección nueva **4.12.1 — Verificación humedad salida Balanza 1 (PS1)**.
- ✅ Sección nueva **4.14.1 — Orden descarga FIFO con excepción justificada**.

**Pendientes generales del borrador v2 (no incorporados como contenido operativo en esta revisión):**
- Ubicación exacta del control de edición por humedad en ANI.
- Procedimiento detallado de anulación por humedad incorrecta / QR / cuenta-contrato errónea.

---

<!-- Próxima entrada arriba de esta línea, sin borrar las anteriores -->
