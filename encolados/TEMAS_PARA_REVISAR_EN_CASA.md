# Temas para revisar en casa - Encolados / Aglomerados

> Guia personal de estudio para entender pantallas, controles, sensores y proceso.  
> No es documento formal de planta; es una lista viva de temas para aprender y volver a planta con mejores preguntas.

## Fuentes base

- Base maestra: `/Users/manue/NOVOPAN-SLIDES/encolados/BASE_INFO_ENCOLADOS.md`
- Proceso resumido: `/Users/manue/NOVOPAN-SLIDES/encolados/PROCESO.md`
- Fotos HMI:
  - `/Users/manue/Downloads/IMG_1875.JPG`
  - `/Users/manue/Downloads/IMG_1872.JPG`
  - `/Users/manue/Downloads/IMG_1873.JPG`
  - `/Users/manue/Downloads/IMG_1876.JPG`
  - `/Users/manue/Downloads/IMG_1874.JPG`
- Notas de trazabilidad: `/Users/manue/Documents/NOVOPAN/transcripts/2026-06-22_encolados/notes/proceso_trazabilidad_cambios.md`
- Audios aglomerados: `/Users/manue/Documents/NOVOPAN/transcripts/2026-06-22_aglomerados/notes/`

## Prioridad de estudio

1. Aprender a leer una pantalla HMI sin perderse.
2. Aprender unidades y como convertirlas.
3. Entender el flujo fisico: encolado -> formacion -> preprensa -> prensa -> calidad -> enfriado -> estacado.
4. Entender que variables son setpoint, cuales son reales y cuales son alarmas.
5. Entender el proyecto de trazabilidad por cambio: distancia, velocidad, pulsos y estaciones.
6. Preparar preguntas concretas para la siguiente visita.

## 1. Como leer una HMI industrial

### Cosas que mirar primero

- Nombre de pantalla: ejemplo `Formacion`, `Encolado`, `Vista general de la prensa`.
- Marca/sistema: Metso, Dieffenbacher PROGUIDE, SUNDS FIBERTECH.
- Usuario activo: Operator, Administrator.
- Fecha/hora.
- Formula/receta activa.
- Modo: Automatico, Manual, Produccion, Calentar, Detener.
- Alarmas visibles.
- Valores verdes/rojos.
- Setpoint vs actual.
- Unidades.

### Colores y estados

- Verde: normalmente OK, ON, habilitado, sin falla.
- Rojo: alarma, OFF, paro, falla o valor fuera de rango.
- Blanco/gris: valor informativo o campo editable.
- Azul: muchas pantallas usan azul para valores importantes o equipos.

No asumir siempre. Verificar con operadores porque cada HMI puede usar convenciones propias.

### Palabras clave

| Palabra | Que significa |
|---|---|
| Actual | Valor medido ahora |
| Setear / Setpoint | Valor objetivo |
| Ajustado | Valor pedido por receta/control |
| Real | Valor medido |
| Automatico | Control funcionando solo |
| Manual | Operador fuerza/mueve |
| ON/OFF | Estado habilitado/deshabilitado |
| Alarma | Evento que requiere atencion |
| Warning | Advertencia antes de falla fuerte |
| Bloqueado | La logica impide continuar o requiere reset |
| Remote | Equipo o modulo controlado remotamente |

## 2. Unidades que debo dominar

### Velocidad

- `m/min`: metros por minuto.
- `mm/s`: milimetros por segundo.

Conversion:

```text
m/min = mm/s x 60 / 1000
mm/s = m/min x 1000 / 60
```

Ejemplos de las fotos:

```text
378 mm/s = 22.68 m/min
16.86 m/min = 281 mm/s aproximadamente
17.0 m/min = 283 mm/s aproximadamente
```

Preguntas:

- Que velocidad manda realmente: prensa, formacion o transportador?
- Cuando la prensa cambia velocidad, que equipos la siguen?
- Hay tramos donde hay deslizamiento o velocidad diferente?

### Peso y masa por area

- `kg/m2`: peso superficial del colchon/tablero.
- `kg/m`: masa por metro lineal.
- `kg/min`: descarga masica por tiempo.
- `t/h`: toneladas por hora.

Pantallas vistas:

