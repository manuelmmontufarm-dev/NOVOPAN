// Guía de Campo — full IJP-REC-001 operator guide.
// Keeps Claude's original Novopan design system and expands the real IJP flow.
const DS = window.NovopanInstructivosDesignSystem_ed66c5;
const { SectionHeader, ActivityStep, Checklist, Callout, InfoTable, ProcessCard, FlowDiagram, Badge, KeyCap, Icon } = DS;

const IMG = './NOVOPNHTML1_files/assets/ijp/';
const RM_IMG = './NOVOPNHTML1_files/assets/recepcion_madera/';

const goToSection = (id) => {
  window.dispatchEvent(new CustomEvent('guia:navigate', { detail: id }));
};

const Stack = ({ children, gap = 20 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>
);

const Lead = ({ children }) => (
  <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--fs-body-lg)', color: 'var(--text-body)', lineHeight: 'var(--lh-relaxed)', maxWidth: 820 }}>{children}</p>
);

const InlineTitle = ({ children, icon = 'check_circle' }) => (
  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-h4)', color: 'var(--text-strong)', lineHeight: 1.2 }}>
    <Icon name={icon} size={26} color="var(--novopan-green)" />
    {children}
  </h3>
);

const Card = ({ title, icon, children, tone = 'plain', footer, style = {} }) => {
  const toneStyles = {
    plain: { border: '2px solid var(--line-200)', background: 'var(--surface-card)' },
    green: { border: '2px solid var(--ok-border)', background: 'var(--ok-bg)' },
    yellow: { border: '2px solid var(--warn-border)', background: 'var(--warn-bg)' },
    red: { border: '2px solid var(--danger-border)', background: 'var(--danger-bg)' },
    blue: { border: '2px solid var(--info-border)', background: 'var(--info-bg)' },
  };
  const s = toneStyles[tone] || toneStyles.plain;
  return (
    <div style={{ ...s, borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)', ...style }}>
      {title && <InlineTitle icon={icon}>{title}</InlineTitle>}
      <div style={{ marginTop: title ? 12 : 0, fontFamily: 'var(--font-body)', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-relaxed)', color: 'var(--text-body)' }}>
        {children}
      </div>
      {footer && <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>{footer}</div>}
    </div>
  );
};

const Grid = ({ children, min = 260, gap = 16 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap, alignItems: 'start' }}>{children}</div>
);

const List = ({ items, ordered = false }) => {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag style={{ margin: 0, paddingLeft: ordered ? 28 : 24 }}>
      {items.map((item, i) => (
        <li key={i} style={{ margin: i ? '8px 0 0' : 0 }}>{item}</li>
      ))}
    </Tag>
  );
};

const PillGrid = ({ items, tone = 'neutral' }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
    {items.map((item, i) => <Badge key={i} tone={tone}>{item}</Badge>)}
  </div>
);

const ImageFigure = ({ src, caption, tall = false, base = IMG }) => (
  <figure style={{ margin: 0, background: 'var(--surface-card)', border: '2px solid var(--line-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
    <div style={{ background: 'var(--surface-sunken)', display: 'flex', justifyContent: 'center', padding: tall ? 16 : 12 }}>
      <img
        src={base + src}
        alt={caption}
        style={{ display: 'block', width: tall ? 'min(100%, 480px)' : '100%', maxHeight: tall ? 760 : 460, objectFit: 'contain', borderRadius: 6 }}
      />
    </div>
    {caption && (
      <figcaption style={{ padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-small)', fontWeight: 700, color: 'var(--text-muted)', lineHeight: 'var(--lh-normal)' }}>
        {caption}
      </figcaption>
    )}
  </figure>
);

const RMFigure = (props) => <ImageFigure base={RM_IMG} {...props} />;

const StepBlock = ({ n, title, icon, children, keyName, tone }) => (
  <ActivityStep number={n} title={title} icon={icon} systemKey={keyName} style={tone === 'warn' ? { borderColor: 'var(--warn-border)', background: 'var(--warn-bg)' } : undefined}>
    {children}
  </ActivityStep>
);

const MiniFact = ({ label, value, icon = 'info' }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 16, background: 'var(--surface-card)', border: '2px solid var(--line-200)', borderRadius: 'var(--radius-md)' }}>
    <span style={{ flex: '0 0 auto', width: 48, height: 48, borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-sunken)' }}>
      <Icon name={icon} size={28} color="var(--novopan-green)" />
    </span>
    <span>
      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-caption)', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wide)' }}>{label}</span>
      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h4)', fontWeight: 800, color: 'var(--text-strong)', lineHeight: 1.15 }}>{value}</span>
    </span>
  </div>
);

