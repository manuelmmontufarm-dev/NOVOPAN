# New Recording 29 - Factory Track, descarga 0.001 e integraciones

**Fecha de procesamiento:** 17 de junio de 2026  
**Audio original:** `/Users/manue/Documents/NOVOPAN/audios/2026-06-17_batch/New Recording 29.m4a`  
**Duracion aproximada:** 00:06:57  
**Transcript TXT:** `/Users/manue/Documents/NOVOPAN/transcripts/2026-06-17_batch/raw/new_recording_29.txt`  
**Transcript SRT/JSON:** `/Users/manue/Documents/NOVOPAN/transcripts_audio_forestal/2026-06-17_batch/new_recording_29.srt` / `/Users/manue/Documents/NOVOPAN/transcripts_audio_forestal/2026-06-17_batch/new_recording_29.json`  
**Confianza:** Media-alta. Terminos ITMADE/PREMADE pueden requerir confirmacion ortografica.

## Resumen ejecutivo

- Explicacion de reporte de descarga en Factory Track: foto por WhatsApp como evidencia y movimiento/reporting minimo 0.001 para generar senal sin mover stock materialmente.
- Se explica un problema de inventario digital: si una ruma no existe o queda en cero, Factory no permite reportar sobre ella; se habilita transfiriendo una cantidad minima.
- Tambien aparece una critica a ANI: sistema comprado/adaptado con modificaciones costosas; posible mejora mediante frontend/API si el sistema permite integracion.

## Hechos operativos extraidos

- Al terminar descarga, operador manda foto al WhatsApp indicando placa/camion descargado.
- En Factory Track entran a stock/inventario, seleccionan origen tipo ITMADE/IDMADE, destino PREMADE/PERMADE, especie/codigo y reportan 0.001 para emitir senal de descarga.
- El 0.001 no busca mover inventario significativo, sino dejar evidencia digital de que se descargo.
- La foto sirve como control de que el reporte no se haga antes de descargar; sin foto, podria culparse al proveedor por demoras de salida.
- Si una ruma nueva no existe en inventario digital, no aparece en Factory; se habilita moviendo una cantidad minima hacia esa ubicacion.
- Se sugiere dejar 0.5 ton digitales en una ruma para que siga visible y se pueda reportar una futura descarga.
- ANI/INFOR/Factory aparecen como sistemas con integracion parcial y friccion operativa.
- Un patron de ruma bien formado: dos continuas, un espacio, dos continuas, un espacio, recto y simetrico.

## Gaps tecnicos completados con research

### Trazabilidad
- ISO 38200:2018 trata la cadena de custodia de madera y productos de madera como un sistema de control para rastrear y manejar material en transporte, recepcion, produccion, venta y salida.
- Para NOVOPAN, esto refuerza la necesidad de conservar una trazabilidad minima entre guia/licencia, proveedor, placa, peso, patio/ruma, movimiento digital y consumo.

## Pendientes por confirmar

- Confirmar escritura exacta: ITMADE, IDMADE, PREMADE, PERMADE, PRIMADE o codigos reales.
- Confirmar si reportar 0.001 afecta algun balance contable/inventario o solo genera evento operacional.
- Validar si ANI tiene API o capa de integracion disponible antes de proponer frontend alternativo.
- Definir si foto WhatsApp seguira siendo evidencia o si Factory debe reemplazarla con timestamp/foto obligatoria.

## Fuentes usadas para completar gaps

- iso_38200: https://www.iso.org/standard/70179.html

## Transcript con timestamps

[00:00:00 - 00:00:05] Manda la foto al whatsapp, manda al grupo indicando que fue descargado tal placa, etc.

[00:00:05 - 00:00:06] Y ya está.

[00:00:06 - 00:00:10] Sube, descarga y manda la foto al whatsapp y ahí se hace algo con el factory, tal.

[00:00:10 - 00:00:29] Y de ahí, ahí sí, coge el factory y debería reportar lo que te digo. Ellos tienen una partecita que ingresan uno que dice stock inventario y ponen de idmade a primade, seleccionan el, como te digo, o escanean el código o ponen manualmente mmat0005 o la especie que sea.

