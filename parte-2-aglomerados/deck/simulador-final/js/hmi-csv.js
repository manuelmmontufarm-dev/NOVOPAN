/* ============================================================
   NOVOPAN · Trazabilidad total · documento CSV del modelo
   ------------------------------------------------------------
   El CSV es la única autoridad editable de parámetros. La UI nunca
   modifica el modelo directamente: edita una fila del CSV, vuelve a
   parsear el documento completo y recién entonces actualiza el motor.

   En producción, WinCC/SQL sigue siendo dueño de datos/hmi.csv. Un
   navegador estático no puede sobrescribir ese archivo del servidor;
   por eso las ediciones se mantienen en el documento CSV activo, se
   pueden descargar y, si el usuario conectó un archivo local mediante
   File System Access, se escriben de forma debounced a ese archivo.
   ============================================================ */

/* Intervalo de relectura del CSV. Default 2000 ms (el HMI de planta escribe
   cada ~2 s); se puede ajustar sin tocar código con ?poll=1000 en la URL
   (mínimo 250 ms para no saturar el servidor). */
const POLL_MS = (() => {
  try {
    const p = Number(new URLSearchParams(window.location.search).get('poll'));
    if (Number.isFinite(p) && p >= 250) return p;
  } catch { /* sin window.location (entorno de pruebas) */ }
  return 2000;
})();
const WRITE_DEBOUNCE_MS = 420;

/* Un archivo por servidor WinCC. Se leen todos y se combinan.
   ------------------------------------------------------------
   `hmi.csv` es la BASE: trae los 104 parámetros con sus valores por defecto o
   estimados, con los nombres canónicos del simulador. Los tres archivos por
   servidor lo pisan con dato vivo usando los nombres reales de WinCC.

   EL ORDEN ES LA PRECEDENCIA — el último gana. Formación va al final a
   propósito: es el dueño de la prensa, y `H_PressSpeed_PV` también existe en
   el servidor de Encolado con otro significado ("Press Conveyor Speed").
   Toda colisión queda avisada en el pill de estado, ya no es silenciosa.

   Un archivo ausente NO es un error: el simulador funciona con los que haya. */
/* Etiqueta reservada del archivo de defaults: sus valores existen para ser
   pisados por los servidores en vivo, así que pisarlos NO es un conflicto. */
export const DEFAULTS_LABEL = 'base';

export const CSV_SOURCES = [
  { file: 'datos/hmi.csv',             label: DEFAULTS_LABEL },
  { file: 'datos/hmi-preparacion.csv', label: 'Preparación' }, // servidor C — WETS/WETB/DRYR/BRNR/SCRN
  { file: 'datos/hmi-encolado.csv',    label: 'Encolado' },    // servidor B — Gluing/PLC_GE
  { file: 'datos/hmi-formacion.csv',   label: 'Formación' },   // servidor A — Forming/PLC_L/Press/POF
  /* El archivo REAL de Sistemas (22-jul-2026): su consulta al Historian junta
     los tres servidores en UN solo CSV `Datetime,Tagname,Value` (origen
     D:\CSV-simulador_cambios_PB1\DatosCSV). Va al final a propósito: es dato
     vivo consolidado y le gana a los archivos por servidor si conviven.
     Contrato congelado en datos/fixtures/sistemas-historian.csv. */
  { file: 'datos/hmi-sistemas.csv',    label: 'Sistemas' },
];

const entry = (keys, kind, unit) => ({ keys: Array.isArray(keys) ? keys : [keys], kind, unit });

/* Tag CSV → claves del modelo. Algunos tags alimentan tanto el modelo
   combinado P1 como el motor detallado de Sección 2; una sola edición
   del CSV mantiene ambos alias sincronizados. */
export const TAG_MAP = {
  V_PRENSA_M_MIN:      entry('v_prensa', 'hmi', 'm/min'),
  PESO_MANTA_KGM2:     entry('_global:peso_manta', 'hmi', 'kg/m²'),
  F_SL_KGMIN:          entry('_global:F_SL', 'hmi', 'kg/min'),
  F_CL_KGMIN:          entry('_global:F_CL', 'hmi', 'kg/min'),
  PCT_SL1:             entry('_global:pctSL1', 'hmi', '%'),
  PCT_SL2:             entry('_global:pctSL2', 'hmi', '%'),

  PILA1_ASERRIN_M_KG:  entry('p1:pila1_M', 'hmi', 'kg'),
  PILA1_ASERRIN_F_KGH: entry('p1:pila1_F', 'hmi', 'kg/h'),
  T_DYNESCREEN_S:      entry('p1:tDS', 'est', 's'),
  T_TRANSP_ASERRIN_S:  entry('p1:tr1', 'est', 's'),
  PILA2_CHIP_M_KG:     entry('p1:pila2_M', 'hmi', 'kg'),
  PILA2_CHIP_F_KGH:    entry('p1:pila2_F', 'hmi', 'kg/h'),
  T_ESPERA_DESVIADOR_S: entry('p1:esperaDesv', 'est', 's'),
  T_TRANSP_FLAKES_S:   entry('p1:tr2', 'est', 's'),
  T_HOMBAK_S3_S:       entry('p1:tr3', 'est', 's'),

  SILO1_RHO_KGM3:      entry('p1:s1_rho', 'hmi', 'kg/m³'),
  SILO1_V_M3:          entry('p1:s1_V', 'est', 'm³'),
  SILO1_L_PCT:         entry('p1:s1_L', 'hmi', '%'),
  SILO1_FOUT_KGH:      entry('p1:s1_F', 'hmi', 'kg/h'),
  SILO2A_RHO_KGM3:     entry('p1:s2_rho', 'hmi', 'kg/m³'),
  SILO2A_V_M3:         entry('p1:s2_V', 'est', 'm³'),
  SILO2A_L_PCT:        entry('p1:s2_L', 'hmi', '%'),
  SILO2A_FOUT_KGH:     entry('p1:s2_F', 'hmi', 'kg/h'),
  SILO2B_RHO_KGM3:     entry('p1:s2b_rho', 'hmi', 'kg/m³'),
  SILO2B_V_M3:         entry('p1:s2b_V', 'est', 'm³'),
  SILO2B_L_PCT:        entry('p1:s2b_L', 'hmi', '%'),
  SILO2B_FOUT_KGH:     entry('p1:s2b_F', 'hmi', 'kg/h'),
  SILO3_RHO_KGM3:      entry('p1:s3_rho', 'hmi', 'kg/m³'),
  SILO3_V_M3:          entry('p1:s3_V', 'est', 'm³'),
  SILO3_L_PCT:         entry('p1:s3_L', 'hmi', '%'),
  SILO3_FOUT_KGH:      entry('p1:s3_F', 'hmi', 'kg/h'),

  BUNKER_RHO_KGM3:     entry('p1:bk_rho', 'hmi', 'kg/m³'),
  BUNKER_V_M3:         entry('p1:bk_V', 'est', 'm³'),
  BUNKER_L_PCT:        entry('p1:bk_L', 'hmi', '%'),
  BUNKER_FHUM_KGH:     entry('p1:bk_F', 'hmi', 'kg/h'),
  T_TRANSP_SECADERO_S: entry('p1:trSec', 'est', 's'),
  TAU_TAMBOR_S:        entry('p1:tauTambor', 'est', 's'),

  T_TAMICES_FG_S:      entry('p1:tCriba', 'est', 's'),
  T_ZARANDAS_S:        entry('p1:tZar', 'est', 's'),
  T_COLECT_CL_S:       entry('p1:tColectCL', 'est', 's'),
  T_COLECT_SL_S:       entry('p1:tColectSL', 'est', 's'),
  T_COLECT_PG_S:       entry('p1:tColectOver', 'est', 's'),
  T_COLECT_POLVO_S:    entry('p1:tPolvo', 'est', 's'),
  T_WS1_S:             entry('p1:tWS1', 'est', 's'),
  T_WS2_S:             entry('p1:tWS2', 'est', 's'),
  T_WS3_S:             entry('p1:tWS3', 'est', 's'),
  T_IMAN_FE_S:         entry('p1:tFe', 'est', 's'),
  T_NEUMATICO_SL_S:    entry('p1:tNeum', 'est', 's'),
  T_REF1_S:            entry('p1:tRef1', 'est', 's'),
  T_REF2_S:            entry('p1:tRef2', 'est', 's'),
  T_CICLON_S:          entry('p1:tCiclon', 'est', 's'),
  T_CLAS_SL_S:         entry('p1:tClasSL', 'est', 's'),
  T_REINGRESO_SL_S:    entry('p1:tReingresoSL', 'est', 's'),

  SILO5_RHO_KGM3:      entry('p1:s5_rho', 'hmi', 'kg/m³'),
  SILO5_V_M3:          entry('p1:s5_V', 'measured', 'm³'),   // 100 m³ confirmado en planta 21-jul-2026
  SILO5_L_PCT:         entry('p1:s5_L', 'hmi', '%'),
  /* La descarga del silo alimenta TAMBIÉN el flujo de la dosificadora: no hay
     tag propio de caudal dosificado (F_*_DosBin_Speed_SP es velocidad de banda,
     no kg/min) y en régimen estable lo que sale del silo ES lo que dosifica el
     bin. Si algún día aparece un tag propio, DOSING_*_F_KGMIN sigue existiendo
     y cualquier discrepancia entre ambos quedará avisada como conflicto. */
  SILO5_FOUT_KGMIN:    entry(['p1:s5_Fmin', 'p1:dosG_F', 'flow:dosing-thick'], 'hmi', 'kg/min'),
  SILO6_RHO_KGM3:      entry('p1:s6_rho', 'hmi', 'kg/m³'),
  SILO6_V_M3:          entry('p1:s6_V', 'measured', 'm³'),   // 100 m³ confirmado en planta 21-jul-2026
  SILO6_L_PCT:         entry('p1:s6_L', 'hmi', '%'),
  SILO6_FOUT_KGMIN:    entry(['p1:s6_Fmin', 'p1:dosF_F', 'flow:dosing-fine'], 'hmi', 'kg/min'),
  SILO4_RHO_KGM3:      entry('p1:s4_rho', 'hmi', 'kg/m³'),
  SILO4_V_M3:          entry('p1:s4_V', 'est', 'm³'),
  SILO4_L_PCT:         entry('p1:s4_L', 'hmi', '%'),
  SILO4_FOUT_KGMIN:    entry('p1:s4_Fmin', 'hmi', 'kg/min'),
  SILO8_RHO_KGM3:      entry('p1:s8_rho', 'hmi', 'kg/m³'),
  SILO8_V_M3:          entry('p1:s8_V', 'est', 'm³'),
  SILO8_L_PCT:         entry('p1:s8_L', 'hmi', '%'),
  SILO8_FOUT_KGMIN:    entry('p1:s8_Fmin', 'hmi', 'kg/min'),

  DOSING_CL_M_KG:      entry(['p1:dosG_M', 'mass:dosing-thick'], 'hmi', 'kg'),
  DOSING_CL_F_KGMIN:   entry(['p1:dosG_F', 'flow:dosing-thick'], 'hmi', 'kg/min'),
  DOSING_SL_M_KG:      entry(['p1:dosF_M', 'mass:dosing-fine'], 'hmi', 'kg'),
  DOSING_SL_F_KGMIN:   entry(['p1:dosF_F', 'flow:dosing-fine'], 'hmi', 'kg/min'),
  T_ENC_CI_S:          entry(['p1:tEncCI', 'ret:enc-thick'], 'est', 's'),
  T_ENC_CE_S:          entry(['p1:tEncCE', 'ret:enc-fine'], 'est', 's'),
  T_SPRAYS_CAIDA_S:    entry('ret:sprays-caida', 'est', 's'),
  INCL_CL_L_M:         entry(['p1:inclG_L', 'len:incl-thick'], 'measured', 'm'),
  /* `measured`, no `hmi`: se barrieron los tres servidores WinCC (1.706 tags,
     21-jul-2026) y NO existe tag de velocidad de banda inclinada. Lo más
     parecido, `H_CC_Speed_SP`, es "CC Metering belt speed" — la dosificadora,
     otra máquina. Marcarlo como HMI haría creer que el número viene de planta. */
  INCL_CL_V_MMIN:      entry(['p1:inclG_v', 'speed:incl-thick'], 'measured', 'm/min'),
  INCL_SL_L_M:         entry(['p1:inclF_L', 'len:incl-fine'], 'measured', 'm'),
  INCL_SL_V_MMIN:      entry(['p1:inclF_v', 'speed:incl-fine'], 'measured', 'm/min'),

  /* Masa retenida en el esparcidor · AHORA SÍ hay tag de planta (23-jul-2026).
     La báscula de cada capa publica su peso en kg/m (H_SL1/CC/SL2_Scale_PV,
     "mat weight scale measured value") medido sobre un ANCHO DE REFERENCIA DE
     1 METRO de banda → el número en kg/m ES los kg sobre ese metro, y entra al
     modelo tal cual (scale 1). τ_esparcidor = báscula / F_capa × 60.
     Antes esto era `falta` (solo existía el % de llenado sin capacidad de
     tolva); con el tag de báscula confirmado en el HMI pasa a `hmi`. Mientras
     IT no lo publique en el CSV, el sello dirá «Supuesto» solo (esSupuesto). */
  M_ESP1_KG:           entry('mass:esp1-zone', 'hmi', 'kg'),
  M_ESP2_KG:           entry('mass:esp2-zone', 'hmi', 'kg'),
  M_ESP3_KG:           entry('mass:esp3-zone', 'hmi', 'kg'),
  L_BANDA_BLANCA_M:    entry('len:white', 'measured', 'm'),
  L_BANDA_ROJA_M:      entry('len:red', 'measured', 'm'),
  L_PRENSA_M:          entry('len:press', 'measured', 'm'),
  L_POSTPRENSA_M:      entry('p1:postPress_L', 'measured', 'm'),
  OFFSET_SENSOR2_M:    entry('geom:sensor2Offset', 'measured', 'm'),
  OFFSET_SENSOR3_M:    entry('geom:sensor3Offset', 'measured', 'm'),
  M_ESP1_CAIDA_M:      entry('geom:esp1', 'measured', 'm'),
  M_ESP2_CAIDA_M:      entry('geom:esp2', 'measured', 'm'),
  M_ESP3_CAIDA_M:      entry('geom:esp3', 'measured', 'm'),
  M_IMAN_M:            entry('geom:magnet', 'measured', 'm'),
  M_SPRAYS2_M:         entry('geom:sprays2', 'measured', 'm'),
  M_DETECTOR_M:        entry('geom:detector', 'measured', 'm'),
  M_CORTADORES_M:      entry('geom:cutters', 'measured', 'm'),
  M_NARIZ_M:           entry('geom:nose', 'measured', 'm'),
  M_VAPOR_M:           entry('geom:vapor', 'measured', 'm'),
  M_PREPRENSA_M:       entry('geom:prepress', 'measured', 'm'),
  M_PREPRENSA_LEN_M:   entry('geom:prepressLen', 'measured', 'm'),
  M_REFILA_INICIO_M:   entry('geom:refilaStart', 'measured', 'm'),
  M_REFILA_FIN_M:      entry('geom:refilaEnd', 'measured', 'm'),
  M_SIERRA_INICIO_M:   entry('geom:sawStart', 'measured', 'm'),
  M_SIERRA_FIN_M:      entry('geom:sawEnd', 'measured', 'm'),
};

