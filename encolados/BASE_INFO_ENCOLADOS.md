# Base maestra de informacion - Encolados / Aglomerados Linea 1

> Documento vivo para juntar notas de campo, descubrimientos, audios, PDF, research tecnico y pendientes de confirmacion.  
> Objetivo: que esto sea la base grande de conocimiento antes de convertirlo en mapa visual, HMI mockup, wireframe o presentacion.

## Metadata

- Ultima actualizacion: 2026-06-22
- Area: NOVOPAN - tableros MDP / aglomerados / encolados / formacion / prensa
- Linea foco: Linea 1, salvo donde se compare con Linea 2 u "otra linea"
- Estado: base de trabajo, no documento formal de planta
- Regla de uso: todo lo dudoso se conserva como "oido en audio" y se marca para confirmar en HMI, placa de maquina, P&ID, PLC o con operador.

## Fuentes locales consolidadas

- PDF base: `/Users/manue/Downloads/Encolados.pdf`
- Proceso ya estructurado: `/Users/manue/NOVOPAN-SLIDES/encolados/PROCESO.md`
- Resumen de reuniones: `/Users/manue/NOVOPAN-SLIDES/encolados/notas/2026-06-22-resumenes-reuniones.md`
- Nota de trazabilidad de cambios: `/Users/manue/Documents/NOVOPAN/transcripts/2026-06-22_encolados/notes/proceso_trazabilidad_cambios.md`
- Audios aglomerados:
  - `/Users/manue/Documents/NOVOPAN/transcripts/2026-06-22_aglomerados/notes/new_recording_35.md`
  - `/Users/manue/Documents/NOVOPAN/transcripts/2026-06-22_aglomerados/notes/new_recording_36.md`
  - `/Users/manue/Documents/NOVOPAN/transcripts/2026-06-22_aglomerados/notes/reunion_angeloncipales.md`
- Audios proceso / trazabilidad:
  - `/Users/manue/Documents/NOVOPAN/transcripts_audio_encolados/2026-06-22_batch/new_recording_37.tsv`
  - `/Users/manue/Documents/NOVOPAN/transcripts_audio_encolados/2026-06-22_batch/new_recording_39.tsv`
  - `/Users/manue/Documents/NOVOPAN/transcripts_audio_encolados/2026-06-22_batch/explicacion.tsv`
- Research previo:
  - `/Users/manue/Documents/NOVOPAN/technical-research/research_aglomerados_2026-06-22.md`

## Fuentes visuales HMI - 2026-06-22

Fotos analizadas:

- `/Users/manue/Downloads/IMG_1875.JPG` - HMI Metso, pantalla `Formacion`, hora visible 13:08:56.
- `/Users/manue/Downloads/IMG_1872.JPG` - HMI Dieffenbacher PROGUIDE, `L0000 Vista general de la cadena de formacion`, hora visible 12:53:46.
- `/Users/manue/Downloads/IMG_1873.JPG` - HMI Dieffenbacher PROGUIDE, `P0000 Vista general de la prensa`, hora visible 12:53:50.
- `/Users/manue/Downloads/IMG_1876.JPG` - HMI SUNDS FIBERTECH, pantalla `Prensa`, hora visible 13:09:01.
- `/Users/manue/Downloads/IMG_1874.JPG` - HMI Metso, pantalla `Encolado`, hora visible 13:08:43.

### Agrupacion visual por HMI

El usuario anoto que las primeras dos imagenes son de Linea 2 y el resto de Linea 1, pero visualmente hay una agrupacion mas clara por sistema:

| Grupo visual | Imagenes | Evidencia | Linea probable |
|---|---|---|---|
| Metso / HMI-METSO | `IMG_1875`, `IMG_1874` | Logo Metso, footer HMI-METSO, tiempos 13:08:43-13:08:56, velocidad ~16.86 m/min | Probablemente misma linea; confirmar si Linea 1 |
| Dieffenbacher PROGUIDE | `IMG_1872`, `IMG_1873` | Logo Dieffenbacher PROGUIDE, menu `Prensa / EVOsteam / Linea de formacion`, tiempos 12:53:46-12:53:50, formula 15mm 670kg MDP/RH | Probablemente misma linea; confirmar si Linea 2 |
| SUNDS FIBERTECH | `IMG_1876` | Logo SUNDS FIBERTECH, tabs `Prensa/Espesor/Cadenas/Hidraulica/Calentamiento`, velocidad 17.0 m/min | Probablemente prensa de la linea Metso; confirmar si Linea 1 |

Conclusion provisional: para no mezclar, hablar de `Sistema Metso`, `Sistema Dieffenbacher PROGUIDE` y `Sistema SUNDS FIBERTECH` hasta que planta confirme linea/equipo exacto.

### IMG_1875 - HMI Metso, Formacion

Pantalla: `Formacion`. Se ve como una pantalla integrada de formadoras, peso de material, preprensa, sprays, Dynasteam, nariz de rechazo y transportadores.

Elementos confirmados:

- Logo `metso` en footer.
- Usuario visible: `administrator`.
- HMI: `HMI-METSO`.
- Logo `Pelikano`.
- Bombas encolado:
  - `OK BOMBAS ENCOLADO SL`.
  - `OK BOMBAS ENCOLADO CL`.
- Formadoras/capas:
  - `SL1`.
  - `CC`.
  - `SL2`.
- `CL/TOTAL = 69.00` visible. Interpretacion probable: relacion de capa central/core sobre total; confirmar.
- Cada formadora muestra motores `M`, valvulas/actuadores y botones `PID`.
- `Magnet Auto` visible antes de preprensa/formacion final.
- `Prepress Automatic` encendido.
- `Pre-Prensa`: controles `Abrir`, `Parar`, `Cerrar`.
- `Habilitar Dynasteam`: boton/selector visible.
- `Autobloques`.
- `SPRAY`: On/Off Spray Superior e Inferior, ambos se ven en ON.
- `Nariz de Rechazo`: boton `Abrir`.
- `Transportador de Entrada`.
- `Automático`, `Formación`, `Vaciar Formadoras`.

Numeros visibles:

| Zona | Valor | Unidad/nota |
|---|---:|---|
| Consumo resina liquido | 51.3 | kg/m3 |
| Consumo resina solido | 34.6 | kg/m3 |
| Peso del material actual | 29.61 | kg/m |
| Peso del material actual | 11.59 | kg/m2 |
| Peso del material setear | 11.62 | kg/m2 |
| Minimo peso material | -8.0 | % |
| Minimo peso material | 10.69 | kg/m2 |
| Maximo peso material | 8.0 | % |
| Maximo peso material | 12.55 | kg/m2 |
| Toneladas por hora | 28.71 | t/h |
| Transp L de Formacion | 16.28 | valor principal visible; confirmar unidad |
| Velocidad Prensa | 16.85 | m/min |
| Velocidad Transp L de Formacion | 16.25 | m/min |
| Velocidad Manual | 15.74 | m/min |
| Preprensa posicion/altura | 415.0 | mm |
| Humedad | 13.7 | % |
| Espesor/altura visible | 18.2 | mm |
| Desvio banda | 2517 | mm; confirmar lectura/contexto |
| Rel. Veloc. minimo | -100.00 | grafico |
| Rel. Veloc. actual | 5.14 | grafico |
| Rel. Veloc. maximo | 269.41 | grafico |
| Contador/distancia formacion | 5510.5 | m |

Valores por formadora/capa visibles:

| Capa | Valores leidos | Interpretacion pendiente |
|---|---|---|
| SL1 | 61%; 3.15 m/min; 70.29 kg/min; 23.36 kg/m; 174.82 kg/m3 | Capa externa/inferior probable |
| CC | 60%; 4.56 m/min; 76.55 kg/m; 132.42 kg/m3; 332.87 kg/min | Capa central/core probable |
| SL2 | 60%; 2.99 m/min; 79.26 kg/min; 27.79 kg/m; -5.2%; 207.94 kg/m3 | Capa externa/superior probable |

Interlocks/estado visible:

- `Referenc. Puerta de descarga funciona bien`.
- `Transportador de entrada (I=adelan, O=atras)`.
- `Prensa parada emerg (I=bien)`.
- `Prensa lista para produccion`.
- `Habilitado para cerrar`.
- `Peso del material no esta bien`.
- Varios estados se ven con `1`; `Peso del material no esta bien` se ve `0`.

Alarmas visibles:

- `SISTEMA SPRAY NIVEL BAJO TANQUE DOSI...`
- `ALARM 733 WARNING/ALARM SPRAY SYST...`
- Hora aproximada de alarmas: 12:07:21 y 12:07:52.

Lectura tecnica:

- Esta pantalla confirma que el area no se entiende solo con 10 etapas: en la operacion real hay subpantallas de material, resina, formadoras, preprensa, sprays, Dynasteam, nariz y alarmas.
- `Peso del material` es un bloque de control central: actual, setpoint, tolerancias y t/h.
- Las capas SL1/CC/SL2 aparecen con velocidad, kg/min, kg/m y kg/m3, lo que conecta dosificacion masica, densidad y avance de banda.
- El grafico inferior compara relaciones de velocidad de `St1`, `CC`, `St2` y `Speed Relation`; esto es directamente util para analizar sobreoscilacion y tau.

### IMG_1874 - HMI Metso, Encolado

Pantalla: `Encolado`. Parece el par directo de `IMG_1875`, porque comparte logo Metso, footer HMI, fecha/hora cercana y velocidad de linea.

Elementos confirmados:

- Tabs: `Receta`, `Encolado`, `Llenado Do_Bin`, `Data motors`, `Servicio`.
- Botones: `Tanques resina`, `Flake Density`, `Evojet`, `Bloques Autom.`, `Consumption`.
- Dos cajas de dosificacion:
  - `CE`.
  - `CI`.
- Dos encoladoras: una para CE y una para CI.
- Controles automaticos:
  - `CE Caja de Dosificacion Automatico` ON.
  - `CI Caja de Dosificacion Automatico` ON.
  - `Encolado ON`.
  - `CE Encolado Automatico` ON.
  - `CI Encolado Automatico` ON.
- Esquema inferior de encolado con multiples inyecciones/boquillas hacia tuberia/colector.

Numeros visibles:

| Zona | Valor | Unidad/nota |
|---|---:|---|
| Humedad en aire - compresores | 100.00 | %; rojo |
| Velocidad Linea Formacion | 16.86 | m/min |
| Velocidad Linea Formacion | 120.25 | % |
| CE caja dosificacion densidad | 157 | kg/m3 |
| CE caja nivel/llenado | 61 | % |
| CE descarga | 117 | kg/min |
| CE proporcion | 27 | % SL |
| CI caja dosificacion densidad | 133 | kg/m3 |
| CI caja nivel/llenado | 59 | % |
| CI descarga | 319 | kg/min |
| CI proporcion | 73 | % CL |
| CE encoladora temperatura | 43.1 | C |
| CE encoladora porcentaje | 1.75 | % |
| CE accion/bomba | 37 | % |
| CE corriente | 75 | A |
| CI corriente | 133 | A |
| CI accion/bomba | 56 | % |
| Resin Consumption | 51.0 | unidad no visible; confirmar |

Lectura tecnica:

- Esta captura convierte la duda de `CE/CI` en algo importante:
  - `CE` aparece asociado a `SL`, probablemente capa externa/surface layer.
  - `CI` aparece asociado a `CL`, probablemente capa interna/core layer.
- La relacion visible `27% SL` y `73% CL` es muy cercana a la regla operativa 30/70 de los audios, pero no igual. Esto debe registrarse como valor observado de pantalla, no como setpoint universal.
- La humedad de aire de compresores al 100% en rojo puede ser alarma/condicion mala de aire comprimido. Revisar si afecta actuadores neumaticos, valvulas y sprays.
- `Flake Density` confirma que la densidad aparente de particula es variable de pantalla, no solo concepto teorico.
- `Llenado Do_Bin` confirma que `Do_Bin` probablemente es la etiqueta HMI para dosing bin/dosimbunca.

### IMG_1872 - Dieffenbacher PROGUIDE, cadena de formacion

Pantalla: `L0000 Vista general de la cadena de formacion`.

Elementos confirmados:

- Sistema: `DIEFFENBACHER PROGUIDE`.
- Empresa/footer: `Novopan del Ecuador MDP`.
- Usuario: `Operator`.
- Fecha/hora: 22-Jun-26, 12:53:46.
- Menu superior:
  - `Prensa`.
  - `EVOsteam`.
  - `Linea de formacion`.
  - `Estacion de formacion`.
  - `Formula`.
  - `Especial`.
  - `Servicio`.
  - `Ayuda`.
- Formula visible: `15mm 670kg MDP/RH`.
- Botones/modulos:
  - `CtrlEsp`.
  - `Tens_Band`.
  - `UH2600`, `UH4300`, `UH1800`, `UH1300` en `Remote`.
  - `CBV`.
  - `HS`.
  - `Precompresor`.
  - `Unidad de aspersion de agua`.
  - `Altura de manta`.
  - `Estacion de formacion`.
- Barra amarilla larga bajo el dibujo: parece recorrido/posicion/seguimiento de linea; muy relevante para la idea de cambio que se desplaza.

Numeros visibles:

| Zona | Valor | Unidad/nota |
|---|---:|---|
| Velocidad izquierda | 377.67 | mm/s |
| Velocidad principal | 378.0 | mm/s |
| Aspersion/spray superior set | 16.0 | g/m2 |
| Aspersion/spray inferior set | 14.0 | g/m2 |
| Valor de posicion/ajuste | -5.52 | mm |
| Altura/posicion antes/despues | 42.72 | mm |
| Altura/posicion antes/despues | 36.17 | mm |
| Modulo central | 41.6 | % |
| Modulo central | 46.6 | C |
| Modulo central | 31.5 | % |
| Modulo central | 45.6 | C |
| Modulo inferior | 18.5 | % |
| Ajuste ancho - Compensacion Est.Form. | 60.0 | mm |
| Punto de ajuste del ancho | 2700.0 | mm |
| Ancho paredes esparcimiento desplazadas | 2548.76 | mm |
| Correccion velocidad banda transferencia | 0.00 | % |
| Correccion velocidad FoB | -1.00 | % |
| Correccion velocidad CBV | 0.00 | % |
| CBV posicion de inicio | 60.0 | mm |
| CBV fuerza | 60.0 | % |
| CBV posicion | 60.0 | mm |
| CBV compensacion salida a entrada | -0.8 | mm |
| CBV altura izquierda | 16.63 / 17.63 | mm |
| CBV altura derecha | 16.78 / 17.59 | mm |
| CBV fuerza izquierda/derecha | 64.09 / 60.82 | % |
| Correccion izquierda/derecha | 0.0 / 0.0 | mm |
| Precompresor offset posicion inicial | 40.0 | mm |
| Precompresor compens. manta produccion | 10.0 | mm |
| Precompresor posicion produccion fija | 60.0 | mm |
| Precompresor posicion real | 55.84 | mm |
| Aspersion superior set/real | 16.0 / 16.0 | g/m2 |
| Aspersion inferior set/real | 14.0 / 14.0 | g/m2 |
| Altura manta antes de CBV | 42.7 | mm |
| Altura manta despues de CBV | 35.3 | mm |
| Peso manta ajustado | 9.5 | kg/m2 |
| Peso manta real | 9.5 | kg/m2 |
| Humedad manta SL | 14.0 | % |
| Humedad manta CL | 4.3 | % |
| Densidad SL | 195.0 | kg/m3 |
| Densidad CL | 145.0 | kg/m3 |

Alarmas visibles:

- `Salida de paquetes casi lleno - Se requiere vaciarlo`.
- `GEN Atencion auto bloqueado activo, reinicio necesario`.
- `Manta hidratacion general - nivel tanque de almacenamiento <= min`.
- `CAL HC02 punto de ajuste para placa de calefaccion no se puede alcanzar`.
- `CAL HC01 punto de ajuste para placa de calefaccion no se puede alcanzar`.

Lectura tecnica:

- Esta pantalla es el mejor ejemplo visual de la "pantalla general" que se queria para la otra linea: muestra toda la cadena de formacion, estado de modulos, velocidades, alturas, fuerzas, aspersion, peso/humedad/densidad y alarmas.
- La conversion de velocidad ayuda a comparar con Metso: 378 mm/s = 22.68 m/min, mayor que los ~16.86 m/min observados en Metso/SUNDS.
- La pantalla ya tiene valores `ajustado` vs `real`, que es una estructura que conviene copiar para cualquier wireframe de trazabilidad.

### IMG_1873 - Dieffenbacher PROGUIDE, prensa

Pantalla: `P0000 Vista general de la prensa`.

Elementos confirmados:

- Sistema: `DIEFFENBACHER PROGUIDE`.
- Modos visibles: `Detener`, `Abrir`, `Produccion`, `Calentar`; `Produccion` aparece seleccionado.
- Botones: `P02`, `CtrlEsp`, `Tens_Band`, `L40`, `L13`.
- Modulos/zonas:
  - `banda CPS`.
  - `CPS`.
  - `EVOsteam`.
  - `CBV`.
  - `Linea de formacion`.

Numeros visibles:

| Zona | Valor | Unidad/nota |
|---|---:|---|
| Velocidad banda CPS | 378.0 | mm/s |
| Velocidad set/compare | 375.0 | mm/s |
| Otra velocidad visible | 394.0 | mm/s |
| Velocidad linea | 22.7 | m/min |
| Velocidad linea | 378.0 | mm/s |
| Tension banda superior | 138.70 | bar |
| Tension banda inferior | 140.55 | bar |
| Alineacion | -4.34 | mm |
| Alineacion max. | -25.00 | mm |
| Maestro accionamiento superior | 37.81 | % |
| Maestro accionamiento inferior | 38.40 | % |
| Factor de prensado | 3.55 | s/mm |
| IWC | 36.30 | mm |
| Marco mas bajo | 14.37 | mm |
| Circ. de calefaccion 1 | 264.60 | C |
| Lubricacion | 15.51 | l/d |
| Produccion | 50.57 | m3/h |
| EVOsteam parte inferior cinturon | 0.00 | correccion |
| EVOsteam parte superior cinturon | 0.00 | correccion |
| Correa inferior punta set/real | 33.0 / 33.1 | mm |
| Distancia parte inferior nariz - punto estrella | 381.9 | mm |
| CBV fuerza entrada | 63.71 | % |
| CBV fuerza salida | 61.32 | % |
| CBV accionamiento superior | 41.21 | % |
| CBV accionamiento inferior | 32.15 | % |
| CBV banda de formacion | 18.10 | % |
| Peso manta ajustado | 9.5 | kg/m2 |
| Peso manta real | 9.5 | kg/m2 |

Lectura tecnica:

- `Factor de prensado` en s/mm confirma el parametro del audio que faltaba formalizar. Este relaciona tiempo de prensado efectivo con espesor.
- `CPS` parece ser la prensa continua de Dieffenbacher. Confirmar si significa Continuous Press System en esta HMI.
- `EVOsteam` ya no es solo "vapor" generico: en esta linea existe una seccion/pestana EVOsteam con correcciones de velocidad y referencias de nariz/punto estrella.
- `CBV` aparece tanto en formacion como en prensa; se debe entender como modulo clave entre formacion/precompresion/prensa. Confirmar significado exacto.

### IMG_1876 - SUNDS FIBERTECH, prensa

Pantalla: `Prensa`.

Elementos confirmados:

- Sistema/logo: `SUNDS FIBERTECH`.
- Tabs:
  - `Prensa`.
  - `Espesor`.
  - `Cadenas`.
  - `Hidraulica`.
  - `Calentamiento`.
  - `Especial`.
  - `Grupos`.
  - `Base de Datos`.
  - `Servicio`.
- IP visible en papel sobre monitor: `192.168.1.113`.
- Ruta de red visible en footer: `\\192.168.1.111\D_HMI110_1\Novopan\10_press` aproximadamente; confirmar.
- Usuario: `Operator`.
- HMI: `HMI_PU110_3`.
- Fecha/hora: 22/6/2026, 13:09:01.
- Logo `Pelikano`.
- Monitores superiores con visualizacion/camara de prensa; por color parece feed de vision/temperatura o camara con filtro, confirmar.

Numeros visibles:

| Zona | Valor | Unidad/nota |
|---|---:|---|
| Temperaturas lado entrada/salida | 51.8 / 52.1 | C |
| Temperaturas lado entrada/salida | 54.3 / 57.0 | C |
| Temperaturas lado derecho | 33.0 / 47.5 | C |
| Temperaturas lado derecho | 36.0 / 58.9 | C |
| Offset/posicion entrada superior | 0.0 | mm |
| Offset/posicion entrada inferior | 0.2 | mm |
| Posicion superior central | 1.3 | mm |
| Posicion central | 0.1 | mm |
| Posicion derecha superior | 2.5 | mm |
| Posicion derecha inferior | 2.8 | mm |
| Posicion/medicion central | 6.1 | mm |
| Posicion/medicion central | 4.0 | mm |
| Posicion marco entrada | 18.4 | mm |
| Posicion marco salida | 19.0 | mm |
| Desviacion inferior | -10.7 | mm |
| Desviacion inferior | -9.6 | mm |
| Posicion MTS marco 2/3 - lado izquierdo | 17.1 | mm |
| Posicion MTS marco 2/3 - lado derecho | 16.6 | mm |
| Velocidad | 17.0 | m/min |
| Ancho del producto | 2545 | mm |
| Peso | 11.60 | kg/m2 |
| Humedad CE | 18.5 | % Hy |
| Humedad CI | 0.0 | % Hy |
| Calentamiento Area 1 set/real | 235.0 / 235.0 | C |
| Calentamiento Area 2 set/real | 235.2 / 235.0 | C |
| Calentamiento Area 3 set/real | 222.2 / 222.0 | C |
| Calentamiento Area 4 set/real | 205.1 / 205.0 | C |
| Presion aceite/sistema | 105 / 103 | Bar |
| Factor Prensa | 3.26 | unidad no visible; probablemente s/mm |

Lectura tecnica:

- Esta HMI confirma 19 marcos/posiciones de prensa visibles en el esquema y grafico. Esto se conecta con el audio donde la presion es mayor al inicio y baja hacia la salida.
- El grafico inferior en MPa muestra un perfil alto al ingreso y decreciente hacia marcos finales. Es una visualizacion directa del perfil de presion.
- Las areas de calentamiento visibles son 4: 235 C, 235 C, 222 C y 205 C. Esto corrige/precisa la nota anterior de 220-220-220-215: esos valores pueden variar por producto o linea.
- La velocidad 17.0 m/min y peso 11.60 kg/m2 coinciden muy cerca con el HMI Metso (16.85-16.86 m/min y 11.59-11.62 kg/m2), lo que sugiere que SUNDS y Metso podrian estar describiendo la misma linea/produccion.

### Implicaciones para no saltarse pasos

Las imagenes obligan a separar la linea en pantallas reales:

1. Encolado y dosing bins (`Metso Encolado`).
2. Formacion / formadoras / peso de material (`Metso Formacion`).
3. Cadena de formacion con precompresor, CBV, aspersion y altura manta (`Dieffenbacher PROGUIDE L0000`).
4. Prensa Dieffenbacher con CPS/EVOsteam/CBV (`Dieffenbacher PROGUIDE P0000`).
5. Prensa SUNDS con 19 marcos, calentamiento, hidraulica, cadenas, espesor y grupos (`SUNDS FIBERTECH`).

Pantallas que aun faltan fotografiar para cerrar el flujo:

- Silos.
- Llenado `Do_Bin`.
- `Data motors`.
- Tanques resina.
- `Flake Density`.
- `Evojet`.
- `Consumption`.
- `Espesor`.
- `Cadenas`.
- `Hidraulica`.
- `Calentamiento`.
- `Grupos`.
- Sensores de reventados / ultrasonido.
- Estacado/enfriadores.

### Cambios fuertes a la base por imagenes

- `Metso` queda confirmado como HMI/sistema visible, no solo hipotesis fonetica.
- `Dieffenbacher PROGUIDE` queda confirmado como HMI/sistema visible.
- `SUNDS FIBERTECH` queda confirmado como HMI/sistema visible.
- `EVOsteam` queda confirmado en Dieffenbacher, y `Dynasteam` aparece como boton en Metso. No son necesariamente lo mismo; comparar en planta.
- `Do_Bin` queda confirmado como etiqueta HMI para dosing bins/dosimbuncas.
- `CE` y `CI` quedan confirmados como nomenclatura HMI. CE parece ligada a `SL` y CI a `CL`.
- `SL1`, `CC`, `SL2` quedan confirmados en pantalla Metso.
- La pantalla de Linea 2/Dieffenbacher ya tiene muchas piezas de la vista general que se quiere replicar: recorrido, estaciones, set/real, alarmas y barra de posicion.

## Confirmacion de nuevas etapas y detalles

Si. La informacion nueva de los ultimos audios no solo agrega detalles a las 10 etapas del PDF; tambien agrega una capa completa de seguimiento de cambios, sensores de calidad y arquitectura de control.

La version simple del PDF tiene 10 etapas:

1. Silos
2. Dosimbuncas
3. Clasificacion
4. Encolador
5. Esparcidores
6. Preprensa
7. Prensa caliente continua
8. Corte angular
9. Enfriadoras tipo estrella
10. Estacado

La version extendida que sale de los audios debe tratar la linea como estos nodos:

1. Preparacion / alimentacion hacia silos
2. Silos de particula fina y media
3. Tornillos de descarga y transportadores
4. Dosimbuncas / dosing bins / dosificadoras
5. Clasificacion por camas de rodillos moleteados
6. Encolador y lazos de dosificacion de resina/parafina/agua
7. Sprays de agua + desmoldante
8. Formacion del colchon por capas: SL1 / CL / SL2 o CLB / CL / CLT
9. Esparcidoras y bascula central
10. Iman ferromagnetico, detector y perfilometro/densitometro
11. Preprensa, nariz y banda de transferencia
12. Prensa caliente continua por zonas
13. Sensores post-prensa: espesor, reventados, ultrasonido, peso, densidad
14. Sierras longitudinales y corte angular
15. Agrupamiento de tableros
16. Enfriadoras tipo estrella
17. Estacado
18. Montacargas hacia lijado/calibracion y posible laminado posterior

La gran novedad no es solo una etapa nueva, sino la necesidad de modelar el proceso como una linea fisica con distancia, velocidad, pulsos, PLCs separados y cambios que se desplazan.

## Mapa mental de proceso

```text
Preparacion
  -> silos fina/media
  -> tornillos + sensores inductivos
  -> dosimbuncas / dosificadoras
  -> clasificacion por rodillos
  -> encolador: particula + resina + parafina + agua
  -> sprays desmoldantes
  -> esparcidores / forming heads
  -> colchon por capas
  -> bascula central + tau
  -> iman / detector / perfilometro
  -> preprensa
  -> nariz / banda de transferencia
  -> prensa caliente continua
  -> sensores de calidad: espesor, reventados, peso, densidad
  -> corte longitudinal / corte angular
  -> agrupamiento
  -> enfriador tipo estrella
  -> estacado
  -> lijado / calibracion / laminado
```

## Etapa 0 - Preparacion y alimentacion

### Funcion

La preparacion entrega particula ya clasificada hacia encolados. En la base actual se distinguen dos grandes calidades:

- Particula fina: destinada a capas externas, superior e inferior.
- Particula media: biruta + polvo, destinada al core o capa central.

### Notas

- El audio ubica los silos "desde preparacion todavia".
- En el proceso de encolados ya no se trabaja en toneladas gruesas sino en control mas fino de dosificacion.
- Aguas arriba pueden existir causas de variacion por densidad, granulometria, humedad o flujo, aunque el foco de estos audios esta desde silos hacia adelante.

### Pendientes

- Confirmar cantidad exacta de silos.
- Confirmar capacidad por silo.
- Confirmar si hay silos dedicados por tipo de particula o si hay conmutacion por receta.
- Confirmar humedad de entrada por tipo de particula.

## Etapa 1 - Silos

### Funcion

Almacenan material clasificado y lo descargan hacia dosificadoras mediante tornillos de descarga.

### Instrumentacion confirmada por audio

- Sensores ultrasonicos superiores para nivel.
- Paletas de nivel minimo y maximo.
- Sensores inductivos asociados a piezas metalicas o puntos de giro.
- Dos tornillos internos por silo, segun audio.

