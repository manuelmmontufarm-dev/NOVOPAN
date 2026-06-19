# IJP-REC-001 Claude Page Plan

Purpose: expand `NOVOPNHTML1.html` so it teaches the full IJP, not only the short summary. The audience is operators, many older, so every screen must be practical, visual, and easy to follow.

Source used: `/Users/manue/Downloads/IJP FINAL.docx`

Extracted images are in:
`/Users/manue/Documents/NOVOPAN/outputs/ijp_final_extracted/`

## Implementation Rules For Claude

- Keep the app in Spanish.
- Use simple operator wording. Short sentences. One idea per line.
- Prefer "Que hago", "Que reviso", "Cuando paro" instead of long procedure paragraphs.
- Keep large readable text and strong contrast.
- Do not invent shortcut keys. The IJP says:
  - `F4`: captura el peso desde la balanza.
  - `F12`: confirma / siguiente paso.
  - `F5`: guarda el ingreso y genera el numero.
- Replace current fake/general content with the real IJP content.
- Add the full descarga and Factory Track section. This is missing from the current HTML.
- Use the real screenshots from the DOCX. Do not use stock photos.
- Ignore `image13.png`; it is a 1x1 spacer.
- Recommended asset move: copy useful images into `NOVOPNHTML1_files/assets/ijp/` and reference them from `Screens.jsx`.

## Image Map

| File | Use |
|---|---|
| `image1.jpg` | DEWALT drill for balanza equipment |
| `image2.jpg` | BOSCH drill and materials for Patio 5 / Secadero 2 |
| `image12.png` | Example photo of empty truck after unloading |
| `image3.png` | Factory Track phone main menu / Stock access |
| `image5.png` | Factory Track menu showing Transferencias de stock |
| `image4.png` | Factory Track transfer form overview |
| `image7.png` | Almacen de origen field with `ITMADE` |
| `image10.png` | Articulo field example |
| `image11.png` | Ubicacion de origen field example |
| `image8.png` | Auto-filled stock quantities |
| `image9.png` | Almacen destino field with `PREMADE` |
| `image6.png` | `Proceso` button to finish transfer |

## Recommended App Structure

Use 5 modules in the left navigation. Inside each module, show step pages or step cards with previous/next controls.

1. Antes de recibir
2. Ingreso en balanza
3. Humedad y muestras
4. Cierre y excepciones
5. Descarga y Factory Track

This keeps the left nav short, while still giving operators one clear task at a time.

## Page-By-Page Plan

### Page 0 - Cover

Title: `Recepcion de Madera y Subproductos`

Subtitle: `Guia de campo para operadores de balanza, patios y descarga`

Small info:
- `IJP-REC-001`
- `Fecha: 16 de junio de 2026`
- `Reemplaza la seccion "Recepcion y registro en balanza" del IJP Rev9`

Button: `Comenzar`

### Page 1 - Que cubre esta guia

Operator text:

`Esta guia explica como recibir un camion, registrar el ingreso, tomar muestras, asignar patio, cerrar el ingreso y registrar la descarga.`

Show a simple flow:

1. Llega camion
2. Peso de entrada
3. Documentos y ANI
4. Muestra de humedad
5. Patio asignado
6. Cierre del ingreso
7. Descarga
8. Factory Track

Callout:

`Importante: el camion no puede pasar a descargar hasta que ANI genere el numero de ingreso.`

### Page 2 - Definiciones que debe conocer

Use a searchable or grouped table. Include all definitions from the IJP:

- Balanza 2 (BPS2): balanza camionera dedicada al ingreso de camiones.
- Balanza 1 (PS1): balanza camionera dedicada a la salida de camiones.
- Sistema ANI: sistema donde se registra ingreso, peso y datos del embarque.
- QR forestal: codigo del proveedor con bosque, transporte, cosechador, categoria y especie.
- Guia de circulacion: documento forestal obligatorio exigido por MAATE.
- Guia de madera: documento del proveedor con la descripcion del producto.
- Guia de remision: documento tributario que ampara el traslado.
- RJP-01: comprobante de peso del sistema ANI.
- LEF-01: lista de precios y forma de pago autorizada por Gerencia.
- Patio interno: patios 5, 6, 7, 8 y 21.
- Patio externo: de los 21 patios, cualquier patio que no sea 5, 6, 7, 8 o 21. Requiere pase de control.
- Ruma: apilamiento de madera.
- Tonelada humeda: 1000 kg de madera humeda.
- Tonelada seca: 1000 kg de madera sin humedad calculada con balanza analitica.
- Metro cubico estereo: largo x ancho x altura.
- Metro cubico neto: m3 estereo x factor de apilamiento.

