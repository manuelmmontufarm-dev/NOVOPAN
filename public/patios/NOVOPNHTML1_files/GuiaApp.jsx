// Guía de Campo — tablet shell. Cover + left nav rail + content.
const DSk = window.NovopanInstructivosDesignSystem_ed66c5;
const { Icon: DSIcon, Badge: DSBadge } = DSk;

function Cover({ onStart }) {
  return (
    <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40, background: 'var(--novopan-green)', color: '#fff' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 22px', border: '2px solid rgba(255,255,255,0.24)', borderRadius: 'var(--radius-md)', marginBottom: 34, boxShadow: 'var(--shadow-lg)', background: 'rgba(255,255,255,0.08)' }}>
        <span style={{ width: 42, height: 42, borderRadius: 'var(--radius-sm)', background: 'var(--novopan-yellow)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <DSIcon name="forest" size={30} color="var(--novopan-green)" />
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, letterSpacing: '0.04em', color: '#fff' }}>NOVOPAN</span>
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--fs-caption)', letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--novopan-yellow)', marginBottom: 12 }}>
        Instructivo de Procedimiento · IJP-REC-001
      </div>
      <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--fs-h1)', textTransform: 'uppercase', letterSpacing: '0', lineHeight: 1.04, maxWidth: 720 }}>
        Recepción de Madera y Subproductos
      </h1>
      <p style={{ margin: '16px 0 0', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-body-lg)', color: 'rgba(255,255,255,0.85)', maxWidth: 560, lineHeight: 1.5 }}>
        Guía de campo para operadores de balanza, patios y descarga.
      </p>
      <button onClick={onStart} style={{
        marginTop: 40, display: 'inline-flex', alignItems: 'center', gap: 12, cursor: 'pointer',
        minHeight: 'var(--touch-min)', padding: '0 32px', borderRadius: 'var(--radius-pill)', border: 'none',
        background: 'var(--novopan-yellow)', color: 'var(--novopan-green)', fontFamily: 'var(--font-display)',
        fontWeight: 800, fontSize: 'var(--fs-h4)', textTransform: 'uppercase', letterSpacing: '0.02em',
        boxShadow: 'var(--shadow-md)',
      }}>
        Comenzar <DSIcon name="arrow_forward" size={28} />
      </button>
      <div style={{ position: 'absolute', bottom: 20, fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
        Fecha: 16 de junio de 2026 · Reemplaza sección de recepción y registro en balanza del IJP Rev9
      </div>
    </div>
  );
}

function App() {
  const nav = window.GuiaScreens.nav;
  const [view, setView] = React.useState('cover'); // 'cover' | section id
  const active = nav.find(s => s.id === view);
  const idx = nav.findIndex(s => s.id === view);

  React.useEffect(() => {
    const handleNavigate = (event) => {
      const id = event.detail;
      if (nav.some(s => s.id === id)) setView(id);
    };
    window.addEventListener('guia:navigate', handleNavigate);
    return () => window.removeEventListener('guia:navigate', handleNavigate);
  }, [nav]);

  if (view === 'cover') return <Cover onStart={() => setView(nav[0].id)} />;

  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      {/* Left nav rail */}
      <nav style={{ flex: '0 0 264px', background: 'var(--novopan-green)', color: '#fff', display: 'flex', flexDirection: 'column', padding: '18px 14px', overflowY: 'auto' }}>
        <button onClick={() => setView('cover')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 10px 16px', textAlign: 'left' }}>
          <DSIcon name="home" size={24} color="var(--novopan-yellow)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#fff', textTransform: 'uppercase', letterSpacing: '0' }}>Recepción</span>
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {nav.map(s => {
            const on = s.id === view;
            return (
              <button key={s.id} onClick={() => setView(s.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
                minHeight: 'var(--touch-min)', padding: '0 14px', borderRadius: 'var(--radius-md)', border: 'none',
                background: on ? 'var(--novopan-yellow)' : 'transparent',
                color: on ? 'var(--novopan-green)' : 'rgba(255,255,255,0.92)',
                fontFamily: 'var(--font-body)', fontWeight: on ? 700 : 500, fontSize: 'var(--fs-body)',
                transition: 'background 120ms',
              }}>
                <span style={{ flex: '0 0 auto', width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'rgba(0,78,56,0.12)' : 'rgba(255,255,255,0.12)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15 }}>{s.n}</span>
                <DSIcon name={s.icon} size={22} />
                <span style={{ flex: 1 }}>{s.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--surface-page)' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px 24px' }}>
          <div style={{ maxWidth: 1040, margin: '0 auto' }}>
            {active && <active.Comp />}
          </div>
        </div>
        {/* Footer nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 40px', borderTop: '2px solid var(--line-200)', background: 'var(--surface-card)' }}>
          <button onClick={() => setView(nav[Math.max(0, idx - 1)].id)} disabled={idx === 0} style={navBtn(idx === 0)}>
            <DSIcon name="arrow_back" size={24} /> Anterior
          </button>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-small)', color: 'var(--text-muted)' }}>
            Sección {active.n} de {nav.length}
          </span>
          <button onClick={() => setView(nav[Math.min(nav.length - 1, idx + 1)].id)} disabled={idx === nav.length - 1} style={{ ...navBtn(idx === nav.length - 1), marginLeft: 'auto', background: 'var(--novopan-green)', color: '#fff' }}>
            Siguiente <DSIcon name="arrow_forward" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

function navBtn(disabled) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 8, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1, minHeight: 'var(--touch-min)', padding: '0 22px',
    borderRadius: 'var(--radius-pill)', border: '2px solid var(--line-200)', background: 'var(--surface-card)',
    color: 'var(--text-strong)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-body)',
    textTransform: 'uppercase', letterSpacing: '0.02em',
  };
}

window.GuiaApp = App;