const FlowGrid = ({ steps }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
    {steps.map((step, i) => (
      <div key={step.label} style={{ position: 'relative', minHeight: 112, padding: '12px 10px 10px', background: 'var(--surface-card)', border: '2px solid var(--novopan-green)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
        <span style={{ position: 'absolute', top: 8, left: 10, width: 26, height: 26, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--novopan-yellow)', color: 'var(--novopan-green)', fontFamily: 'var(--font-display)', fontWeight: 900 }}>{i + 1}</span>
        <span style={{ width: 42, height: 42, margin: '2px auto 8px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--novopan-green)' }}>
          <Icon name={step.icon} size={28} color="var(--novopan-yellow)" />
        </span>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, color: 'var(--text-strong)', textTransform: 'uppercase', lineHeight: 1.12 }}>{step.label}</div>
        <div style={{ marginTop: 4, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.15 }}>{step.caption}</div>
      </div>
    ))}
  </div>
);

const defs = [
  ['Balanza 2 (BPS2)', 'Balanza camionera dedicada al ingreso de camiones.'],
  ['Balanza 1 (PS1)', 'Balanza camionera dedicada a la salida de camiones.'],
  ['Sistema ANI', 'Sistema donde se registra el ingreso, el peso y todos los datos del embarque.'],
  ['QR forestal', 'Código del proveedor con datos de bosque, transporte, cosechador, categoría y especie.'],
  ['Guía de circulación', 'Documento forestal obligatorio para transportar madera, exigido por MAATE.'],
  ['Guía de madera', 'Documento del proveedor con la descripción del producto despachado.'],
  ['Guía de remisión', 'Documento tributario que ampara el traslado del material.'],
  ['RJP-01', 'Comprobante de peso generado por el sistema ANI.'],
  ['LEF-01', 'Lista de precios y forma de pago autorizada por Gerencia.'],
  ['Patio interno', 'Patios 5, 6, 7, 8 y 21.'],
  ['Patio externo', 'De los 21 patios, cualquier patio que no sea 5, 6, 7, 8 o 21. Requiere pase de control.'],
  ['Ruma', 'Apilamiento de madera formando una unidad.'],
  ['Tonelada húmeda', '1000 kg de madera húmeda medida con balanza camionera.'],
  ['Tonelada seca', '1000 kg de madera sin humedad, calculada con humedad de balanza analítica.'],
  ['Metro cúbico estéreo', 'Largo x ancho x altura.'],
  ['Metro cúbico neto', 'm3 estéreo x factor de apilamiento.'],
];

const roleCards = [
  ['Operador de balanza', 'Recibe el camión, captura el peso, registra el ingreso en ANI y toma muestra cuando corresponde.', 'balance'],
  ['Ayudante de balanza', 'Apoya en horas pico y en la toma de muestras.', 'groups'],
  ['Operador de máquina de descarga', 'Descarga en patio, registra Factory Track y toma foto del camión vacío para WhatsApp.', 'construction'],
  ['Conductor', 'Presenta documentos, ubica el camión donde se le indique y sale 15 a 20 minutos después de descargar.', 'local_shipping'],
  ['Supervisor de preparación de madera', 'Verifica el cumplimiento, autoriza excepciones y atiende fuerza mayor.', 'verified_user'],
  ['Jefe de Patios y auxiliar de inventario', 'Definen patios, esquema diario y asignación de rumas.', 'warehouse'],
  ['Departamento Forestal', 'Mantiene LEF-01 y autoriza precios.', 'forest'],
  ['Sistema de Gestión', 'Mantiene el IJP actualizado y asegura la trazabilidad ISO.', 'assignment_turned_in'],
  ['Departamento Contable', 'Crea códigos INFOR. Recepción agrupa y traslada datos.', 'calculate'],
];

function AntesDeRecibir() {
  return (
    <Stack>
      <SectionHeader number="1" eyebrow="IJP-REC-001" title="Antes de recibir" icon="menu_book" />
      <Lead>Primero entienda el flujo, los nombres usados en el IJP y quien toma cada decisión. Esto evita dudas cuando el camión ya está en balanza.</Lead>

      <ProcessCard code="Vista general" title="Qué cubre esta guía" icon="route">
        <p style={{ marginTop: 0 }}>Esta guía explica cómo recibir un camión, registrar el ingreso, tomar muestras, asignar patio, cerrar el ingreso y registrar la descarga.</p>
        <FlowGrid steps={[
          { label: 'Llega camión', icon: 'local_shipping', caption: 'BPS2' },
          { label: 'Documentos', icon: 'description', caption: 'Guía y QR / código' },
          { label: 'Datos ANI', icon: 'edit_note', caption: 'Llenar primero' },
          { label: 'Peso entrada', icon: 'balance', caption: 'F4 cuando aplica' },
          { label: 'Humedad', icon: 'science', caption: 'Muestra' },
          { label: 'Cierre', icon: 'save', caption: 'F12 + F5' },
          { label: 'Patio', icon: 'warehouse', caption: 'Asignado' },
          { label: 'Descarga + FT', icon: 'phone_android', caption: 'Foto + transferencia' },
        ]} />
        <Callout variant="nota" title="Orden real">
          Primero se llenan/revisan los datos del ingreso y luego se captura el peso cuando corresponde en ANI. No es "ver camión → capturar peso" como primer acto absoluto.
        </Callout>
      </ProcessCard>

      <Callout variant="advertencia" title="Regla de oro">
        El camión NO puede pasar a descargar hasta que ANI genere el número de ingreso.
      </Callout>

      <InfoTable
        caption="Definiciones que debe conocer"
        columns={[{ label: 'Término', width: '28%' }, 'Significado para el operador']}
        rows={defs}
      />

      <div>
        <InlineTitle icon="groups">Quién hace qué</InlineTitle>
        <Grid min={250} gap={14}>
          {roleCards.map(([role, text, icon]) => (
            <Card key={role} title={role} icon={icon}>
              {text}
            </Card>
          ))}
        </Grid>
      </div>
    </Stack>
  );
}

function IngresoBalanza() {
  return (
    <Stack>
      <SectionHeader number="2" eyebrow="IJP-REC-001" title="Ingreso en balanza" icon="balance" />
      <Lead>Siga estos pasos en orden. Aquí se decide si el camión entra al flujo normal o si debe pasar a excepción.</Lead>

      <Callout variant="nota" title="Esta parte es para el operador de balanza">
        Use esta sección para recibir al conductor, revisar documentos, capturar el peso y dejar creado el número de ingreso en ANI antes de liberar el camión.
      </Callout>

      <StepBlock n="4.1" title="Llegada del camión" icon="local_shipping">
        <List ordered items={[
          'El camión entra y se ubica en Balanza 2.',
          'Identifique el tipo de carga antes de capturar el peso.',
        ]} />
        <div style={{ marginTop: 12 }}>
          <PillGrid tone="neutral" items={['Rollizo', 'Subproducto', 'Combustible', 'Reciclado', 'Residuo']} />
        </div>
        <Callout variant="nota" title="Subproductos incluidos" style={{ marginTop: 12 }}>
          Chip, aserrín, viruta, lamina, jampa y retazo.
        </Callout>
      </StepBlock>

      <Callout variant="excepcion" title="Cuando no es flujo normal">
        Si la carga es combustible, residuo o trasbordo, revise Excepciones antes de continuar.
      </Callout>

      <Checklist title="Antes de pesar" items={[
        'La balanza muestra cero.',
        'El camión está totalmente sobre la plataforma.',
        'No hay objetos tocando la balanza.',
      ]} />

      <StepBlock n="4.2" title="Capturar peso de entrada" icon="scale" keyName="F4">
        Presione F4 en ANI. Luego compare visualmente que el peso capturado coincida con el peso que muestra la balanza.
      </StepBlock>

      <Card title="4.3 Recibir documentos" icon="description">
        <InfoTable
          columns={[{ label: 'Tipo de proveedor', width: '34%' }, 'Documentos que debe entregar']}
          rows={[
            ['Propio - madera rolliza', 'Guía de circulación forestal + Guía de madera + Guía de remisión.'],
            ['Tercero - madera rolliza', 'Solo Guía de circulación forestal.'],
            ['Subproductos de terceros', 'Documentos según normativa + factura para Contabilidad.'],
          ]}
        />
        <Callout variant="advertencia" title="Aserrín" style={{ marginTop: 14 }}>
          Para aserrín, pida al conductor la fotografía del producto que <strong>envía por WhatsApp con la geolocalización activada</strong>. La foto debe mostrar el punto más lejano donde se hizo la carga. Archive la imagen en la oficina de balanza con el nombre del número de entrada.
        </Callout>
      </Card>

      <StepBlock n="4.4" title="Identificar conductor" icon="badge">
        Si el camión va a un patio diferente de 5, 6, 7, 8 o 21, trátelo como patio externo: retenga la cédula y entregue pase de control. Si va a patio 5, 6, 7, 8 o 21, continúe el flujo normal de patio interno.
      </StepBlock>

      <Card title="4.5 Ingreso de datos en ANI" icon="computer" tone="blue">
        <p style={{ marginTop: 0 }}>Esta es la versión resumida del registro en ANI. Primero elija el tipo de proveedor, luego defina si el ingreso viene con QR o se llena manualmente.</p>
        <Grid min={260} gap={12}>
          <Card title="Tipo de proveedor" icon="person_search">
            <PillGrid tone="info" items={['Propios', 'Terceros', 'Vuelo Forestal']} />
          </Card>
          <Card title="Propios / Vuelo Forestal: QR forestal" icon="qr_code_2" tone="green">
            Escanee el <strong>QR forestal</strong> (propios y vuelo forestal). Revise lo que ANI llenó solo y complete los campos verdes que falten.
          </Card>
          <Card title="Terceros: código de barras" icon="qr_code_scanner" tone="blue">
            <strong>Terceros usa código de barras del proveedor, no QR forestal.</strong> El código ayuda a llenar datos del proveedor, pero varios campos siguen manuales (placa, transportista, especie, categoría, ubicación, observación con aserradero).
          </Card>
          <Card title="Sin QR / sin código / falla" icon="edit_note" tone="yellow">
            Llene manualmente <strong>placa, proveedor, transportista, servicio de explotación (mano de obra), categoría, especie, ubicación de descarga y operador de entrada</strong>. Si hace ingreso manual, avise a supervisores. <strong>No todos los casos "sin QR" son terceros</strong> — propios y vuelo forestal también pueden venir sin QR.
          </Card>
        </Grid>
        <Checklist title="Puntos que no se saltan" items={[
          'Verifique placa, ubicación de descarga y operador.',
          'Si el ingreso fue manual, avise a supervisores.',
          'Capture el peso con F4 cuando la balanza esté en cero y el camión esté bien ubicado.',
          'Si el camión trae guía de circulación forestal, escanee el QR de esa guía.',
          'Guarde con F5 solo cuando los datos estén completos y correctos.',
        ]} />
        <button className="screen-nav-button" onClick={() => goToSection('recepcion')} style={{
          marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          minHeight: 'var(--touch-min)', padding: '0 22px', borderRadius: 'var(--radius-pill)',
          border: '2px solid var(--novopan-green)', background: 'var(--novopan-green)', color: '#fff',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-body)',
          textTransform: 'uppercase', letterSpacing: '0.02em',
        }}>
          Ver guía detallada de recepción de madera <Icon name="arrow_forward" size={24} color="#fff" />
        </button>
      </Card>

      <Card title="4.6 Validar guía" icon="fact_check">
        <p style={{ marginTop: 0 }}>ANI verifica automáticamente que la guía no esté duplicada antes de dejar entrar el camión.</p>
        <Callout variant="prohibido" title="Si ANI rechaza la guía">
          <List ordered items={[
            'Informe al conductor.',
            'Baje el camión de la balanza.',
            'El proveedor debe reemitir una guía nueva.',
            'No permita la entrada con guía repetida.',
          ]} />
        </Callout>
      </Card>

      <Checklist title="Repaso rápido - operador de balanza" items={[
        'Ya identifiqué el tipo de carga.',
        'Ya revisé los documentos del conductor.',
        'Ya seleccioné el tipo de proveedor en ANI.',
        'Ya decidí si el ingreso va con QR o manual.',
        'Si fue manual, ya avisé a supervisores.',
        'Ya completé los campos verdes que faltaban.',
        'Ya validé que la guía no esté repetida.',
        'Ya capturé el peso con F4.',
        'Ya escaneé el QR de guía forestal cuando el documento lo trae.',
        'Ya confirmé si el patio es interno (5, 6, 7, 8 o 21) o externo (cualquier otro patio).',
        'Todavía debo seguir con humedad, patio y cierre cuando correspondan.',
      ]} />
    </Stack>
  );
}

