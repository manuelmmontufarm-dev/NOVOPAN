# Como abrir los HTML finales

## Recomendado para entregar

Abrir:

`NOVOPAN_Guia_Recepcion_Madera_FINAL_ESTATICO.html`

Este archivo ya esta renderizado como HTML estatico: no depende de React, Babel ni scripts. Puede abrirse directamente en Chrome o subirse a GitHub como entregable final junto con la carpeta `NOVOPNHTML1_files/` para que carguen estilos e imagenes.

## Version app / no estatica

Archivos:

`NOVOPNHTML1.html`

`NOVOPAN_Guia_Recepcion_Madera_FINAL.html`

Estos archivos usan React/Babel y cargan archivos `.jsx` desde `NOVOPNHTML1_files/`. No conviene abrirlos como `file:///...` ni moverlos solos a Descargas, porque el navegador puede bloquear la carga y quedar en blanco.

Para abrirlos correctamente:

```bash
cd /Users/manue/Documents/NOVOPAN/docs-finales
python3 -m http.server 8767 --bind 127.0.0.1
```

Luego abrir:

`http://127.0.0.1:8767/NOVOPNHTML1.html`

o:

`http://127.0.0.1:8767/NOVOPAN_Guia_Recepcion_Madera_FINAL.html`

## Regla practica

Para revisar/entregar: use el HTML estatico.

Para editar o probar la app interactiva: use el servidor local.