[00:00:29 - 00:00:33] y reporta con 0.001.

[00:00:34 - 00:00:36] Que es para no mover nada, solo es para recibir la señal.

[00:00:36 - 00:00:36] Exacto.

[00:00:37 - 00:00:41] Esa señal nos da para saber si han descargado o no han descargado.

[00:00:42 - 00:00:42] ¿Ya?

[00:00:42 - 00:00:44] ¿Y no pueden reemplazar eso con la foto?

[00:00:44 - 00:00:47] Ya no necesitas la foto, es que me des prácticamente.

[00:00:49 - 00:00:51] Sí, en cierto sentido sí.

[00:00:52 - 00:00:52] Pero...

[00:00:52 - 00:00:55] Te estás diciendo dos veces la misma cosa.

[00:00:55 - 00:00:57] ¿Cómo evidencias tú

[00:00:57 - 00:00:59] Que en el factory no reportan

[00:00:59 - 00:01:02] Antes de descarga?

[00:01:02 - 00:01:04] Pero ahí sí tuvieran que decirles

[00:01:04 - 00:01:05] Que para después de ley

[00:01:05 - 00:01:07] Pero que no sabes quién cumple

[00:01:07 - 00:01:09] Pues por eso en el whatsapp yo me asesorio

[00:01:09 - 00:01:11] Que manden la foto cuando el camión

[00:01:11 - 00:01:13] Realmente está descargado

[00:01:13 - 00:01:15] Porque si no ellos, claro ya se descargó

[00:01:15 - 00:01:17] Que no se tomó, es culpa del proveedor

[00:01:17 - 00:01:20] Ellos por barajarse y no tener la culpa

[00:01:20 - 00:01:21] Culpan a los proveedores que se demoran en salir

[00:01:21 - 00:01:23] Cuando a veces no es así

[00:01:23 - 00:01:26] Oye, y ahí cuando

[00:01:26 - 00:01:28] Cambian del

[00:01:28 - 00:01:30] ITMADE al

[00:01:30 - 00:01:31] PREMADE

[00:01:31 - 00:01:34] ¿Cómo se sabe? Ah, bueno

[00:01:34 - 00:01:35] Eso ya se asocia con el peso

[00:01:35 - 00:01:38] Que calcula balanza para saber exactamente

[00:01:38 - 00:01:40] A ver, verás, ah ya, ahí te explico

[00:01:40 - 00:01:40] Otra cosa

[00:01:40 - 00:01:43] Porque eso al final del día es inventario, ¿no?

[00:01:44 - 00:01:46] Como tú viste, en el ITMADE yo tengo

[00:01:46 - 00:01:48] La ubicación que es el P11001

[00:01:49 - 00:01:50] Sí, que es la

[00:01:50 - 00:01:52] La ruma y el patio, efectivamente

[00:01:52 - 00:02:02] Si, digamos, comienzan a formar una nueva rumba, ellos vienen y a ellos no les reflejan el inventario en el factory porque no está creado ese espacio.

[00:02:02 - 00:02:10] Entonces, a mí es cuando ya se les pidió, deberían avisarme, se va a crear una nueva rumba, por favor verificar si hay en el...

[00:02:10 - 00:02:16] A mí me toca hacer una transferencia de una rumba a una rumba, de una tonelada nomás.

[00:02:16 - 00:02:23] esa una tonelada a ellos les va a reflejar en el sistema para poder reportar el 0.001

[00:02:23 - 00:02:27] que sólo se va a habilitar otra ruma en el factory track para que se detecte

[00:02:27 - 00:02:34] entonces si ellos tienen en el inventario digital todas las rumas como les dije a ellos

[00:02:34 - 00:02:39] si se van a consumir esa ruma deberían dejarme al menos 0.5 para que cuando nuevamente se forme

[00:02:39 - 00:02:44] esa ruma puedan reportar la descarga no sé si me hago entenderlo

