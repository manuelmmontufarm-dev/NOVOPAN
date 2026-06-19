# Sistemas IT y Aplicaciones Operativas — NOVOPAN

**Actualizado:** 17 de junio de 2026  
**Fuente:** Audios del 15 y 17 de junio de 2026  
**Confianza:** Media. Los nombres internos y codigos deben confirmarse con capturas de pantalla.

---

## ANI

**Uso principal:** Recepcion e ingreso de madera en balanza.

**Datos/acciones mencionadas:**
- Captura peso de entrada con `F4`.
- Guarda ingreso con `F5`.
- Recibe datos por QR forestal o por llenado manual.
- Puede validar si una guia ya esta duplicada.
- Integra informacion con inventario/INFOR despues de completar datos criticos como humedad.

**Riesgos detectados:**
- QR vinculado a cuenta contrato incorrecta puede bloquear campos y obligar a anular/reingresar manualmente.
- Si se digita humedad incorrecta y el ingreso se integra, corregir puede requerir anulacion y reproceso.
- Pantalla/flujo no parece amigable para operadores nuevos.

**Pendiente:** Confirmar si ANI tiene API o mecanismos de integracion para construir una pantalla frontal mas simple.

---

## INFOR

**Uso principal:** Inventario integrado.

**Datos/acciones mencionadas:**
- Stock digital por ubicacion/ruma.
- Relacion con movimientos desde ANI y posiblemente Factory Track.
- Necesita conciliacion contra inventario fisico de patios.

**Riesgos detectados:**
- Diferencias fisico-digitales cuando la ruma fisica tiene madera pero el stock digital se agota.
- Operadores pueden usar stock digital de otra ruma para reportar consumo, distorsionando trazabilidad.

---

## Factory Track

**Uso principal:** Reporteria movil de descarga y consumo.

**Dispositivo:** Celular industrial o equipo movil con lector/escanner de codigo de barras.

**Flujos mencionados:**
- **Descarga:** reportar `0.001` para generar senal de descarga sin mover stock significativo.
- **Consumo:** transferir toneladas secas desde ruma/patio hacia consumo. Viaje tipico mencionado: 11 o 12 toneladas secas.
- Selecciona almacen de origen, articulo/especie, ubicacion origen, cantidad y almacen destino.

**Campos/codigos por confirmar:**
- `IDMADE` / `ITMADE`: almacen de origen o inventario de madera.
- `PREMADE` / `PERMADE` / `PRIMADE`: almacen destino o consumo de madera.
- `M-MAT-003`, `M-MAT-005`: codigos de especie/material.
- `P08 Ruma 5`, `P11001`: ubicaciones de patio/ruma.

**Riesgos detectados:**
- Si una ruma queda con stock cero, desaparece/no se puede reportar sobre ella.
- Para habilitar una ruma nueva puede requerirse transferir una cantidad minima.
- Falta de bateria/cargadores impide reportería.
- Reporte puede hacerse antes o despues de descarga si no hay regla clara.

---

## Click / CLiK

**Uso principal:** Reportes o consulta de movimientos de Factory Track.

**Pendiente:** Confirmar nombre exacto, acceso, campos visibles y capturas.

---

## WhatsApp

**Uso operativo actual:** Evidencia de descarga mediante foto al grupo.

**Fortaleza:**
- Permite confirmar visualmente que el camion fue descargado.

**Debilidad:**
- No escala bien para estadistica diaria con muchos camiones.
- Requiere revision manual caso por caso.
- No reemplaza un timestamp estructurado si se quieren medir tiempos.

---

## Recomendaciones IT derivadas de los audios

- Definir timestamp oficial de descarga: idealmente cuando el camion termina de descargar.
- Definir timestamp oficial de consumo: pendiente decidir si es al cargar en patio o al descargar en planta.
- Exigir carga/bateria de dispositivos Factory Track por turno.
- Crear hoja visible de codigos de especie/material y ubicaciones para operadores.
- Evitar movimientos digitales desde rumas distintas a la fisica salvo autorizacion.
- Evaluar una pantalla frontal simplificada sobre ANI solo si existe integracion/API estable.
