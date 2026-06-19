# New Recording 30 - consumo, transferencias y diferencias fisico-digital

**Fecha de procesamiento:** 17 de junio de 2026  
**Audio original:** `/Users/manue/Documents/NOVOPAN/audios/2026-06-17_batch/New Recording 30.m4a`  
**Duracion aproximada:** 00:05:15  
**Transcript TXT:** `/Users/manue/Documents/NOVOPAN/transcripts/2026-06-17_batch/raw/new_recording_30.txt`  
**Transcript SRT/JSON:** `/Users/manue/Documents/NOVOPAN/transcripts_audio_forestal/2026-06-17_batch/new_recording_30.srt` / `/Users/manue/Documents/NOVOPAN/transcripts_audio_forestal/2026-06-17_batch/new_recording_30.json`  
**Confianza:** Media-alta para flujo de consumo; hay incertidumbre declarada sobre momento exacto de reporte.

## Resumen ejecutivo

- Explicacion del flujo de consumo desde rumas hacia planta, usando Factory Track para transferir de inventario/patio a consumo.
- Se diferencia el reporte de descarga 0.001 del reporte de consumo por toneladas reales/estimadas del viaje, como 11, 8 o 4 toneladas secas.
- El problema principal es la diferencia entre inventario fisico y digital: si digital se agota antes que la ruma fisica, operadores pueden tomar stock digital de otra ruma para reportar consumo.

## Hechos operativos extraidos

- Para consumo, se entrega/lista al supervisor y balanza que rumas deben consumirse.
- Los camiones se parquean al lado de la ruma y cargan madera para planta/triturador/chip.
- En Factory Track buscan ruma/codigo, colocan origen IDMADE/ITMADE, especie M-MAT-003 u otro codigo, y destino PREMADE/PERMADE.
- Un viaje tipico de consumo se estima en aproximadamente 11 toneladas secas, aunque puede ser 8, 4 u otra cantidad si la ruma se acaba.
- Reportes de 11/8/4 se interpretan como consumo; reportes de 0.001 como descarga.
- No queda confirmado si el reporte de consumo debe hacerse al cargar en patio o al descargar en planta.
- Si una ruma con 50 toneladas digitales se consume fisicamente en mas/menos viajes de lo estimado, aparece diferencia fisico-digital.
- Mala practica identificada: tomar stock digital de otra ruma para poder reportar consumo real de una ruma agotada digitalmente.
- Idea de mejora: reportar porcentaje de llenado o carga estimada para ajustar toneladas con mas realismo.

## Gaps tecnicos completados con research

### Trazabilidad
- ISO 38200:2018 trata la cadena de custodia de madera y productos de madera como un sistema de control para rastrear y manejar material en transporte, recepcion, produccion, venta y salida.
- Para NOVOPAN, esto refuerza la necesidad de conservar una trazabilidad minima entre guia/licencia, proveedor, placa, peso, patio/ruma, movimiento digital y consumo.

### Factor Apilamiento
- La literatura tecnica define el factor de conversion/apilamiento como la relacion entre volumen neto de madera solida y volumen bruto apilado. Normalmente es menor a 1 porque el volumen bruto incluye huecos/aire.
- Una revision en Silva Fennica reporta que factores de conversion suelen caer aproximadamente entre 0.45 y 0.80, pero dependen de especie, region, forma de troza, largo, diametro, corteza y calidad del apilado. Por eso deben validarse localmente.

## Pendientes por confirmar

- Definir momento oficial de reporte de consumo: al cargar, al llegar a planta o al descargar en planta.
- Definir metodo para ajustar diferencias fisico-digital sin robar stock de otra ruma.
- Evaluar campo de porcentaje de llenado o estimacion visual calibrada por tipo de camion.
- Crear control para impedir consumo digital desde una ruma distinta a la fisica sin autorizacion.

## Fuentes usadas para completar gaps

- iso_38200: https://www.iso.org/standard/70179.html
- silva_fennica_stack_factors: https://www.silvafennica.fi/article/22018

## Transcript con timestamps

[00:00:00 - 00:00:02] Los camiones se dirigen a la...

[00:00:02 - 00:00:03] Para cuando es consumo.

[00:00:03 - 00:00:04] Cuando es consumo.

[00:00:04 - 00:00:05] Ya, para cuando es consumo.