/* Tags reales del HMI Metso (pantalla "Select Tag", 700 items, foto 21-jul-2026).
   Alias de SOLO LECTURA: el CSV que escribe IT puede usar el nombre real de
   WinCC y el simulador lo entiende sin que nadie renombre nada. El nombre
   canónico de la izquierda en TAG_MAP se sigue usando para escribir/editar.

   ⚠️ Los nombres de WinCC son sensibles a mayúsculas en pantalla pero el
   simulador los compara sin distinguir mayúsculas — se conservan aquí tal
   como aparecen en el HMI (incluidos sus errores de tipeo de fábrica).

   Cada alias está confirmado por la columna `Comment` del propio HMI (fotos de
   descripciones, 21-jul-2026) — no por parecido de nombre. La unidad citada es
   la que declara ese comentario.

   El valor puede ser un string (el tag canónico) o `{ tag, scale }` cuando el
   HMI entrega otra unidad: el valor del CSV se multiplica por `scale` antes de
   entrar al modelo (p.ej. kg/h → kg/min con scale 1/60). Así IT vuelca el
   número crudo del servidor y la conversión vive en un solo lugar auditable. */
export const WINCC_ALIAS = {
  // "Press speed (m/min)" · Access Name: Forming
  'H_PressSpeed_PV':      'V_PRENSA_M_MIN',
  // "Mat weight after forming (kg/m2)" · OJO: `H_Act_MatWeight_Real` NO sirve
  // aquí — su comentario es "Mat weight from Scale (kg)", son kilos, no kg/m².
  'H_Act_MatWeight_SP':   'PESO_MANTA_KGM2',
  // "CL total flakes kg/min" · Access Name: Forming
  'H_CL_Total_Flakes':    'F_CL_KGMIN',
  // "SL1 % Set value (%)" · Access Name: Forming
  'H_Act_SL1_SP':         'PCT_SL1',

  /* Básculas de capa (kg/m sobre 1 m de referencia = kg) · Access Name:
     Forming · confirmadas por el Comment del HMI "mat weight scale measured
     value" (fotos Select Tag, 23-jul-2026). Alimentan la masa del esparcidor
     para τ = M/F. OJO: el core usa prefijo H_CC_ aquí (báscula/rodillos) pero
     H_CL_ en flujo/arranque — así está en la base de tags real, no es typo. */
  'H_SL1_Scale_PV':       'M_ESP1_KG',
  'H_CC_Scale_PV':        'M_ESP2_KG',
  'H_SL2_Scale_PV':       'M_ESP3_KG',
  // Nombres cortos equivalentes por si el CSV se escribe a mano (kg/m ≡ kg).
  'SL1_KGM':              'M_ESP1_KG',
  'CC_KGM':               'M_ESP2_KG',
  'SL2_KGM':              'M_ESP3_KG',

  /* HMI de encolado / cocina de cola (420 items, servidor `HMI`, 21-jul-2026).
     Es un servidor DISTINTO al de formación: si IT junta ambos en un solo CSV,
     revisar colisiones — `H_PressSpeed_PV` y `H_SL_FlakeDens_SP` existen en los
     dos con Access Name distinto (`Forming` vs `Form`). */
  // "CL dosing bin weight" · Access Name: Gluing · grupo CL_DosBin
  // En la pantalla del HMI el tag aparece SIN `_PV`; el Historian de Sistemas
  // lo entrega CON `_PV` (archivo real, 22-jul-2026). Se aceptan ambos.
  'F_CL_DosBin_Weight':    'DOSING_CL_M_KG',
  'F_CL_DosBin_Weight_PV': 'DOSING_CL_M_KG',
  // "SL dosing bin weight" · Access Name: Gluing · grupo SL_DosBin
  'F_SL_DosBin_Weight':    'DOSING_SL_M_KG',
  'F_SL_DosBin_Weight_PV': 'DOSING_SL_M_KG',
  /* "SL flake flow" · el comentario del HMI no declara unidad. DECISIÓN
     21-jul-2026: se asume kg/min, por simetría con su gemelo de Formación
     `H_CL_Total_Flakes` ("CL total flakes kg/min") y con los tags hermanos del
     mismo grupo SL_DosBin, que sí dicen kg/min (`F_SL_FillingRequest…`).
     Si algún día el valor en vivo sale ~60× fuera de `H_CL_Total_Flakes`,
     la unidad era kg/h: basta agregar `{ tag: 'F_SL_KGMIN', scale: 1 / 60 }`. */
  'F_SL_FlakeFlow_PV':    'F_SL_KGMIN',

  /* Densidad de los silos finales 5 y 6: no la publica ningún tag propio del
     silo — se mide en las DOSING BINS (los `H_*Dens` de Formación son Access
     Name `Gluing`, o sea leídos de encolado; `H_cc_density_fromgluin` lo dice
     en el nombre). El bin se llena directo del silo con el mismo material,
     así que su densidad ES la del silo. Matiz: es material recién caído; la
     columna dentro del silo compacta algo más. Menos error que una constante. */
  // Densidad flakes en dosificadora gruesa · kg/m³ (unidad confirmada por los
  // `_SP` gemelos de Formación: "CL flake density (kg/m3)")
  'F_CL_FlakeDens_PV':    'SILO5_RHO_KGM3',
  // Densidad flakes en dosificadora fina · kg/m³
  'F_SL_FlakeDens_PV':    'SILO6_RHO_KGM3',

  /* Silos finales 5 y 6 · nivel y descarga (servidor C · Access `SCRN` ·
     grupo `Screening`). Nombres completos confirmados en pantalla el
     21-jul-2026.

     El propio nombre del tag resuelve la correspondencia que veníamos
     infiriendo: el HMI llama CL a la "capa interna" y SL a la "capa externa",
     igual que el modelo. CL = core = silo 5 · SL = fina = silo 6.

     La descarga la publica el HMI en kg/h y el modelo la usa en kg/min → el
     `scale` hace la conversión, así IT vuelca el número crudo del servidor. */
  // "Nivel silo capa interna %"
  '066_C_Dry_Material_CL_Level':     'SILO5_L_PCT',
  // "Descarga desde silo capa interna kg/h"
  '066_C_Dry_Material_CL_discharge': { tag: 'SILO5_FOUT_KGMIN', scale: 1 / 60 },
  // "Nivel silo capa externa %"
  '066_C_Dry_Material_SL_Level':     'SILO6_L_PCT',
  // "Descarga desde silo capa externa kg/h"
  '066_C_Dry_Material_SL_discharge': { tag: 'SILO6_FOUT_KGMIN', scale: 1 / 60 },
};

/* Normaliza una entrada de WINCC_ALIAS a { tag, scale }. */
export function aliasTarget(value) {
  return typeof value === 'string' ? { tag: value, scale: 1 } : { tag: value.tag, scale: value.scale ?? 1 };
}

/* Índice de búsqueda: NOMBRE_NORMALIZADO → { meta, scale }. Cubre los nombres
   canónicos (scale 1) y los alias de WinCC en una sola tabla. */
const LOOKUP = (() => {
  const out = new Map();
  for (const [tag, meta] of Object.entries(TAG_MAP)) out.set(tag.toUpperCase(), { meta, scale: 1 });
  for (const [wincc, value] of Object.entries(WINCC_ALIAS)) {
    const { tag, scale } = aliasTarget(value);
    const meta = TAG_MAP[tag];
    if (meta) out.set(wincc.toUpperCase(), { meta, scale });
  }
  return out;
})();

export const KIND_BY_KEY = (() => {
  const out = {};
  for (const meta of Object.values(TAG_MAP)) {
    for (const key of meta.keys) out[key] = meta.kind;
  }
  return out;
})();

export const UNIT_BY_KEY = (() => {
  const out = {};
  for (const meta of Object.values(TAG_MAP)) {
    for (const key of meta.keys) out[key] = meta.unit;
  }
  return out;
})();

export const TAG_BY_KEY = (() => {
  const out = {};
  for (const [tag, meta] of Object.entries(TAG_MAP)) {
    for (const key of meta.keys) out[key] = tag;
  }
  return out;
})();