- Metso Formacion: peso material actual 11.59 kg/m2, set 11.62 kg/m2.
- SUNDS Prensa: peso 11.60 kg/m2.
- Dieffenbacher Linea 2: peso manta ajustado y real 9.5 kg/m2.

Preguntas:

- Por que una linea trabaja con 11.6 kg/m2 y otra con 9.5 kg/m2?
- Depende de espesor, densidad, receta o producto?
- Como se relaciona kg/m2 con densidad final?

### Densidad

- `kg/m3`: masa por volumen.
- Densidad de flake/particula: antes de formar tablero.
- Densidad de manta: durante formacion.
- Densidad de tablero: despues de prensa con peso, dimensiones y espesor.

Valores vistos:

- Metso Encolado: CE 157 kg/m3, CI 133 kg/m3.
- Metso Formacion: SL1 174.82 kg/m3, CC 132.42 kg/m3, SL2 207.94 kg/m3.
- Dieffenbacher: Densidad SL 195 kg/m3, Densidad CL 145 kg/m3.

Preguntas:

- Que densidad es aparente de particula y cual es del colchon?
- Donde se mide: dosing bin, formadora, perfilometro o post-prensa?

### Humedad

- `%`: porcentaje de humedad o variable relacionada.
- `% Hy`: humedad en algunas pantallas.

Valores vistos:

- Metso Formacion: Humedad 13.7%.
- Dieffenbacher: Humedad manta SL 14.0%, CL 4.3%.
- SUNDS: Humedad CE 18.5% Hy, CI 0.0% Hy.
- Metso Encolado: Humedad en aire compresores 100.00% en rojo.

Preguntas:

- Que diferencia hay entre humedad de material, humedad de manta y humedad de aire comprimido?
- Por que CI aparece 0.0% en SUNDS?
- El 100% de aire compresores es alarma real o indicador saturado?

### Temperatura

- `C`: grados Celsius.
- Aparece en encoladoras, prensa, calentamiento, aceites, circuitos.

Valores vistos:

- Metso Encolado: CE 43.1 C.
- Dieffenbacher Linea 2: 46.6 C, 45.6 C en modulos.
- Dieffenbacher Prensa: Circ. calefaccion 1 = 264.60 C.
- SUNDS Prensa: areas de calentamiento 235/235/222/205 C.

Preguntas:

- Que temperatura es de aceite termico, plato, banda o material?
- Que significa cuando una alarma dice que no alcanza punto de placa de calefaccion?

### Presion

- `bar`: presion hidraulica o tension de banda.
- `MPa`: presion de grafico de prensa.

Valores vistos:

- Dieffenbacher: Tens.Band superior 138.70 bar, inferior 140.55 bar.
- SUNDS: 105/103 bar y grafico en MPa.

Preguntas:

- Que presion compacta el tablero?
- Que presion solo tensiona banda/cinturon?
- Como leer el perfil de presion por marcos?

### Dosificacion de agua/spray

- `g/m2`: gramos por metro cuadrado.

Valores vistos:

- Dieffenbacher: aspersion superior 16.0 g/m2, inferior 14.0 g/m2.
- Metso: spray superior e inferior ON.

Preguntas:

- Es agua pura o agua + desmoldante?
- Los 16/14 g/m2 corresponden al desmoldante o agua total?
- Como afecta pegado en banda/prensa?

## 3. Nomenclatura de capas

### Terminos vistos

| Termino | Interpretacion provisional |
|---|---|
| CE | Capa externa |
| CI | Capa interna |
| SL | Surface layer / capa superficial |
| CL | Core layer / capa central |
| SL1 | Capa superficial 1, probablemente inferior |
| SL2 | Capa superficial 2, probablemente superior |
| CC | Capa central/core en HMI Metso |
| CLB | Core Layer Bottom, oido en audio |
| CLT | Core Layer Top, oido en audio |

### Cosas clave

- En los audios se hablaba de 30% capas externas y 70% core.
- En Metso Encolado se ve 27% SL y 73% CL.
- En las fotos aparece CE/CI y SL/CL, lo que ayuda a traducir idioma de HMI.

Preguntas para planta:

- CE = capa externa? CI = capa interna?
- SL1 y SL2 son inferior/superior?
- CC es core completo o una seccion especifica?
- CLB/CL/CLT existen en HMI o fueron de otra linea?

## 4. Pantalla Metso - Encolado