function RecepcionMaderaDetalle() {
  return (
    <Stack>
      <SectionHeader number="3" eyebrow="Apoyo para 4.5" title="Recepción de madera ANI" icon="computer" />
      <Lead>Use esta sección cuando necesite ver con más detalle cómo llenar ANI. La idea es simple: escoger el tipo de proveedor, usar QR cuando exista, completar campos verdes y guardar el ingreso.</Lead>

      <Callout variant="nota" title="Guía detallada para el operador de balanza">
        Esta sección resume el documento de Recepción de Madera. Las imágenes muestran pantallas reales de ANI para reconocer dónde hacer clic o qué revisar.
      </Callout>

      <Grid min={260}>
        <MiniFact label="Tipos de ingreso" value="Propios, Terceros, Vuelo Forestal" icon="person_search" />
        <MiniFact label="Ruta rápida" value="Con QR" icon="qr_code_2" />
        <MiniFact label="Ruta manual" value="Sin QR o QR fallido" icon="edit_note" />
      </Grid>

      <Card title="Antes de empezar en ANI" icon="fact_check" tone="blue">
        <List ordered items={[
          'Revise si el proveedor es Propios, Terceros o Vuelo Forestal.',
          'Si hay QR, escanéelo con el lector de la oficina de balanza.',
          'Los campos verdes son los que el operador debe llenar o revisar.',
          'Los campos grises pueden venir como ejemplo o llenarse solos desde el QR.',
          'No permita descargar si ANI rechaza la guía o no existe número de ingreso.',
        ]} />
      </Card>

      <div>
        <InlineTitle icon="forest">Propios - con QR</InlineTitle>
        <Stack gap={16}>
          <Card title="1. Seleccione Tipo de Proveedor: Propios" icon="person">
            <p style={{ marginTop: 0 }}>El QR es generado por el área forestal. Al escanearlo, ANI prellena automáticamente <strong>bosque, transporte, cosechador, categoría y especie</strong>. Revise los campos verdes — algunos casos pueden variar (consultar la guía ANI).</p>
            <Grid min={400}>
              <RMFigure src="image5.png" caption="Tipo de proveedor: Propios." />
              <RMFigure src="image14.png" caption="Datos que ANI llena desde el QR." />
              <RMFigure src="image24.png" caption="Revise que los datos automáticos estén correctos." />
            </Grid>
          </Card>
          <Card title="2. Complete lo que queda a mano" icon="edit_note">
            <List items={[
              'Placa del camión.',
              'Ubicación de descarga.',
              'Operador de entrada.',
              'Operadores y maquinaria cuando aplique.',
            ]} />
            <div style={{ marginTop: 14 }}>
              <RMFigure src="image9.png" caption="Campos verdes que el operador completa manualmente." />
            </div>
          </Card>
          <Card title="3. Capture peso y guarde" icon="keyboard" tone="green">
            <List ordered items={[
              'Con campos listos, presione F4 para capturar peso.',
              'Confirme con OK cuando el peso esté correcto.',
              'Si el ingreso tiene guía de circulación forestal, escanee el QR de esa guía.',
              'Complete fecha de inicio y fecha fin si ANI no las llena.',
              'Presione F5 para guardar y generar el número de entrada.',
              'Anote el número en la guía de madera y devuélvala al conductor.',
            ]} />
            <Grid min={310} gap={12}>
              <RMFigure src="image11.png" caption="Capturar peso con F4." />
              <RMFigure src="image7.png" caption="Confirmación del peso en ANI." />
              <RMFigure src="image10.png" caption="Datos automáticos de licencia de movilización." />
              <RMFigure src="image8.png" caption="Fechas de la guía cuando deben llenarse manualmente." />
              <RMFigure src="image15.png" caption="Guardar con F5." />
              <RMFigure src="image4.png" caption="Número de entrada generado por ANI." />
            </Grid>
          </Card>
          <Card title="Propios sin QR" icon="edit_note" tone="yellow">
            <List ordered items={[
              'Seleccione Tipo de Proveedor: Propios.',
              <span>Llene manualmente los datos que normalmente llegarían desde el QR: <strong>placa, proveedor, transportista, servicio de explotación (mano de obra), bosque, cosechador, categoría, especie y ubicación de descarga</strong>.</span>,
              'Complete operador de entrada y, cuando aplique, operadores y maquinaria.',
              'Capture peso con F4.',
              'Escanee el QR de la guía forestal cuando el documento lo trae (es obligatorio por MAATE).',
              'Guarde con F5 y anote el número de ingreso. Entre otros campos pueden variar — consultar la guía ANI.',
            ]} />
          </Card>
        </Stack>
      </div>

      <div>
        <InlineTitle icon="local_shipping">Terceros - con código de barras</InlineTitle>
        <Stack gap={16}>
          <Card title="1. Seleccione Tipo de Proveedor: Terceros" icon="person_search">
            <p style={{ marginTop: 0 }}><strong>Terceros usa código de barras del proveedor (no QR forestal).</strong> El código ayuda con los datos del proveedor, pero varios datos se completan a mano: <strong>placa, transportista, especie, categoría, ubicación de descarga</strong> y la <strong>observación</strong> con el aserradero de origen.</p>
            <Grid min={400}>
              <RMFigure src="image6.png" caption="Tipo de proveedor: Terceros." />
              <RMFigure src="image16.png" caption="Placa ingresada manualmente." />
              <RMFigure src="image1.png" caption="Código de barras del proveedor para autocompletar." />
            </Grid>
          </Card>
          <Card title="2. Revise proveedor, placa y datos manuales" icon="playlist_add_check">
            <List items={[
              'Llene la placa del vehículo.',
              'Escanee o ingrese el código del proveedor.',
              'Complete los campos verdes que falten: transportista, servicio de explotación (mano de obra), especie, categoría, ubicación de descarga, operador de entrada.',
              'En Observación escriba el aserradero de donde viene la madera, por ejemplo EDINCA.',
            ]} />
            <Grid min={420} gap={14}>
              <RMFigure src="image12.png" caption="Campo de placa." />
              <RMFigure src="image17.png" caption="Datos manuales y datos que se completan automáticamente." />
              <RMFigure src="image23.png" caption="Revise campos antes de guardar." />
            </Grid>
          </Card>
          <Card title="3. Peso y guardado" icon="scale" tone="green">
            <List ordered items={[
              'Verifique que la balanza esté en cero antes de pesar.',
              'Presione F4 para capturar el peso.',
              'Presione F5 para guardar.',
            ]} />
            <Grid min={420} gap={14}>
              <RMFigure src="image21.png" caption="Peso de terceros con F4." tall />
              <RMFigure src="image18.png" caption="Guardar el ingreso de terceros." tall />
              <RMFigure src="image19.png" caption="Ingreso guardado en ANI." tall />
            </Grid>
          </Card>
          <Card title="Terceros - sin código de barras" icon="edit_note" tone="yellow">
            <List ordered items={[
              'Seleccione Tipo de Proveedor: Terceros.',
              <span>Llene a mano: <strong>placa, proveedor, transportista, servicio de explotación (mano de obra), producto, categoría, especie y ubicación de descarga</strong>.</span>,
              'Complete operador de entrada.',
              'Escriba en Observación el aserradero de origen (por ejemplo EDINCA).',
              'Verifique balanza en cero y capture peso con F4.',
              'Guarde con F5. Entre otros campos pueden variar — consultar guía ANI.',
            ]} />
          </Card>
        </Stack>
      </div>

      <div>
        <InlineTitle icon="eco">Vuelo Forestal</InlineTitle>
        <Stack gap={16}>
          <Card title="Qué significa Vuelo Forestal" icon="forest" tone="blue">
            Es madera del bosque, ligada al programa de aprovechamiento forestal. El camión debe traer guía de circulación forestal con QR, guía de madera y guía de remisión.
          </Card>
          <Card title="1. Seleccione Tipo de Proveedor: Vuelo Forestal" icon="person_search">
            <p style={{ marginTop: 0 }}>Escanee el QR del camión. ANI llena <strong>bosque, transporte, cosechador, categoría y especie</strong>. Revise y corrija si algo no coincide — entre otros campos pueden variar (consultar la guía ANI).</p>
            <Grid min={420}>
              <RMFigure src="image20.png" caption="Tipo de proveedor: Vuelo Forestal." tall />
              <RMFigure src="image22.png" caption="Datos automáticos desde QR de Vuelo Forestal." tall />
            </Grid>
          </Card>
          <Card title="2. Complete campos verdes" icon="edit_note">
            <List items={[
              'Placa.',
              'Ubicación.',
              'Operador de entrada.',
              'Categoría y certificación si no se llenaron con el código de ubicación.',
            ]} />
          </Card>
          <Card title="3. Peso, licencia y guardado" icon="keyboard" tone="green">
            <List ordered items={[
              'Verifique balanza en cero.',
              'Presione F4 y confirme con OK o F12.',
              'Escanee el QR de la guía forestal obligatoria.',
              'Revise fecha inicio y fecha fin.',
              'Presione F5, obtenga el número y anótelo en la guía de madera.',
            ]} />
            <Grid min={420} gap={14}>
              <RMFigure src="image13.png" caption="Captura de peso en Vuelo Forestal." tall />
              <RMFigure src="image10.png" caption="Licencia de movilización desde QR." tall />
              <RMFigure src="image8.png" caption="Fechas de vigencia de la guía." tall />
              <RMFigure src="image2.png" caption="Guardar y crear número de ingreso." tall />
              <RMFigure src="image3.png" caption="Número anotado para continuar el proceso." tall />
            </Grid>
          </Card>
          <Card title="Vuelo Forestal sin QR del camión" icon="edit_note" tone="yellow">
            <p style={{ marginTop: 0 }}>Si el camión llega sin QR de proveedor, llene a mano los datos del ingreso. La guía forestal sí debe escanearse porque trae QR por ley.</p>
            <PillGrid items={['Placa', 'Guía de remisión', 'Código proveedor', 'Transporte', 'Mano de obra', 'Provincia', 'Cantón', 'Tipo de material', 'Ubicación', 'Categoría', 'Operador entrada']} />
          </Card>
        </Stack>
      </div>

      <Card title="Verificación visual de especie / material" icon="visibility" tone="yellow">
        <p style={{ marginTop: 0 }}>Antes y durante la captura del peso, el operador de balanza <strong>verifica visualmente</strong> que la especie/material observado en el camión coincida con lo ingresado manualmente.</p>
        <List items={[
          'Es un control rápido pero puede ser más difícil de noche.',
          <span>Si lo observado <strong>no coincide</strong> con el ingreso manual, debe haber un <strong>punto adicional de revisión/corrección</strong> antes de continuar (escalar al supervisor / responsable definido).</span>,
        ]} />
      </Card>

      <Card title="Validaciones y casos especiales" icon="report">
        <Grid min={280} gap={12}>
          <Callout variant="prohibido" title="Guía duplicada o rechazada">
            El camión sale de balanza. El proveedor debe mandar una guía nueva. No descargue hasta que la guía sea válida.
          </Callout>
          <Callout variant="advertencia" title="Aserrín">
            Antes de registrar, pida la fotografía del producto que el conductor <strong>envía por WhatsApp con la geolocalización activada</strong>. Debe mostrar el punto más lejano de carga. Archive la imagen con el número de ingreso.
          </Callout>
          <Callout variant="nota" title="Cuándo hacer manual">
            Use ingreso manual cuando el QR falla o cuando el proveedor no tiene contrato y solo existe cuenta. Si hace un ingreso manual, avise a supervisores; el flujo ideal es por QR.
          </Callout>
          <Callout variant="excepcion" title="Cuándo anular">
            Anule si cambió el precio acordado, si hubo error en datos manuales o si ANI no se integró con INFOR.
          </Callout>
        </Grid>
      </Card>

      <Checklist title="Repaso rápido - ingreso ANI" items={[
        'Elegí Propios, Terceros o Vuelo Forestal.',
        'Usé QR si estaba disponible.',
        'Si usé ingreso manual, avisé a supervisores.',
        'Completé campos verdes.',
        'Revisé placa, proveedor, ubicación y observación.',
        'Capturé peso con F4.',
        'Escaneé el QR de guía forestal cuando el documento lo trae.',
        'Guardé con F5 y obtuve número de ingreso.',
      ]} />

      <button className="screen-nav-button" onClick={() => goToSection('balanza')} style={{
        alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer',
        minHeight: 'var(--touch-min)', padding: '0 22px', borderRadius: 'var(--radius-pill)',
        border: '2px solid var(--line-200)', background: 'var(--surface-card)', color: 'var(--text-strong)',
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-body)', textTransform: 'uppercase', letterSpacing: '0.02em',
      }}>
        <Icon name="arrow_back" size={24} /> Volver a ingreso en balanza
      </button>
    </Stack>
  );
}

