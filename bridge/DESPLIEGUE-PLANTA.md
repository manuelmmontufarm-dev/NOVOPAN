# Despliegue en planta — cómo está armado hoy

Registro de la topología real en Itulcachi, para no tener que redescubrirla
cada vez. Última confirmación: 2026-09-10 (Anderson conectó el Puente).

## Dos computadoras, dos roles distintos

```
┌─────────────────────────────┐        ┌─────────────────────────────┐
│  COMPU CON WIFI (derecha)    │        │  COMPU SIN WIFI               │
│  ve el CSV del HMI           │        │  (donde se quiere ver la línea│
│                               │        │   sin depender de internet)   │
│  corre: bridge/ (el Puente)  │        │  corre: el simulador LOCAL    │
│  → sube el CSV a Vercel Blob │        │    (NOVOPAN-Simulador-planta  │
│    cada 2 s                  │        │     o NOVOPAN-Hub-completo)   │
│                               │        │  → lee el MISMO csv           │
│  ZIP: novopan-puente-        │        │    directo del disco, sin     │
│  19bced8502cded87.zip        │        │    pasar por la nube          │
│  (Blob, link fijo en la      │        │                               │
│   página /descargar)         │        │  se conecta con el botón      │
│                               │        │  "Conectar CSV" del           │
│  YA CONECTADO (2026-09-10)   │        │  simulador (File System       │
└──────────────┬────────────────┘        │  Access API)                   │
               │                          └─────────────────────────────┘
               │ sube cada 2s
               ▼
   Vercel Blob (linea1-seccion2/hmi.csv)
               │
               │ lee cada 2s (fetch, cache:no-store)
               ▼
   novopan.vercel.app/simulador-final
   (cualquiera con internet, casa/celular)
```

**Por qué dos caminos al mismo CSV:** el Puente sube a la nube para verlo
desde fuera de planta. La compu sin wifi no puede alcanzar la nube, así que
el simulador ahí lee el archivo LOCAL directamente — mismo dato, sin
internet de por medio. Ver `CLOUD_CSV_URL` en
`parte-2-aglomerados/deck/simulador-final/js/hmi-csv.js` para la ruta de
nube; el modo archivo local es el mismo simulador, otro botón.

## El Puente (compu con wifi)

- **Fuente en este repo:** carpeta `bridge/` (este directorio).
- **Lo que corre en planta NO sale de un `git clone`.** Es un ZIP
  pre-configurado con el token ya adentro, subido aparte a Vercel Blob y
  linkeado desde `vercel/descargar/index.html` (sección "🌉 Puente a la
  nube"). Ese ZIP **no está versionado** — si se pierde, hay que rehacerlo
  a mano desde `bridge/` + un token nuevo del Blob store.
- **Nombres reales dentro de ese ZIP** (no coinciden 1:1 con los del repo,
  ver tabla abajo):

  | Dentro del ZIP en planta | Qué hace | Fuente equivalente en `bridge/` |
  |---|---|---|
  | `INICIAR.bat` | arranca el Puente, lo registra para que inicie solo al prender la compu | `INSTALAR.bat` (el repo usa otro nombre) |
  | `correr.bat` | loop interno que reinicia `node bridge.mjs` si se cae — **no tocar directo** | `correr.bat` (igual) |
  | `VER SALUD.bat` | ventana 🟢/🔴 que confirma si está subiendo | no existe como archivo en `bridge/`, es parte del ZIP pre-armado |
  | `ELEGIR CSV.bat` | cambia la ruta del CSV con explorador de archivos | ídem, solo vive en el ZIP pre-armado |

  Confusión ya ocurrida una vez: se le dijo "doble clic en `INSTALAR.bat`"
  (nombre del repo) cuando el archivo real en su compu se llama
  `INICIAR.bat`. **El nombre correcto en planta es `INICIAR.bat`.**

- **Requisito:** esa compu necesita Node.js y salida a internet (HTTPS a
  Vercel). Sin internet ahí, el Puente no puede subir nada — no hay forma
  de resolverlo por USB, porque lo que falta es la conexión, no el software.

## El simulador local (compu sin wifi)

- Dos paquetes posibles, ambos generados por
  `scripts/build-vercel-public.sh` y descargables desde `/descargar`:
  - `NOVOPAN-Simulador-planta.zip` — liviano, solo el simulador + motor.
  - `NOVOPAN-Hub-completo.zip` — todo el sitio.
- Se lleva por **USB** desde una compu con internet (esa compu no tiene
  wifi, no puede bajarlo sola).
- Adentro: `ABRIR SIMULADOR (Windows).bat` levanta un mini-servidor
  (`servidor.ps1`) en `localhost:8080` y abre el navegador ahí. **Debe
  ejecutarse desde la carpeta ya EXTRAÍDA del ZIP**, nunca desde dentro del
  ZIP/WinRAR (si no, tira "falta descomprimir").
- Una vez abierto, botón **"Conectar CSV"** dentro del simulador → se elige
  el `.csv` del HMI directo en esa compu (File System Access API, Chrome
  moderno). Sin nube, sin Puente, sin internet.
- Esa ventana/servidor **no arranca solo**: si se cierra o se apaga la
  compu, hay que volver a abrir el `.bat` a mano. (El Puente sí arranca
  solo, vía Programador de tareas — ver `bridge/INSTALAR.bat`. Si se quiere
  el mismo comportamiento acá, se puede armar igual con `schtasks`,
  pendiente si lo piden.)
- El permiso del archivo elegido puede pedir reconfirmación tras un
  refresh/reinicio del navegador (normal, un clic en "Reconectar CSV" y
  sigue — no hay que volver a elegir el archivo).

## Fixes ya aplicados (ver commits en `main`)

- `b496eb5` — el simulador moría con `ERR_FAILED` cuando faltaba la red,
  por un redirect de Vercel (`cleanUrls`+`trailingSlash:false`) que
  rompía el service worker. Corregido: el shell offline ya no depende de
  ese redirect y el worker controla la página de verdad.
- `c412491` — cartel rojo grande cuando el CSV lleva más de 10 min sin
  actualizarse (o nunca llegó), con instrucciones de qué hacer. Antes solo
  había un pill chico en la cabecera que nadie notaba a tiempo.

## Pendiente / no confirmado

- No hay forma de que el simulador local en la compu sin wifi arranque
  solo al prender la máquina (a diferencia del Puente). Si lo piden, se
  arma con el Programador de tareas de Windows igual que el Puente.
- Los archivos del ZIP pre-armado del Puente (`INICIAR.bat`, `VER
  SALUD.bat`, `ELEGIR CSV.bat`, `salud.html`) no están versionados en este
  repo — solo existen dentro del ZIP subido al Blob. Si hace falta
  editarlos, hay que reconstruirlos o pedir ese ZIP para extraerlo y
  versionarlo.
