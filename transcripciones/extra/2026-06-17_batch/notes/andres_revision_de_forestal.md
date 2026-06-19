# Andres revision de forestal

**Fecha de procesamiento:** 17 de junio de 2026  
**Audio original:** `/Users/manue/Documents/NOVOPAN/audios/2026-06-17_batch/Andres revision de forestal.m4a`  
**Duracion aproximada:** 00:30:42  
**Transcript TXT:** `/Users/manue/Documents/NOVOPAN/transcripts/2026-06-17_batch/raw/andres_revision_de_forestal.txt`  
**Transcript SRT/JSON:** `/Users/manue/Documents/NOVOPAN/transcripts_audio_forestal/2026-06-17_batch/andres_revision_de_forestal.srt` / `/Users/manue/Documents/NOVOPAN/transcripts_audio_forestal/2026-06-17_batch/andres_revision_de_forestal.json`  
**Confianza:** Media-alta. Buena parte es conversacion en balanza con interrupciones; algunos nombres/codigos deben validarse.

## Resumen ejecutivo

- Revision de un instructivo de recepcion de madera en balanza, con foco en ANI, documentos por tipo de proveedor, validacion de guia y diferencias entre ingreso con QR y manual.
- Se confirma el flujo base: camion ingresa a Balanza 2, operador captura peso con F4, solicita documentos, registra/valida datos en ANI, y no debe permitir descarga si la guia forestal es rechazada o duplicada.
- Se observan registros internos para recirculacion de material de planta con codigos sin precio, usados para control de cantidad que vuelve a materia prima.

## Hechos operativos extraidos

- El IJP debe separar recepcion general de madera, ingreso a sistema ANI y excepciones/casos especiales.
- Proveedor propio con madera rolliza: se pide guia de circulacion forestal, guia de madera y guia de remision.
- Proveedor tercero con madera rolliza: se menciona guia de circulacion forestal; para subproductos de terceros se debe revisar documentacion aplicable y factura para contabilidad.
- Si el camion trae QR forestal, ANI prellena datos como bosque, transporte, cosechador, categoria y especie; los campos prellenados deben revisarse antes de validar.
- Si no trae QR o el QR falla, el operador llena manualmente placa, proveedor, transportista, servicio de explotacion, especie, categoria y ubicacion de descarga.
- ANI verifica que la guia no este duplicada. Si rechaza la guia, el conductor debe salir de balanza, el proveedor debe emitir una nueva guia y no se permite descarga.
- Para vuelo forestal manual se mencionan: tipo de proveedor, placa, numero de guia de remision, codigo de proveedor, codigo de transporte, codigo de mano de obra, provincia, canton, material, ubicacion, sitio de descarga, categoria, operador y peso de entrada.
- En vuelo forestal con QR se autollenan datos superiores; luego se escanea la guia forestal y guia de madera. La guia forestal debe tener QR; si no, no sirve para esa validacion.
- Material interno/recirculado puede registrarse con codigo sin rubro/precio cero para controlar cantidad que vuelve a materia prima.

## Gaps tecnicos completados con research

### Guia Forestal
- La guia de circulacion forestal es una autorizacion administrativa para movilizar productos forestales maderables dentro del pais; el tramite oficial exige registro en el SAF, licencia/autorizacion de aprovechamiento e impresion de la guia en SAF.
- La guia debe relacionarse con la licencia de aprovechamiento forestal al momento de generarse. Esto respalda que, operativamente, la guia forestal no sea opcional en balanza.
- La norma tecnica MAATE define la guia de circulacion de productos forestales maderables como documento oficial que ampara legalmente el transporte de productos forestales maderables.

### Trazabilidad
- ISO 38200:2018 trata la cadena de custodia de madera y productos de madera como un sistema de control para rastrear y manejar material en transporte, recepcion, produccion, venta y salida.
- Para NOVOPAN, esto refuerza la necesidad de conservar una trazabilidad minima entre guia/licencia, proveedor, placa, peso, patio/ruma, movimiento digital y consumo.