[00:02:44 - 00:02:45] Sí, sí, sí, para que exista la ruma.

[00:02:45 - 00:02:47] Si no, estás poniendo madera.

[00:02:47 - 00:02:49] Si ellos se consumen todo, desaparece el factory

[00:02:49 - 00:02:52] y cuando quieren reportarlos, que descargan, no hay.

[00:02:52 - 00:02:54] Y tienen que llamarme a mí para que yo les crezca.

[00:02:54 - 00:02:55] Para habilitar una...

[00:02:55 - 00:02:57] Para que tú le hagas...

[00:02:57 - 00:02:57] ¿Le crees?

[00:02:57 - 00:02:58] Sí, no, no.

[00:02:58 - 00:02:59] Sí te cacho.

[00:02:59 - 00:03:01] Sí te cacho, y es un buen método.

[00:03:01 - 00:03:04] Y este factory track es validado en otras empresas de...

[00:03:04 - 00:03:05] Utaí, sí, lo conozco.

[00:03:05 - 00:03:07] Yo también primera vez que le veo ese factory.

[00:03:07 - 00:03:09] Por ejemplo, sistema ANI, sistema INFO.

[00:03:09 - 00:03:10] ANI es muy poco común.

[00:03:11 - 00:03:11] Es de aquí.

[00:03:12 - 00:03:13] Yo estaba investigando un poco.

[00:03:13 - 00:03:16] Ani yo he visto que, o sea, es de Brasil

[00:03:16 - 00:03:19] Pero el problema que tuvieron con Ani es que compraron

[00:03:19 - 00:03:21] Y la empresa tuvo que adaptarse a Ani

[00:03:21 - 00:03:24] Por eso es que hay muchos conflictos aún en Ani

[00:03:24 - 00:03:27] Y comprar, son bien viejos los sistemas, me parece a mí

[00:03:27 - 00:03:29] Ajá, ¿y cuál es el problema?

[00:03:29 - 00:03:30] Que debería ser al revés

[00:03:30 - 00:03:34] Nosotros desarrollar un sistema que se adapte a nosotros

[00:03:34 - 00:03:36] No nosotros adaptarnos al sistema

[00:03:36 - 00:03:39] Porque si no vamos a tener conflictos

[00:03:39 - 00:03:41] O sea, 100%

[00:03:41 - 00:03:42] Y no es tan difícil desarrollar un sistema

[00:03:42 - 00:03:45] Entonces, eso es lo que yo hago

[00:03:45 - 00:03:47] Hasta ahorita no me cabe en la cabeza

[00:03:47 - 00:03:49] Más barato creo que va a ser desarrollar un sistema

[00:03:49 - 00:03:50] Entonces, ¿cómo es que terminan comprando?

[00:03:50 - 00:03:53] Porque tengo entendido que Ani les costó millones

[00:03:53 - 00:03:54] No te creo

[00:03:54 - 00:03:56] Entonces, no entiendo cómo es que compran ese sistema

[00:03:56 - 00:03:59] En vez de hacer un sistema

[00:03:59 - 00:03:59] Claro

[00:03:59 - 00:04:03] Entonces, no sé, los Juega ya creo que fue conflicto

[00:04:03 - 00:04:05] O por lo menos que los de Ani puedan hacer

[00:04:05 - 00:04:05] Parámetros

[00:04:05 - 00:04:08] Si cuesta tanto, individuales

[00:04:08 - 00:04:10] ¿Cuál es el problema con Ani?

[00:04:10 - 00:04:12] Que ellos, digamos, si nosotros

[00:04:12 - 00:04:15] compramos que se compró, digamos, la aplicación

[00:04:15 - 00:04:16] y se dan cuenta que

[00:04:16 - 00:04:18] nosotros debemos adaptarnos a la esta.

[00:04:18 - 00:04:20] Simplemente es una modificación para que se adapte

[00:04:20 - 00:04:21] el programa a nosotros.

[00:04:22 - 00:04:24] ¿Cuál es la cuestión? Que cuando nosotros pedimos