### Como se mide el nivel

El ultrasonico manda una senal de sonido, rebota en el nivel de material y calcula distancia por tiempo de retorno. En planta se interpreta como volumen/llenado, no como peso.

Calibracion conceptual:

```text
senal con silo vacio = 0 %
senal con silo lleno = 100 %
nivel intermedio = interpolacion lineal
```

### Por que ultrasonico

El audio explica que hay mucho polvo. Un sensor visual/optico se tapa o queda inutil rapidamente. Research de instrumentacion confirma que en silos de solidos con polvo la seleccion de tecnologia depende de polvo, geometria, estructuras internas, condensacion y tipo de material; no basta decir "nivel" genericamente.

### Paletas

Las paletas funcionan como puntos discretos:

- Minimo.
- Maximo.
- Redundancia mas segura para condiciones criticas.

No entregan todo el rango 0-100, pero son mas confiables para alarmas simples.

### Tornillos y pulsos

Los tornillos giran y descargan material. La teoria simple seria:

```text
1 vuelta de tornillo = X cantidad de material
```

Pero en practica el llenado del tornillo varia segun compactacion, densidad, nivel y condicion del material. Por eso la descarga real puede oscilar.

Los inductivos detectan paso de metal o una pieza de referencia; si dejan de llegar pulsos cuando deberia haber movimiento, se puede generar alarma de taponamiento o falla de giro.

### Fallas posibles

- Sensor ultrasonico con lectura erratica por polvo o geometria.
- Paleta trabada o sucia.
- Tornillo descargando menos o mas por material compactado.
- Inductivo sin pulsos por falla de giro, cableado, sensor o acumulacion.
- Nivel alto sin interlock efectivo.

### Datos por levantar

- Tag HMI/PLC de cada silo.
- Capacidad de silo.
- Tipo/modelo de ultrasonico.
- Ubicacion de paletas.
- Pulsos por vuelta de tornillo.
- Diametro/paso del tornillo.
- Logica de seleccion de silo activo.

## Etapa 2 - Dosimbuncas / dosificadoras / dosing bins

### Nombres oidos

- Dosimbuncas
- Dosimil
- Dos y mil
- Dosibunker
- Dosing bins
- Dosificadoras

Usar "dosimbuncas" como termino de planta provisional, pero confirmar escritura exacta en HMI.

### Funcion

Reciben material de silos y dosifican cada flujo/capa antes de encolado y formacion. El audio habla de:

- Parte interna.
- Capa externa.
- Capa media.
- Dosimbuncas de arriba.

### Sensores y calculo

El sistema combina:

- Sensor de volumen/nivel para mantener llenado constante.
- Celda de carga para peso.
- Giro/velocidad de motor o banda.
- Sensor inductivo o encoder para rotaciones.

Formula conceptual:

```text
descarga kg/min = peso disponible o peso instantaneo x velocidad de descarga
```

Otra forma de leerlo:

```text
si el volumen se mantiene constante:
  peso medido -> densidad aparente
  velocidad de motor/banda -> tiempo o caudal volumetrico
  densidad x velocidad -> descarga masica
```

### Detalle importante

El audio recalca que "mantener volumen constante" permite calcular densidad si se conoce el peso. Luego, con velocidad de banda o motor, se calcula descarga en kg/min.

### Problema abierto

Las dosificadoras son uno de los tres problemas activos mencionados:

1. Esparcidoras.
2. Dosificadoras / consumos.
3. Tau / TAM.

Se espera instructivo del fabricante para calibracion mecanica y electrica.

### Datos por levantar

- Nombre exacto en HMI.
- Cantidad de dosimbuncas.
- Capa asociada a cada una.
- Rango kg/min.
- Sensor de nivel y celda de carga por equipo.
- Tag de velocidad de motor.
- Formula real usada por PLC.
- Si existe compensacion por densidad.

## Etapa 3 - Clasificacion por rodillos moleteados

### Funcion

Clasifica particula antes de entrar al encolador/formacion. El material cae por camas de rodillos.

### Confirmado

- Hay camas de rodillos.
- Se menciona al menos una para capa baja/externa y una para capa media.
- El proceso se describe como mecanico, no como un PID.
- Los rodillos tienen moleteados con diferentes profundidades.

### Valores oidos

- 0.3 mm.
- 1.3 mm.
- En una linea del audio aparece "1.3 a 1.5"; confirmar si era rango, ejemplo o error de transcripcion.

### Interpretacion

El moleteado/profundidad determina que particula pasa y cual se retiene. Esta etapa afecta:

- Granulometria.
- Distribucion de capa.
- Superficie.
- Resistencia mecanica del core.
- Estabilidad de dosificacion.

### Datos por levantar

- Numero de camas de rodillos.
- Numero de rodillos por cama.
- Profundidades reales.
- Criterio para ajustar/cambiar rodillos.
- Flujo de rechazo o recirculacion.

## Etapa 4 - Encolador y dosificacion de componentes

### Funcion

Mezcla la particula con componentes liquidos:

- Resina.
- Parafina.
- Agua.
- Posibles aditivos/catalizadores, por confirmar.

### Control PID

El audio explica variables:

| Variable | Significado | Comentario |
|---|---|---|
| SP | Setpoint | Lo que se solicita, por ejemplo L/min |
| PV | Process Value | Lo que realimenta el flujometro/sensor |
| LMN | Salida del controlador | Porcentaje/capacidad que manda a bomba o motor |

Regla operativa explicada:

- Si falta flujo, la bomba acelera.
- Si sobra flujo, el controlador baja.
- Si el controlador trabaja al 100 % sostenido, hay problema.
- Picos breves a 100 % pueden existir, pero no deben ser permanentes.
- Punto de trabajo sano mencionado: 40-50 % nominal.

### Estado observado

Se observa PV oscilando y sin estabilizarse. El audio lo relaciona con retardos de senal y mala sintonizacion del lazo.

### P/I/D explicado en audio

- P: correccion proporcional al error actual.
- I: correccion acumulada/repartida en el tiempo.
- D: anticipacion segun tendencia de cambio.

### Instrumentacion

- Flujometros electromagneticos para L/min.
- Flujometro o medidor Coriolis para flujo masico, densidad y temperatura, por confirmar en linea exacta.
- Sensores de presion con membrana.
- Bombas.
- Actuadores neumaticos.
- Electrovalvulas.
- Valvulas de paso.
- Control desde control room para abrir/cerrar dosificacion de resina.

### Enfriamiento del encolador

El audio menciona un sistema de enfriamiento en la parte inferior del encolador. Su funcion es evitar que la mezcla/resina reaccione antes de tiempo por calor.

### Mantenimiento

Los sensores de presion con membrana pueden ensuciarse con resina/parafina. En mantenimiento se limpian lineas, sensores y tanques relacionados.

### Pendientes

- Tipo de resina: UF, MUF, PMDI u otra.
- Dosificacion por kg de particula.
- Que lineas usan electromagnetico vs Coriolis.
- Rango normal de SP/PV/LMN.
- Si la oscilacion esta en resina, parafina, agua o varios lazos.

## Etapa 5 - Sprays de agua y desmoldante

### Nueva etapa importante

Los ultimos audios agregan que hay sprays antes y/o alrededor de formacion/preprensa. No deben quedar como detalle menor, porque son parte del seguimiento de cambios.

### Funcion

Los sprays ayudan a:

- Desmoldar.
- Evitar que el material se pegue a la banda.
- Cuidar la banda metalica de la prensa.
- Proteger contra pegado de material en zonas criticas.

### Concentracion oida

- Agua + desmoldante especial al 1.5 %.

### Ubicacion

El audio dice:

- "Antes de que se dosifique el material en la banda".
- Tambien menciona dos secciones y sprays en parte superior/inicio.
- Queda pendiente mapear ubicacion exacta.

### Relevancia para trazabilidad

No todos los cambios nacen en resina o densidad. Un cambio de spray/desmoldante tambien puede tener punto de origen propio y deberia poder marcarse en la pantalla de seguimiento.

### Pendientes

- Concentracion real y tolerancia.
- Nombre comercial del desmoldante.
- Numero de boquillas.
- Ubicacion exacta por tramo.
- Si la dosificacion de spray esta integrada a PLC/HMI.
- Si existe caudalimetro o solo apertura/cierre.

## Etapa 6 - Formacion y esparcidores

### Funcion

Los esparcidores forman el colchon por capas sobre la banda formadora.

### Capas

Nomenclaturas oidas:

- SL1: asociada a capa inferior.
- CL: core layer o capa central, pero hay ruido en audio.
- SL2: posiblemente capa superior.
- CLB: Core Layer Bottom.
- CL: Core Layer.
- CLT: Core Layer Top.
- PB1 = SL1, segun un fragmento de audio, confirmar.

No usar estas siglas formalmente sin verificar captura de HMI.

### Proporcion de capas

Setpoint principal:

```text
capas externas = 30 %
capa media/core = 70 %
```

Ejemplo del audio:

```text
si el peso objetivo es 9 kg/m2:
  3 kg/m2 externas
  6 kg/m2 core
```

### Reparto top/bottom

Se oye:

```text
53 % arriba
43 % abajo
```

Pero 53 + 43 = 96, por tanto hay pendiente fuerte:

- Puede ser 53/47.
- Puede haber un factor omitido.
- Puede ser error de transcripcion.
- Puede que el 4 % faltante sea otro ajuste.

### Por que top y bottom no son iguales

La diferencia controla pandeo/alabeo. Si hay mas material en una cara, el tablero puede curvarse. El ajuste busca que el tablero salga recto.