## Pendientes por confirmar

- Confirmar nombre exacto de campos ANI para vuelo forestal: proveedor, transporte, mano de obra, ubicacion y categoria.
- Confirmar si todos los terceros requieren guia de remision ademas de guia forestal, o solo ciertos subproductos/facturacion.
- Tomar capturas de pantalla para el flujo de vuelo forestal con QR y sin QR.
- Confirmar nombre/codigo de registros internos de recirculacion con precio cero.

## Fuentes usadas para completar gaps

- gob_ec_maderables: https://www.gob.ec/mae/tramites/emision-guias-circulacion-movilizacion-productos-forestales-maderables-pais
- gob_ec_no_maderables: https://www.gob.ec/mae/tramites/emision-guias-circulacion-movilizacion-productos-forestales-no-maderables-pais
- maate_norma_export_import: https://www.ambienteyenergia.gob.ec/ambiente/wp-content/plugins/download-monitor/download.php?force=1&id=14391
- iso_38200: https://www.iso.org/standard/70179.html

## Transcript con timestamps

[00:00:00 - 00:00:02] Documento empezado.

[00:00:07 - 00:00:15] Ahorita lo que fuera chévere, ¿qué es lo que me falta? Vea lo que tengo hecho. Es un instructivo, es lo que me mandaron a hacer.

[00:00:16 - 00:00:24] Entonces, tiene las definiciones al principio, después responsabilidad y autoridad.

[00:00:24 - 00:00:25] entonces operador de balanza

[00:00:25 - 00:00:28] recibir el camión, capturar el peso

[00:00:28 - 00:00:29] registrar ingreso en NANI

[00:00:29 - 00:00:32] tomar las muestras de humedad cuando corresponda

[00:00:32 - 00:00:33] y se va más a detalle aquí abajo

[00:00:33 - 00:00:36] actividades 4.1

[00:00:36 - 00:00:37] llega el camión

[00:00:37 - 00:00:39] el camión entra y se ubica en balanza 2

[00:00:39 - 00:00:40] el operador identifica el tipo de carga

[00:00:40 - 00:00:44] registra su producto, combustible, reciclado, residuo

[00:00:44 - 00:00:45] si la carga es un caso especial

[00:00:45 - 00:00:48] combustible, residuo, transbordo

[00:00:48 - 00:00:50] continúa la sección 5 excepciones

[00:00:50 - 00:00:51] porque son diferentes

[00:00:51 - 00:00:54] dígame entonces

[00:00:54 - 00:00:56] si le parece que algo está fuera de lugar

[00:00:56 - 00:01:01] 4.2 captura de peso de entrada

[00:01:01 - 00:01:02] verificar que la balanza muestre

[00:01:02 - 00:01:04] 0 y que el camión esté totalmente

[00:01:04 - 00:01:06] sobre la plataforma, presionar F4 en AN

[00:01:06 - 00:01:08] y capturar automáticamente el peso de entrada

[00:01:08 - 00:01:11] verificar visualmente que el peso capturado

[00:01:11 - 00:01:13] coincida con el que muestre la balanza

[00:01:13 - 00:01:16] 4.3 recepción de documentos

[00:01:16 - 00:01:19] solicitar al conductor los documentos según el tipo de proveedor

[00:01:19 - 00:01:20] entonces si es propio

[00:01:20 - 00:01:22] Madera Rolliza, se pide la guía de circulación

[00:01:22 - 00:01:23] forestal, la guía de

[00:01:23 - 00:01:26] madera y la guía de remisión

[00:01:26 - 00:01:27] ¿correcto?

[00:01:28 - 00:01:29] Tercero, Madera Rolliza

[00:01:29 - 00:01:31] solo guía de circulación forestal

[00:01:31 - 00:01:34] su producto de terceros, documentación

[00:01:34 - 00:01:36] según normativa, más factura para el

[00:01:36 - 00:01:37] departamento de contabilidad

[00:01:37 - 00:01:42] ¿en esta de aquí?