[00:04:24 - 00:04:26] alguna modificación que nos sirva a nosotros,

[00:04:26 - 00:04:28] nos cobran. Encima más.

[00:04:28 - 00:04:30] Entonces, encima más que

[00:04:30 - 00:04:32] nosotros les compramos, nos siguen cobrando por cada

[00:04:32 - 00:04:34] modificación que es necesario para nosotros.

[00:04:35 - 00:04:36] Entonces, por eso te digo, es ilógico

[00:04:36 - 00:04:38] que haya comprado yo un programa así que esté adaptado

[00:04:38 - 00:04:40] para nosotros y que nosotros nos estemos

[00:04:40 - 00:04:41] adaptando a eso.

[00:04:41 - 00:04:54] Lo que se podría hacer, yo no sé que tanto tú sabes de desarrollo, pero sabes si Ani tiene buenas integraciones API

[00:04:54 - 00:05:03] Porque si tienen, yo he estado desarrollando una aplicación

[00:05:03 - 00:05:05] y lo que se puede ahí hacer

[00:05:05 - 00:05:06] es

[00:05:06 - 00:05:09] no necesariamente puedes cambiar

[00:05:09 - 00:05:11] exactamente que se ingresa

[00:05:11 - 00:05:13] al ANI

[00:05:13 - 00:05:15] pero puedes cambiar la pantalla

[00:05:15 - 00:05:16] frontal que si te puede

[00:05:16 - 00:05:18] full cosas puedes mover desde ahí

[00:05:18 - 00:05:20] entonces al final del día todo se presenta por ANI

[00:05:20 - 00:05:22] pero tú puedes diseñar desde cero

[00:05:22 - 00:05:25] como quieres que se vea, structure

[00:05:25 - 00:05:26] sea el flujo

[00:05:26 - 00:05:29] yo no sé si eso ayuda

[00:05:29 - 00:05:30] en algo

[00:05:30 - 00:05:32] yo creo que sí les puede ayudar

[00:05:32 - 00:05:34] Porque es bien confuso

[00:05:34 - 00:05:35] Es como

[00:05:35 - 00:05:38] O sea no se ve muy amigable

[00:05:38 - 00:05:40] Para un operador nuevo

[00:05:40 - 00:05:42] Recién aprender en un solo día

[00:05:42 - 00:05:43] Tenaz

[00:05:43 - 00:05:48] Yo hice algunos ingresos en balanzos

[00:05:48 - 00:05:50] Si ves unos errores

[00:05:50 - 00:05:53] Ya sabes a quien culpar

[00:05:53 - 00:05:54] A quien te pedir

[00:05:54 - 00:05:58] Yo también cuando recién ingresé acá

[00:05:58 - 00:06:00] Puta también estar sentado con los manes

[00:06:00 - 00:06:01] A cada rato les molestaba

[00:06:01 - 00:06:11] Claro, tener una guía hasta puede estar pegado.

[00:06:12 - 00:06:13] Ahí está bien.

[00:06:13 - 00:06:14] Mira cómo están formados.

[00:06:14 - 00:06:20] Obviamente aquí han pegado tres porque si hubiesen separado uno más no tienen acceso a buscar.

[00:06:20 - 00:06:20] A meter el camión ahí.

[00:06:21 - 00:06:23] Entonces esto es bien formado.

[00:06:24 - 00:06:25] Esto es lo que buscas.

[00:06:25 - 00:06:28] Recto, tengo dos continuas, un espacio.

[00:06:29 - 00:06:30] Dos continuas, un espacio.

[00:06:30 - 00:06:39] y como ves es todo igual, es simétrico, bueno aquí ya digamos se han comido la altura, pero no es mucho, o sea ya no es tan representativo como cuando dejo muy atrás

[00:06:39 - 00:06:48] bien formado, todo recto, taca taca taca, aquí ya sale la girada en chanza pero no le veo tanto conflicto y así sucesivamente

[00:06:48 - 00:06:52] así se debería hacer, así se debería ver todo

[00:06:52 - 00:06:55] pero no hay problema