Foto: `/Users/manue/Downloads/IMG_1874.JPG`

### Que aprender

- Que es una caja de dosificacion.
- Que es `Do_Bin`.
- Como se calcula descarga kg/min.
- Como leer densidad de flake.
- Como leer porcentaje de capa.
- Como leer encoladora CE/CI.
- Que significa `Resin Consumption`.
- Que es `Evojet`.
- Que son `Bloques Autom.`.

### Valores para practicar

- CE: 157 kg/m3, 61%, 117 kg/min, 27% SL.
- CI: 133 kg/m3, 59%, 319 kg/min, 73% CL.
- Velocidad linea formacion: 16.86 m/min, 120.25%.
- Resin Consumption: 51.0.
- Humedad en aire compresores: 100%.

### Ejercicio

Hacer una tabla:

```text
CE: densidad, llenado, descarga, proporcion, estado automatico
CI: densidad, llenado, descarga, proporcion, estado automatico
```

Luego escribir que pasaria si:

- CE baja de densidad.
- CI sube kg/min.
- Encolado automatico pasa a OFF.
- Humedad aire compresores queda en rojo.

## 5. Pantalla Metso - Formacion

Foto: `/Users/manue/Downloads/IMG_1875.JPG`

### Que aprender

- Como se visualizan SL1, CC, SL2.
- Como se lee peso del material.
- Como se comparan actual, setpoint, minimo y maximo.
- Como se lee velocidad de prensa vs transportador.
- Donde aparecen preprensa, spray, Dynasteam, nariz de rechazo y magnet.
- Como ver interlocks y alarmas.

### Valores para practicar

- Peso actual: 11.59 kg/m2.
- Setear: 11.62 kg/m2.
- Tolerancia: -8% a +8%.
- Minimo: 10.69 kg/m2.
- Maximo: 12.55 kg/m2.
- Toneladas por hora: 28.71 t/h.
- Velocidad prensa: 16.85 m/min.
- Transportador formacion: 16.25 m/min.
- Manual: 15.74 m/min.
- Humedad: 13.7%.
- Preprensa: 415.0 mm y 18.2 mm visibles.
- Contador/distancia: 5510.5 m.

### Ejercicio

Verificar que el setpoint 11.62 con +/-8% da aproximadamente:

```text
11.62 x 0.92 = 10.69
11.62 x 1.08 = 12.55
```

Esto ayuda a entender tolerancias de HMI.

## 6. Pantalla Dieffenbacher PROGUIDE - Cadena de formacion

Foto: `/Users/manue/Downloads/IMG_1872.JPG`

### Que aprender

- Que es una vista general completa.
- Como leer una cadena continua de formacion.
- Como se muestran estaciones y modulos.
- Como se diferencia setpoint vs real.
- Como se ve la barra amarilla de posicion/recorrido.
- Como se presentan alarmas con codigo, hora y tag.

### Modulos a estudiar

- UH2600, UH4300, UH1800, UH1300.
- CBV.
- HS.
- Precompresor.
- Unidad de aspersion de agua.
- Altura de manta.
- Estacion de formacion.

### Valores para practicar

- Velocidad: 377.67 / 378.0 mm/s.
- Ancho: 2700.0 mm set, 2548.76 mm visible.
- CBV posicion/fuerza: 60 mm / 60%.
- Precompresor posicion real: 55.84 mm.
- Aspersion: 16 g/m2 superior, 14 g/m2 inferior.
- Altura manta antes/despues CBV: 42.7 / 35.3 mm.
- Peso manta ajustado/real: 9.5 / 9.5 kg/m2.
- Humedad SL/CL: 14.0 / 4.3%.
- Densidad SL/CL: 195 / 145 kg/m3.

### Ejercicio

Convertir 378 mm/s a m/min y comparar con la otra linea:

```text
378 x 60 / 1000 = 22.68 m/min
```

Luego preguntarse:

- Por que esta linea corre mas rapido?
- Es otro producto, espesor, receta o momento de operacion?

## 7. Pantalla Dieffenbacher PROGUIDE - Prensa

Foto: `/Users/manue/Downloads/IMG_1873.JPG`

### Que aprender

- Que significa CPS.
- Que significa EVOsteam.
- Que significa CBV.
- Que es factor de prensado.
- Que es IWC.
- Que son tensiones de banda.
- Que es produccion en m3/h.
- Como se relaciona prensa con linea de formacion.