[00:01:42 - 00:01:43] ¿en cuál?

[00:01:44 - 00:01:45] ¿en su producto de terceros?

[00:01:50 - 00:01:55] bueno en este caso le especifica

[00:01:55 - 00:02:00] o sea claro los documentos que entran los terceros son con el código del proveedor

[00:02:00 - 00:02:02] y el documento que viene a hacer la guía de

[00:02:02 - 00:02:03] en todos

[00:02:03 - 00:02:06] en todos

[00:02:06 - 00:02:07] en este caso aquí

[00:02:07 - 00:02:12] en la parte de arriba en el rellizo

[00:02:12 - 00:02:14] aquí sería de especificar si es que

[00:02:14 - 00:02:16] en este caso si entra con cuero

[00:02:16 - 00:02:18] no se piden

[00:02:18 - 00:02:24] el código de varas

[00:02:24 - 00:02:25] de cada transportista

[00:02:25 - 00:02:27] son los codiguinos

[00:02:27 - 00:02:32] con eso se llena

[00:02:32 - 00:02:33] o eso se pide

[00:02:33 - 00:02:35] en caso de que no venga con el QR

[00:02:35 - 00:02:38] cuando viene con QR ya llena toda la información

[00:02:38 - 00:02:42] claro, pero igual necesita usted pedir

[00:02:42 - 00:02:43] la guía de circulación forestal

[00:02:43 - 00:02:45] eso va después

[00:02:45 - 00:02:48] para serrín

[00:02:48 - 00:02:50] solicitar también fotografía

[00:02:50 - 00:02:53] bueno eso va después, eso es una excepción

[00:02:53 - 00:02:55] 4.4

[00:02:55 - 00:02:56] identificación del conductor

[00:02:56 - 00:02:57] si el camión va a patio externo

[00:02:57 - 00:03:00] retener la cédula y entregar el pase

[00:03:00 - 00:03:01] control

[00:03:01 - 00:03:04] 4.5 ingreso a sistemas ANI

[00:03:04 - 00:03:06] eso le estoy haciendo

[00:03:06 - 00:03:07] otro documento

[00:03:07 - 00:03:10] más específico

[00:03:10 - 00:03:12] con los, esto ya le empezó

[00:03:12 - 00:03:13] Gabriel

[00:03:13 - 00:03:23] pero eso ya te circula y todo, pero bueno, lo que está aquí es opción A, el camión trae QR forestal, escanea el QR con lector,

[00:03:24 - 00:03:29] ANI prellena automáticamente bosque, transporte, cosechador, categoría y especie, revisar los campos prellenados,

[00:03:30 - 00:03:36] si alguno estaba haciendo incorrecto, completarlo manualmente, opción B, el camión no trae forestal,

[00:03:36 - 00:03:43] Llenar manualmente ANI, placa de vehículo, proveedor, transportista, servicio de explotación, especie, categoría, ubicación de descarga.

[00:03:44 - 00:03:46] Aplica sobre todo a proveedores terceros.

[00:03:48 - 00:03:50] 4.6. Validación de la guía.

[00:03:51 - 00:03:54] ANI verifica automáticamente que la guía no esté duplicada en el sistema.

[00:03:54 - 00:03:57] Se verifica que no sea duplicada antes de dejar entrar.

[00:03:57 - 00:04:04] Si ANI rechaza la guía, informar al conductor que el camión debe salir de la balanza, el proveedor debe remitir una nueva guía.

[00:04:04 - 00:04:06] No se debe permitir la descarga.

[00:04:06 - 00:04:09] Por ahí es todo bien, ¿no?

[00:04:10 - 00:04:10] Sí.

[00:04:10 - 00:04:11] Muy buenas.

[00:04:11 - 00:04:12] Muy bien.

[00:04:15 - 00:04:16] ¿Cómo le va?

[00:04:27 - 00:04:28] Siemprele, por favor.

[00:04:36 - 00:04:37] ¿Qué es el código?

[00:04:37 - 00:04:38] Por favor.