function HumedadMuestras() {
  return (
    <Stack>
      <SectionHeader number="4" eyebrow="IJP-REC-001" title="Humedad y muestras" icon="science" />
      <Lead>La muestra protege el pago, la calidad y la trazabilidad. Tome la muestra correcta según el material y registre el resultado donde corresponde.</Lead>

      <InfoTable
        caption="4.7 Cuando tomar muestra"
        columns={[{ label: 'Material o caso', width: '58%' }, { label: 'Frecuencia', align: 'center' }]}
        rows={[
          ['Proyecto nuevo: al menos 10 seguidas o mínimo una semana calendario', '10'],
          ['Proyecto antiguo: mayor a una semana', '5 / semana'],
          ['Terceros continuas', '5 / semana'],
          ['Terceros ocasionales', '1 de 5 vehiculos'],
          ['Subproductos y madera que se paga en seco', '100%'],
          ['Subproductos CHIP para análisis de corteza', '100%'],
        ]}
      />
      <Callout variant="nota" title="Criterio del supervisor">
        Si el bosque o el producto lo requiere, se puede muestrear con mayor frecuencia.
      </Callout>

      <Grid min={290}>
        <Card title="4.8 Madera rolliza" icon="forest">
          <List ordered items={[
            'Muestree a 0,6 m del extremo de la troza o al cuarto de su longitud.',
            'Escoja un diámetro promedio representativo.',
            'Obtenga viruta con taladro y broca de 1/2 pulgada.',
          ]} />
        </Card>
        <Card title="4.8 Chip y aserrín" icon="grain">
          <List ordered items={[
            'Tome tres muestras durante la descarga: inicio, mitad y final.',
            'Homogeneice las tres muestras.',
            'Coloque en una funda etiquetada.',
            'Lleve la muestra al secadero.',
          ]} />
        </Card>
        <Card title="4.8 Tablero, jampa y retazo" icon="inventory_2">
          <List ordered items={[
            'Obtenga viruta de tres piezas diferentes.',
            'Unifique la viruta en una sola funda identificada.',
          ]} />
        </Card>
      </Grid>

      <Card title="4.9 Dónde se toma y quién participa" icon="place">
        <Callout variant="nota" title="Regla rápida" style={{ marginBottom: 12 }}>
          <strong>Rolliza propia → prueba en Balanza</strong> (oficina balanza). <strong>Rolliza terceros + aserrín + chip + cualquier subproducto (todo lo no-rolliza) → prueba en Control Room Secadero 2, ubicado en Patio 5.</strong>
        </Callout>
        <Grid min={260}>
          <MiniFact label="Rolliza propia" value="Oficina balanza" icon="balance" />
          <MiniFact label="Terceros y subproductos" value="Recepción en Patio 5" icon="warehouse" />
          <MiniFact label="Prueba no-rolliza" value="Control Room Sec. 2 (en Patio 5)" icon="science" />
        </Grid>
        <InfoTable
          style={{ marginTop: 16 }}
          columns={[{ label: 'Personal', width: '34%' }, 'Actividad y ubicación']}
          rows={[
            ['Operador de balanza', 'Solo rolliza PROPIOS: toma muestra y hace prueba en oficina balanza.'],
            ['Operador de balanza / ayudante inventario', 'Rolliza TERCEROS y subproductos (aserrín, chip, viruta, lámina, jampa, retazo): recibe muestra en Patio 5 y hace la prueba en Control Room Secadero 2 (también en Patio 5).'],
            ['Supervisor de secadero', 'Apoya en muestras de rolliza terceros y subproductos — Patio 5 (recepción) y Control Room Secadero 2 (prueba).'],
          ]}
        />
      </Card>

      <Card title="4.10 Análisis en balanza analítica" icon="monitor_weight">
        <Grid min={200} gap={12}>
          <MiniFact label="Temperatura" value="125 °C" icon="device_thermostat" />
          <MiniFact label="Peso muestra" value="2,5 - 3,5 g" icon="scale" />
          <MiniFact label="Desconexión" value="1/20 mg/s" icon="speed" />
          <MiniFact label="Tiempo (rolliza)" value="25 a 40 min" icon="timer" />
        </Grid>
        <div style={{ marginTop: 16 }}>
          <List ordered items={['Coloque la muestra en la balanza analítica.', 'Inicie el análisis.', 'Espere hasta que el equipo muestre el resultado final.', <span><strong>Lo más importante: anote el % de humedad que muestra el equipo</strong> — ese valor se traslada a ANI y se usa para pagar por tonelada seca.</span>]} />
        </div>
      </Card>

      <Card title="Fórmulas de humedad" icon="functions" tone="blue">
        <p style={{ marginTop: 0 }}>El equipo entrega directamente el % de humedad, pero estas son las fórmulas equivalentes para validar o reconstruir resultados manualmente.</p>
        <Stack gap={12}>
          <div style={{ padding: 18, background: 'var(--surface-sunken)', border: '2px solid var(--line-200)', borderRadius: 'var(--radius-sm)', fontFamily: 'Inter, monospace', fontSize: 'var(--fs-body-lg)', textAlign: 'center', fontWeight: 600, color: 'var(--text-strong)' }}>
            % Humedad = ((Peso inicial húmedo − Peso final seco) / Peso final seco) × 100
          </div>
          <div style={{ padding: 18, background: 'var(--surface-sunken)', border: '2px solid var(--line-200)', borderRadius: 'var(--radius-sm)', fontFamily: 'Inter, monospace', fontSize: 'var(--fs-body-lg)', textAlign: 'center', fontWeight: 600, color: 'var(--text-strong)' }}>
            Peso seco = Peso húmedo / ((% Humedad / 100) + 1)
          </div>
        </Stack>
      </Card>

      <Card title="4.11 Etiqueta y registro" icon="label">
        <Grid min={250}>
          <Card title="A. En balanza" icon="print" tone="green">
            <p style={{ marginTop: 0 }}>Para rolliza de proveedores propios, ANI imprime la etiqueta.</p>
            <PillGrid tone="ok" items={['Item', 'Fecha', 'Número ingreso', 'Placa', 'Humedad', 'Especie', 'Instrumento']} />
            <p><strong>Lo principal: anote el % de humedad que muestra el equipo.</strong> Luego tome foto del resultado de la balanza analítica junto con la etiqueta impresa y guárdela con el número de ingreso.</p>
          </Card>
          <Card title="B. Etiqueta/papel para muestra (terceros y subproductos)" icon="edit" tone="blue">
            <p style={{ marginTop: 0 }}>Para rolliza de terceros y subproductos, <strong>balanza entrega una etiqueta/papel al transportista</strong> (puede ser impresa o llenada a mano según el flujo del momento). El <strong>transportista lleva la etiqueta/papel al patio asignado</strong> y la entrega al responsable que toma la muestra.</p>
            <PillGrid tone="info" items={['Item', 'Número ingreso', 'Placa', 'Producto']} />
            <p>La prueba se hace en Control Room Secadero 2.</p>
          </Card>
          <Card title="C. Registro digital" icon="cloud_done">
            Registre el resultado en el archivo compartido "14 % HUMEDADES DE INGRESO-REVXX", en la carpeta PRODUCCIÓN del OneDrive del Control Room del Secadero 2.
          </Card>
        </Grid>
      </Card>

      <Card title="Humedad: último filtro antes del cierre" icon="warning_amber" tone="red">
        <p style={{ marginTop: 0 }}>El % de humedad es el <strong>último dato que se digita en ANI antes del cierre</strong>. <strong>Sin humedad no se puede completar correctamente el registro</strong> cuando aplica. Una vez registrado, corregir el valor puede exigir <strong>anular el ingreso y reingresarlo</strong>, con impacto contable. Por eso:</p>
        <List items={[
          'Confirme el valor del equipo ANTES de digitarlo en ANI (lectura directa de la pantalla de la balanza analítica).',
          'Si el QR o la cuenta-contrato del proveedor están equivocados, NO digite la humedad encima — primero anule y reingrese con los datos correctos.',
        ]} />
      </Card>

      <Callout variant="nota" title="Si la muestra parece perdida o no procesada">
        <List ordered items={[
          'Confirme primero con balanza si la muestra fue tomada.',
          'Si no se tomó o no se encuentra, escale al responsable / supervisor definido.',
        ]} />
        <p style={{ marginTop: 8, marginBottom: 0 }}>No tratar promedios de viajes anteriores ni doble muestra en un viaje posterior como práctica regular: son medidas de excepción que decide el supervisor.</p>
      </Callout>

      <Callout variant="nota" title="Verificación de humedad en salida — Balanza 1 (PS1)">
        Antes de cerrar la salida del camión en Balanza 1, el operador debe verificar que el % de humedad esté digitado en ANI. Si quedó en blanco (caso del 4.12 abajo), búsquelo por número de ingreso o placa, ingrese el valor manualmente, y solo entonces libere el cierre de salida. Para patios externos, la humedad en salida es obligatoria.
      </Callout>

      <Grid min={300}>
        <Callout variant="advertencia" title="4.12 Si el análisis demora">
          En el flujo normal, si la prueba tarda más que la permanencia del camión, registre la salida y deje humedad en blanco. Luego busque por número de ingreso o placa e ingrese el porcentaje manualmente en ANI.
        </Callout>
        <Callout variant="prohibido" title="Patios externos: humedad obligatoria">
          Si el camión va a patio externo y la humedad es obligatoria para la salida, no cierre la salida con humedad en blanco. Avise al supervisor y registre el resultado antes de liberar el cierre.
        </Callout>
        <Card title="4.13 Medición de diámetro" icon="straighten">
          Mida el diámetro de la madera por especie en un área representativa de 1 m² del total de la carga.
        </Card>
      </Grid>
    </Stack>
  );
}

