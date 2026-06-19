/**
 * ADENDA 2026-06-19 — Fragmentos JSX para integrar en Screens.jsx / rebuild ESTATICO.html
 *
 * Ubicación sugerida en HumedadMuestras (después de Card 4.11 Etiqueta y registro):
 *   - AdendaSection4101
 *   - AdendaSection4121
 *
 * Ubicación sugerida en CierreExcepciones (dentro de Card 4.14 Asignación de patio, al final):
 *   - AdendaSection4141
 *
 * Fuente canónica: html-app/NOVOPNHTML1_files/Screens.jsx (líneas ~631-698)
 * NO modificar docs-finales/*.html hasta rebuild completo — ver notes/REBUILD_PENDING.md
 */

// eslint-disable-next-line no-unused-vars
function AdendaSection4101() {
  return (
    <Card title="4.10.1 Humedad: último filtro antes del cierre" icon="warning_amber" tone="red">
      <p style={{ marginTop: 0 }}>
        El % de humedad es el <strong>último dato que se digita en ANI antes del cierre del ingreso</strong>.
        Una vez registrado, corregir el valor puede exigir <strong>anular el ingreso y reingresarlo</strong>, lo cual tiene impacto contable.
      </p>
      <List items={[
        'Confirme el valor del equipo ANTES de digitarlo en ANI (lectura directa de la pantalla de la balanza analítica, sin estimaciones).',
        'Si el QR del proveedor o la cuenta-contrato registrada son erróneos, NO digite la humedad encima — primero anule el ingreso y reingreselo con los datos correctos.',
        'El punto exacto en ANI donde la humedad bloquea la edición del registro: [POR VALIDAR con Daniel Sotalin / supervisor ANI].',
        'Procedimiento detallado de anulación por humedad incorrecta o QR/cuenta-contrato erróneos: [POR VALIDAR — escalar a supervisor].',
      ]} />
    </Card>
  );
}

// eslint-disable-next-line no-unused-vars
function AdendaSection4121() {
  return (
    <Callout variant="nota" title="4.12.1 Verificación de humedad en salida — Balanza 1 (PS1)">
      Antes de cerrar la salida del camión en Balanza 1, el operador debe verificar que el % de humedad esté digitado en ANI.
      Si quedó en blanco (caso del 4.12), búsquelo por número de ingreso o placa, ingrese el valor manualmente, y solo entonces libere el cierre de salida.
      Para <strong>patios externos</strong>, la humedad en salida es <strong>obligatoria</strong>: no se puede cerrar la salida con humedad en blanco.
      Si el resultado no está, avise al supervisor y registre el valor antes de liberar el cierre.
    </Callout>
  );
}

// eslint-disable-next-line no-unused-vars
function AdendaSection4141() {
  return (
    <Callout variant="advertencia" title="4.14.1 Orden de descarga: FIFO con excepción justificada" style={{ marginTop: 14 }}>
      Como regla general la descarga sigue <strong>FIFO</strong> (primero en entrar, primero en descargar).
      En la práctica, se puede descargar por <strong>especie</strong> o por <strong>patio</strong> cuando lo justifica el esquema del día (RJP-03) o instrucción del Jefe de Patios.
      Toda excepción al FIFO debe estar <strong>justificada</strong>, <strong>comunicada al supervisor</strong> antes de ejecutarse, y <strong>registrada</strong> (WhatsApp del grupo de patios o nota en hoja de turno).
    </Callout>
  );
}