/* ══ ¿Ese "HMI" es de verdad? ══════════════════════════════════════════════
   `kind: 'hmi'` en TAG_MAP declara la INTENCIÓN («este número debería venir de
   planta»). No dice si HOY llega: hay tags declarados HMI que ningún servidor
   publica todavía, y su valor sale de `datos/hmi.csv` — nuestro propio archivo
   de valores por defecto. Sellarlos «HMI» es afirmar que vienen de planta un
   supuesto que escribimos nosotros; es justo el sello que hay que no poner.

   Casos vivos hoy (23-jul-2026): masas de los esparcidores (12,5 / 40 / 15 kg
   de arranque; los tags de báscula `H_SL1/CC/SL2_Scale_PV` ya están mapeados y
   el sello pasará a «HMI» solo cuando IT los publique), PCT_SL2 (52,9 %
   supuesto, falta que IT publique `H_SL2_Total_Flakes`) y toda la Sección 1,
   cuyos CSV por servidor todavía llegan vacíos.

   La verdad NO se declara en una tabla que hay que acordarse de actualizar:
   se lee del propio CSV. `parseHmiCsv` devuelve qué origen escribió cada
   clave, y `DEFAULTS_LABEL` significa «lo pusimos nosotros». El día que IT
   publique el tag, el sello vuelve a «HMI» solo. */
const origenVivoPorClave = new Map();

/** Registra de dónde salió cada valor del último CSV aplicado. */
export function registrarOrigenes(origenPorClave) {
  origenVivoPorClave.clear();
  for (const [key, origen] of Object.entries(origenPorClave ?? {})) {
    origenVivoPorClave.set(key, origen);
  }
}

/** true = declarado HMI pero HOY nadie de planta lo está escribiendo. */
export function esSupuesto(key) {
  if (KIND_BY_KEY[key] !== 'hmi') return false;
  const origen = origenVivoPorClave.get(key);
  // Sin CSV leído todavía no se acusa a nadie: se asume la declaración.
  if (!origenVivoPorClave.size) return false;
  return origen === undefined || origen === DEFAULTS_LABEL;
}

function unquote(s) {
  const t = String(s ?? '').trim();
  return t.length >= 2 && t[0] === '"' && t[t.length - 1] === '"' ? t.slice(1, -1).trim() : t;
}

function toNumber(valRaw, sep) {
  let v = unquote(valRaw);
  if (v === '') return { empty: true };
  if (sep === ':') {
    const dec = Math.max(v.lastIndexOf(','), v.lastIndexOf('.'));
    if (dec !== -1) v = v.slice(0, dec).replace(/[.,]/g, '') + '.' + v.slice(dec + 1);
  } else if (sep === ';' || sep === '\t') {
    v = v.replace(/\./g, '').replace(',', '.');
  } else {
    v = v.replace(/,/g, '');
  }
  const m = v.match(/-?\d+(\.\d+)?/);
  if (!m) return { nan: true };
  return { val: parseFloat(m[0]) };
}

/** Parsea el CSV completo. Todos los alias reciben el mismo valor. */
export function parseHmiCsv(text) {
  const updates = {};
  const warnings = [];
  const setBy = {};
  const setByOrigin = {};
  let vPrensa = null;
  let count = 0;
  let origin = null;
  const clean = String(text ?? '').replace(/^﻿/, '');
  for (const rawLine of clean.split(/\r?\n/)) {
    /* Marca de origen que inserta pollServer al concatenar los CSV de cada
       servidor. Va como comentario para que un CSV suelto siga siendo válido. */
    const mark = rawLine.match(/^#\s*@origen:\s*(.+?)\s*$/i);
    if (mark) { origin = mark[1]; continue; }
    let line = rawLine;
    const h = line.indexOf('#'); if (h !== -1) line = line.slice(0, h);
    const c = line.indexOf('//'); if (c !== -1) line = line.slice(0, c);
    line = line.trim();
    if (!line) continue;
    const records = line.includes(':') ? line.split(';') : [line];
    for (const recRaw of records) {
      const rec = recRaw.trim();
      if (!rec) continue;
      let sep;
      let sepIdx = rec.indexOf(':');
      if (sepIdx !== -1) sep = ':';
      else if ((sepIdx = rec.indexOf('\t')) !== -1) sep = '\t';
      else if ((sepIdx = rec.indexOf(';')) !== -1) sep = ';';
      else if ((sepIdx = rec.indexOf(',')) !== -1) sep = ',';
      else { warnings.push(`registro sin separador: "${rec}"`); continue; }
      /* El nombre se conserva tal cual viene (WinCC distingue mayúsculas y
         usa guiones: `L18CL5-IN-PB-le-F_act`); la comparación es
         insensible a mayúsculas para tolerar exports en otro formato. */
      const tag = unquote(rec.slice(0, sepIdx));
      const norm = tag.toUpperCase();
      if (!tag || norm === 'TAG' || norm === 'TAGNAME' || norm === 'VARIABLE') continue;
      const hit = LOOKUP.get(norm);
      if (!hit) { warnings.push(`tag desconocido: ${tag}`); continue; }
      const num = toNumber(rec.slice(sepIdx + 1), sep);
      if (num.empty) continue;
      if (num.nan) { warnings.push(`valor inválido en ${tag}`); continue; }
      if (num.val < 0) { warnings.push(`valor negativo ignorado en ${tag}`); continue; }
      /* La conversión de unidad del alias (p.ej. kg/h → kg/min) se aplica ANTES
         de comparar por colisión, para que dos orígenes en unidades distintas
         se comparen ya en la unidad del modelo. */
      const val = num.val * hit.scale;
      const meta = hit.meta;
      /* Colisión entre servidores: `H_PressSpeed_PV` existe en Formación y en
         Encolado con significados distintos. Antes ganaba el último en silencio;
         ahora gana igual (el orden de CSV_SOURCES es la precedencia) pero queda
         un aviso visible en el pill de estado. */
      for (const key of meta.keys) {
        /* Pisar un default de la base es el comportamiento esperado, no un
           conflicto: solo se avisa cuando DOS orígenes en vivo discrepan. */
        const prevIsDefault = setByOrigin[key] === DEFAULTS_LABEL;
        if (key in updates && updates[key] !== val && !prevIsDefault) {
          warnings.push(`conflicto en ${key}: ${setBy[key] ?? '?'}=${updates[key]} vs ${origin ? origin + '/' : ''}${tag}=${val} — gana ${tag}`);
        }
        updates[key] = val;
        setBy[key] = `${origin ? origin + '/' : ''}${tag}`;
        setByOrigin[key] = origin;
      }
      if (meta.keys.includes('v_prensa')) vPrensa = val;
      count += 1;
    }
  }
  /* `origenPorClave` es la respuesta a "¿este número lo puso planta o lo
     pusimos nosotros?": DEFAULTS_LABEL = salió de datos/hmi.csv (nuestro
     archivo de valores por defecto), cualquier otra etiqueta = lo escribió un
     servidor en vivo. La UI lo usa para no sellar como HMI un supuesto. */
  return { updates, vPrensa, warnings, count, origenPorClave: setByOrigin };
}

/* ============================================================
   ADAPTADOR DE FORMATOS · sniffer → perfil → normalizador
   ------------------------------------------------------------
   Nosotros nos adaptamos a IT, no al revés: cada ida y vuelta con
   Sistemas cuesta días, así que el simulador acepta el archivo que su
   export automático buenamente logre generar.

   `parseHmiCsv` NO se toca. Todo formato raro se traduce al canónico
   `TAG: valor;` y entra por la puerta de siempre — así el camino `kv`
   (el de hoy) jamás pasa por código nuevo: se devuelve el texto tal cual.

   Perfiles: kv · tabla · ancho · desconocido (ver PLAN-ADAPTADOR-CSV.md).
   ============================================================ */

/* Nombres de columna que reconocemos por encabezado. La comparación normaliza
   mayúsculas, espacios, guiones y guiones bajos (`Var_Name` = `varname`). */
const COL_TAG     = new Set(['tag', 'tagname', 'varname', 'variable', 'nombre', 'name', 'item', 'punto', 'senal', 'señal', 'signal']);
const COL_VALOR   = new Set(['value', 'varvalue', 'valor', 'val', 'pv', 'medida', 'lectura', 'measurement', 'wert']);
const COL_CALIDAD = new Set(['validity', 'quality', 'qc', 'calidad', 'validez', 'estado', 'status', 'flag']);
/* `$date` / `$time` son la convención de los export de tendencias de WinCC /
   Wonderware ("Save To File" del gráfico histórico), que es como Sistemas va a
   entregar los datos en la práctica. */
const COL_TIEMPO  = new Set(['timestamp', 'timestring', 'time', 'datetime', 'date', 'fecha', 'hora', 'fechahora',
  '$date', '$time', '$timestamp', '$datetime']);

const DELIMS = [';', '\t', '|', ','];

const norma = (s) => String(s ?? '').trim().replace(/^"|"$/g, '').toLowerCase().replace(/[\s_.\-]/g, '');

/* Líneas con contenido: sin BOM, sin vacías, sin comentarios `#` / `//`. */
function lineasUtiles(texto, max = 5000) {
  const out = [];
  for (const raw of String(texto ?? '').replace(/^﻿/, '').split(/\r?\n/)) {
    const t = raw.trim();
    if (!t || t.startsWith('#') || t.startsWith('//')) continue;
    out.push(t);
    if (out.length >= max) break;
  }
  return out;
}

/* Separador por conteo en las primeras 10 líneas, premiando la CONSISTENCIA
   (mismo número de columnas en todas). Eso resuelve solo el caso peligroso:
   en un export alemán `1,5;2,7;3,1` la coma aparece tanto como el `;`, pero
   solo el `;` da el mismo conteo en todas las líneas… y cuando empatan, gana
   el `;` por orden de DELIMS. */
function detectarDelim(lineas) {
  const muestra = lineas.slice(0, 10);
  let mejor = null;
  for (const d of DELIMS) {
    const counts = muestra.map((l) => l.split(d).length - 1).filter((c) => c > 0);
    if (!counts.length) continue;
    const freq = new Map();
    for (const c of counts) freq.set(c, (freq.get(c) ?? 0) + 1);
    let moda = 0;
    let vecesModa = 0;
    for (const [c, n] of freq) if (n > vecesModa || (n === vecesModa && c > moda)) { moda = c; vecesModa = n; }
    const score = vecesModa * 100 + moda;
    if (!mejor || score > mejor.score) mejor = { delim: d, score };
  }
  return mejor?.delim ?? null;
}

/* Partición respetando comillas: `A,"1.234,56",B` son tres celdas. */
function partirFila(linea, delim) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < linea.length; i += 1) {
    const ch = linea[i];
    if (ch === '"') {
      if (q && linea[i + 1] === '"') { cur += '"'; i += 1; } else q = !q;
      continue;
    }
    if (ch === delim && !q) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map((c) => c.trim());
}

/* Número ESTRICTO: solo dígitos y separadores. `2026-07-21 08:00:00` no lo es
   (tiene `-` y `:`), y por eso una columna de fecha nunca se confunde con la
   de valor. */
function esNumero(celda) {
  return /^[-+]?\d[\d.,\s]*$/.test(unquote(celda));
}

const conocido = (celda) => LOOKUP.has(unquote(celda).toUpperCase());

/* Agrupación de miles: `1.234` · `1,234` · `12.345.678`. Con UN solo separador
   el formato es ambiguo (¿1234 o 1.234?); se resuelve por la forma del número
   —tres dígitos exactos por grupo— en vez de adivinar el locale del servidor. */
const MILES = /^[-+]?\d{1,3}([.,]\d{3})+$/;