function CierreExcepciones() {
  const exceptionCards = [
    ['Aserrín', 'Se paga por peso y distancia. Tome muestra en cada camión y registre la distancia del origen para pago.', 'grain'],
    ['Patios externos', 'De los 21 patios, son externos todos menos 5, 6, 7, 8 y 21. Entrada: retener cédula, entregar pase y registrar tarjeta cuando aplique. Salida: devolver cédula contra pase y registrar humedad obligatoria.', 'badge'],
    ['Combustibles', 'DSL, GLP y resina solo se pesan entrada y salida como referencia para Bodega. No entran al flujo completo ANI.', 'local_gas_station'],
    ['Residuos EMASEO', 'Flujo simplificado. Registre entrada y salida en la hoja Google Drive compartida con Sistema de Gestión. No genera número ANI.', 'delete'],
    ['Reciclado', 'Flujo completo ANI como subproducto. Material para biomasa o trituración. Retazos internos se registran como registro interno.', 'recycling'],
    ['Trasbordo', 'Si descarga en más de una máquina, regresa a balanza por peso de salida adicional. Registre qué máquina descargó cada parte.', 'sync_alt'],
    ['Guías inválidas', 'Si ANI rechaza guía repetida, caducada o inválida, baje el camión y pida una guía nueva.', 'block'],
    ['Hora pico', 'Turno 2 desde 14:00. Si la fila sale de planta, habilite dos balanzas de entrada con dos personas.', 'groups'],
    ['Fuerza mayor', 'Si ANI falla, use documento manual secuencial, anote todos los datos y regularice luego. Si no hay peso de salida, use peso vacío histórico por placa; si no existe, use la capacidad de un vehículo similar. Seguridad o Supervisor pueden verificar y registrar pesos.', 'priority_high'],
  ];

  return (
    <Stack>
      <SectionHeader number="5" eyebrow="IJP-REC-001" title="Cierre y excepciones" icon="assignment_turned_in" />
      <Lead>Cierre el ingreso solo cuando ANI ya tiene la información necesaria. Si algo se sale del flujo normal, use la regla de excepción correspondiente.</Lead>

      <Card title="4.14 Asignación de patio" icon="warehouse">
        <List ordered items={[
          'Consulte la hoja de rumas actualizada.',
          'Revise el grupo de WhatsApp de patios.',
          'Verifique el esquema RJP-03 para el tipo de material.',
          'Indique al conductor el patio asignado.',
        ]} />
        <Grid min={260} gap={12}>
          <Card title="Patios internos" icon="warehouse" tone="green">
            Patios 5, 6, 7, 8 y 21.
          </Card>
          <Card title="Patios externos" icon="badge" tone="yellow">
            De los 21 patios, cualquier otro patio es externo y requiere pase de control.
          </Card>
        </Grid>
        <Callout variant="nota" title="Quien decide el patio" style={{ marginTop: 14 }}>
          El operador de balanza comunica el patio. El Jefe de Patios y auxiliar de inventario definen la asignación.
        </Callout>
        <Callout variant="advertencia" title="Orden de descarga: FIFO con excepción justificada" style={{ marginTop: 14 }}>
          Como regla general la descarga sigue <strong>FIFO</strong> (primero en entrar, primero en descargar). En la práctica se puede descargar por especie o por patio cuando lo justifica el esquema del día (RJP-03) o instrucción del Jefe de Patios; toda excepción debe estar justificada y comunicada al supervisor.
        </Callout>
      </Card>

      <StepBlock n="4.15" title="Cerrar el ingreso" icon="save" keyName="F12 / F5">
        <List ordered items={[
          'Presione F12 para confirmar.',
          'Presione F5 para guardar el ingreso.',
          'ANI genera el número de ingreso.',
          'Entregue RJP-01 al conductor.',
          'Libere el camión hacia su patio.',
        ]} />
      </StepBlock>

      <Callout variant="prohibido" title="No deje pasar antes de tiempo">
        El camión NO puede pasar a descargar hasta que exista número de ingreso.
      </Callout>

      <Card title="Anulación, reliquidación y nota de crédito" icon="receipt_long" tone="yellow">
        <p style={{ marginTop: 0 }}>Aplica cuando un ingreso ya cerrado tiene datos incorrectos o problemas de integración.</p>
        <InfoTable
          columns={[{ label: 'Caso', width: '22%' }, { label: 'Cuándo aplica', width: '34%' }, { label: 'Acción', width: '26%' }, 'Escalar a']}
          rows={[
            ['Anulación', 'Datos del ingreso quedaron mal (QR forestal erróneo, código de barras de terceros mal, ingreso mal digitado por balanza, ANI no se integró con INFOR).', 'Se anula el ingreso y se ingresa nuevamente con los datos correctos.', 'Supervisor de balanza / contabilidad (Daniel Aguilar).'],
            ['Reliquidación', 'Se pagó de menos por mala categoría/material u otro dato.', 'El proveedor emite factura por el faltante que debe pagarse.', 'Contabilidad / Departamento Forestal.'],
            ['Nota de crédito', 'Se pagó de más.', 'El proveedor emite nota de crédito por el valor que debe descontarse.', 'Contabilidad.'],
          ]}
        />
        <p style={{ marginTop: 10, marginBottom: 0 }}><strong>Motivos posibles:</strong> error en QR forestal, error en código de barras de terceros, ingreso mal digitado por balanza, precio mal ingresado, categoría/material incorrecto, integración fallida con INFOR.</p>
      </Card>

      <Card title="4.14.2 Patios y rumas digitales" icon="warehouse" tone="blue">
        <List items={[
          <span>Si el operador descarga en un <strong>patio o ruma que no sigue la secuencia</strong> definida, <strong>debe avisar</strong> al jefe de patios o responsable definido.</span>,
          <span>Si <strong>físicamente se crea una ruma nueva</strong> que <strong>no existe digitalmente</strong>, se debe <strong>pedir habilitación</strong> al jefe de patios o responsable definido antes de seguir.</span>,
          <span>La <strong>ruma digital</strong> funciona como <strong>histórico/control</strong>: permite verificar cambios físicos en el patio contra el sistema.</span>,
        ]} />
      </Card>

      <div>
        <InlineTitle icon="report">Excepciones principales</InlineTitle>
        <Grid min={280} gap={14}>
          {exceptionCards.map(([title, text, icon], i) => (
            <Card key={title} title={title} icon={icon} tone={i === 6 ? 'red' : i === 8 ? 'yellow' : 'plain'}>
              {text}
            </Card>
          ))}
        </Grid>
      </div>

      <Card title="Equipos y materiales de balanza" icon="construction">
        <Grid min={330}>
          <Card title="Balanza" icon="balance" tone="green">
            <List items={[
              'Taladro DEWALT D25133-B3.',
              '1 broca de 1/2 pulgada.',
              '3 balanzas analíticas.',
              '2 baterias.',
              'Se almacena en oficina balanza.',
            ]} />
            <div style={{ marginTop: 14 }}>
              <ImageFigure src="image1.jpg" caption="Taladro DEWALT usado en balanza." tall />
            </div>
          </Card>
          <Card title="Patio 5 / Control Room Secadero 2" icon="warehouse" tone="blue">
            <List items={[
              'Taladro BOSCH GSB 180-LI.',
              '2 brocas de 1/2 pulgada.',
              '7 balanzas analíticas.',
              'Se almacena en oficina descortezador.',
            ]} />
            <div style={{ marginTop: 14 }}>
              <ImageFigure src="image2.jpg" caption="Taladro BOSCH y materiales para Patio 5 / Secadero 2." />
            </div>
          </Card>
        </Grid>
      </Card>

      <Card title="Teclas reales del sistema ANI" icon="keyboard">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start' }}>
          <KeyCap size="lg" label="Captura peso desde balanza">F4</KeyCap>
          <KeyCap size="lg" label="Confirma / siguiente paso">F12</KeyCap>
          <KeyCap size="lg" label="Guarda ingreso y genera número">F5</KeyCap>
        </div>
      </Card>
    </Stack>
  );
}