### Page 3 - Quien hace que

Use role cards, not a dense table. Include:

- Operador de balanza: recibe camion, captura peso, registra en ANI y toma muestra cuando corresponde.
- Ayudante de balanza: apoya en horas pico y toma de muestras.
- Operador de maquina de descarga: descarga en patio, registra transferencia en Factory Track y toma foto del camion vacio para WhatsApp.
- Conductor: presenta documentos, ubica camion en balanza y patio, y sale 15 a 20 minutos despues de descargar.
- Supervisor de preparacion de madera: verifica cumplimiento, autoriza excepciones y atiende fuerza mayor.
- Jefe de Patios y auxiliar de inventario: definen que patio recibe cada material y aprueban rumas.
- Departamento Forestal: mantiene LEF-01 y autoriza precios.
- Encargado de Sistema de Gestion: mantiene el IJP y trazabilidad ISO.
- Departamento Contable: crea codigos INFOR. Recepcion agrupa y traslada datos.

### Page 4 - Llegada del camion

Step title: `4.1 Llegada`

Operator text:

1. `El camion entra y se ubica en Balanza 2.`
2. `Identifique el tipo de carga.`

Show selectable chips:

- Rollizo
- Subproducto: chip, aserrin, viruta, lamina, jampa, retazo
- Combustible: DSL, GLP, resina
- Reciclado
- Residuo: camion EMASEO

Callout:

`Si es combustible, residuo o trasbordo, vaya a Excepciones antes de continuar.`

### Page 5 - Capturar peso de entrada

Step title: `4.2 Peso de entrada`

Operator checklist:

- `La balanza marca cero.`
- `El camion esta completo sobre la plataforma.`
- `No hay objetos tocando la balanza.`

Action:

`Presione F4 en ANI. El sistema captura el peso de entrada automaticamente.`

Verification:

`Compare el peso capturado en ANI con el peso que muestra la balanza. Deben coincidir.`

### Page 6 - Recibir documentos

Step title: `4.3 Documentos`

Use cards by provider:

- Propio - madera rolliza: `Guia de circulacion forestal + Guia de madera + Guia de remision`.
- Tercero - madera rolliza: `Solo Guia de circulacion forestal`.
- Subproductos de terceros: `Documentos segun normativa + factura para Contabilidad`.

Special note:

`Para aserrin, solicite tambien la foto geolocalizada del punto mas lejano donde se hizo la carga. Archive esa imagen en oficina.`

### Page 7 - Identificar al conductor

Step title: `4.4 Conductor`

Operator text:

`Si el camion va a un patio diferente de 5, 6, 7, 8 o 21, tratelo como patio externo: retenga la cedula y entregue pase de control. Si va a patio 5, 6, 7, 8 o 21, continue el flujo normal de patio interno.`

Add a branch button:

- `Patio interno`: continuar.
- `Patios externos`: mostrar reglas de patio externo.

### Page 8 - 4.5 Ingreso de datos en ANI resumido

Step title: `4.5 Ingreso de datos en ANI`

This page must be short in the IJP. It should not carry the full step-by-step from the Recepcion de Madera document. It should summarize the decision and provide a clear button to the detailed HTML module.

Operator text:

`Primero elija el tipo de proveedor. Luego defina si el ingreso viene con QR o si debe llenarse manualmente. Revise campos verdes, capture peso con F4 y guarde con F5 cuando todo este correcto.`

Show three provider chips:

- Propios
- Terceros
- Vuelo Forestal

Show two cards:

- `Si trae QR`: escanear, revisar lo que ANI completo automaticamente, llenar campos verdes faltantes.
- `Si no trae QR o falla`: llenar manualmente placa, proveedor, transporte, ubicacion, categoria, especie y operador.

Button:

- `Ver guia detallada de recepcion de madera`: navigate to the dedicated HTML section `Recepcion madera ANI`.

### Page 9 - Recepcion madera ANI detallada

This new HTML section summarizes `RECEPCION_DE_MADERA_guia_v2 (1).docx` with images from `assets/recepcion_madera/`.

Use sections:

- `Propios con QR`
- `Propios sin QR`
- `Terceros con código de barras`
- `Terceros sin código de barras`
- `Vuelo Forestal con QR`
- `Vuelo Forestal sin QR`
- `Validacion y casos especiales`

Required steps to show:

- Seleccionar tipo de proveedor.
- Escanear QR o codigo de barras si existe.
- Llenar los campos verdes.
- Verificar placa, ubicacion, proveedor y observacion.
- Capturar peso con F4.
- Confirmar con OK o F12 donde aplique.
- Si el camion trae guia de circulacion forestal, escanear el QR de esa guia.
- Guardar con F5 y anotar numero de ingreso.
### Page 10 - Validar guia

Step title: `4.6 Guia duplicada o invalida`

Normal:

`ANI verifica automaticamente que la guia no este duplicada antes de dejar entrar el camion.`

If rejected:

1. `Informe al conductor.`
2. `Baje el camion de la balanza.`
3. `Pida al proveedor una guia nueva.`
4. `No permita descarga con guia repetida.`

Use red warning styling.

### Page 11 - Cuando tomar muestra de humedad

Step title: `4.7 Frecuencia de muestras`

Use a table:

- Proyecto nuevo: `10 muestras seguidas o minimo una semana calendario`.
- Proyecto antiguo mayor a una semana: `5 muestras por semana`.
- Terceros continuas: `5 muestras por semana`.
- Terceros ocasionales: `1 de cada 5 vehiculos (20%)`.
- Subproductos y madera pagada en seco: `100%`.
- Subproductos CHIP para analisis de corteza: `100%`.

Callout:

`El supervisor puede pedir mas muestras si el bosque o producto lo requiere.`

### Page 12 - Como tomar muestra

Step title: `4.8 Metodo de muestra`

Split into three tabs/cards:

Rolliza:
1. `Muestree a 0,6 m del extremo de la troza o al cuarto de su longitud.`
2. `Escoja un diametro promedio.`
3. `Saque viruta con taladro y broca de 1/2 pulgada.`

Chip y aserrin:
1. `Tome tres muestras durante la descarga: inicio, mitad y final.`
2. `Mezcle las tres muestras.`
3. `Coloque en una funda etiquetada.`
4. `Lleve la muestra al secadero.`

Tablero, jampa, retazo y contaminado:
1. `Obtenga viruta de tres piezas diferentes.`
2. `Una la viruta en una sola funda identificada.`

### Page 13 - Donde se toma y quien participa

Step title: `4.9 Distribucion de muestras`

Use location cards:

- Rolliza de proveedores propios: `Balanza`.
- Rolliza de terceros y subproductos: `Patio 5`.
- Operador de balanza: `muestra rolliza propios en oficina balanza`.
- Operador de balanza / ayudante inventario: `recibe muestra en Patio 5 y prueba en Control Room Secadero 2`.
- Supervisor de secadero: `apoya recepcion y prueba segun corresponda`.

### Page 14 - Analisis en balanza analitica

Step title: `4.10 Balanza analitica`

Parameter cards:

- Temperatura: `125 °C`
- Peso de muestra: `2,5 a 3,5 g`
- Desconexion: `1/20 mg/s`
- Tiempo aproximado: `20 a 40 minutos`

Steps:

1. `Coloque la muestra en la balanza analitica.`
2. `Inicie el analisis.`
3. `Espere el resultado final.`

### Page 15 - Etiqueta y registro de humedad

Step title: `4.11 Etiquetado`

Create three cards:

A. En balanza - rolliza propia:
- `ANI imprime etiqueta.`
- Campos: item, fecha, numero de ingreso, placa, humedad, especie, instrumento de muestra.
- `Tome foto del resultado de la balanza analitica junto con la etiqueta impresa.`
- `Guarde la foto con el numero de ingreso.`

B. Patio 5 - terceros y subproductos:
- `Llene etiqueta manualmente.`
- Campos: item, numero de ingreso, placa, producto.
- `Entregue la etiqueta al transportista.`
- `La prueba se hace en Control Room Secadero 2.`

C. Registro digital:
- `Registre la humedad en "14 % HUMEDADES DE INGRESO-REVXX".`
- `Ubicacion: carpeta PRODUCCION del OneDrive del Control Room Secadero 2.`

### Page 16 - Si el analisis demora

Step title: `4.12 Resultado pendiente`

Operator text:

`En el flujo normal, si la prueba de humedad tarda mas que la permanencia del camion, registre la salida y deje humedad en blanco. Luego busque por numero de ingreso o placa e ingrese el porcentaje manualmente en ANI.`

External patio warning:

`Si el camion va a patio externo y la humedad es obligatoria para la salida, no cierre la salida con humedad en blanco. Avise al supervisor y registre el resultado antes de liberar el cierre.`

Later:

`Cuando tenga el resultado, busque el ingreso en ANI por numero de ingreso o placa e ingrese el porcentaje manualmente.`

### Page 17 - Diametro y patio

Step title: `4.13 y 4.14 Diametro y patio`

Diametro:

`Mida el diametro por especie en un area representativa de 1 m2 del total de la carga.`

Patio:

1. `Consulte la hoja de rumas actualizada.`
2. `Revise el grupo de WhatsApp de patios.`
3. `Verifique el esquema RJP-03.`
4. `Indique al conductor el patio asignado.`

Show patio rule:

- `Patios internos`: 5, 6, 7, 8 y 21.
- `Patios externos`: de los 21 patios, cualquier otro patio.

Callout:

`El operador de balanza comunica el patio. El Jefe de Patios y auxiliar de inventario definen la asignacion.`

### Page 18 - Cerrar el ingreso

Step title: `4.15 Cierre`

Steps:

1. `Presione F12 para confirmar.`
2. `Presione F5 para guardar.`
3. `ANI genera el numero de ingreso.`
4. `Entregue RJP-01 al conductor.`
5. `Libere el camion hacia su patio.`

Strong warning:

`No deje pasar el camion a descargar hasta que exista numero de ingreso.`

### Page 19 - Excepciones principales

Create exception cards with "Que hacer":

Aserrin:
- `Se paga por peso y distancia.`
- `Muestra de humedad en cada camion.`
- `Registre distancia del origen para pago.`

Patios externos:
- De los 21 patios, son externos todos menos 5, 6, 7, 8 y 21.
- Entrada: `retener cedula, entregar pase, registrar tarjeta de entrada cuando aplique`.
- Salida: `devolver cedula contra pase, registrar humedad obligatoria`.

Combustibles:
- `Solo pesar entrada y salida como referencia para Bodega.`
- `No entra al flujo completo ANI.`
- `Compra/pago lo maneja Bodega.`

Residuos EMASEO:
- `Flujo simplificado.`
- `Registrar entrada y salida en hoja Google Drive compartida con Sistema de Gestion.`
- `No genera numero de ingreso ANI.`

Reciclado:
- `Flujo completo ANI como subproducto.`
- `Destino: biomasa o trituracion.`
- `Retazos internos se registran como registro interno, no proveedor.`

Trasbordo:
- `Si descarga en mas de una maquina, regresa a balanza para peso de salida adicional.`
- `Registrar maquina que descargo cada parte.`

Guias repetidas, caducadas o invalidas:
- `ANI rechaza. Bajar camion y pedir guia nueva.`

Hora pico turno 2 desde 14:00:
- `Si la fila sale de planta, habilitar dos balanzas de entrada con dos personas.`

Fuerza mayor:
- `Si ANI falla, anotar manualmente todos los datos del embarque y regularizar luego.`
- `Si no se puede pesar salida, usar peso vacio historico por placa.`
- `Si no existe, usar capacidad de vehiculo similar.`
- `Seguridad o Supervisor puede verificar y anotar pesos.`

### Page 20 - Equipos y materiales

Use two side-by-side cards and include images:

Balanza:
- Taladro DEWALT D25133-B3
- 1 broca de 1/2 pulgada
- 3 balanzas analiticas
- 2 baterias
- Se almacena en oficina balanza
- Image: `image1.jpg`

Patio 5 / Control Room Secadero 2:
- Taladro BOSCH GSB 180-LI
- 2 brocas de 1/2 pulgada
- 7 balanzas analiticas
- Se almacena en oficina descortezador
- Image: `image2.jpg`

### Page 21 - Teclas ANI

Use large key caps:

- `F4`: Captura el peso desde la balanza.
- `F12`: Confirma / siguiente paso.
- `F5`: Guarda el ingreso y genera numero.

Remove current wrong key list.

### Page 22 - Descarga: antes y despues

Step title: `8. Actividades de descarga`

Types of machines:

`Hay dos tipos de maquinas: Chevrolet con remolque y otras sin remolque.`

Before unloading:

1. `El camion sube a Patio 5 o al patio indicado.`
2. `Si necesita humedad en Patio 5, pasa primero por Patio 5.`
3. `En el patio asignado, espera una maquina NOVOPAN.`
4. `Si ya hay maquina, se coloca al lado. Si no, espera normalmente cerca de la ruma mas lejana.`

After unloading:

1. `La maquina se coloca entre el camion y la ruma.`
2. `Descarga el material.`
3. `Tome foto del camion vacio.`
4. `Envíe la foto al grupo de WhatsApp correspondiente.`
5. `Desde ese momento, el camion tiene 15 minutos, maximo 20, para salir.`

Image: `image12.png` with caption `Ejemplo de foto del camion vacio`.

### Page 23 - Factory Track: entrar a Stock

Step title: `Factory Track 1 - Menu Stock`

Text:

`Antes de bajar del patio, y despues de descargar, abra Factory Track en el movil de descarga.`

Steps:

1. `Abra el menu principal.`
2. `Si no lo ve, toque las tres rayas de arriba varias veces.`
3. `Elija Stock.`

Image: `image3.png`

### Page 24 - Factory Track: Transferencias de stock

Step title: `Factory Track 2 - Transferencias`

Text:

`Dentro de Stock, entre a Transferencias de stock.`

Image: `image5.png`

### Page 25 - Factory Track: formulario de transferencia

Step title: `Factory Track 3 - Llenar datos`

Text:

`Llene los campos en este orden. No salte campos.`

Image: `image4.png`

Show the ordered list:

1. Almacen de origen
2. Articulo
3. Ubicacion de origen
4. Cantidad a transferir
5. Almacen destino
6. Proceso

### Page 26 - Factory Track: Almacen de origen

Text:

`En Almacen de origen ingrese ITMADE.`

Image: `image7.png`

### Page 27 - Factory Track: Articulo

Text:

`En Artic ingrese el codigo del articulo descargado. Tambien puede escanear el codigo de barras del papel para que se complete solo.`

Image: `image10.png`

### Page 28 - Factory Track: Ubicacion de origen

Text:

`En Ubicacion de origen ingrese la ubicacion. Ejemplo: P09070.`

Image: `image11.png`

### Page 29 - Factory Track: Cantidades

Text:

`El sistema llena solo Ctd en exis, Ctd libr y U/M. Revise que aparezcan antes de continuar.`

Image: `image8.png`

Then:

`En Ctd a transferir ingrese las toneladas.`

Reference:

- `Maquina con remolque llena: aproximadamente 11 toneladas.`
- `Maquina sin remolque llena: aproximadamente 8 a 9 toneladas.`
- `Si la maquina no baja llena, ajuste la cantidad proporcionalmente.`

### Page 30 - Factory Track: Almacen destino

Text:

`En Almacen destino ingrese PREMADE.`

Image: `image9.png`

### Page 31 - Factory Track: Procesar y repetir

Text:

`Seleccione Proceso para finalizar la transferencia.`

Image: `image6.png`

Final step:

`Baje la maquina y repita el registro con el siguiente camion.`

### Page 32 - Repaso rapido por rol

Do not use one combined checklist. Keep the balanza checklist at the end of `Ingreso en balanza` and the descarga checklist at the end of `Descarga y Factory Track`.

Repaso rapido - operador de balanza:

- `Ya identifique el tipo de carga.`
- `Ya revise documentos.`
- `Ya seleccione tipo de proveedor en ANI.`
- `Ya decidi si el ingreso va con QR o manual.`
- `Ya valide que la guia no este repetida.`
- `Ya capture peso con F4.`
- `Ya guarde con F5 y tengo numero de ingreso.`
- `Ya entregue RJP-01 o anote el numero donde corresponde.`
- `Ya confirme si el patio es interno (5, 6, 7, 8 o 21) o externo (cualquier otro patio).`

Repaso rapido - operador de descarga:

- `Ya descargue en el patio asignado.`
- `Ya tome foto del camion vacio.`
- `Ya envie la foto al grupo de WhatsApp correspondiente.`
- `Ya abri Factory Track en Stock.`
- `Ya registre Transferencias de stock.`
- `Ya use ITMADE como almacen de origen.`
- `Ya use PREMADE como almacen destino.`
- `Ya ingrese cantidad a transferir.`
- `Ya presione Proceso.`
- `Ya repeti el registro con el siguiente camion.`

## Content Gaps In Current HTML

Current `Screens.jsx` is only a short demo. Claude must replace these issues:

- Definitions are incomplete and generic.
- Responsibility table is simplified and missing real roles.
- Activity steps use wrong shortcut keys (`F2`, `Enter`) and skip most IJP steps.
- Exceptions are mostly invented and do not match the IJP.
- Equipment list is generic and missing actual DEWALT/BOSCH details and images.
- ANI key list is wrong.
- Documents related section is not from the IJP and can be removed or moved to appendix.
- Full descarga and Factory Track procedure is missing.

## Suggested Component Changes

- Add `ImageFigure` component for screenshots with caption.
- Add `DecisionCard` component for branches such as QR / no QR and internal patio / patios externos.
- Add `OperatorChecklist` for "Revise antes de continuar".
- Add `WarningBox` for guia rechazada, no ingreso before number, and force majeure.
- Keep tables only where comparison helps: definitions, documents, sample frequency, ANI keys.
- For long sections like exceptions, use cards grouped by topic.