/* ── Export de tendencias: la coma es separador Y decimal a la vez ──────────
   Caso real (`DENSIDADESHUMEDAD.CSV`, 21-jul-2026):

     $Date,$Time,NIVEL_SL,NIVEL_CL,HUMEDAD_CE,…      ← 9 columnas
     07/20/26,07:42:50,70,89912,75,23389,2,68814,0,0,0,0   ← 12 campos

   `70,89912` es UN valor (70.89912), no dos. Sin reparar esto el simulador
   leería NIVEL_SL = 70 y descartaría el resto de la fila corrida.

   El encabezado dice cuántas columnas hay, así que sobran (campos − columnas)
   uniones. Cuáles unir se resuelve por programación dinámica: cada columna
   toma 1 campo, o 2 si ambos son enteros puros (`70` + `89912`). Se prefiere
   la fracción larga, porque un `0,0` de dos columnas booleanas contiguas
   también es unible pero casi nunca es lo que se quiso decir. */
const ENTERO_IZQ = /^[-+]?\d+$/;
const ENTERO_DER = /^\d+$/;

export function repararFilaAncha(campos, nCols) {
  const M = campos.length;
  if (M <= nCols) return { campos, uniones: 0 };
  const NEG = -1e9;
  // dp[i][j] = mejor puntaje usando i campos para llenar j columnas.
  const dp = Array.from({ length: M + 1 }, () => new Array(nCols + 1).fill(NEG));
  const via = Array.from({ length: M + 1 }, () => new Array(nCols + 1).fill(0));
  dp[0][0] = 0;
  for (let i = 0; i < M; i += 1) {
    for (let j = 0; j < nCols; j += 1) {
      if (dp[i][j] === NEG) continue;
      if (dp[i][j] > dp[i + 1][j + 1]) { dp[i + 1][j + 1] = dp[i][j]; via[i + 1][j + 1] = 1; }
      if (i + 1 < M) {
        const a = unquote(campos[i]);
        const b = unquote(campos[i + 1]);
        if (ENTERO_IZQ.test(a) && ENTERO_DER.test(b)) {
          // Fracción de ≥2 dígitos = decimal casi seguro; de 1 dígito, dudoso.
          const puntos = b.length >= 2 ? 10 + b.length : 1;
          if (dp[i][j] + puntos > dp[i + 2][j + 1]) { dp[i + 2][j + 1] = dp[i][j] + puntos; via[i + 2][j + 1] = 2; }
        }
      }
    }
  }
  if (dp[M][nCols] === NEG) return { campos, uniones: 0 }; // no cuadra: se deja crudo
  const out = new Array(nCols);
  let i = M;
  let j = nCols;
  let uniones = 0;
  while (j > 0) {
    const paso = via[i][j];
    if (paso === 2) { out[j - 1] = `${unquote(campos[i - 2])}.${unquote(campos[i - 1])}`; uniones += 1; i -= 2; }
    else { out[j - 1] = campos[i - 1]; i -= 1; }
    j -= 1;
  }
  return { campos: out, uniones };
}

/* ── Instante de una fila de tendencias ─────────────────────────────────────
   Devuelve una clave numérica ordenable (no un Date: las fechas vienen en
   formatos distintos según el servidor y solo necesitamos comparar). */
export function clavarInstante(fecha, hora, diaPrimero = false) {
  const f = unquote(fecha).trim();
  const h = unquote(hora ?? '').trim();
  let Y = 0;
  let Mo = 0;
  let D = 0;
  let m = f.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);       // 2026-07-20
  if (m) { Y = +m[1]; Mo = +m[2]; D = +m[3]; }
  else {
    m = f.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/);        // 07/20/26 · 20/07/2026
    if (!m) return null;
    Y = +m[3];
    if (Y < 100) Y += 2000;
    if (diaPrimero) { D = +m[1]; Mo = +m[2]; } else { Mo = +m[1]; D = +m[2]; }
  }
  /* La hora puede venir en 24 h (`13:16`) o en 12 h con AM/PM (`1:16:05 PM`,
     `1:16 p. m.`). SQL Server / Excel exportan seguido en 12 h según la
     configuración regional del servidor; si se ignora el AM/PM, la tarde
     (1 PM) se lee como la madrugada (1 AM) → el dato sale 12 h más viejo y el
     widget de frescura miente «hace 12 h». Se captura el marcador y se
     convierte a 24 h. */
  const t = h.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*([AaPp])\.?\s*[Mm]?\.?)?/);
  let hh = t ? +t[1] : 0;
  const mi = t ? +t[2] : 0;
  const ss = t && t[3] ? +t[3] : 0;
  if (t && t[4]) {
    const esPM = /[Pp]/.test(t[4]);
    if (esPM && hh < 12) hh += 12;        // 1 PM → 13
    else if (!esPM && hh === 12) hh = 0;  // 12 AM → 0
  }
  if (hh > 23 || mi > 59 || ss > 59) return null;
  return ((((Y * 100 + Mo) * 100 + D) * 100 + hh) * 100 + mi) * 100 + ss;
}

/* Clave ordenable (YYYYMMDDhhmmss) → instante real, en ms epoch.
   ------------------------------------------------------------
   La fecha del CSV la escribe el servidor de planta, que corre en hora de
   Quito, y la pantalla muestra hora de Quito: se reconstruye el instante EN
   ESA zona (America/Guayaquil = UTC−5 fijo, sin horario de verano) para que el
   widget muestre exactamente los dígitos que trae el archivo aunque el
   navegador esté configurado en otra zona. */
const QUITO_UTC_OFFSET_H = 5;
export function fechaDeClave(clave) {
  if (!Number.isFinite(clave) || clave <= 0) return null;
  const ss = clave % 100;
  const mi = Math.floor(clave / 1e2) % 100;
  const hh = Math.floor(clave / 1e4) % 100;
  const D = Math.floor(clave / 1e6) % 100;
  const Mo = Math.floor(clave / 1e8) % 100;
  const Y = Math.floor(clave / 1e10);
  if (Y < 1970 || Y > 9999 || Mo < 1 || Mo > 12 || D < 1 || D > 31) return null;
  if (hh > 23 || mi > 59 || ss > 59) return null;
  return Date.UTC(Y, Mo - 1, D, hh + QUITO_UTC_OFFSET_H, mi, ss);
}

/* ¿El primer número de la fecha es el día? Se decide mirando TODAS las filas:
   si alguna tiene un primer componente > 12 no puede ser un mes. */
function detectarDiaPrimero(fechas) {
  for (const f of fechas) {
    const m = String(f ?? '').match(/^(\d{1,2})[-/.](\d{1,2})[-/.]\d{2,4}$/);
    if (m && +m[1] > 12) return true;
  }
  return false;
}

function celdaNumero(bruto) {
  const t = unquote(bruto);
  if (t === '') return { empty: true };
  if (t.includes('.') && t.includes(',')) return toNumber(t, ':'); // el ÚLTIMO separador es el decimal
  if (MILES.test(t)) return { val: parseFloat(t.replace(/[.,]/g, '')) };
  return toNumber(t, ':');
}

const CAL_MALA  = new Set(['0', 'false', 'bad', 'malo', 'mala', 'no', 'off', 'uncertain', 'incierto', 'error', 'invalid', 'invalido', 'inválido']);
const CAL_BUENA = new Set(['1', 'true', 'good', 'ok', 'bueno', 'buena', 'si', 'sí', 'yes', '192', 'valid', 'valido', 'válido', 'gut']);

/* Un dato de mala calidad se trata como PENDIENTE, nunca como cero: un cero
   falso es el peor resultado posible — número creíble y equivocado. */
function calidadBuena(celda, esperado) {
  const t = norma(celda);
  if (esperado !== null && esperado !== undefined && esperado !== '') return t === norma(esperado);
  if (!t) return true;
  if (CAL_MALA.has(t)) return false;
  if (CAL_BUENA.has(t)) return true;
  const n = Number(t.replace(',', '.'));
  if (Number.isFinite(n)) return n > 0;
  return true; // etiqueta que no entendemos: no se descarta el dato por eso
}

function idxPorNombre(cab, set) {
  for (let i = 0; i < cab.length; i += 1) if (set.has(norma(cab[i]))) return i;
  return -1;
}

/* Columna de `adaptador.json`: acepta nombre de encabezado o índice 0-based. */
function resolverCol(spec, cab) {
  if (spec === null || spec === undefined || spec === '') return -1;
  if (typeof spec === 'number') return spec;
  const n = norma(spec);
  for (let i = 0; i < cab.length; i += 1) if (norma(cab[i]) === n) return i;
  const idx = Number(spec);
  return Number.isInteger(idx) ? idx : -1;
}

/** Olfatea el formato. `cfg` (de `datos/adaptador.json`) manda sobre todo. */
export function detectarPerfil(texto, cfg = null) {
  const lineas = lineasUtiles(texto, 200);
  /* Sin líneas de datos (p.ej. `hmi-preparacion.csv`, hoy todo comentarios):
     no hay nada que adaptar, se deja pasar como siempre. */
  if (!lineas.length) return { perfil: 'kv', confianza: 1, detalle: 'sin líneas de datos' };
  const cabezaTxt = lineas.slice(0, 2).join(' ⏎ ').slice(0, 200);
  if (cfg?.perfil === 'kv') return { perfil: 'kv', confianza: 1, detalle: 'adaptador.json' };
  if (!cfg?.perfil && pareceKv(lineas)) return { perfil: 'kv', confianza: 1, detalle: 'TAG: valor;' };

  const delim = cfg?.delim ?? detectarDelim(lineas);
  if (!delim) return { perfil: 'desconocido', confianza: 0, detalle: cabezaTxt };

  const filas = lineas.map((l) => partirFila(l, delim));
  const cab = filas[0];
  /* Encabezado = primera línea con ≥2 celdas y NINGUNA numérica. */
  const encabezado = cab.length >= 2 && !cab.some(esNumero);
  const datos = encabezado ? filas.slice(1) : filas;
  if (!datos.length) return { perfil: 'desconocido', confianza: 0, detalle: cabezaTxt };

  if (cfg?.perfil) {
    return {
      perfil: cfg.perfil, confianza: 1, detalle: 'adaptador.json', delim, encabezado,
      colTag: resolverCol(cfg.colTag, cab), colValor: resolverCol(cfg.colValor, cab),
      colCalidad: resolverCol(cfg.colCalidad, cab), calidadOk: cfg.calidadOk ?? null,
    };
  }

  if (encabezado) {
    // 2 · tabla: el encabezado dice cuál columna es el tag y cuál el valor.
    const idxTag = idxPorNombre(cab, COL_TAG);
    const idxVal = idxPorNombre(cab, COL_VALOR);
    if (idxTag !== -1 && idxVal !== -1 && idxTag !== idxVal) {
      const idxCal = idxPorNombre(cab, COL_CALIDAD);
      return {
        perfil: 'tabla', confianza: 1, delim, encabezado: true,
        detalle: `columnas ${cab[idxTag]} → ${cab[idxVal]}${idxCal !== -1 ? ` · calidad ${cab[idxCal]}` : ''}`,
        colTag: idxTag, colValor: idxVal, colCalidad: idxCal, calidadOk: null,
      };
    }
    /* 3 · ancho: el encabezado ES la lista de tags; cada fila, un instante.
       Se reconoce por la FORMA (columna de tiempo + varias columnas más), no
       por cuántos tags conocemos: un export de tendencias con tags que el
       modelo aún no mapea sigue siendo un export de tendencias, y conviene
       leerlo y avisar de los desconocidos antes que rechazarlo entero. */
    const conocidas = cab.filter(conocido).length;
    const conTiempo = cab.some((c) => COL_TIEMPO.has(norma(c)));
    if (conocidas >= 2 || (conTiempo && cab.length >= 3)) {
      const conf = conocidas >= 2 ? Math.min(1, conocidas / Math.max(1, cab.length - 1)) : 0.75;
      return {
        perfil: 'ancho', confianza: conf, delim, encabezado: true,
        detalle: conocidas >= 2
          ? `${conocidas} tags en columnas · se lee el instante más reciente`
          : `columna de tiempo + ${cab.length - 1} columnas · se lee el instante más reciente`,
        colTag: -1, colValor: -1, colCalidad: -1, calidadOk: null,
      };
    }
  }

  // 4 · tabla por CONTENIDO: columna de tags reconocidos + columna numérica.
  const nCols = Math.max(...datos.map((f) => f.length));
  let idxTag = -1;
  let mejorTag = 0;
  let idxVal = -1;
  let mejorVal = 0;
  const textos = [];
  for (let i = 0; i < nCols; i += 1) {
    let known = 0;
    let num = 0;
    let txt = 0;
    for (const f of datos) {
      const c = f[i] ?? '';
      if (conocido(c)) known += 1;
      else if (esNumero(c)) num += 1;
      else if (c) txt += 1;
    }
    textos[i] = txt;
    if (known > mejorTag) { mejorTag = known; idxTag = i; }
    if (num > mejorVal) { mejorVal = num; idxVal = i; }
  }
  let confianza = mejorTag / datos.length;
  if (idxTag === -1) {
    // Ningún tag reconocido: la columna de texto no-numérico es el candidato.
    idxTag = textos.findIndex((t, i) => t > 0 && i !== idxVal && !esNumero(datos[0][i] ?? ''));
    confianza = 0.4;
  }
  if (idxTag === -1 || idxVal === -1 || idxTag === idxVal) return { perfil: 'desconocido', confianza: 0, detalle: cabezaTxt };

  /* `TAG,valor` clásico (dos columnas, sin encabezado): ya lo entiende el
     parser de siempre, así que se devuelve intacto. */
  if (!encabezado && nCols === 2 && idxTag === 0 && idxVal === 1 && confianza >= 0.5 && delim !== '|') {
    return { perfil: 'kv', confianza, detalle: 'TAG,valor' };
  }
  return {
    perfil: 'tabla', confianza, delim, encabezado,
    detalle: `sin encabezado útil · columna ${idxTag + 1} = tag, columna ${idxVal + 1} = valor`,
    colTag: idxTag, colValor: idxVal, colCalidad: -1, calidadOk: null,
  };
}