[00:05:06 - 00:05:09] cargado demasiado

[00:05:09 - 00:05:12] 31 toneladas

[00:05:12 - 00:05:15] 9 300

[00:05:15 - 00:05:18] mucho

[00:05:18 - 00:05:22] no sé cargar y a ese precio

[00:05:22 - 00:05:25] yo 27, 26

[00:05:25 - 00:05:29] en la lista un montón

[00:05:29 - 00:05:31] ...

[00:05:59 - 00:06:00] ¿A dónde va?

[00:06:06 - 00:06:09] ¿Ya se acabó el Los Ángeles o todavía hay leyes?

[00:06:11 - 00:06:13] ¿No está quedando en Pedernales?

[00:06:13 - 00:06:14] ¿No está quedando en Pedernales?

[00:06:14 - 00:06:15] ¿No está quedando en Pedernales?

[00:06:15 - 00:06:16] ¿No está quedando en Pedernales?

[00:06:16 - 00:06:17] ¿No está quedando en Pedernales?

[00:06:17 - 00:06:18] ¿No está quedando en Pedernales?

[00:06:18 - 00:06:19] ¿No está quedando en Pedernales?

[00:06:19 - 00:06:20] ¿No está quedando en Pedernales?

[00:06:20 - 00:06:22] Patio 12, por favor.

[00:06:23 - 00:06:24] ¿A qué patio toca?

[00:06:24 - 00:06:25] Patio 12.

[00:06:26 - 00:06:27] ¿Abajo la planadita, diga?

[00:06:27 - 00:06:28] Sí.

[00:06:28 - 00:06:29] Disculpa.

[00:06:33 - 00:06:35] ¿Qué?

[00:06:35 - 00:06:38] Ah, sí, claro.

[00:06:50 - 00:07:20] La Baja

[00:07:20 - 00:07:47] ¿Qué máquina le descargó?

[00:07:47 - 00:07:54] La chevrode?

[00:07:54 - 00:07:55] Si

[00:07:55 - 00:07:56] ¿Qué?

[00:08:25 - 00:08:26] Gracias.

[00:08:55 - 00:09:25] ¿Qué pasa?

[00:09:25 - 00:09:26] Gracias.

[00:09:55 - 00:09:56] Gracias.

[00:10:25 - 00:10:55] ¿Qué es lo que se hace?

[00:10:55 - 00:11:04] En este caso también hacemos ingresos por ejemplo de esos de lo que decía de los retazos

[00:11:04 - 00:11:11] tableros, salen también recortes de acá dentro de ciertas áreas que recolectan también.

[00:11:11 - 00:11:17] Entonces todo eso se recircula y sube para arriba.

[00:11:17 - 00:11:19] Pero sale de la planta?

[00:11:19 - 00:11:20] Claro.

[00:11:20 - 00:11:21] Y vuelve a entrar?

[00:11:21 - 00:11:24] Claro, o sea vuelve a recircular y sube arriba los molines.

[00:11:24 - 00:11:31] pero eso ya se categoriza como registro interno

[00:11:31 - 00:11:35] también se mete al sistema pero es un registro interno

[00:11:35 - 00:11:37] buenos días

[00:11:37 - 00:11:45] ¿cuántos tienen?

[00:11:45 - 00:11:45] ¿Cuántos tienen?

[00:11:46 - 00:11:46] Dos.

[00:11:46 - 00:11:46] Dos.

[00:12:15 - 00:12:23] ¿Laminado?

[00:12:23 - 00:12:23] Sí.

[00:12:24 - 00:12:24] Gracias.

[00:12:33 - 00:12:34] Buenos días.

[00:12:34 - 00:12:34] Buenos días.

[00:12:38 - 00:12:41] Por ejemplo, este material lo que le saco.

[00:12:43 - 00:12:43] ¿Tem?

[00:12:43 - 00:12:53] Ah, pero él mismo va y recoge del lado de allá las que tienen fallas.

[00:12:53 - 00:12:55] ¿Y usted le deja entrar nomás?