### Valores para practicar

- Tension banda superior/inferior: 138.70 / 140.55 bar.
- Alineacion: -4.34 mm.
- Factor de prensado: 3.55 s/mm.
- IWC: 36.30 mm.
- Circ. calefaccion 1: 264.60 C.
- Lubricacion: 15.51 l/d.
- Produccion: 50.57 m3/h.
- Distancia nariz - punto estrella: 381.9 mm.
- CBV fuerza entrada/salida: 63.71 / 61.32%.

### Ejercicio

Buscar en las notas que significa "la prensa es el master". Luego marcar en esta pantalla que valores parecen mandar la linea:

- Velocidad.
- Factor de prensado.
- Tension de banda.
- Produccion.

## 8. Pantalla SUNDS FIBERTECH - Prensa

Foto: `/Users/manue/Downloads/IMG_1876.JPG`

### Que aprender

- Leer una prensa por marcos.
- Leer perfil de presion.
- Leer areas de calentamiento.
- Diferenciar aceite hidraulico, aceite termico, temperatura de banda/material.
- Entender por que la presion es mayor al inicio y baja al final.

### Valores para practicar

- Velocidad: 17.0 m/min.
- Ancho producto: 2545 mm.
- Peso: 11.60 kg/m2.
- Humedad CE: 18.5% Hy.
- Calentamiento areas:
  - Area 1: 235 C.
  - Area 2: 235 C.
  - Area 3: 222 C.
  - Area 4: 205 C.
- Presion visible: 105 / 103 bar.
- Factor prensa: 3.26.
- 19 marcos visibles.

### Ejercicio

Dibujar el perfil de presion:

```text
marcos 1-5: presion alta
marcos 6-10: presion baja progresiva
marcos 11-19: estabilizacion / menor presion
```

Luego conectar esto con el audio:

- Entrada: compactacion fuerte.
- Medio: curado y control.
- Salida: estabilizacion.

## 9. PID, lazos y control

### Temas minimos

- SP: setpoint.
- PV: process value.
- LMN: salida del controlador.
- Error = SP - PV.
- Control automatico vs manual.
- Saturacion al 100%.
- Sobreoscilacion.
- Retardo de medicion.
- Anti-windup, como concepto.

### Aplicaciones en planta

- Bombas de resina.
- Bombas de parafina.
- Sprays.
- Peso del material.
- Velocidad de bandas.
- Tension de bandas.

### Ejercicio

Tomar un lazo cualquiera y escribir:

```text
Que pide?
Que mide?
Que actuador mueve?
Que pasa si se satura?
Que alarma apareceria?
```

## 10. Sensores e instrumentacion

### Sensores a estudiar

- Ultrasonicos.
- Paletas de nivel.
- Inductivos.
- Encoders.
- Celdas de carga.
- Flujometros electromagneticos.
- Coriolis.
- Sensores de presion con membrana.
- Actuadores neumaticos.
- Electrovalvulas.
- Sensores opticos.
- Perfilometro / rayos X.
- Ultrasonido para reventados.

### Preguntas por sensor

Para cada sensor aprender:

- Que mide?
- Es continuo o ON/OFF?
- Donde esta?
- Que unidad entrega?
- Que falla comun tiene?
- Que pasa si miente?

## 11. Basculas, tau y calibracion

### Temas clave

- Celda de carga.
- mV/V y linealizacion.
- Peso muerto.
- Tara estatica.
- Tara dinamica.
- Pesos patron.
- Banda en movimiento.
- Arrastre/roce.
- Tau/TAM.
- Prueba de papel.

### Preguntas que debo poder responder

- Por que una bascula puede estar bien en parado y mal en produccion?
- Que compara tau?
- Por que tau deberia estar cerca de cero?
- Por que 30% externo puede salir 33% real?
- Que informacion se debe mandar al fabricante?

## 12. Prensa continua

### Temas a aprender

- Prensa continua vs prensa de ciclos.
- Factor de prensado s/mm.
- Presion por zonas/marcos.
- Temperatura por areas.
- Aceite termico.
- Aceite hidraulico.
- Tension de banda.
- Alineacion de banda.
- IWC.
- MTS.
- CBV.
- CPS.
- EVOsteam / Dynasteam.