/* `kv` = el nombre y sus dos puntos van ANTES que cualquier delimitador de
   tabla. La condición del delimitador es la que evita el falso positivo obvio:
   `2026-07-21 08:00:00;TAG;14,5` también tiene `:`, pero después del `;`. */
/* Devuelve el nombre del tag si la línea abre como `TAG:`, o null.
   ------------------------------------------------------------
   El nombre PUEDE empezar con dígito: en el servidor de Preparación casi todos
   lo hacen (`066_C_Dry_Material_CL_Level`, `051_S_Hombak_Level`, `071_DRY_Hum_out`)
   porque el prefijo es el código de área. La regla anterior exigía letra o `_`
   inicial y hacía que ese CSV entero se detectara como "desconocido".

   Las dos condiciones que siguen evitando el falso positivo del timestamp:
   debe contener al menos una LETRA, y no puede arrancar como fecha `AAAA-`
   o `AAAA/`. Tampoco se admiten espacios dentro del nombre — ningún tag de
   WinCC los tiene y son la marca de un `2026-07-21 08:00:00`. */
function claveKv(linea) {
  const m = String(linea).match(/^\s*"?([A-Za-z0-9_.\-]+)"?\s*:/);
  if (!m) return null;
  const clave = m[1];
  if (/^\d{4}[-/]/.test(clave)) return null;  // fecha AAAA-MM-DD / AAAA/MM/DD
  if (!/[A-Za-z]/.test(clave)) return null;   // `08:00:00` y demás horas
  return clave;
}
function pareceKv(lineas) {
  const muestra = lineas.slice(0, 10);
  let ok = 0;
  for (const l of muestra) {
    if (!claveKv(l)) continue;
    const idxDos = l.indexOf(':');
    const idxDelim = Math.min(...DELIMS.map((d) => { const i = l.indexOf(d); return i === -1 ? Infinity : i; }));
    if (idxDos < idxDelim) ok += 1;
  }
  return ok >= Math.ceil(muestra.length / 2);
}

function fmtNum(v) {
  const s = String(v);
  return s.includes('e') ? v.toFixed(9) : s;
}

/* Valor no numérico ("OFF", "N/A"): se pasa tal cual y `parseHmiCsv` avisa
   `valor inválido en TAG`. Se limpia lo que rompería el formato canónico. */