[00:12:55 - 00:12:56] O sea, sin registro.

[00:12:57 - 00:12:59] O sea, sí, es lo que estoy haciendo el registro aquí.

[00:13:00 - 00:13:01] Ah, ya, ese es el registro.

[00:13:03 - 00:13:08] Hay un código que, por ejemplo, este código no tiene precio.

[00:13:09 - 00:13:09] Claro.

[00:13:09 - 00:13:14] Registren el sistema, pero no tiene precio. Tiene precio a cero.

[00:13:15 - 00:13:17] Déjame tomar una foto para incluirle.

[00:13:23 - 00:13:24] Ya ves.

[00:13:34 - 00:13:34] ¡Flaja!

[00:13:39 - 00:13:41] ¿De dónde?

[00:13:41 - 00:13:43] ¿De qué?

[00:13:43 - 00:13:45] ¿Qué trae?

[00:13:45 - 00:13:47] ¿De dónde?

[00:13:47 - 00:13:49] ¿De qué trae?

[00:13:49 - 00:13:51] ¿De dónde?

[00:13:51 - 00:13:53] ¿De qué trae?

[00:13:53 - 00:13:55] ¿De dónde trae?

[00:13:55 - 00:13:57] ¿De dónde trae?

[00:13:57 - 00:13:59] ¿De dónde trae?

[00:13:59 - 00:14:01] ¿De dónde trae?

[00:14:01 - 00:14:03] ¿De dónde trae?

[00:14:03 - 00:14:05] ¿De dónde trae?

[00:14:05 - 00:14:07] ¿De dónde trae?

[00:14:07 - 00:14:08] ¿Qué es el primer?

[00:14:37 - 00:14:38] Gracias.

[00:15:07 - 00:15:16] No sabes que todo es para cálculo de cuánta cantidad entra para materia prima para producción.

[00:15:17 - 00:15:19] Por eso es pesado.

[00:15:20 - 00:15:21] Ok, ok, pero se pesa.

[00:15:22 - 00:15:22] Claro.

[00:15:23 - 00:15:27] Pero es con un código que no tiene arubro de cópito.

[00:15:28 - 00:15:29] Ya, claro.

[00:15:29 - 00:15:29] No tiene arubro.

[00:15:29 - 00:15:30] Tiene sentido.

[00:15:30 - 00:15:34] Bueno, y para esta recepción de madera

[00:15:34 - 00:15:35] Que le tengo al específico

[00:15:35 - 00:15:37] Lo único que falta es los ingresos

[00:15:37 - 00:15:38] Vuelo forestal

[00:15:38 - 00:15:39] Que es diferente

[00:15:39 - 00:15:42] Para forestal propios

[00:15:42 - 00:15:45] Claro, en este caso entraría como terceros

[00:15:45 - 00:15:48] Claro, pero para forestal

[00:15:48 - 00:15:49] Hay que ver como fuera

[00:15:49 - 00:15:50] Necesito que me explique el proceso

[00:15:50 - 00:15:53] Con I5R

[00:15:53 - 00:15:54] Para poder anotar

[00:15:54 - 00:15:55] Y hacerle la guía

[00:15:55 - 00:15:57] ¡Ay, no, no, no, no!

[00:16:11 - 00:16:13] ¡Dé, lo último!

[00:16:25 - 00:16:26] Gracias.

[00:16:55 - 00:16:57] ¿Puedo ver la limión?

[00:17:25 - 00:17:37] La placa por favor

[00:17:37 - 00:17:39] La PAA

[00:17:39 - 00:17:41] 3791

[00:17:41 - 00:17:46] Transbuana Ulisa

[00:17:46 - 00:17:46] Si

[00:17:55 - 00:18:25] ¿Qué pasa?

[00:18:25 - 00:18:48] ¿Qué paso sería primero en la placa?

[00:18:48 - 00:18:49] A ver.

[00:18:49 - 00:18:50] ¿El tipo de proveedor?

[00:18:50 - 00:18:52] Primero tipo de proveedor, sí.