### Preguntas

- Cual es la marca mecanica real de cada prensa?
- Dieffenbacher y SUNDS son lineas distintas o sistemas distintos de una misma linea?
- Metso corresponde a que parte?
- EVOsteam y Dynasteam son lo mismo o tecnologias distintas?

## 13. Alarmas y diagnostico

### Leer una alarma

Siempre anotar:

- Hora.
- Texto exacto.
- Codigo/tag.
- Pantalla donde aparecio.
- Estado de linea.
- Primer evento antes del reset.

### Alarmas vistas en fotos

- Spray nivel bajo tanque dosificador.
- Warning/alarm spray system.
- Salida de paquetes casi lleno.
- Auto bloqueado activo, reinicio necesario.
- Manta hidratacion general, nivel tanque <= min.
- Punto de ajuste placa de calefaccion no se puede alcanzar.

### Ejercicio

Para cada alarma escribir:

```text
Que equipo afecta?
Que variable mide?
Puede parar linea?
Puede causar defecto de tablero?
Es causa raiz o consecuencia?
```

## 14. Trazabilidad de cambios

### Concepto

Un cambio de receta/dosificacion no aparece al instante en el tablero final. Viaja por la linea.

Se debe saber:

- Donde nacio el cambio.
- Hora exacta.
- Velocidad de linea.
- Distancia entre equipos.
- Estacion actual.
- Tiempo hasta prensa.
- Tiempo hasta sensores de calidad.

### Formulas

```text
distancia_avanzada = pulsos_detectados x distancia_por_pulso
tiempo_estimado = distancia_restante / velocidad_actual
posicion_cambio = origen_del_cambio + distancia_avanzada
```

### Cosas que necesito medir en planta

- Distancias.
- Velocidades por tramo.
- Pulsos por vuelta.
- Diametros de rodillo.
- Tags de velocidad.
- Tags de cambio.
- Reloj entre PLCs.

### Ejercicio

Elegir una pantalla y marcar:

- Punto donde naceria un cambio.
- Primera estacion que lo recibe.
- Donde se ve en calidad.
- Que variable deberia cambiar.

## 15. Como preparar la siguiente visita

### Fotos que faltan

- Silos.
- Llenado Do_Bin.
- Data motors.
- Tanques resina.
- Flake Density.
- Evojet.
- Consumption.
- Espesor.
- Cadenas.
- Hidraulica.
- Calentamiento.
- Grupos.
- Sensores de reventados.
- Perfilometro.
- Enfriadoras/estacado.

### Preguntas concretas

- Que linea es cada HMI: Metso, Dieffenbacher, SUNDS?
- Que significa CE/CI/SL/CL/CC en planta?
- Que significa CBV?
- Que significa IWC?
- Que significa MTS?
- Que es EVOsteam?
- Que es Dynasteam?
- Que es Evojet?
- Que mide Flake Density?
- Que hace Consumption?
- Que significan UH2600/UH4300/UH1800/UH1300?
- Como se exportan alarmas y trends?
- Donde se ve tau/TAM en HMI?
- Donde se ve perfilometro?
- Donde se ve detector de reventados?

## 16. Metodo de estudio recomendado

### Paso 1

Tomar una imagen por dia y transcribir todos los numeros visibles.

### Paso 2

Clasificar cada numero:

```text
setpoint
actual
tolerancia
alarma
estado
unidad
tag
```

### Paso 3

Convertir unidades:

- mm/s a m/min.
- bar a MPa si hace falta.
- kg/m2 a densidad aproximada si tienes espesor.

### Paso 4

Escribir una frase causal:

```text
Si este valor sube, entonces...
Si este valor baja, entonces...
Si esta alarma aparece, debo revisar...
```

### Paso 5

Volver a los audios y conectar:

- Donde hablaban de esa pantalla?
- Que problema explicaban?
- Que variable se ve ahora en la foto?

## 17. Meta personal

La meta no es memorizar todos los botones. La meta es poder mirar una pantalla y responder:

1. Que parte del proceso estoy viendo?
2. Que material entra y sale?
3. Que valores son objetivo?
4. Que valores son reales?
5. Que alarmas hay?
6. Que variable manda la linea?
7. Que deberia revisar si algo sale mal?
8. Como conecto esta pantalla con la pantalla anterior y la siguiente?