const limpiar = (v) => String(v ?? '').replace(/[;#\r\n]|\/\//g, ' ').trim().slice(0, 40);

/** Traduce cualquier perfil al canónico `TAG: valor;`. `kv` sale intacto. */
export function normalizar(texto, perfil) {
  if (!perfil || perfil.perfil === 'kv') return { texto: String(texto ?? ''), avisos: [] };
  if (perfil.perfil === 'desconocido') {
    return { texto: '', error: true, avisos: [`formato no reconocido (ni TAG: valor;, ni tabla, ni ancho) — primeras líneas: ${perfil.detalle}`] };
  }

  const avisos = [];
  const desconocidos = new Set();
  const filas = lineasUtiles(texto).map((l) => partirFila(l, perfil.delim));
  const cab = perfil.encabezado ? (filas[0] ?? []) : [];
  const datos = perfil.encabezado ? filas.slice(1) : filas;
  /* Map por tag: un export histórico repite el mismo tag en muchos instantes.
     Gana el de `orden` MÁS ALTO: si la fila trae fecha legible, el orden es la
     fecha (el Historian de Sistemas no ordena por tiempo, foto 22-jul-2026);
     sin fecha, el orden es la posición en el archivo — la última línea, como
     siempre. Una fila con fecha le gana SIEMPRE a una sin fecha. */
  const salida = new Map();
  let malas = 0;
  let repetidos = 0;
  let seq = 0;
  /* Instante MÁS RECIENTE visto en el archivo: es "de cuándo son los datos",
     que no es lo mismo que "cuándo los leímos". Lo consume el widget de
     frescura de la barra. Null = el formato no trae marca de tiempo. */
  let instanteMax = null;
  const marcarInstante = (clave) => {
    if (clave == null) return;
    if (instanteMax == null || clave > instanteMax) instanteMax = clave;
  };

  const poner = (nombreRaw, bruto, calidad, orden = null) => {
    const nombre = unquote(nombreRaw);
    if (!nombre) return;
    const clave = nombre.toUpperCase();
    /* Un tag que el modelo no conoce se junta en UN aviso, no en uno por fila:
       un export de 800 tags dejaría el tooltip del pill ilegible justo cuando
       más se lo necesita. */
    /* El instante se marca ANTES de filtrar por tag conocido: la edad del
       archivo no depende de que el modelo entienda ese tag. */
    marcarInstante(orden);
    if (!LOOKUP.has(clave)) { desconocidos.add(nombre); return; }
    seq += 1;
    const k = orden ?? seq; // las claves de fecha (~1e13) dominan a las posicionales
    const previo = salida.get(clave);
    if (previo) { repetidos += 1; if (k < previo.orden) return; }
    let linea;
    if (calidad !== undefined && !calidadBuena(calidad, perfil.calidadOk)) {
      malas += 1;
      linea = `${nombre}:;`; // pendiente: conserva el último bueno
    } else {
      const num = celdaNumero(bruto);
      if (num.empty) linea = `${nombre}:;`;
      else if (num.nan) linea = `${nombre}: ${limpiar(bruto)};`;
      else linea = `${nombre}: ${fmtNum(num.val)};`;
    }
    salida.set(clave, { orden: k, linea });
  };

  if (perfil.perfil === 'ancho') {
    /* Un export de tendencias trae MUCHOS instantes y no siempre ordenados
       (el operador puede pegar dos tramos, o exportar en orden inverso). Se
       repara cada fila, se ordena por fecha+hora y se toma la MÁS RECIENTE
       —no la última línea del archivo, que es lo que se hacía antes. */
    const iFecha = cab.findIndex((c) => ['date', 'fecha', '$date'].includes(norma(c)));
    const iHora = cab.findIndex((c) => ['time', 'hora', '$time'].includes(norma(c)));
    const iStamp = cab.findIndex((c) => ['timestamp', 'datetime', 'fechahora', '$timestamp', '$datetime'].includes(norma(c)));

    let unionesTot = 0;
    const filas = datos.map((f) => {
      const { campos, uniones } = repararFilaAncha(f, cab.length);
      unionesTot += uniones;
      return campos;
    });

    const colF = iFecha >= 0 ? iFecha : iStamp;
    const diaPrimero = colF >= 0 ? detectarDiaPrimero(filas.map((f) => f[colF])) : false;
    let elegida = filas[filas.length - 1] ?? [];
    let cuando = null;
    if (colF >= 0) {
      let mejor = null;
      for (const f of filas) {
        const k = clavarInstante(f[colF], iHora >= 0 ? f[iHora] : (f[colF] ?? '').trim().split(/[ T]+/).slice(1).join(' '), diaPrimero);
        if (k == null) continue;
        if (mejor == null || k > mejor) { mejor = k; elegida = f; }
      }
      if (mejor != null) {
        cuando = `${unquote(elegida[colF])}${iHora >= 0 ? ` ${unquote(elegida[iHora])}` : ''}`;
        marcarInstante(mejor);
      }
    }

    if (unionesTot) {
      avisos.push(`coma usada como separador Y como decimal: se reconstruyeron ${unionesTot} valor(es) guiándose por el número de columnas del encabezado`);
    }
    if (filas.length > 1) {
      avisos.push(cuando
        ? `${filas.length} instantes en el archivo · se usó el más reciente (${cuando})`
        : `${filas.length} filas sin columna de fecha reconocible · se usó la última`);
    }

    for (let i = 0; i < cab.length; i += 1) {
      const n = norma(cab[i]);
      if (!n || COL_TIEMPO.has(n) || COL_CALIDAD.has(n)) continue;
      poner(cab[i], elegida[i] ?? '');
    }
  } else {
    /* Columna de tiempo en la tabla (`Datetime` en el Historian de Sistemas):
       si existe, el instante de la fila decide quién gana por tag. La fecha y
       la hora pueden venir juntas en una celda (`7/22/2026 12:36`) o en dos
       columnas separadas. */
    const iTiempo = perfil.encabezado ? cab.findIndex((c) => COL_TIEMPO.has(norma(c))) : -1;
    const iHora = perfil.encabezado ? cab.findIndex((c, i) => i !== iTiempo && ['time', 'hora', '$time'].includes(norma(c))) : -1;
    const diaPrimero = iTiempo >= 0
      ? detectarDiaPrimero(datos.map((f) => String(f[iTiempo] ?? '').split(/[ T]/)[0]))
      : false;
    for (const f of datos) {
      if (perfil.colTag < 0 || perfil.colTag >= f.length) continue;
      let orden = null;
      if (iTiempo >= 0) {
        const partesT = String(f[iTiempo] ?? '').trim().split(/[ T]+/);
        const fecha = partesT[0];
        const horaCelda = partesT.slice(1).join(' '); // conserva el AM/PM
        orden = clavarInstante(fecha, iHora >= 0 ? f[iHora] : horaCelda, diaPrimero);
      }
      poner(f[perfil.colTag], f[perfil.colValor] ?? '',
        perfil.colCalidad >= 0 ? (f[perfil.colCalidad] ?? '') : undefined, orden);
    }
    if (repetidos && iTiempo >= 0) {
      avisos.push(`tags repetidos en ${repetidos} fila(s): se usó el instante más reciente de cada tag (columna ${cab[iTiempo]})`);
    }
  }

  if (malas) avisos.push(`${malas} fila(s) descartadas por calidad → quedan pendientes`);
  if (desconocidos.size) {
    const ej = [...desconocidos].slice(0, 5).join(', ');
    avisos.push(`${desconocidos.size} tag(s) del archivo no existen en el modelo: ${ej}${desconocidos.size > 5 ? '…' : ''}`);
  }
  /* Se leyó el archivo pero no salió NADA aprovechable. Es el caso que hay que
     explicar sí o sí: dice qué perfil se creyó ver, qué columnas se usaron y
     cómo forzar el mapeo, para poder resolverlo por teléfono con Sistemas. */
  if (!salida.size) {
    return {
      texto: '',
      error: true,
      avisos: [...avisos, `no se pudo sacar ningún tag (perfil "${perfil.perfil}" · ${perfil.detalle}). Si el formato es correcto pero las columnas no, fíjalas en datos/adaptador.json`],
    };
  }
  const cuerpo = [`# adaptado · perfil ${perfil.perfil} · ${salida.size} tags · ${perfil.detalle}`,
    ...[...salida.values()].map((v) => v.linea)];
  return { texto: `${cuerpo.join('\n')}\n`, avisos, instante: fechaDeClave(instanteMax) };
}

/** Punto de entrada: texto crudo de IT → texto canónico + perfil + avisos.
    `instante` = fecha/hora que trae el PROPIO archivo (ms epoch) o null si el
    formato no la declara — es la edad real del dato, no la de la lectura. */
export function adaptarCsv(texto, cfg = null) {
  const perfil = detectarPerfil(texto, cfg);
  const { texto: salida, avisos, error = false, instante = null } = normalizar(texto, perfil);
  if (perfil.perfil !== 'desconocido' && perfil.confianza < 0.6) {
    avisos.unshift(`perfil "${perfil.perfil}" detectado con confianza baja (${Math.round(perfil.confianza * 100)} %) — se puede fijar en datos/adaptador.json`);
  }
  return { texto: salida, perfil: perfil.perfil, confianza: perfil.confianza, detalle: perfil.detalle, avisos, error, instante };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Cambia exactamente un tag y conserva comentarios/orden del documento. */
export function updateCsvTag(text, tag, value) {
  const formatted = Number(value).toString();
  const re = new RegExp(`(^|[;\\n\\r])([ \\t]*${escapeRegExp(tag)}[ \\t]*:[ \\t]*)([^;\\r\\n]*)(;)`, 'im');
  if (re.test(text)) return text.replace(re, (_, lead, prefix, _old, semi) => `${lead}${prefix}${formatted}${semi}`);
  return `${String(text ?? '').replace(/\s*$/, '')}\n${tag}: ${formatted};\n`;
}

function fmtTime(d) {
  return d.toLocaleTimeString('es-EC', { timeZone: 'America/Guayaquil', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function fmtFechaHora(ms) {
  const d = new Date(ms);
  const hoy = new Date().toLocaleDateString('es-EC', { timeZone: 'America/Guayaquil' });
  const dia = d.toLocaleDateString('es-EC', { timeZone: 'America/Guayaquil' });
  return dia === hoy ? fmtTime(d) : `${d.toLocaleDateString('es-EC', { timeZone: 'America/Guayaquil', day: '2-digit', month: '2-digit' })} ${fmtTime(d)}`;
}

/** "hace 8 s" · "hace 3 min 20 s" · "hace 1 h 5 min" · "hace 2 d". */
export function fmtEdad(segundos) {
  const s = Math.max(0, Math.round(segundos));
  if (s < 60) return `hace ${s} s`;
  const min = Math.floor(s / 60);
  if (min < 60) return `hace ${min} min${s % 60 ? ` ${s % 60} s` : ''}`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h${min % 60 ? ` ${min % 60} min` : ''}`;
  const d = Math.floor(h / 24);
  return `hace ${d} d${h % 24 ? ` ${h % 24} h` : ''}`;
}

/* Umbrales de frescura (s). El HMI de planta reescribe cada ~2 s; una consulta
   al Historian puede tardar un minuto. Por encima de 5 min el dato ya no
   describe lo que está pasando en la línea. */
const EDAD_OK_S = 60;
const EDAD_AVISO_S = 300;

/* ══ Memoria del CSV local conectado (sobrevive al refresco) ═══════════════
   Un FileSystemFileHandle se puede guardar en IndexedDB (structured clone) y
   recuperar tras un F5. El permiso de lectura puede seguir vigente (se reanuda
   solo) o el navegador pedir re-confirmarlo (un clic, sin re-elegir archivo).
   Todo entre try/catch: sin IndexedDB (o en navegador viejo) el simulador
   sigue igual que antes, solo que la conexión no persiste. */
const IDB_DB = 'novopan-hmi';
const IDB_STORE = 'handles';
const IDB_KEY = 'csv-local';
function idbOpen() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbSaveHandle(handle) {
  try {
    const db = await idbOpen();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(handle, IDB_KEY);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  } catch { /* sin IndexedDB: la conexión simplemente no persiste */ }
}
async function idbLoadHandle() {
  try {
    const db = await idbOpen();
    return await new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const rq = tx.objectStore(IDB_STORE).get(IDB_KEY);
      rq.onsuccess = () => resolve(rq.result ?? null);
      rq.onerror = () => resolve(null);
    });
  } catch { return null; }
}
async function idbClearHandle() {
  try {
    const db = await idbOpen();
    await new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(IDB_KEY);
      tx.oncomplete = resolve;
      tx.onerror = resolve;
    });
  } catch { /* nada que limpiar */ }
}

export function initHmiCsv({
  applyData, statusEl, statusPopEl, connectBtn, fileInput, freshEl, connectLabelEl, connectAddrEl,
}) {
  let lastText = null;
  let currentText = '';
  let mode = 'off'; // off | server | live-file | manual-file | edited
  let fileHandle = null;
  /* Handle guardado de un refresco anterior cuyo permiso el navegador pide
     re-confirmar: se reconecta al MISMO archivo con un clic, sin re-elegirlo. */
  let pendingHandle = null;
  let lastGood = null;
  let failStreak = 0;
  let lastCount = 0;
  let lastWarnings = [];
  let lastFallos = [];
  let writeTimer = 0;

  /* El tooltip es para diagnosticar por teléfono: se muestran los primeros
     avisos completos y se dice cuántos quedaron fuera, en vez de un muro. */
  const TOOLTIP_MAX = 10;
  function tooltip(avisos) {
    if (!avisos.length) return '';
    const cabeza = avisos.slice(0, TOOLTIP_MAX);
    if (avisos.length > TOOLTIP_MAX) cabeza.push(`… y ${avisos.length - TOOLTIP_MAX} aviso(s) más`);
    return cabeza.join('\n');
  }

  let statusDetail = '';
  function setStatus(cls, msg, title) {
    if (!statusEl) return;
    statusDetail = (title ?? '').trim();
    const hasDetail = statusDetail.length > 0;
    statusEl.className = `s2-hmi-status is-${cls}${hasDetail ? ' has-detail' : ''}`;
    statusEl.textContent = msg;
    // El título nativo se conserva como respaldo; el detalle real se despliega.
    statusEl.title = hasDetail ? `${statusDetail}\n(clic para desplegar)` : '';
    if (statusPopEl) {
      statusPopEl.textContent = statusDetail;
      if (!hasDetail) statusPopEl.classList.add('is-hidden'); // sin detalle → cerrado
    }
  }
  /* El pill despliega su detalle al clic: avisos/errores del CSV completos, no
     escondidos en un tooltip que en una pantalla táctil de planta no se ve. */
  statusEl?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!statusPopEl || !statusDetail) return;
    statusPopEl.classList.toggle('is-hidden');
  });
  document.addEventListener('click', (e) => {
    if (!statusPopEl || statusPopEl.classList.contains('is-hidden')) return;
    if (e.target === statusEl || statusEl?.contains(e.target) || statusPopEl.contains(e.target)) return;
    statusPopEl.classList.add('is-hidden');
  });

  /* ══ Frescura: DE CUÁNDO ES EL DATO, no cuándo lo leímos ═══════════════
     El pill de estado dice la hora de la última LECTURA — con un CSV que no
     cambia, esa hora avanza cada 2 s aunque el dato sea de ayer. Este widget
     responde la otra pregunta, que es la que importa en planta: ¿de cuándo es
     la versión del archivo que estoy viendo?

     Se toma la mejor evidencia disponible, en este orden:
       1 · `dato`      — la columna de fecha del propio CSV (Datetime del
                         Historian, Date/Time de un export de tendencias). Es
                         la verdad: la estampa quien produce el dato.
       2 · `archivo`   — cabecera Last-Modified de la respuesta HTTP, o
                         file.lastModified del archivo local conectado. Es
                         cuándo se ESCRIBIÓ el archivo.
       3 · `contenido` — ninguna de las dos existe: solo sabemos cuándo vimos
                         cambiar el contenido. Se muestra con "≥" porque el
                         archivo puede ser mucho más viejo que eso. */
  let fresh = { ms: null, fuente: 'ninguna', detalle: '' };
  /* DOS relojes distintos, a propósito:
       · `fresh.ms`   = de cuándo es EL DATO del CSV (columna de tiempo / mtime).
       · `lastReadMs` = la última vez que ESTE simulador LEYÓ el CSV (cada ~2 s
                        mientras esté conectado, cambie o no el archivo).
     Un CSV viejo pero que seguimos leyendo: "actualizado hace 3 h · Leído hace 2 s".
     El HMI caído: "Leído hace 40 s" deja de avanzar → se ve al instante. */
  let lastReadMs = null;
  const RANGO_FUENTE = { dato: 3, archivo: 2, contenido: 1, ninguna: 0 };
  const FUENTE_TITULO = {
    dato: 'Fecha que trae el propio CSV (su columna de tiempo): es de cuándo son los datos.',
    archivo: 'Fecha de última escritura del archivo (Last-Modified): cuándo lo generó el servidor.',
    contenido: 'El archivo no declara fecha: solo se sabe cuándo cambió su contenido. La versión real puede ser más vieja.',
  };

  /* La escritura del archivo (Last-Modified) es un ancla confiable del reloj:
     el dato más nuevo del CSV no puede ser HORAS más viejo que cuándo se
     escribió el archivo. Si un `dato` viola eso, su hora se leyó mal (formato
     AM/PM raro, zona, etc.) y NO debe mandar sobre el Last-Modified — si no, el
     widget miente «hace 12 h» con un archivo recién escrito. */
  let mejorArchivo = null;
  const SKEW_DATO_MAX_MS = 60 * 60 * 1000; // 1 h de margen
  function setFresh(ms, fuente, detalle = '') {
    if (!Number.isFinite(ms)) return;
    if (fuente === 'archivo' && (mejorArchivo == null || ms > mejorArchivo)) mejorArchivo = ms;
    // Guarda anti-parseo-erróneo: un `dato` mucho más viejo que la escritura
    // del archivo es una hora mal leída → se descarta (gana el `archivo`).
    if (fuente === 'dato' && mejorArchivo != null && ms < mejorArchivo - SKEW_DATO_MAX_MS) return;
    // Una fuente mejor siempre gana; entre iguales, gana la más reciente.
    if (fresh.fuente === fuente ? ms <= (fresh.ms ?? -Infinity) : RANGO_FUENTE[fuente] < RANGO_FUENTE[fresh.fuente]) return;
    fresh = { ms, fuente, detalle };
    renderFresh();
  }

  /* Bloque "Leído hace X" = hace cuánto que el simulador leyó el CSV por última
     vez (distinto de la fecha del dato). Se pega al lado del de frescura. */
  function readHtml() {
    if (lastReadMs == null) return '';
    const s = (Date.now() - lastReadMs) / 1000;
    const cls = s <= 10 ? 'is-read-ok' : s <= 30 ? 'is-read-warn' : 'is-read-old';
    return `<span class="s2-fresh__read ${cls}" title="Última vez que ESTE simulador leyó el CSV (se relee cada ${POLL_MS / 1000} s mientras esté conectado). Si deja de avanzar, se dejó de leer el archivo.">`
      + `<span class="ms">sync</span>Leído ${fmtEdad(s)}</span>`;
  }

  function renderFresh() {
    if (!freshEl) return;
    if (fresh.ms == null) {
      freshEl.className = 's2-fresh is-none';
      freshEl.innerHTML = '<span class="ms">schedule</span><span class="s2-fresh__txt">CSV · sin datos</span>' + readHtml();
      freshEl.title = 'Todavía no se ha leído ningún CSV con fecha.';
      return;
    }
    const edadS = (Date.now() - fresh.ms) / 1000;
    /* Reloj del CSV por delante del de la pantalla: es un problema real de
       planta (servidor y PC desincronizados) y se dice, no se disimula con un
       "hace 0 s". */
    const adelantado = edadS < -90;
    const cls = adelantado ? 'is-skew' : edadS <= EDAD_OK_S ? 'is-ok' : edadS <= EDAD_AVISO_S ? 'is-warn' : 'is-old';
    const prefijo = fresh.fuente === 'contenido' ? '≥ ' : '';
    const cuando = fmtFechaHora(fresh.ms);
    freshEl.className = `s2-fresh ${cls}`;
    freshEl.innerHTML = `<span class="ms">schedule</span>`
      + `<span class="s2-fresh__txt">CSV actualizado <strong>${adelantado ? 'en el futuro' : `${prefijo}${fmtEdad(edadS)}`}</strong>`
      + `<span class="s2-fresh__at">${cuando}</span></span>`
      + readHtml();
    freshEl.title = `${FUENTE_TITULO[fresh.fuente]}\nÚltima versión del CSV: ${cuando}${fresh.detalle ? `\n${fresh.detalle}` : ''}`
      + (adelantado ? '\n⚠ La fecha del CSV está adelantada respecto al reloj de esta pantalla: revisar la hora del servidor.' : '');
  }

  /* El "hace cuánto" envejece solo aunque no llegue ningún CSV nuevo: ese es
     justamente el caso que hay que ver (el archivo dejó de actualizarse). */
  if (freshEl) { renderFresh(); setInterval(renderFresh, 1000); }

  /* ══ Estado del botón de conexión ═════════════════════════════════════ */
  const ESTADO_CONEXION = {
    off: { cls: 'is-off', label: 'Conectar CSV', icon: 'upload_file' },
    servidor: { cls: 'is-on', label: 'Conectado', icon: 'link' },
    archivo: { cls: 'is-on', label: 'Conectado · archivo local', icon: 'link' },
    manual: { cls: 'is-manual', label: 'Copia cargada a mano', icon: 'description' },
    // Había un archivo conectado antes del refresco; el navegador pide un clic
    // para re-confirmar el acceso. No se perdió la conexión, solo el permiso.
    reconnect: { cls: 'is-manual', label: 'Reconectar CSV', icon: 'link_off' },
  };

  function setConnected(estado, dir, titulo = '') {
    const e = ESTADO_CONEXION[estado] ?? ESTADO_CONEXION.off;
    if (connectBtn) {
      connectBtn.className = `s2-hmi__btn ${e.cls}`;
      connectBtn.title = titulo || (estado === 'off'
        ? 'Elegir un CSV local del HMI (respaldo si no hay servidor)'
        : `${dir}\nClick para conectar otro archivo.`);
    }
    if (connectLabelEl) connectLabelEl.textContent = e.label;
    if (connectAddrEl) {
      connectAddrEl.textContent = dir ?? '';
      connectAddrEl.hidden = !dir;
    }
    const icon = connectBtn?.querySelector('.ms');
    if (icon) icon.textContent = e.icon;
  }
  setConnected('off', '');

  /* Devuelve true = aplicado · false = sin cambios · 'error' = formato
     inválido (se conserva el último CSV bueno y el estado muestra el error;
     pollServer NO debe pisar ese estado con el pill "en vivo").

     `text` YA viene en canónico: la adaptación ocurre por archivo, antes de
     combinar los servidores (cada uno puede venir en un formato distinto). */
  function applyText(text, sourceLabel, force = false, avisosAdaptador = [], fallos = []) {
    if (!force && text === lastText) return false;
    const parsed = parseHmiCsv(text);
    parsed.warnings = [...avisosAdaptador, ...parsed.warnings];
    if (parsed.count === 0 && parsed.warnings.length > 0) {
      const when = lastGood ? ` · último válido ${fmtTime(lastGood)}` : '';
      setStatus('error', `● CSV · error de formato${when}`, tooltip(parsed.warnings));
      return 'error';
    }
    /* Respaldo de frescura (el más flojo): el contenido acaba de cambiar, así
       que la versión es de AHORA como muy tarde. Solo manda si el archivo no
       trajo fecha propia ni Last-Modified. */
    setFresh(Date.now(), 'contenido', `Contenido distinto al anterior (${sourceLabel}).`);
    lastText = text;
    currentText = text;
    lastGood = new Date();
    failStreak = 0;
    lastCount = parsed.count;
    lastWarnings = parsed.warnings;
    lastFallos = fallos;
    const warn = parsed.warnings.length ? ` · ⚠ ${parsed.warnings.length}` : '';
    const edited = mode === 'edited';
    /* Un archivo ilegible NO puede quedar escondido detrás de los que sí
       cargaron: el modelo sigue corriendo con lo bueno, pero el pill se pone
       en rojo y nombra el archivo culpable. */
    setStatus(fallos.length ? 'error' : (edited || mode === 'manual-file' ? 'manual' : 'live'),
      fallos.length
        ? `● ${sourceLabel} · ${fmtTime(lastGood)} · ${parsed.count} tags · ✖ ${fallos.join(', ')}`
        : `● ${sourceLabel} · ${fmtTime(lastGood)} · ${parsed.count} tags${warn}`,
      tooltip(parsed.warnings));
    applyData({ ...parsed, rawText: text, sourceLabel, edited });
    return true;
  }

  const SOURCE_LIST = CSV_SOURCES.map((s) => s.file).join(', ');

  /* Mapeo manual de respaldo, por si el sniffer no acierta con el export real
     de IT: `datos/adaptador.json` fija perfil y columnas sin tocar código.
     Ausente el archivo (lo normal hoy) → todo funciona por autodetección. */
  let adapterCfg = null;
  let cfgPedida = false;
  let cfgAviso = null; // JSON presente pero ilegible: hay que decirlo, no ignorarlo
  async function loadAdapterCfg() {
    if (cfgPedida) return adapterCfg;
    cfgPedida = true;
    try {
      const res = await fetch(`datos/adaptador.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) return adapterCfg; // ausente = autodetección, el caso normal
      adapterCfg = JSON.parse(await res.text());
    } catch (e) {
      adapterCfg = null;
      cfgAviso = `datos/adaptador.json existe pero no se pudo leer (${e.message}) — se sigue por autodetección`;
    }
    return adapterCfg;
  }

  /* El perfil solo se nombra cuando NO es el de siempre: en operación normal el
     pill no cambia, y el día que IT mande una tabla se lee `● HMI CSV · tabla`. */
  function etiquetaPerfil(perfiles) {
    // `desconocido` no se nombra aquí: ya sale como `✖ archivo` y su explicación.
    const raros = [...new Set(perfiles.filter((p) => p && p !== 'kv' && p !== 'desconocido'))];
    return raros.length ? ` · ${raros.join('+')}` : '';
  }

  function markServerDown() {
    failStreak += 1;
    if (failStreak < 2) return;
    if (lastGood) setStatus('error', `● CSV · reconectando… (último ${fmtTime(lastGood)})`, `No se encuentra ninguno de: ${SOURCE_LIST}`);
    else setStatus('idle', '● CSV · sin conexión', `Conecta un archivo CSV o verifica: ${SOURCE_LIST}`);
  }

  /* Lee TODOS los CSV declarados y los concatena en un solo documento con una
     marca `# @origen:` por bloque. Cada servidor WinCC escribe su propio
     archivo; los que falten se ignoran sin romper nada (así el simulador sigue
     andando con solo `datos/hmi.csv`, como antes). El orden de CSV_SOURCES es
     la precedencia: el último que define un parámetro gana, y la colisión
     queda avisada por `parseHmiCsv`. */
  async function pollServer() {
    const stamp = Date.now();
    const cfgAll = await loadAdapterCfg();
    const fetched = await Promise.all(CSV_SOURCES.map(async (src) => {
      try {
        const res = await fetch(`${src.file}?t=${stamp}`, { cache: 'no-store' });
        if (!res.ok) return null;
        const text = await res.text();
        /* Last-Modified = cuándo se ESCRIBIÓ el archivo en el servidor. Lo
           sirven tanto http.server como Vercel; si falta (o el proxy lo
           borra), simplemente no se usa esta evidencia. */
        const lm = Date.parse(res.headers.get('Last-Modified') ?? '');
        return text.trim() ? { src, text, lm: Number.isFinite(lm) ? lm : null } : null;
      } catch {
        return null; // fuente ausente u offline: no es un error, es opcional
      }
    }));
    const parts = fetched.filter(Boolean);
    if (parts.length === 0) { if (mode === 'server') markServerDown(); return false; }
    mode = 'server';
    lastReadMs = Date.now(); // leímos el CSV con éxito (cambie o no su contenido)
    /* Dirección visible = el archivo que MANDA (el de mayor precedencia que
       no sea el de defaults), porque es el que trae el dato vivo y el que hay
       que revisar cuando algo no cuadra. Las rutas completas de todos los
       archivos van en el tooltip, para poder dictárselas a IT por teléfono. */
    const urls = parts.map(({ src }) => {
      try { return new URL(src.file, window.location.href).href; } catch { return src.file; }
    });
    const vivos = parts.filter(({ src }) => src.label !== DEFAULTS_LABEL);
    const manda = (vivos.length ? vivos : parts)[Math.max(0, (vivos.length ? vivos : parts).length - 1)];
    const otros = parts.length - 1;
    setConnected('servidor',
      `${manda.src.file}${otros > 0 ? ` (+${otros})` : ''}`,
      `Leyendo cada ${POLL_MS / 1000} s de:\n${urls.join('\n')}`);
    /* Cada archivo se adapta POR SEPARADO: un servidor puede exportar tabla y
       otro seguir en `TAG: valor;`, y el mapeo manual se declara por archivo. */
    const avisos = cfgAviso ? [cfgAviso] : [];
    const perfiles = [];
    const bloques = [];
    const fallos = [];
    const evidencias = [];
    for (const { src, text, lm } of parts) {
      const base = src.file.split('/').pop();
      const ad = adaptarCsv(text, cfgAll?.[base] ?? cfgAll?.[src.file] ?? null);
      perfiles.push(ad.perfil);
      for (const a of ad.avisos) avisos.push(`${base}: ${a}`);
      if (ad.error) fallos.push(base);
      if (ad.texto.trim()) bloques.push(`# @origen: ${src.label}\n${ad.texto.replace(/\s*$/, '')}\n`);
      /* Evidencia de frescura por archivo, para decidirla DESPUÉS del bucle. */
      if (ad.instante != null) evidencias.push({ ms: ad.instante, fuente: 'dato', base, label: src.label });
      if (lm != null) evidencias.push({ ms: lm, fuente: 'archivo', base, label: src.label });
    }
    /* El archivo de defaults (`hmi.csv`) es una plantilla versionada en git,
       no un dato vivo: su fecha solo se usa si NO hay ninguna otra fuente.
       Si contara siempre, un `git checkout` (que le pone mtime de hoy) diría
       "actualizado hace 2 s" con el HMI caído. */
    const vivas = evidencias.filter((e) => e.label !== DEFAULTS_LABEL);
    /* `archivo` ANTES que `dato`: así la guarda anti-parseo-erróneo de setFresh
       ya conoce el Last-Modified cuando evalúa la fecha del dato. */
    const ordenadas = (vivas.length ? vivas : evidencias).slice().sort((a, b) => RANGO_FUENTE[a.fuente] - RANGO_FUENTE[b.fuente]);
    for (const e of ordenadas) {
      setFresh(e.ms, e.fuente, e.fuente === 'dato' ? `Columna de tiempo de ${e.base}.` : `Last-Modified de ${e.base}.`);
    }
    const combined = bloques.join('\n');
    const label = `HMI CSV${parts.length > 1 ? ` · ${parts.length} servidores` : ''}${etiquetaPerfil(perfiles)}`;
    const changed = applyText(combined, label, false, avisos, fallos);
    /* Solo el caso "sin cambios" refresca el pill en vivo; un 'error' de
       formato debe quedar visible hasta que llegue un CSV válido.
       Los warnings se re-emiten aquí a propósito: un conflicto entre servidores
       es permanente mientras el CSV no cambie, así que no puede desaparecer del
       pill en el siguiente sondeo. */
    if (changed === false && lastGood) {
      const warn = lastWarnings.length ? ` · ⚠ ${lastWarnings.length}` : '';
      setStatus(lastFallos.length ? 'error' : 'live',
        lastFallos.length
          ? `● ${label} · ${fmtTime(lastGood)} · ${lastCount} tags · ✖ ${lastFallos.join(', ')}`
          : `● ${label} · ${fmtTime(lastGood)} · ${lastCount} tags${warn}`,
        lastWarnings.length ? tooltip(lastWarnings) : 'Contenido sin cambios; última lectura válida.');
    }
    return true;
  }

  let lastModified = 0;
  let livePerfil = 'kv'; // perfil del archivo local conectado (ver persistConnectedFile)
  /* El HMI reescribe el CSV cada pocos minutos. En el instante de la escritura,
     una lectura puede caer vacía o a medias: eso NO es una desconexión, es el
     archivo cambiando. Un solo fallo se ignora y se reintenta al próximo sondeo,
     conservando el último dato bueno (el pill NO parpadea a rojo). Solo un fallo
     SOSTENIDO (varios sondeos seguidos) se reporta como problema real. */
  let fileFailStreak = 0;
  const FILE_FAIL_AVISO = 3; // sondeos seguidos fallando antes de avisar (~6 s)
  async function pollFile() {
    if (!fileHandle) return;
    try {
      const file = await fileHandle.getFile();
      lastReadMs = Date.now(); // accedimos al archivo local con éxito
      if (file.lastModified === lastModified) return;
      const text = await file.text();
      const ad = text.trim() ? adaptarCsv(text, adapterCfg?.[file.name] ?? null) : null;
      /* Archivo vacío / a medio escribir / ilegible → transitorio: no se toca
         el último dato bueno ni el pill; se reintenta en el siguiente sondeo.
         Tampoco se avanza lastModified, para releerlo cuando termine de escribir. */
      if (!ad || ad.error || !ad.texto.trim()) {
        fileFailStreak += 1;
        if (fileFailStreak >= FILE_FAIL_AVISO && lastGood) {
          setStatus('error', `● CSV local · reintentando… (último ${fmtTime(lastGood)})`,
            'El archivo está vacío o a medio escribir hace varios segundos. Se conserva la última lectura buena.');
        }
        return;
      }
      lastModified = file.lastModified;
      fileFailStreak = 0;
      livePerfil = ad.perfil;
      applyText(ad.texto, `CSV local${etiquetaPerfil([ad.perfil])}`, true, ad.avisos, ad.error ? [file.name] : []);
      setFresh(file.lastModified, 'archivo', `Última escritura de ${file.name}.`);
      if (ad.instante != null) setFresh(ad.instante, 'dato', `Columna de tiempo de ${file.name}.`);
      setConnected('archivo', file.name, `Archivo local en vivo: ${file.name}\nSe relee cada ${POLL_MS / 1000} s y se aplica en cuanto cambie.\nClick para conectar otro.`);
    } catch {
      /* getFile() puede fallar si el HMI tiene el archivo abierto en exclusiva
         mientras lo reescribe: mismo criterio, se tolera un fallo puntual. */
      fileFailStreak += 1;
      if (fileFailStreak >= FILE_FAIL_AVISO) {
        setStatus('error', '● CSV local · no accesible', 'No se pudo leer el archivo varias veces seguidas. Vuelve a conectarlo si el problema sigue.');
      }
    }
  }

  async function resumeHandle(handle) {
    fileHandle = handle;
    pendingHandle = null;
    mode = 'live-file';
    lastModified = 0;
    lastText = null;
    fileFailStreak = 0;
    await idbSaveHandle(handle);
    await pollFile();
  }

  async function connectFile() {
    /* Reconexión de un clic: hay un archivo recordado de antes del refresco cuyo
       permiso el navegador pidió re-confirmar. Se re-pide el permiso sobre ESE
       mismo handle (no se re-elige archivo). */
    if (pendingHandle) {
      try {
        const perm = await pendingHandle.requestPermission?.({ mode: 'read' });
        if (perm === 'granted') { await resumeHandle(pendingHandle); return; }
      } catch { /* cae al selector normal */ }
      pendingHandle = null;
    }
    if ('showOpenFilePicker' in window) {
      try {
        const [handle] = await window.showOpenFilePicker({
          types: [{ description: 'CSV del modelo NOVOPAN', accept: { 'text/csv': ['.csv'], 'text/plain': ['.txt'] } }],
        });
        await resumeHandle(handle);
      } catch { /* cancelado por el usuario */ }
    } else if (fileInput) {
      fileInput.click();
    }
  }

  async function persistConnectedFile() {
    if (!fileHandle?.createWritable || !currentText) return;
    /* El documento en memoria está en canónico. Si el archivo conectado venía
       en otro formato (el export real de IT), NO se reescribe: cambiarle el
       formato al archivo de IT lo rompería y el próximo export lo pisaría igual.
       El cambio queda solo en pantalla (simulación), no toca el archivo. */
    if (livePerfil !== 'kv') {
      setStatus('manual', `● Cambio solo en pantalla · el archivo de IT no se toca`,
        `El archivo conectado viene en formato "${livePerfil}" (export de IT); no se reescribe para no cambiarle el formato. El valor editado es una simulación en pantalla y se pierde cuando el HMI vuelva a escribir el CSV.`);
      return;
    }
    try {
      const writable = await fileHandle.createWritable();
      await writable.write(currentText);
      await writable.close();
      const file = await fileHandle.getFile();
      lastModified = file.lastModified;
      setStatus('manual', `● CSV local guardado · ${fmtTime(new Date())} · ${lastCount} tags`, 'El modelo fue actualizado únicamente a través del CSV conectado.');
    } catch {
      setStatus('manual', '● Cambio solo en pantalla', 'El navegador no obtuvo permiso para sobrescribir el archivo local; el valor editado queda solo en la simulación.');
    }
  }

  function scheduleFileWrite() {
    clearTimeout(writeTimer);
    if (!fileHandle) return;
    writeTimer = setTimeout(persistConnectedFile, WRITE_DEBOUNCE_MS);
  }

  /* Si el CSV vino de IT con nombres de WinCC, la edición debe reescribir
     ESA fila — no agregar una segunda con nuestro nombre canónico. */
  function tagPresentIn(text, key) {
    const canon = TAG_BY_KEY[key];
    if (!canon) return null;
    const has = (name) => new RegExp(`(^|[;\\n\\r])[ \\t]*${escapeRegExp(name)}[ \\t]*:`, 'im').test(text);
    if (has(canon)) return canon;
    for (const [wincc, value] of Object.entries(WINCC_ALIAS)) {
      if (aliasTarget(value).tag === canon && has(wincc)) return wincc;
    }
    return canon;
  }

  function updateKey(key, value) {
    const tag = tagPresentIn(currentText, key);
    let numeric = Number(value);
    if (!tag || !Number.isFinite(numeric) || numeric < 0 || !currentText) return false;
    /* Si la fila del archivo es un alias con conversión de unidad (kg/h→kg/min),
       la UI edita en unidades del modelo: se escribe el valor DES-escalado para
       que el documento siga en la unidad cruda del servidor. */
    const aliasValue = WINCC_ALIAS[tag];
    if (aliasValue !== undefined) {
      const { scale } = aliasTarget(aliasValue);
      if (scale !== 1 && scale > 0) numeric = numeric / scale;
    }
    mode = 'edited';
    const next = updateCsvTag(currentText, tag, numeric);
    applyText(next, fileHandle ? 'CSV local editado' : 'CSV editado en memoria', true);
    scheduleFileWrite();
    return true;
  }

  async function reloadServer() {
    mode = 'off';
    fileHandle = null;
    pendingHandle = null;
    lastText = null;
    currentText = '';
    // Desconexión explícita del archivo local: se olvida para que no vuelva a
    // reconectarse solo al refrescar.
    await idbClearHandle();
    await pollServer();
  }

  fileInput?.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    mode = 'manual-file';
    fileHandle = null;
    lastText = null;
    const ad = adaptarCsv(await file.text(), adapterCfg?.[file.name] ?? null);
    applyText(ad.texto, `CSV manual${etiquetaPerfil([ad.perfil])}`, true, ad.avisos, ad.error ? [file.name] : []);
    setFresh(file.lastModified, 'archivo', `Última escritura de ${file.name}.`);
    if (ad.instante != null) setFresh(ad.instante, 'dato', `Columna de tiempo de ${file.name}.`);
    /* Copia estática: el navegador no puede volver a leerla sola. Se dice, para
       que nadie crea que está viendo la línea en vivo. */
    setConnected('manual', file.name, `Copia cargada a mano: ${file.name}\nNO se actualiza sola — vuelve a cargarla para ver datos nuevos.`);
    fileInput.value = '';
  });
  connectBtn?.addEventListener('click', connectFile);

  /* ¿Había un CSV local conectado antes del refresco? Se recupera su handle y,
     si el permiso sigue vigente, se reanuda SOLO (no se desconecta al refrescar).
     Si el navegador pide re-confirmar, se deja el botón en «Reconectar CSV» para
     un único clic (sin re-elegir el archivo). */
  async function restoreConnection() {
    const saved = await idbLoadHandle();
    if (!saved) return false;
    try {
      const perm = await saved.queryPermission?.({ mode: 'read' });
      if (perm === 'granted') {
        await resumeHandle(saved);
        return true;
      }
      // Permiso a re-confirmar: se recuerda el handle y se ofrece reconectar.
      pendingHandle = saved;
      setConnected('reconnect', saved.name ?? 'CSV local',
        `Antes tenías conectado «${saved.name ?? 'un CSV local'}». El navegador pide re-confirmar el acceso.\nUn clic para reconectar al MISMO archivo.`);
      return false;
    } catch {
      // Handle inválido (archivo movido/borrado): se olvida y se sigue normal.
      await idbClearHandle();
      return false;
    }
  }

  (async () => {
    const resumed = await restoreConnection();
    if (!resumed) {
      const ok = await pollServer();
      if (!ok && mode !== 'live-file') {
        setStatus('idle', '● CSV · sin conexión', 'Conecta un archivo CSV o verifica datos/hmi.csv.');
        if (!pendingHandle) setConnected('off', '');
      }
      /* Hay un archivo por reconectar: el botón debe seguir invitando a
         reconectar aunque el servidor tenga CSV (que sería el de defaults,
         no el archivo del operador). `pollServer` acaba de pisar el botón con
         «Conectado (servidor)», así que se re-afirma el estado de reconexión. */
      if (pendingHandle) {
        setConnected('reconnect', pendingHandle.name ?? 'CSV local',
          `Antes tenías conectado «${pendingHandle.name ?? 'un CSV local'}». El navegador pide re-confirmar el acceso.\nUn clic para reconectar al MISMO archivo.`);
      }
    }
    setInterval(() => {
      if (mode === 'live-file') pollFile();
      else if (mode === 'server' || mode === 'off') pollServer();
    }, POLL_MS);
  })();

  return {
    updateKey,
    reloadServer,
    getText: () => currentText,
    getTagForKey: (key) => TAG_BY_KEY[key] ?? null,
    getFreshness: () => ({ ...fresh }),
  };
}