function DescargaFactoryTrack() {
  const factorySteps = [
    {
      n: 'FT-1',
      title: 'Entrar a Stock',
      text: 'Después de descargar y antes de bajar del patio, abra Factory Track en el móvil. Si no ve el menú, toque las tres rayas de arriba varias veces y elija Stock.',
      img: 'image3.png',
      caption: 'Menú principal de Factory Track: elegir Stock.',
    },
    {
      n: 'FT-2',
      title: 'Transferencias de stock',
      text: 'Dentro de Stock, entre a Transferencias de stock.',
      img: 'image5.png',
      caption: 'Opción Transferencias de stock.',
    },
    {
      n: 'FT-3',
      title: 'Formulario de transferencia',
      text: 'Llene los campos en este orden: almacén de origen, artículo, ubicación de origen, cantidad a transferir, almacén destino y Proceso.',
      img: 'image4.png',
      caption: 'Pantalla principal para llenar la transferencia.',
    },
    {
      n: 'FT-4',
      title: 'Almacén de origen',
      text: 'En Almacén de origen ingrese ITMADE.',
      img: 'image7.png',
      caption: 'Campo Almacén de origen con ITMADE.',
    },
    {
      n: 'FT-5',
      title: 'Artículo',
      text: 'En Artic ingrese el código del artículo descargado. También puede escanear el código de barras del papel para autocompletar.',
      img: 'image10.png',
      caption: 'Campo Artic con código del artículo.',
    },
    {
      n: 'FT-6',
      title: 'Ubicación de origen',
      text: 'En Ubicación de origen ingrese la ubicación. Ejemplo: P09070.',
      img: 'image11.png',
      caption: 'Campo Ubicación origen.',
    },
    {
      n: 'FT-7',
      title: 'Cantidades',
      text: 'El sistema llena Ctd en exis, Ctd libr y U/M. Revise que aparezcan. Luego ingrese las toneladas en Ctd a transferir; ese campo significa la cantidad que baja la máquina.',
      img: 'image8.png',
      caption: 'Cantidades de existencia y unidad se llenan solas.',
    },
    {
      n: 'FT-8',
      title: 'Almacén destino',
      text: 'En Almacén destino ingrese PREMADE.',
      img: 'image9.png',
      caption: 'Campo Almacén destino con PREMADE.',
    },
    {
      n: 'FT-9',
      title: 'Procesar y repetir',
      text: 'Seleccione Proceso para finalizar. Baje la máquina y repita el registro con el siguiente camión.',
      img: 'image6.png',
      caption: 'Botón Proceso para finalizar la transferencia.',
    },
  ];

  return (
    <Stack>
      <SectionHeader number="6" eyebrow="IJP-REC-001" title="Descarga y Factory Track" icon="phone_android" />
      <Lead>Esta parte es para el operador de descarga. El objetivo es descargar, dejar evidencia del camión vacío y registrar correctamente la transferencia.</Lead>

      <Card title="8. Tipos de camiones" icon="local_shipping">
        <Callout variant="nota" title="Dos marcas, dos procedimientos">
          Los camiones que llegan a NOVOPAN son <strong>HINO (con remolque)</strong> o <strong>Chevrolet (sin remolque)</strong>. La capacidad típica y la maniobra de descarga dependen del tipo.
        </Callout>
        <Grid min={320} gap={16} style={{ marginTop: 14 }}>
          <Card title="HINO — con remolque" icon="local_shipping" tone="blue">
            <p style={{ marginTop: 0 }}>Capacidad típica lleno: <strong>~11 t</strong>.</p>
            <p>Necesita más espacio para maniobra. La descarga puede requerir desenganchar el remolque según el patio.</p>
          </Card>
          <Card title="Chevrolet — sin remolque" icon="forklift" tone="blue">
            <p style={{ marginTop: 0 }}>Capacidad típica lleno: <strong>~8 a 9 t</strong>.</p>
            <p>Maniobra más ágil. Llega más cerca de la ruma.</p>
          </Card>
        </Grid>
        <Callout variant="advertencia" title="Corrección en esta revisión" style={{ marginTop: 12 }}>
          Las marcas HINO y Chevrolet estaban invertidas en versiones anteriores. Verifique siempre la marca real del camión antes de asumir capacidad.
        </Callout>
      </Card>

      <Card title="8.1 Antes y después de descargar" icon="forklift">
        <Grid min={380} gap={16}>
          <Card title="Antes de descargar" icon="warehouse">
            <List ordered items={[
              'El camión sube a Patio 5 o al patio indicado.',
              'Si necesita humedad en Patio 5, pasa primero por Patio 5.',
              'En el patio asignado, espera una máquina NOVOPAN.',
              'El operador de la máquina elige bien dónde descargar, especialmente en qué parte de la ruma.',
              'Si ya hay máquina, se coloca al lado. Si no, espera cerca de la ruma más lejana.',
            ]} />
          </Card>
          <Card title="Después de descargar" icon="photo_camera" tone="green">
            <List ordered items={[
              'La máquina se coloca entre el camión y la ruma.',
              'Descargue el material.',
              'Tome foto del camión vacío.',
              'Envíe la foto al grupo de WhatsApp correspondiente.',
              'Desde ese momento, el camión tiene 15 minutos, máximo 20, para salir.',
            ]} />
          </Card>
        </Grid>
        <Callout variant="advertencia" title="Cómo debe quedar la ruma" style={{ marginTop: 14 }}>
          <List items={[
            'Extienda la ruma lo más posible hasta llegar al camino, sin bloquear el paso.',
            'Mantenga la ruma hasta 5 m de altura (excepcionalmente 6 m), pareja, recta, simétrica y aireada.',
            'Patrón de armado: dos rumas + camino + dos rumas (~1 m de hueco entre pares).',
            'Siga la misma línea de la ruma anterior: debe quedar recta y alineada.',
            'Si la ruma de al lado quedó baja o corta, termine de llenarla antes de empezar una nueva.',
          ]} />
        </Callout>
        <div style={{ marginTop: 16 }}>
          <ImageFigure src="image12.png" caption="Ejemplo de foto del camión vacío después de descargar." tall />
        </div>
      </Card>

      <Card title="Referencia para toneladas" icon="scale">
        <Grid min={300}>
          <MiniFact label="HINO (con remolque) llena" value="~11 t" icon="local_shipping" />
          <MiniFact label="Chevrolet (sin remolque) llena" value="~8 a 9 t" icon="forklift" />
          <MiniFact label="Si no baja llena" value="Ajustar proporcional" icon="rule" />
        </Grid>
      </Card>

      <Callout variant="nota" title="Factory Track — cuentas y equipos">
        <List items={[
          <span>Cada <strong>Factory Track está asociado a un camión / equipo</strong> y tiene <strong>cuenta y contraseña propia</strong>.</span>,
          <span>Las credenciales las conocen y administran <strong>supervisores, jefe de patios y responsable definido</strong>.</span>,
          <span>Nombre oficial: <strong>Factory Track</strong> (no "Factori Track").</span>,
        ]} />
      </Callout>

      <div>
        <InlineTitle icon="phone_android">Factory Track - paso a paso</InlineTitle>
        <Stack gap={16}>
          {factorySteps.map((step) => (
            <div key={step.n} className="factory-step-row">
              <StepBlock n={step.n} title={step.title} icon="touch_app">
                {step.text}
              </StepBlock>
              <ImageFigure src={step.img} caption={step.caption} tall={step.img === 'image3.png' || step.img === 'image4.png' || step.img === 'image5.png'} />
            </div>
          ))}
        </Stack>
      </div>

      <Checklist title="Repaso rápido - operador de descarga" items={[
        'Ya descargué en el patio asignado.',
        'Ya revisé que la ruma quede extendida, pareja, recta, simétrica y con altura máxima de 5 m (6 m excepcional).',
        'Ya tomé foto del camión vacío.',
        'Ya envié la foto al grupo de WhatsApp correspondiente.',
        'Ya abrí Factory Track en Stock.',
        'Ya registré Transferencias de stock.',
        'Ya usé ITMADE como almacén de origen.',
        'Ya usé PREMADE como almacén destino.',
        'Ya ingresé cantidad a transferir.',
        'Ya presioné Proceso.',
        'Ya repetí el registro con el siguiente camión.',
      ]} />
    </Stack>
  );
}

