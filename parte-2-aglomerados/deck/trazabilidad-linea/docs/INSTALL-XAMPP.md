# Instalación en un servidor local con XAMPP — Simulador de trazabilidad (Línea 1)

**Para:** equipo de IT / automatización de NOVOPAN
**Qué es esto:** el simulador es un **sitio web estático** (solo archivos HTML/CSS/JS).
No tiene backend, base de datos ni PHP propios. Solo necesita un servidor web que
entregue esos archivos por HTTP. XAMPP aporta ese servidor web (**Apache**).

> Dificultad: **baja** (~10–15 min). Lo único con trabajo real es el paso 6
> (que el HMI/SQL refresque `datos/hmi.csv`), y eso es del lado de IT, no del sitio.

---

## Diagrama de las piezas

```
Apache (de XAMPP)  ──sirve──►  archivos del sitio (index.html, js/, datos/hmi.csv)  ──►  navegador en la red de planta
        ▲
        └── datos/hmi.csv lo reescribe cada ~2 s un job de SQL Server / WinCC
```

Dos tareas: **(A)** poner los archivos detrás de Apache — trivial; **(B)** mantener
`datos/hmi.csv` actualizado desde el HMI — la única integración real (ver §6).

---

## Requisitos

- Un servidor Windows en la red de planta (idealmente el mismo donde está SQL Server / WinCC).
- Permisos de administrador para instalar XAMPP.
- La carpeta `public/` de este proyecto (la salida ya construida del sitio).

---

## Pasos

### 1. Instalar XAMPP
Descargar el instalador de Windows desde <https://www.apachefriends.org> e instalar.
En los componentes basta con dejar marcado **Apache**. MySQL, PHP, Mercury, etc. **no
se usan** y se pueden desmarcar.

### 2. Copiar el sitio al servidor web
Copiar **todo el contenido** de la carpeta `public/` dentro de la raíz web de XAMPP:

```
C:\xampp\htdocs\
```

Al terminar debe existir:

```
C:\xampp\htdocs\trazabilidad-linea\index.html
C:\xampp\htdocs\trazabilidad-linea\js\...
C:\xampp\htdocs\trazabilidad-linea\datos\hmi.csv
```

> ⚠️ **Conservar el nombre de carpeta `trazabilidad-linea`.** La página tiene
> `<base href="/trazabilidad-linea/">` incrustado, así que debe abrirse en
> `http://SERVIDOR/trazabilidad-linea/`, no en la raíz. Copiar todo `public/`
> preserva esto automáticamente.

### 3. Arrancar Apache
Abrir el **XAMPP Control Panel** y pulsar **Start** en la fila de Apache
(se pone en verde). Por defecto sirve en el puerto **80**.

> Si el puerto 80 está ocupado (p. ej. por IIS), cambiar el puerto de Apache en
> `Config → httpd.conf` (`Listen 80` → `Listen 8080`) y usar `:8080` en la URL.

### 4. Abrir el simulador
- En el propio servidor: <http://localhost/trazabilidad-linea/>
- Desde otro PC de la red: `http://<IP-del-servidor>/trazabilidad-linea/`

### 5. Verificar que carga
El sitio ya trae un `datos/hmi.csv` de demostración, así que debería mostrar de
inmediato los ~15 tags de ejemplo y el estado `● HMI CSV · … · N tags`. Eso
confirma que la instalación quedó bien **antes** de conectar los datos reales.

### 6. Conectar los datos reales (lado IT)
Que el simulador muestre datos **en vivo** = que algo sobrescriba
`C:\xampp\htdocs\trazabilidad-linea\datos\hmi.csv` cada ~2 s con el formato
`VARIABLE:VALOR;`. Ver [`ESPECIFICACION-HMI-CSV.md`](ESPECIFICACION-HMI-CSV.md)
para el formato completo, la lista de tags y el `SELECT` de SQL Server que genera
el archivo. Como el sitio y SQL Server pueden estar en el mismo servidor, el job
solo escribe un archivo local — sin red, sin API. **El simulador no cambia; solo
lee el archivo.**

---

## Formato del archivo `datos/hmi.csv` (resumen)

```
V_PRENSA_M_MIN:14.5;
PESO_MANTA_KGM2:11.5;
PCT_SL1:47.1;
SILO6_LEVEL_PCT:;        # valor vacío = pendiente / TBD (no lo toca)
```

`:` separa variable y valor · `;` termina cada registro · decimal `.` o `,` ·
una variable por línea o varias en la misma. Detalle completo en
[`ESPECIFICACION-HMI-CSV.md`](ESPECIFICACION-HMI-CSV.md).

---

## Notas y advertencias

- **No funciona con `file://`.** El sitio usa módulos de JavaScript, así que abrir
  `index.html` con doble clic falla. **Debe** servirse por HTTP — que es justo lo
  que da Apache. Es el error más común.
- **XAMPP no es la única opción.** Al ser archivos estáticos, el mismo servidor
  puede servirlos con **IIS** (probablemente ya instalado en el equipo WinCC) o
  incluso con `python -m http.server`. Si el servidor tiene internet, mantenerlo
  en Vercel (donde ya está) también es válido y sin mantenimiento. Usar XAMPP si
  no hay ya un servidor web corriendo.
- **MIME types:** Apache moderno sirve `.js` y `.csv` con el tipo correcto sin
  configuración extra.
- **Arranque automático:** para que Apache arranque solo al reiniciar el servidor,
  instalarlo como servicio de Windows desde el XAMPP Control Panel (botón junto a
  Apache) o marcar "Install as service".