### Basculas y celdas

Cada esparcidora:

- 2 celdas de carga: izquierda/derecha.
- Rodillo transmite fuerza a las celdas.
- Promedio de izquierda/derecha = peso.

Bascula central:

- 4 celdas.
- Peso total del colchon.
- Variable maestra de la linea.

### TAU / TAM

Definicion operativa de audio:

```text
tau = diferencia entre lo que mandan/suman las esparcidoras y lo que mide/pide la bascula central
```

Objetivo:

```text
tau = 0
```

Estado actual:

```text
tau cercano a +5 constante
```

Interpretacion:

- Pequena oscilacion alrededor de cero es normal.
- Diferencia positiva o negativa sostenida indica problema.
- El problema lleva alrededor de medio ano sin resolucion integral.

### Prueba de papel

Metodo:

- Se ponen testigos/papel entre capas.
- Se separan fisicamente capas.
- Se pesa cada capa.
- Se calcula porcentaje real.

Resultado observado:

```text
se pide 30 % externas
sale alrededor de 33 % externas
```

Conclusion:

- El problema no es solo de receta.
- Hay desajuste de pesaje dinamico o distribucion.

### Calibracion estatica vs dinamica

Hecho clave:

- Con pesos patron y esparcidora parada, el peso sale bien.
- En produccion, con banda moviendose y material real, no sale bien.

Posibles causas:

- Arrastre de banda.
- Tension mecanica.
- Roce.
- Rodillo mal alineado.
- Punto de referencia mV incorrecto.
- Tara dinamica incompleta.
- Material con densidad variable.
- Acumulacion o suciedad.
- Sensor fuera de su zona lineal.

### Tara dinamica

El audio dice que al arrancar vacia:

- Se descuenta el peso de la banda.
- Se registran puntos a lo largo de todo el recorrido.
- Se hace delta/promedio para tener medicion mas exacta.
- Luego queda tarado, pero en produccion vuelve a fallar.

### Linealizacion de celdas

Ejemplo del audio:

```text
3 mV -> 0 kg
20 mV -> 20 kg
```

La parte critica es definir el punto de partida con peso muerto. Si se parte de un mV incorrecto, todo el escalamiento queda mal.

### Pendientes

- Formula exacta de tau/TAM.
- Unidad de tau.
- Tolerancia permitida.
- Tags de esparcidoras.
- Calibracion mecanica/electrica del fabricante.
- Procedimiento escrito de prueba de papel.
- Registro de taras dinamicas.
- Velocidad de banda durante prueba.
- Fotos de celdas, rodillos y amplificadores.

## Etapa 7 - Iman, detector y perfilometro

### Nueva informacion de audios

Antes de preprensa o alrededor de la salida de formacion se mencionan:

- Iman ferromagnetico.
- Detector.
- Perfilometro o densitometro.

### Iman ferromagnetico

Funcion:

- Retirar material ferromagnetico, probablemente metales.
- Proteger prensa, bandas y tablero.

El audio primero dice "iman inductivo" y luego corrige a "iman ferromagnetico".

### Detector

El siguiente equipo despues del iman se menciona como "detector". Puede ser:

- Detector de metales.
- Detector de cuerpos extranos.
- Detector de contaminacion.

Confirmar modelo y tecnologia.

### Perfilometro / densitometro / "tomatito"

Funcion:

- Mide densidad a lo largo/ancho del tablero o colchon.
- Permite ver distribucion de material.
- Detecta caidas de material o mala distribucion.
- Sirve para diagnosticar si una variacion es sensor real o consecuencia mecanica.

El audio de proceso menciona principio por rayos X para perfil de densidad.

### Research relacionado

- GreCon DENSITYPROFILER mide perfil de densidad de paneles de madera y puede usarse inline o laboratorio.
- GreCon BOARDCONTROL XL mide peso, espesor, densidad aparente y ancho de productos tipo tablero usando laser, rayos X y metodos tactiles.
- Esto no confirma que NOVOPAN tenga GreCon, pero GreCon es candidato razonable si el equipo en planta se llama perfilometro/densitometro.

### Pendientes

- Marca/modelo.
- Si mide colchon antes de prensa o tablero despues de prensa.
- Si es rayos X.
- Resolucion por ancho.
- Variables que entrega al HMI/historian.

## Etapa 8 - Preprensa, nariz y banda de transferencia

### Funcion de preprensa

Compacta el colchon antes de la prensa caliente y reduce aire atrapado.

Valores oidos:

- Presion hidraulica aproximada: 153 bar, segun notas previas.

### Explicacion operativa

La preprensa:

- Sube/baja mediante sistema hidraulico.
- Reduce aire del colchon.
- Uniformiza altura.
- Prepara el ingreso a prensa caliente.

Sin preprensa o con mala preprensa, el aire puede expandirse con calor y generar defectos internos.

### Nariz

"Nariz" aparece asociada a arranque, apertura/cierre y desperdicio. Pendiente confirmar si es:

- Boca/compuerta de descarga.
- Nariz de formacion.
- Punto de transferencia hacia prensa.
- Elemento mecanico que se abre/cierra para iniciar colchon.

### Banda de transferencia

Los audios dicen que existen pantallas separadas para:

- Esparcidores.
- Preprensa.
- Nariz.
- Banda de transferencia.
- Prensa.

La falta de una pantalla general es uno de los problemas principales.

### Pendientes

- Longitud preprensa.
- Marca/modelo.
- Ubicacion exacta de nariz.
- Velocidad de banda preprensa/transferencia.
- Si la preprensa tiene PLC propio.
- Relacion con prensa y sensores de salida.

## Etapa 9 - Prensa caliente continua

### Rol

La prensa es el master de la linea. Su velocidad "jala" el resto del proceso y afecta todo el lazo aguas arriba.

### Funcion

- Compacta el colchon hasta espesor objetivo.
- Aplica presion y temperatura.
- Activa/curar resina.
- Convierte el colchon en tablero.

### Temperaturas

Notas previas:

```text
platos: 220 - 220 - 220 - 215 C
aceite termico: aproximadamente 285 C
```

En una transcripcion se repite "220, 220, 220, 220, 220" y en otra parece decir "85 grados" para aceite termico. Mantener los valores como pendientes de confirmacion en HMI, porque Whisper puede cortar el "2" de 285.

### Presion

El audio indica:

- Mayor presion a la entrada.
- Menor presion hacia salida o estabilizacion.
- Bloques de control de presion por zona/equipo.
- Sistema hidraulico con bombas y tanque de aceite hidraulico.

### Aceites y temperatura

Se distinguen:

- Aceite hidraulico: para presion/accionamiento. No debe superar cierta temperatura de trabajo; el audio menciona 100 como limite conceptual.
- Aceite termico: para calentar prensa/platos.

La prensa tiene sistema de calentamiento y enfriamiento para mantener temperaturas objetivo.

### Zonas / areas

Ultimo audio menciona:

- La prensa tiene cuatro areas diferentes.
- Area 1.
- Area de calentamiento 1.
- Area de calentamiento 2.
- Otras zonas por confirmar.

Para el proyecto de trazabilidad seria valioso saber por que area va el cambio, no solo "esta en prensa".

### Distancias oidas

- Banda/formacion: 90 m en una linea.
- Otra referencia: 60 y algo de maquina.
- Esta prensa: 22.1 m.
- Otra prensa/linea: 16 m.

Estos valores son muy utiles, pero deben medirse en planta antes de usarlos como constantes.

### Vapor / Dynasteam / steam

Notas previas dicen que el sistema de vapor esta fuera de servicio al 2026-06-22.

En audio aparece una frase transcrita como:

```text
pre-pensa, stripes, dynastine
```

Posible interpretacion:

- Puede referirse a DynaSteam/Dynasteam, tecnologia de vapor/precalentamiento usada en lineas de paneles.
- Research muestra que IMALPAL ha tenido tecnologia "Dyna-Steam" para OSB/PB/MDF, pero eso no confirma que NOVOPAN la tenga.

Marcar como pendiente critico:

- Existe vapor?
- Esta instalado?
- Esta fuera de servicio?
- Es DynaSteam u otra tecnologia?
- En que punto fisico esta?

### Marcas candidatas de prensa

No afirmar marca sin placa. El audio y notas contienen ruido:

- "Mezzo" / "Metso" / "Messo": se oye como software o prensa. Research confirma que Metso Panelboard existio como proveedor historico de panelboard, pero no se encontro "Mezzo" como marca clara de prensa para wood-based panels.
- "Jeff & Butcher" / "pre bache": muy probablemente una transcripcion deformada. Candidato a confirmar: Dieffenbacher, proveedor conocido de prensas continuas CPS/CPS+ para PB/MDP/MDF/OSB.
- Siempelkamp / ContiRoll: aparece como candidato en notas previas y es proveedor reconocido de prensas continuas, pero no queda confirmado para esta planta.

### Pendientes

- Foto de placa de prensa.
- Nombre exacto en HMI.
- Fabricante.
- Longitud real.
- Numero de zonas.
- Temperaturas por zona.
- Presion por zona.
- Velocidad nominal y rango.
- Estado de vapor.
- Si existe sistema tipo DynaSteam.

## Etapa 10 - Sensores de calidad post-prensa

### Nueva informacion fuerte

El audio de explicacion agrega un bloque muy importante: despues de prensa existen pantallas/sensores para ver cada tablero y relacionar cambios de proceso con calidad.

### Sensores ultrasonicos / reventados

Funcion:

- Medir estructura interna.
- Detectar tableros huecos, reventados, blown areas o defectos internos.

Principio explicado:

- Hay ultrasonico abajo y arriba.
- Se emiten ondas.
- Se revisa cuanta senal llega/refracta.
- Si el tablero esta hueco o reventado, las ondas chocan/se atenúan.
- Menor senal recibida se interpreta como problema.

### Pantalla por tablero

Se puede analizar:

- Un tablero a la vez.
- Estructura interna tipo "radiografia".
- 12 sensores a lo ancho, segun audio.
- Tonalidad azul = mejor.
- Tonalidad roja = peor / reventado.
- Numeros = potencia o senal recibida.

### Tendencia de 19 tableros

La pantalla permite ver:

- Cada tablero.
- Resumen/promedio de los 19 tableros anteriores.
- Evolucion por sensores.
- Conteo de tableros producidos.
- Conteo de tableros fuera de tolerancia.

Esto es clave para el proyecto: si se sabe donde esta un cambio, se puede mirar exactamente cuando deberia empeorar/mejorar la tendencia de calidad.

### Zona central

El audio indica que normalmente la parte central del tablero puede ser mas debil. Si se observa algo "al reves" o fuera de patron, puede indicar problema de dosificacion o composicion.

### Espesor

Datos oidos:

- 6 medidores de espesor.
- Medicion con ruedas o sensores tactiles/rodillos.
- Tablero estandar observado: 15.3 mm.
- Diferencia maxima entre punto menor y mayor: 3 decimas de mm, segun audio.
- Se manejan milimetros.

Ejemplo conceptual:

```text
max(espesor) - min(espesor) <= 0.3 mm
```

Confirmar tolerancia exacta por norma interna y producto.

### Peso y densidad promedio

El tablero se pesa en una seccion aislada mecanicamente para que el peso sea individual.

La densidad promedio se calcula con:

```text
densidad = peso / volumen
volumen = espesor x ancho x largo
```

Audio indica que se usa espesor, peso promedio y dimensiones del tablero.

### Research relacionado

- IMALPAL tiene controles online de calidad para detectar delaminados, zonas sin cola, blown areas, burbujas y defectos internos en PB/MDF/OSB.
- GreCon BOARDCONTROL XL integra mediciones de peso, espesor, densidad aparente y ancho para tableros.

No confirmar marca hasta ver equipo, pero estas son familias tecnologicas coherentes con lo observado.

### Datos por levantar

- Marca/modelo de sensores de reventados.
- Si son IMALPAL/FBC200, GreCon u otro.
- Numero real de sensores.
- Ubicacion: antes/despues de corte.
- Tolerancias por producto.
- Como se guarda historico.
- Si hay export CSV/historian.

## Etapa 11 - Corte longitudinal y corte angular

### Funcion

Despues de prensa, el tablero se corta y recorta.

### Sierras longitudinales

Funcion:

- Recortar bordes.
- Ajustar ancho.
- Sincronizar con velocidad de linea.

### Corte angular en movimiento

Funcion:

- Cortar mientras la linea avanza.
- Usar corte diagonal/compensado para que el resultado final sea a 90 grados.

### Diagonales / ortoangulo

El audio recalca:

- El corte puede estar "a 90", pero si diagonales estan mal, el tablero no sale cuadrado.
- Hay que calibrar diagonales.
- Se entiende como problema geometrico de triangulos.

### Pendientes

- Formato de corte.
- Tolerancia de escuadria.
- Sistema de sincronizacion.
- Sensores de posicion de sierra.
- Frecuencia de calibracion.

## Etapa 12 - Agrupamiento

### Funcion

Agrupa tableros, aparentemente de 3 en 3, antes de enfriamiento/estacado.

### Instrumentacion

- Sensores opticos.
- Sensores con retroalimentacion/emisor-receptor.
- Sistema neumatico.
- Encoders que pueden fallar.

### Conteo

El audio describe conteo por senales:

```text
pasa tablero -> senal / hueco -> uno
pasa tablero -> senal / hueco -> dos
...
```

### Problemas

- Encoders danados.
- Agrupamiento falla.
- Sensores mal configurados.

### Pendientes

- Confirmar si agrupamiento es antes o despues de enfriador.
- Confirmar cuantos tableros por grupo.
- Confirmar logica de conteo.
- Confirmar actuadores y encoders.

## Etapa 13 - Enfriadoras tipo estrella

### Funcion

Enfrian tableros despues de prensa para estabilizar temperatura y reducir pandeo por desbalance termico.

### Confirmado por documentos previos

- Enfriadoras tipo estrella.
- 3 tableros simultaneos.
- Rotacion de 180 grados por ciclo.
- Contacto con tubos metalicos.

### Funcion fisica

El giro alterna caras y ayuda a que ambas superficies pierdan calor de forma mas pareja.

### Pendientes

- Tiempo de residencia.
- Temperatura entrada/salida.
- Numero de estrellas.
- Si hay medicion de temperatura.
- Relacion con ritmo de prensa.

## Etapa 14 - Estacado y salida del area

### Funcion

Apila tableros agrupados y cierra el area de encolados/formacion/prensa.

### Instrumentacion

- Sensores opticos.
- Actuadores neumaticos.
- Encoders.
- Conteo de tableros.

### Siguiente etapa

El audio dice que de aqui un montacarguista lleva a la etapa de:

- Lijado / calibracion, probablemente.
- Laminado, mencionado como posterior en transcripcion.

Confirmar flujo real segun producto.

## Pantallas y arquitectura actual

### Problema principal

No existe una pantalla generica que agrupe todo el proceso. Hay vistas separadas por sector.

Pantallas o zonas mencionadas:

- Esparcidores.
- Preprensa.
- Nariz.
- Banda de transferencia.
- Prensa.
- Sensores de calidad/reventados.

Necesidad:

```text
una vista entera que diga donde esta el cambio desde encolado hasta salida/calidad
```

### Linea 2 / otra linea

Los audios comparan con otra linea:

- Tiene sensores mas modernos.
- Se oye "IONX", probablemente IO-Link.
- Tiene una vista donde marcas/puntos se desplazan.
- Tiene puntos de referencia por maquina.
- Al hacer click en una marca, indica en que punto se encuentra cada cambio.
- Puede ver tiempo o metros segun velocidad.

### IO-Link

Research confirma que IO-Link es una tecnologia I/O estandarizada para comunicacion punto a punto con sensores y actuadores inteligentes. Encaja con la frase "entradas y salidas inteligentes".

No afirmar que la planta usa IO-Link hasta revisar hardware, pero es muy probable que "IONX" sea mala transcripcion de IO-Link.

## Proyecto principal - trazabilidad de cambios por etapa

### Problema

Cuando se cambia una receta, resina, dosificacion, densidad o spray, no se sabe con precision donde esta fisicamente ese cambio a lo largo de la linea.

Consecuencia:

- Se mira calidad demasiado temprano o tarde.
- No se sabe si un defecto corresponde al cambio actual o al material anterior.
- Cuesta justificar si un ajuste mejoro o empeoro.
- El operador trabaja a ciegas en transiciones.
- Se desperdicia material en arranques y cambios.

### Cambios que deberian rastrearse

- Cambio de resina.
- Cambio de parafina.
- Cambio de agua.
- Cambio de desmoldante/spray.
- Cambio de densidad.
- Cambio de receta.
- Cambio de proporcion externa/core.
- Cambio de setpoint de esparcidoras.
- Cambio de velocidad de prensa.
- Cambio de arranque/secuencia.
- Cambio manual relevante registrado por operador.

### Punto de origen

El cambio puede nacer en distintos puntos:

- Dosificacion / encolado.
- Dosimbuncas.
- Sprays.
- Inicio de formacion.
- Preprensa.
- Prensa.

Por eso no basta una sola marca. Se necesitan origenes configurables.

### Modelo minimo

```text
evento_cambio:
  id
  tipo_cambio
  timestamp_origen
  estacion_origen
  valor_anterior
  valor_nuevo
  operador
  velocidad_linea
  estado_linea

estacion:
  nombre
  distancia_desde_origen
  velocidad_tramo
  plc
  sensor_referencia

posicion_cambio:
  distancia_avanzada
  estacion_actual
  eta_a_siguiente_estacion
  eta_a_salida
```

### Formula por distancia/velocidad

```text
tiempo_llegada = distancia / velocidad_actual
posicion_actual = velocidad_actual x tiempo_desde_evento
```

### Formula por pulsos

```text
distancia_por_pulso = distancia_por_vuelta / pulsos_por_vuelta
distancia_avanzada = pulsos_acumulados x distancia_por_pulso
tiempo_restante = distancia_restante / velocidad_actual
```

### Lo que se debe medir

- Distancia desde encolado a primer punto de banda.
- Distancia de sprays a esparcidoras.
- Distancia entre esparcidora 1, 2 y 3.
- Distancia a bascula central.
- Distancia a iman/detector/perfilometro.
- Distancia a preprensa.
- Distancia a nariz.
- Distancia a entrada de prensa.
- Longitud de prensa.
- Distancia por zona de prensa.
- Distancia a sensores de calidad.
- Distancia a corte.
- Distancia a enfriador.
- Distancia a estacado.

### Opcion A - marcador fisico

Ideas oidas:

- Franja verde.
- Pintura de fabrica.
- Marca en banda.
- Grapa o marca en parte interna.

Problema:

- No durable.
- Friccion, material, desmoldante y limpieza lo pueden borrar.
- Puede durar una semana o menos.

Uso recomendado:

- Calibracion inicial.
- Verificacion temporal.
- No como solucion productiva principal.

### Opcion B - pulsos/rotaciones

Idea mas aterrizada para MVP:

- Usar sensor existente en banda/rodillo.
- Contar rotaciones.
- Medir diametro de rodillo.
- Calcular metros por vuelta.
- Dividir por pulsos por vuelta.
- Expresar cada estacion como cantidad de pulsos desde origen.

Ventajas:

- No requiere marcar fisicamente la banda.
- Usa senales existentes si estan disponibles.
- Puede funcionar aunque cambie velocidad, porque se integra por pulsos.

Riesgos:

- Deslizamiento entre rodillo y banda.
- Diametro efectivo cambia por desgaste/suciedad.
- Pulsos perdidos.
- Diferentes PLCs no sincronizados.

### Opcion C - comunicacion entre PLCs

Situacion:

- Cada maquina tiene su propio PLC/controlador.
- No necesariamente hay comunicacion entre maquinas.

Ventaja:

- Seria solucion mas robusta.
- Permite eventos reales por tramo.

Desventaja:

- Proyecto de programacion mas complejo.
- Requiere red, tags, sincronizacion de reloj, permisos e ingenieria.

### Pantalla objetivo

La pantalla deberia mostrar:

- Cambio activo.
- Origen del cambio.
- Hora de origen.
- Valor anterior/nuevo.
- Posicion estimada.
- Estacion actual.
- ETA a esparcidoras, preprensa, prensa, sensores y salida.
- Lista de ultimos cambios.
- Indicador de "ya salio" / "en transicion" / "evaluar calidad ahora".
- Variables de salida asociadas: espesor, peso, densidad, reventados, fuera de tolerancia.
- Estado por seccion.
- Incertidumbre de estimacion.

### KPIs para justificar proyecto

- Metros de tablero en transicion.
- Numero de tableros afectados por cambio.
- Tiempo desde cambio hasta salida.
- Tiempo hasta primer tablero medible.
- Reduccion de desperdicio en arranque.
- Reduccion de tableros fuera de tolerancia.
- Reduccion de pruebas a ciegas.
- Menor tiempo de diagnostico.
- Menor numero de reset/rearranque sin causa raiz.
- Beneficio monetario vs costo de sensores/programacion/mecanica.

## Proyecto secundario - optimizacion de arranque

### Problema actual

El arranque local se hace desde dos paneles y puede arrancar todo de golpe. Eso genera sobreoscilacion de peso y puede parar/rearrancar la linea.

### Referencia de otra linea

En otra linea el arranque seria mas secuencial:

1. Descarga primero SL1 / capa inferior.
2. Luego capa central.
3. Luego capa superior.

### Beneficio esperado

- Menos sobreoscilacion.
- Menos desperdicio.
- Mejor llegada a regimen estable.
- Menos tapones por material enviado de golpe.

### Datos necesarios

- Estado inicial: linea vacia o llena.
- Material retenido en cada equipo.
- Tiempos de llenado.
- Tiempos de viaje.
- Secuencia real de arranque.
- Retardo entre capas.
- Comportamiento de bascula central.
- Evolucion de tau.

## Proyecto secundario - reduccion de desperdicio en aperturas/nariz

### Problema

Al comenzar encolado/formacion, hasta cerrar la nariz se genera material de desperdicio.

### Hipotesis

Si se sincroniza:

- Dosificacion de material.
- Material presente en esparcidoras.
- Retardo de transporte.
- Cierre/apertura de nariz.

Se puede mejorar la relacion de desperdicio.

### Dependencia

Este proyecto depende del mapa tiempo-distancia. Sin saber donde esta el material/cambio, no se puede sincronizar bien.

## Problema activo 1 - taponamientos de madrugada

### Hechos oidos

- Hubo cuatro taponamientos consecutivos.
- La primera causa no estaba clara.
- Eventos 2 y 3 parecen relacionados con sensor de maximo/controlador.
- Evento 4 parece consecuencia de reinicios y acumulacion.
- Se mencionan valores 85, 100, 120, 130; confirmar unidades y umbrales.

### Logica comentada

Cuando se activa sensor de maximo, deberia parar descargas para evitar que el problema se agrave.

Problema posible:

```text
sensor detecta maximo
senal no llega o no es interpretada por controlador
controlador no para
material sigue acumulandose
taponamiento empeora
```

### Relacion con rodillos/encoladora

Se menciona alarma de rodillos en encoladora:

- Rodillos se alarman.
- No manda material.
- Aguas abajo pide mas material.
- Al destaponarse rodillos, entra exceso de material.
- Se amplifica el problema.

### Mala practica detectada

Resetear falla sin analizar causa raiz puede:

- Rearmar sobre condiciones no resueltas.
- Provocar fallas secundarias.
- Ocultar primera alarma real.
- Convertir una falla simple en evento multiple.

### Datos para RCA

- Alarm log exacto.
- Trend de nivel.
- Trend de velocidad.
- Estado de rodillos.
- Estado sensor maximo.
- Estado salida controlador/interlock.
- Hora de reset.
- Hora de rearranque.
- Quién opero.
- Cambio de receta o velocidad cercano.
- Condicion de material.

## Problema activo 2 - tau +5 y capas 33/30

### Sintoma

- Tau deberia estar en cero.
- Tau esta alrededor de +5 constante.
- Se pide 30 % externas pero prueba de papel da 33 %.

### Por que importa

La relacion de capas afecta:

- Superficie.
- Fijado.
- Resistencia mecanica.
- Core.
- Densidad.
- Pandeo.
- Calidad final.

### Hipotesis

- Error de bascula central.
- Error de celdas de esparcidora.
- Error dinamico por banda en movimiento.
- Tara dinamica incorrecta.
- Roce/arrastre.
- Offset mV incorrecto.
- Material con densidad variable.
- Limpieza/alineacion.
- Compensacion del controlador mal ajustada.

### Accion pendiente

Esperar o insistir con instructivo del fabricante para calibracion mecanica y electrica. Preparar paquete de evidencia:

- Pesos patron.
- Resultado en estatico.
- Resultado en dinamico.
- Prueba de papel.
- Trends de tau.
- Foto de celdas.
- Datos de tara.
- Velocidad de banda.
- Producto/receta.

## Problema activo 3 - oscilacion de PID en dosificacion

### Sintoma

PV no sigue estable al SP. Sube, corrige, baja, corrige.

### Posibles causas

- Mala sintonizacion PID.
- Retardo de medicion.
- Sensor sucio.
- Bomba fuera de rango.
- Aire en linea.
- Viscosidad/densidad variable.
- Valvula con histeresis.
- Saturacion de LMN.
- Anti-windup/rampas no configuradas.

### Datos necesarios

- Trend SP/PV/LMN.
- Modo auto/manual.
- Alarmas de bomba.
- Presion antes/despues.
- Caudal real.
- Limpieza de sensor.
- Temperatura del fluido.
- Receta activa.

## Maquinas, marcas y nombres oidos

Esta seccion separa lo confirmado visualmente en HMI, lo confirmado por audio y lo inferido por research. Importante: ver una marca en HMI no siempre significa que sea el fabricante mecanico completo; puede ser proveedor historico, integrador, sistema de control o software.

### Confirmado visualmente en imagenes HMI

| Marca/sistema | Donde aparece | Que confirma | Pendiente |
|---|---|---|---|
| Metso | `IMG_1875`, `IMG_1874` | HMI de `Formacion` y `Encolado`; footer `HMI-METSO` | Confirmar si corresponde a Linea 1, Linea 2 o sistema heredado |
| Dieffenbacher PROGUIDE | `IMG_1872`, `IMG_1873` | HMI de cadena de formacion y prensa; formula 15mm 670kg MDP/RH | Confirmar linea exacta y alcance mecanico del proveedor |
| SUNDS FIBERTECH | `IMG_1876` | HMI de prensa con tabs Prensa/Espesor/Cadenas/Hidraulica/Calentamiento | Confirmar si es fabricante de prensa, retrofit o sistema de control |
| EVOsteam | `IMG_1872`, `IMG_1873` | Pestana/seccion Dieffenbacher asociada a vapor/steam y correcciones | Confirmar operacion real y relacion con Dynasteam |
| Dynasteam | `IMG_1875` | Boton `Habilitar Dynasteam` visible en Metso | Confirmar si esta operativo o fuera de servicio |
| Do_Bin | `IMG_1874` | Pestaña `Llenado Do_Bin` visible | Confirmar equivalencia exacta con dosimbuncas/dosing bins |
| Pelikano | `IMG_1875`, `IMG_1874`, `IMG_1876` | Logo visible en HMI | Confirmar si es marca/producto interno o identificador corporativo |

### Confirmado como oido, no confirmado como escritura

| Oido/transcrito | Posible interpretacion | Estado |
|---|---|---|
| Mezzo | Probablemente Metso en algunos audios, pero puede ser otra cosa | Metso ya aparece visualmente; confirmar si el audio se referia a Metso |
| Jeff & Butcher | Posible Dieffenbacher | Dieffenbacher ya aparece visualmente; confirmar si el audio deformo ese nombre |
| pre bache | Posible Dieffenbacher u otra marca | Confirmar |
| IONX | Probablemente IO-Link | Confirmar en hardware |
| Dynastine | Posible DynaSteam/Dynasteam | Confirmar |
| dos y mil / dosimil | Dosimbunca / dosing bin / Do_Bin | Do_Bin ya aparece en HMI; falta nombre oral correcto |
| perfilometro / tomatito | Densitometro / perfil de densidad | Confirmar marca/modelo |

### Research - proveedores/tecnologias relevantes