[00:18:53 - 00:18:53] Y ahí la placa.

[00:18:55 - 00:18:58] Para vuelo forestal

[00:18:58 - 00:19:00] La placa

[00:19:00 - 00:19:06] El número de la guía de remisión

[00:19:06 - 00:19:10] Código de proveedor

[00:19:10 - 00:19:15] Código de transporte

[00:19:15 - 00:19:20] Pero esto es con QR o el QR de auto llenable

[00:19:20 - 00:19:22] El auto llenable ya se llena

[00:19:22 - 00:19:25] Claro

[00:19:25 - 00:19:26] Claro, claro, a ver ya

[00:19:26 - 00:19:29] Tendríamos que hacerle una captura

[00:19:29 - 00:19:31] Sí, a ver, hagamos del manual

[00:19:31 - 00:19:33] Ya, eso es lo que le dije

[00:19:33 - 00:19:36] Con un código de proveedor

[00:19:36 - 00:19:37] Código de transporte

[00:19:37 - 00:19:38] Y código de mano de obra

[00:19:38 - 00:19:44] Ahí sería

[00:19:44 - 00:19:47] El campo de provincia

[00:19:47 - 00:19:51] Sí, claro

[00:19:51 - 00:19:52] Cantón

[00:19:52 - 00:19:54] El tipo de material

[00:19:54 - 00:19:55] en este caso

[00:19:55 - 00:19:57] relliza o su producto

[00:19:57 - 00:19:58] no, relliza sería

[00:19:58 - 00:20:00] pero este está para propios

[00:20:00 - 00:20:02] sí, está para vuelos también

[00:20:02 - 00:20:04] para vuelos también

[00:20:04 - 00:20:06] ahí sería

[00:20:06 - 00:20:08] la ubicación

[00:20:08 - 00:20:10] la ubicación

[00:20:10 - 00:20:11] el sitio de descarga

[00:20:11 - 00:20:14] ahí sería la categoría

[00:20:15 - 00:20:18] y ahí sería el campo

[00:20:18 - 00:20:19] de

[00:20:19 - 00:20:22] operador de entrada

[00:20:22 - 00:20:24] operador quien registra

[00:20:24 - 00:20:26] el registro

[00:20:26 - 00:20:29] y ahí sería

[00:20:29 - 00:20:30] el peso de

[00:20:30 - 00:20:32] registrar peso

[00:20:32 - 00:20:33] de entrada

[00:20:54 - 00:21:13] ¿Está vacío?

[00:21:13 - 00:21:14] ¿Está vacío?

[00:21:24 - 00:21:25] Gracias.

[00:21:54 - 00:22:24] La Baja

[00:22:24 - 00:22:25] Gracias.

[00:22:54 - 00:23:24] ¿Qué pasa?

[00:23:24 - 00:23:54] este material es de vuelo

[00:23:54 - 00:24:01] ¿Ves el ajustes en la derecha?

[00:24:01 - 00:24:02] Buenas.

[00:24:12 - 00:24:13] Ahí está.

[00:24:14 - 00:24:15] Ese dice.

[00:24:17 - 00:24:18] Ya.

[00:24:21 - 00:24:22] Chéder, hágale lentito.

[00:24:22 - 00:24:24] Ahí también me va diciendo

[00:24:24 - 00:24:31] Pongan el código QR

[00:24:31 - 00:24:33] Lleno el QR

[00:24:33 - 00:24:42] Simplemente

[00:24:42 - 00:24:44] Es salir a la puerta

[00:24:44 - 00:24:49] Número de placa

[00:24:49 - 00:24:50] TBL

[00:24:50 - 00:24:53] 7886

[00:24:53 - 00:24:55] Timbrele nuevamente al puero

[00:24:55 - 00:25:05] ¿Qué máquina le ayudó a descargar?

[00:25:05 - 00:25:07] La 3

[00:25:07 - 00:25:10] La X2

[00:25:10 - 00:25:12] La X2