function ChangelogFooter() {
  return (
    <Stack>
      <SectionHeader number="7" eyebrow="Versión" title="Historial de cambios" icon="history" />
      <Lead>Cada actualización del contenido se registra aquí con fecha, hora exacta (minuto) y autor. Esto permite saber qué se modificó y cuándo, sin tener que cruzar varios documentos.</Lead>

      <Card title="Última actualización" icon="event" tone="green">
        <p style={{ marginTop: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-h3)', color: 'var(--text-strong)' }}>
          2026-06-19 · 16:07 (-05 ECT)
        </p>
        <p style={{ margin: 0 }}><strong>Editor:</strong> Manuel Montúfar / Codex</p>
        <p style={{ margin: 0 }}><strong>Documento fuente:</strong> <code>instructivos/finales/CONTENIDO_MAESTRO.md</code></p>
      </Card>

      <Card title="2026-06-19 16:07 — cierre follow-up Codex" icon="task_alt" tone="green">
        <List items={[
          <span>Documentos paralelos/adendas alineados con la revisión Gabriel.</span>,
          <span>HTML estático regenerado desde <code>Screens.jsx</code>.</span>,
          <span>DOCX finales actualizados y renderizados; PDF final re-exportado desde el HTML estático.</span>,
          <span>Changelogs y notas de validación limpiados para que las búsquedas literales no reporten texto antiguo como contenido pendiente.</span>,
        ]} />
      </Card>

      <Card title="2026-06-19 15:35 — Revisión HTML contenido GABRIEL" icon="track_changes">
        <p style={{ marginTop: 0 }}><strong>Cambios aprobados aplicados en este sync:</strong></p>
        <List items={[
          <span>Flujo operativo reescrito por etapas; énfasis en que <strong>primero se llenan/revisan datos del ingreso y luego se captura peso</strong>.</span>,
          <span><strong>QR forestal vs código de barras de terceros</strong> separados; títulos de terceros ajustados a con/sin código de barras.</span>,
          <span>4.6: redacción ajustada para bloquear la <strong>entrada</strong> cuando la guía está repetida.</span>,
          <span>4.10.1: eliminado el placeholder no aprobado; conservada la idea de humedad como último dato antes del cierre.</span>,
          <span>Muestra perdida: confirmar primero con balanza y escalar; <strong>no</strong> se documentan como práctica regular el promedio de últimos viajes ni el doble muestreo.</span>,
          <span>4.11: etiqueta/papel <strong>entregada al transportista</strong> en balanza (no "todo automático") y llevada al patio asignado.</span>,
          <span>4.5: verificación visual de especie/material en balanza (más difícil de noche).</span>,
          <span>Anulación / reliquidación / nota de crédito — bloque operativo con caso/acción/escalamiento.</span>,
          <span><strong>Camiones HINO/Chevrolet corregidos (estaban invertidos):</strong> HINO con remolque (~11 t), Chevrolet sin remolque (~8-9 t).</span>,
          <span>4.14.2: Patios y rumas digitales — avisar si descarga fuera de secuencia; pedir habilitación si se crea ruma física sin registro digital.</span>,
          <span>Factory Track: cada Factory Track con cuenta/contraseña propia; credenciales con supervisores/jefe de patios/responsable definido.</span>,
        ]} />
        <Callout variant="nota" title="Fuera de alcance (no incluido por instrucción)" style={{ marginTop: 14 }}>
          No se agregó procedimiento de proveedor nuevo / asignación de código de barras · No se agregó pendiente sobre ubicación exacta de bloqueo por humedad · No se documentó como procedimiento formal el promedio de últimos seis viajes ni el doble muestreo.
        </Callout>
      </Card>

      <Card title="2026-06-19 09:53 — fixes de consistencia + 3 secciones nuevas (entrada previa)" icon="history">
        <p style={{ marginTop: 0 }}>Altura de ruma → hasta 5 m (excep. 6 m), patrón 2+camino+2. Tiempo muestra rolliza 25-40 min. Etiquetado Patio 5. Secciones nuevas 4.10.1 / 4.12.1 / 4.14.1.</p>
      </Card>
    </Stack>
  );
}

window.GuiaScreens = {
  nav: [
    { id: 'antes', n: '1', label: 'Antes de recibir', icon: 'menu_book', Comp: AntesDeRecibir },
    { id: 'balanza', n: '2', label: 'Ingreso en balanza', icon: 'balance', Comp: IngresoBalanza },
    { id: 'recepcion', n: '3', label: 'Recepción madera ANI', icon: 'computer', Comp: RecepcionMaderaDetalle },
    { id: 'humedad', n: '4', label: 'Humedad y muestras', icon: 'science', Comp: HumedadMuestras },
    { id: 'cierre', n: '5', label: 'Cierre y excepciones', icon: 'assignment_turned_in', Comp: CierreExcepciones },
    { id: 'descarga', n: '6', label: 'Descarga y Factory Track', icon: 'phone_android', Comp: DescargaFactoryTrack },
    { id: 'changelog', n: '7', label: 'Historial de cambios', icon: 'history', Comp: ChangelogFooter },
  ],
};