[00:00:05 - 00:00:12] Cuando es consumo, tienes los dos camiones, yo por ejemplo mando todita las 10 rumas que vienen a ser seguidas de consumo.

[00:00:12 - 00:00:16] Eso lo mando al supervisor y el supervisor debería saber igual balanza.

[00:00:16 - 00:00:23] Entonces balanza, ellos tienen el listado también como visto, cuál es el consumo y todo lo demás y con eso saben dónde consumir.

[00:00:23 - 00:00:30] entonces se dirigen allá, se parquean al lado y comienzan a cargar

[00:00:30 - 00:00:36] traca traca traca igual, ellos no reportan nada al whatsapp de que cogieron tantas toneladas de esto

[00:00:36 - 00:00:39] ellos netamente lo que hacen es reportar en el factory

[00:00:39 - 00:00:41] ya, ahí se usan bien

[00:00:41 - 00:00:44] si, entonces en el factory lo que hacen es así mismo

[00:00:44 - 00:00:47] buscan la ruma o el número de ruma en el factory

[00:00:47 - 00:00:54] primero colocan idmade, colocan la especie que es de M-MAT-003, es del Uro Grandis,

[00:00:55 - 00:00:58] y ponen aperemade.

[00:01:00 - 00:01:04] Después cogen qué cantidad de toneladas va a reportar.

[00:01:05 - 00:01:06] Que es básicamente decir de inventario a consumo.

[00:01:07 - 00:01:10] Exacto, entonces, como te dije, más o menos ellos tienen,

[00:01:11 - 00:01:14] o se sabe que un camión lleva 11 toneladas secas por vía.

[00:01:14 - 00:01:17] entonces cargan en el este

[00:01:17 - 00:01:18] ponen 11 y mandan

[00:01:18 - 00:01:21] entonces lo que te dice en el click

[00:01:21 - 00:01:23] yo veo que todos los que tengan

[00:01:23 - 00:01:25] 11, 8, 4 porque a veces se va

[00:01:25 - 00:01:27] acabando y solo pueden reportar 4

[00:01:27 - 00:01:30] es correspondiente a consumo

[00:01:30 - 00:01:33] pero cuando reportan

[00:01:33 - 00:01:35] con 0.001 yo distingo

[00:01:35 - 00:01:36] que eso es descarga

[00:01:36 - 00:01:39] y tu manualmente tienes que estar haciendo

[00:01:39 - 00:01:39] esa distribución

[00:01:39 - 00:01:41] no eso ya está hecho

[00:01:41 - 00:01:43] entonces tengo

[00:01:43 - 00:01:45] en el uno que es movimiento de descarga

[00:01:45 - 00:01:47] y el otro que es

[00:01:47 - 00:01:48] consumo

[00:01:48 - 00:01:51] ¿y reportan en el factory apenas

[00:01:51 - 00:01:53] cargan o una vez que esté

[00:01:53 - 00:01:56] descargado el consumo?

[00:01:56 - 00:01:57] ese no te puedo decir la verdad

[00:01:57 - 00:01:58] bueno no

[00:01:58 - 00:02:01] ese no me he dado cuenta pero yo creo que deberían reportar

[00:02:01 - 00:02:03] cuando cargan al camión

[00:02:03 - 00:02:05] en los patios

[00:02:05 - 00:02:07] y eso ya le llevan abajo

[00:02:07 - 00:02:10] al patio que necesiten

[00:02:10 - 00:02:12] al chip, al triturador

[00:02:12 - 00:02:24] puede ser que haya dos casos, un caso que reporten una vez ya tengan un camión lleno, se suben al vehículo, reportan 11 toneladas y se dirigen a planta

[00:02:24 - 00:02:33] o el otro caso, cargan, llevan el camión a planta, descargan el material ahí y reportan que se consumió 11 toneladas

[00:02:33 - 00:02:34] Claro.

[00:02:34 - 00:02:36] O sea, hay esos dos casos.

[00:02:36 - 00:02:38] Ahora, ¿cuál sería el ideal?

[00:02:38 - 00:02:44] No sé por qué este del factor ya hacían antes del reporte de consumo, pero el de las cargas es nuevo.

[00:02:44 - 00:02:46] Claro, claro.

[00:02:46 - 00:02:49] Esas son las dos diferencias.