| Marca/tecnologia | Que aporta | Uso en esta base |
|---|---|---|
| Dieffenbacher CPS+ | Prensa continua para PB, MDF, OSB, LVL | Candidato si "Jeff & Butcher/pre bache" era Dieffenbacher |
| Siempelkamp ContiRoll | Prensa continua para paneles de madera | Candidato de prensa si aparece en placa |
| Metso Panelboard | Proveedor historico de tecnologias panelboard; parte fue vendida/divestida | Candidato fonetico si "Mezzo" era Metso |
| GreCon DENSITYPROFILER / BOARDCONTROL | Perfil de densidad, medicion inline/lab, peso/espesor/densidad | Candidato para perfilometro/tomatito |
| IMALPAL | Equipos para wood-based panels, resination, metering bins, online quality controls | Candidato para sensores de reventados/calidad o DynaSteam |
| IO-Link | Comunicacion inteligente sensor/actuador | Probable correccion de "IONX" |
| Siemens PID_Compact | Referencia SP/PV/LMN y PID en PLC Siemens | Contexto para variables PID, no confirma PLC |
| Endress+Hauser | Referencias de medicion industrial: nivel, flujo EM, Coriolis | Research de principios, no marca confirmada |

### Fotos que hay que tomar para cerrar marcas

- Placa de prensa principal.
- Footer/header del HMI de prensa.
- Gabinete PLC de prensa.
- Placa de preprensa.
- Placa de esparcidoras.
- Marca/modelo de perfilometro.
- Marca/modelo del detector de reventados.
- Marca/modelo de flujometros.
- Marca/modelo de celdas o amplificadores de peso.
- Marca/modelo de modulos IO inteligentes.
- Pantalla donde aparezca "Mezzo", "Metso" o nombre similar.

## Data dictionary preliminar

### Evento de cambio

| Campo | Descripcion |
|---|---|
| change_id | Identificador unico |
| timestamp_inicio | Hora exacta del cambio |
| origen | Encolado, dosimbunca, spray, formacion, prensa, etc. |
| tipo | Receta, resina, parafina, agua, densidad, velocidad, spray |
| valor_anterior | Valor antes del cambio |
| valor_nuevo | Valor despues del cambio |
| operador | Usuario/turno |
| producto | Espesor/formato/receta |
| velocidad_linea | Velocidad al momento del cambio |
| estado_linea | Arranque, estable, parada, limpieza, transicion |

### Estacion

| Campo | Descripcion |
|---|---|
| station_id | Identificador |
| nombre | Nombre operativo |
| distancia_desde_origen | m |
| plc | Controlador asociado |
| hmi | Pantalla asociada |
| sensor_referencia | Tag de pulso/velocidad/posicion |
| offset_tiempo | Tiempo fijo si aplica |
| incertidumbre | Margen de error estimado |

### Calidad de tablero

| Campo | Descripcion |
|---|---|
| board_id | Identificador de tablero, si existe |
| timestamp_salida | Hora post-prensa/corte |
| espesor_promedio | mm |
| espesor_min | mm |
| espesor_max | mm |
| delta_espesor | mm |
| peso | kg |
| densidad_promedio | kg/m3 |
| reventado_score | Indicador de ultrasonido |
| sensores_12 | Array de senal por sensor |
| fuera_tolerancia | boolean |
| change_id_estimado | Cambio que deberia corresponder |

### Variables de control

| Variable | Donde |
|---|---|
| SP/PV/LMN resina | Encolador |
| SP/PV/LMN parafina | Encolador |
| flujo agua | Encolador/sprays |
| nivel silos | Silos |
| nivel dosimbunca | Dosimbuncas |
| peso dosimbunca | Dosimbuncas |
| velocidad motor descarga | Dosimbuncas |
| peso esparcidora L/R | Esparcidoras |
| peso bascula central | Formacion |
| tau/TAM | Formacion |
| velocidad prensa | Prensa |
| temperatura zonas | Prensa |
| presion zonas | Prensa |
| espesor tablero | Post-prensa |
| peso tablero | Post-prensa |
| reventados | Post-prensa |

## Checklist para proxima visita

### Medicion fisica

- [ ] Medir distancia de encolado a primer punto de banda.
- [ ] Medir distancia de sprays a cada esparcidora.
- [ ] Medir distancia entre esparcidoras.
- [ ] Medir distancia de esparcidoras a bascula central.
- [ ] Medir distancia a iman/detector/perfilometro.
- [ ] Medir distancia a preprensa.
- [ ] Medir longitud de preprensa.
- [ ] Medir distancia a nariz.
- [ ] Medir distancia a entrada de prensa.
- [ ] Confirmar longitud real de prensa.
- [ ] Dividir prensa por zonas reales.
- [ ] Medir distancia a sensores de calidad.
- [ ] Medir distancia a corte.
- [ ] Medir distancia a enfriador.
- [ ] Medir distancia a estacado.

### Capturas de HMI

- [ ] Pantalla de silos.
- [ ] Pantalla de dosimbuncas.
- [ ] Pantalla de encolador SP/PV/LMN.
- [ ] Pantalla de esparcidoras.
- [ ] Pantalla de tau/TAM.
- [ ] Pantalla de bascula central.
- [ ] Pantalla de preprensa/nariz/transferencia.
- [ ] Pantalla de prensa con zonas.
- [ ] Pantalla de sensores de reventados.
- [ ] Pantalla de espesor/peso/densidad.
- [ ] Pantalla donde salga software "Mezzo/Metso/otro".

### Confirmaciones operativas

- [ ] Es 53/47 o 53/43?
- [ ] Tau y TAM son lo mismo?
- [ ] Que significa CLB, CL, CLT en HMI?
- [ ] SL1 y SL2 son capas externas o nombres internos?
- [ ] Donde exactamente esta la nariz?
- [ ] Que es "franja verde" en otra linea?
- [ ] Que significa "Dynastine/DynaSteam" en planta?
- [ ] Sistema de vapor esta instalado, fuera de servicio o no existe?
- [ ] Cual es la marca de la prensa Linea 1?
- [ ] Cual es la marca de la prensa Linea 2?
- [ ] Que sensores nuevos tiene Linea 2?
- [ ] IO-Link esta instalado?

### Datos de problema

- [ ] Export de alarmas del taponamiento.
- [ ] Trends de 2:00 a 4:00 del dia del evento.
- [ ] Estado sensor maximo.
- [ ] Estado controlador/interlock.
- [ ] Trend nivel 85/100/120/130.
- [ ] Trend velocidad.
- [ ] Trend descargas 110/120.
- [ ] Reset/rearme por operador.
- [ ] Prueba de papel antes/despues de calibracion.
- [ ] Trend tau.
- [ ] Trend SP/PV/LMN.

## Preguntas abiertas grandes

1. Cual es el punto de origen oficial de un cambio?
2. Como se identifica un cambio de receta vs un ajuste manual temporal?
3. Cada PLC comparte reloj?
4. Existe historian central?
5. Hay tags accesibles desde todos los HMI?
6. Se puede exportar data historica?
7. Se permite agregar sensor a banda principal?
8. Hay red industrial disponible para comunicar PLCs?
9. Que nivel de exactitud necesita operaciones: metros, segundos, tableros o zonas?
10. Que costo de desperdicio justifica el proyecto?

## Fuentes externas de research

- EPA AP-42 Particleboard Manufacturing: https://gaftp.epa.gov/ap42/ch10/s062/c10s06-2.pdf
- NIST Handbook 44, Section 2.21 Belt-Conveyor Scale Systems: https://www.nist.gov/document/2026-nist-handbook-44-section-221
- Siemens PID_Compact documentation: https://docs.tia.siemens.cloud/r/en-us/v21/pid-control/pid-control-s7-1200-s7-1500-s7-1200-g2/using-pid_compact-s7-1200-s7-1500-s7-1200-g2/technology-object-pid_compact-s7-1200-s7-1500-s7-1200-g2
- Dieffenbacher CPS+ continuous press: https://dieffenbacher.com/wood-based-panels/products/press-systems/cps-continuous-press
- Dieffenbacher press systems: https://dieffenbacher.com/wood-based-panels/products/press-systems
- Siempelkamp ContiRoll: https://www.siempelkamp.com/en/products-and-technologies/machine-and-plant-engineering/wood-based-panel-plants/lvl/contiroll/contiroll/
- Fagus-GreCon DENSITYPROFILER: https://www.fagus-grecon.com/en-us/measurement-technology/products/densityprofiler
- Fagus-GreCon BOARDCONTROL XL: https://www.fagus-grecon.com/en-us/measurement-technology/products/boardcontrol-xl
- IO-Link official: https://io-link.com/
- IMALPAL Group: https://www.imalpal.com/
- IMALPAL wood based panels: https://www.imalpal.com/wood-based-panels/
- Valmet/Metso Panelboard archive: https://www.valmet.com/news/news-archive-1999-2013/pulp-and-paper-news/metso-has-agreed-to-divest-its-german-panelboard-press-business-and-to-form-strategic-cooperation-with-siempelkamp/
- Endress+Hauser electromagnetic flow principle: https://www.endress.com/en/support-overview/learning-center/flow-measuring-principle-emf
- Endress+Hauser Coriolis principle: https://www.endress.com/en/support-overview/learning-center/flow-measuring-principle-coriolis

## Notas finales

Esta base debe crecer como libreta tecnica, no como slide. Cada vez que aparezca una anotacion nueva, agregarla aqui aunque todavia no este limpia. Luego se puede transformar en:

- Mapa visual de proceso.
- Wireframe de overview HMI.
- Documento de justificacion de proyecto.
- Checklist de levantamiento en planta.
- Especificacion tecnica para programacion.
- Presentacion ejecutiva.