[00:25:12 - 00:25:13] No, no va a tirar nada

[00:25:13 - 00:25:15] No, no va a tirar nada

[00:25:15 - 00:25:16] No va a tirar nada

[00:25:16 - 00:25:17] No va a tirar nada

[00:25:17 - 00:25:19] No va a tirar nada

[00:25:19 - 00:25:49] 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 14, 15, 16, 17, 18, 19, 20, 20, 21, 21, 22, 22, 23, 24, 25, 26, 27, 28, 29, 29, 30, 29, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30

[00:25:49 - 00:25:50] Claro, eso le ponen arriba.

[00:25:52 - 00:25:55] Y si no, ese producto le deja guardar sin humedad o no le deja.

[00:25:55 - 00:25:55] Sí.

[00:25:56 - 00:25:56] Por si acaso.

[00:26:06 - 00:26:07] Ahí ya le escaneó el QR.

[00:26:07 - 00:26:07] Sí.

[00:26:08 - 00:26:09] Se autosnino toda la parte de arriba.

[00:26:15 - 00:26:18] Ahí le escanea la guía forestal.

[00:26:19 - 00:26:22] ¿Es la guía forestal esa?

[00:26:22 - 00:26:23] Sí

[00:26:23 - 00:26:41] Después vas a ver la guía de madera

[00:26:41 - 00:26:54] Verifica

[00:26:54 - 00:26:57] Mano de obra

[00:26:57 - 00:27:02] Código de transporte y proveedor

[00:27:02 - 00:27:04] Código de transporte y proveedor

[00:27:04 - 00:27:09] Y anote el número de ingreso

[00:27:09 - 00:27:16] con la guía de madera.

[00:27:16 - 00:27:43] Salida?

[00:27:43 - 00:27:43] Salida?

[00:27:43 - 00:27:45] Un segundo

[00:27:45 - 00:28:15] ¿Qué?

[00:28:15 - 00:28:16] Salida

[00:28:16 - 00:28:22] ¿Cuál es su número de placa?

[00:28:22 - 00:28:23] ¿Un número de placa?

[00:28:23 - 00:28:25] TBK 8692

[00:28:25 - 00:28:28] Chévere

[00:28:28 - 00:28:36] ¿Máquina de descarga?

[00:28:36 - 00:28:37] La fija

[00:28:37 - 00:28:38] ¿Cuál es la fija?

[00:28:38 - 00:28:39] Case 2

[00:28:39 - 00:28:43] Ah, la Case 2

[00:28:43 - 00:28:44] Chévere

[00:28:44 - 00:28:51] no sé qué no como

[00:28:51 - 00:28:55] sí

[00:28:55 - 00:28:58] sí

[00:28:58 - 00:29:01] ciento

[00:29:01 - 00:29:02] Sí, por qué.

[00:29:04 - 00:29:05] ¿Ahí queda?

[00:29:05 - 00:29:05] Sí.

[00:29:07 - 00:29:08] Ya, síganme.

[00:29:10 - 00:29:11] Ahí, ya, se puso solo.

[00:29:12 - 00:29:13] Póngale, enviar.

[00:29:14 - 00:29:15] Ya, sí.

[00:29:17 - 00:29:18] Ya, me dio.

[00:29:31 - 00:29:33] No.

[00:29:48 - 00:29:50] Llega, lo estoy entrando a la fábrica de salvar.

[00:29:50 - 00:30:03] Y la única diferencia es que si no tiene QR todo se llena manual

[00:30:03 - 00:30:16] Pero la guía forestal esa de ley tiene que tener QR

[00:30:16 - 00:30:20] Claro

[00:30:20 - 00:30:23] Si no, no sirve.

[00:30:26 - 00:30:28] Por lo menos de esa parte siempre es automático.

[00:30:28 - 00:30:29] ¿Ese es el número del código?

[00:30:31 - 00:30:32] ¿De la guía?

[00:30:32 - 00:30:36] Este es el código QR.

[00:30:37 - 00:30:38] Ah, ya, chevere.