[00:02:49 - 00:02:54] Ahora, hay otro conflicto internamente en consumo.

[00:02:54 - 00:02:57] Porque, digamos, ellos tienen que...

[00:02:57 - 00:03:02] Esta ruma, digamos, yo en inventario tengo el 50 toneladas según las mediciones.

[00:03:02 - 00:03:09] eso implica que cinco viajes de 11 toneladas debería acabar

[00:03:09 - 00:03:18] cubrir, sí, pero a veces nos hacen, como no es preciso, a veces resulta que digamos se terminan en 10 viajes

[00:03:18 - 00:03:26] y ellos al reportar 11, 11, 11 significa que se acaban primero en digital pero en físico mantengo

[00:03:26 - 00:03:30] Entonces ellos lo que hacen es coger

[00:03:30 - 00:03:32] Y buscar al azar otra ruma

[00:03:32 - 00:03:34] Que tenga pino y descargan de ese

[00:03:34 - 00:03:36] Entonces se comienzan a robar

[00:03:36 - 00:03:38] Para igualar las medidas

[00:03:38 - 00:03:39] Para que no les jodan

[00:03:39 - 00:03:41] Entonces comienzan a robarse el stock digital

[00:03:41 - 00:03:43] De otra ruma

[00:03:43 - 00:03:45] Para reportar el consumo

[00:03:45 - 00:03:48] Esa es la cuestión

[00:03:48 - 00:03:49] Entonces

[00:03:49 - 00:03:51] Yo ya les cambié

[00:03:51 - 00:03:53] O les estoy tratando de cambiar esa mentalidad

[00:03:53 - 00:03:55] No siempre es donce

[00:03:55 - 00:03:57] tienen que reportar

[00:03:57 - 00:03:58] según el físico

[00:03:58 - 00:04:01] entonces si yo les digo

[00:04:01 - 00:04:03] que esa tiene 50 toneladas

[00:04:03 - 00:04:04] y voy consumiendo la mitad

[00:04:04 - 00:04:06] debería haber 25

[00:04:06 - 00:04:08] eso me toca a mi reportar

[00:04:08 - 00:04:10] tal vez viajes de 8, 5

[00:04:10 - 00:04:11] o otra vez voy a 10

[00:04:11 - 00:04:12] o así

[00:04:12 - 00:04:14] o abrirtear un campo en el factory

[00:04:14 - 00:04:17] que digo del tipo de cosas que se pueden hacer con API facilito

[00:04:17 - 00:04:18] que diga

[00:04:18 - 00:04:21] un criterio que diga porcentaje de lleno

[00:04:21 - 00:04:24] ¿me entiendes?

[00:04:24 - 00:04:25] Simón, para comparar

[00:04:25 - 00:04:27] Claro, entonces en vez de que tenga que ser la mate

[00:04:27 - 00:04:28] De que está a tres cuartos

[00:04:28 - 00:04:31] Ponen 75%

[00:04:31 - 00:04:33] Después de multiplicar su ingresa

[00:04:33 - 00:04:34] Mismo de Aina

[00:04:34 - 00:04:36] Entonces, sí, por ejemplo

[00:04:36 - 00:04:40] Para que vean ellos en porcentaje en relación a física

[00:04:40 - 00:04:41] Pero esos inconvenientes

[00:04:41 - 00:04:43] Desde el mismo pasado teniendo yo

[00:04:43 - 00:04:44] ¿Por qué?

[00:04:45 - 00:04:47] Porque luego cuando se cambian de turno

[00:04:47 - 00:04:49] Resulta que siguen construyendo la misma ruma

[00:04:49 - 00:04:51] Y en el digital ya no hay como reportar

[00:04:51 - 00:04:52] Claro

[00:04:52 - 00:04:56] Entonces a mi me toca mover de perimade otra vez de inmadre

[00:04:56 - 00:04:58] y no debería estar así

[00:04:58 - 00:05:00] Eso no debería existir

[00:05:00 - 00:05:03] Entonces, ¿qué es lo que se llama?

[00:05:03 - 00:05:05] Retiriendo madera

[00:05:05 - 00:05:08] Sacando del monedador poliante de la novia

[00:05:08 - 00:05:10] Entonces, eso es lo que se llama

[00:05:10 - 00:05:12] Si, supe

[00:05:12 - 00:05:15] Más es que portería, más es que hagan bien el...
