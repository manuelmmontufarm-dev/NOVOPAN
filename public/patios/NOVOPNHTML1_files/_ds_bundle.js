/* @ds-bundle: {"format":3,"namespace":"NovopanInstructivosDesignSystem_ed66c5","components":[{"name":"Checklist","sourcePath":"components/checklists/Checklist.jsx"},{"name":"Callout","sourcePath":"components/feedback/Callout.jsx"},{"name":"FlowDiagram","sourcePath":"components/process/FlowDiagram.jsx"},{"name":"ProcessCard","sourcePath":"components/process/ProcessCard.jsx"},{"name":"ActivityStep","sourcePath":"components/structure/ActivityStep.jsx"},{"name":"Badge","sourcePath":"components/structure/Badge.jsx"},{"name":"Icon","sourcePath":"components/structure/Icon.jsx"},{"name":"KeyCap","sourcePath":"components/structure/KeyCap.jsx"},{"name":"SectionHeader","sourcePath":"components/structure/SectionHeader.jsx"},{"name":"InfoTable","sourcePath":"components/tables/InfoTable.jsx"}],"sourceHashes":{"components/checklists/Checklist.jsx":"7e4ed4bd8188","components/feedback/Callout.jsx":"22ce85e544b8","components/process/FlowDiagram.jsx":"21f1d6744258","components/process/ProcessCard.jsx":"b86ff0d0bb6b","components/structure/ActivityStep.jsx":"16dde09d5329","components/structure/Badge.jsx":"e3fcc9db2267","components/structure/Icon.jsx":"0836fb9ad3de","components/structure/KeyCap.jsx":"aa8cea248506","components/structure/SectionHeader.jsx":"dc9bbe51f683","components/tables/InfoTable.jsx":"e09365f832b7","ui_kits/guia_de_campo/GuiaApp.jsx":"866fe605301d","ui_kits/guia_de_campo/Screens.jsx":"f8e462f40052"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NovopanInstructivosDesignSystem_ed66c5 = window.NovopanInstructivosDesignSystem_ed66c5 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/structure/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Icon — Material Symbols Rounded (filled) pictogram.
 * Use bold, recognizable symbols so low-literacy operators can scan by shape.
 */
function Icon({
  name,
  size = 24,
  color = 'currentColor',
  fill = true,
  weight = 600,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "material-symbols-rounded",
    "aria-hidden": "true",
    style: {
      fontFamily: 'var(--font-icon)',
      fontSize: size,
      lineHeight: 1,
      color,
      userSelect: 'none',
      fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${Math.min(48, Math.max(20, size))}`,
      display: 'inline-flex',
      verticalAlign: 'middle',
      ...style
    }
  }, rest), name);
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/structure/Icon.jsx", error: String((e && e.message) || e) }); }

// components/checklists/Checklist.jsx
try { (() => {
/**
 * Checklist — markable verification list for operators on the floor.
 * Items can be controlled or uncontrolled (local state). Each item is a large,
 * glove-friendly touch target.
 */
function Checklist({
  title,
  items = [],
  onChange,
  style = {}
}) {
  const [checked, setChecked] = React.useState(() => Object.fromEntries(items.map((it, i) => [i, !!(typeof it === 'object' && it.checked)])));
  const toggle = i => {
    const next = {
      ...checked,
      [i]: !checked[i]
    };
    setChecked(next);
    onChange && onChange(i, next[i]);
  };
  const done = items.filter((_, i) => checked[i]).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '2px solid var(--line-200)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      ...style
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      justifyContent: 'space-between',
      padding: 'var(--space-4) var(--space-5)',
      background: 'var(--surface-sunken)',
      borderBottom: '2px solid var(--line-200)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "fact_check",
    size: 28,
    color: "var(--novopan-green)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-h4)',
      color: 'var(--text-strong)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-tight)'
    }
  }, title)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-body)',
      color: done === items.length ? 'var(--ok-accent)' : 'var(--text-muted)'
    }
  }, done, "/", items.length)), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, items.map((it, i) => {
    const text = typeof it === 'string' ? it : it.text;
    const hint = typeof it === 'object' ? it.hint : null;
    const isOn = checked[i];
    return /*#__PURE__*/React.createElement("li", {
      key: i
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => toggle(i),
      style: {
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        appearance: 'none',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-4)',
        minHeight: 'var(--touch-min)',
        padding: 'var(--space-4) var(--space-5)',
        background: isOn ? 'var(--ok-bg)' : 'transparent',
        border: 'none',
        borderTop: i === 0 ? 'none' : '2px solid var(--line-100)',
        font: 'inherit',
        transition: 'background 120ms ease'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: '0 0 auto',
        width: 34,
        height: 34,
        borderRadius: 'var(--radius-sm)',
        border: `3px solid ${isOn ? 'var(--ok-accent)' : 'var(--ink-300)'}`,
        background: isOn ? 'var(--ok-accent)' : 'var(--surface-0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2
      }
    }, isOn && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "check",
      size: 26,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--fs-body-lg)',
        fontWeight: 'var(--fw-semibold)',
        lineHeight: 'var(--lh-snug)',
        color: 'var(--text-strong)',
        textDecoration: isOn ? 'line-through' : 'none',
        textDecorationColor: 'var(--ok-accent)',
        textDecorationThickness: '2px'
      }
    }, text), hint && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        marginTop: 2,
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--fs-small)',
        color: 'var(--text-muted)',
        lineHeight: 'var(--lh-normal)'
      }
    }, hint))));
  })));
}
Object.assign(__ds_scope, { Checklist });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/checklists/Checklist.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Callout.jsx
try { (() => {
/**
 * Callout — differentiated alert / exception block.
 * Variants map to the plant safety system: advertencia (yellow), prohibido (red),
 * correcto (green), nota (blue), excepcion (neutral-strong).
 */
const VARIANTS = {
  advertencia: {
    bg: 'var(--warn-bg)',
    bd: 'var(--warn-border)',
    ink: 'var(--warn-ink)',
    accent: 'var(--warn-accent)',
    icon: 'warning',
    label: 'Advertencia'
  },
  prohibido: {
    bg: 'var(--danger-bg)',
    bd: 'var(--danger-border)',
    ink: 'var(--danger-ink)',
    accent: 'var(--danger-accent)',
    icon: 'block',
    label: 'Prohibido'
  },
  correcto: {
    bg: 'var(--ok-bg)',
    bd: 'var(--ok-border)',
    ink: 'var(--ok-ink)',
    accent: 'var(--ok-accent)',
    icon: 'check_circle',
    label: 'Correcto'
  },
  nota: {
    bg: 'var(--info-bg)',
    bd: 'var(--info-border)',
    ink: 'var(--info-ink)',
    accent: 'var(--info-accent)',
    icon: 'info',
    label: 'Nota'
  },
  excepcion: {
    bg: 'var(--surface-sunken)',
    bd: 'var(--ink-700)',
    ink: 'var(--ink-900)',
    accent: 'var(--ink-700)',
    icon: 'priority_high',
    label: 'Excepción'
  }
};
function Callout({
  variant = 'nota',
  title,
  children,
  label,
  icon,
  style = {}
}) {
  const v = VARIANTS[variant] || VARIANTS.nota;
  const heading = title || label || v.label;
  return /*#__PURE__*/React.createElement("div", {
    role: "note",
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      background: v.bg,
      border: `2px solid ${v.bd}`,
      borderLeft: `var(--border-width-thick) solid ${v.accent}`,
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4) var(--space-5)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-sm)',
      background: v.accent,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || v.icon,
    size: 28
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-black)',
      fontSize: 'var(--fs-h4)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-tight)',
      color: v.ink,
      lineHeight: 'var(--lh-snug)'
    }
  }, heading), children && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-lg)',
      color: v.ink,
      lineHeight: 'var(--lh-relaxed)'
    }
  }, children)));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Callout.jsx", error: String((e && e.message) || e) }); }

// components/process/FlowDiagram.jsx
try { (() => {
/**
 * FlowDiagram — simple left-to-right process flow (entrada balanza → muestra → patio → salida).
 * Steps are { label, icon, caption }. Wraps and turns vertical on narrow screens via flex-wrap.
 */
function FlowDiagram({
  steps = [],
  vertical = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: vertical ? 'column' : 'row',
      alignItems: vertical ? 'stretch' : 'stretch',
      flexWrap: vertical ? 'nowrap' : 'wrap',
      gap: 0,
      ...style
    }
  }, steps.map((s, i) => {
    const last = i === steps.length - 1;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: vertical ? '0 0 auto' : '1 1 0',
        minWidth: vertical ? 'auto' : 150,
        display: 'flex',
        flexDirection: vertical ? 'row' : 'column',
        alignItems: 'center',
        gap: 'var(--space-3)',
        textAlign: 'center',
        padding: 'var(--space-4)',
        background: 'var(--surface-card)',
        border: '2px solid var(--novopan-green)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: '0 0 auto',
        width: 64,
        height: 64,
        borderRadius: 'var(--radius-md)',
        background: 'var(--novopan-green)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: s.icon || 'arrow_forward',
      size: 36,
      color: "var(--novopan-yellow)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -10,
        left: -10,
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: 'var(--novopan-yellow)',
        color: 'var(--novopan-green)',
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--fw-black)',
        fontSize: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid var(--surface-card)'
      }
    }, i + 1)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: vertical ? 'left' : 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--fw-bold)',
        fontSize: 'var(--fs-body)',
        color: 'var(--text-strong)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--ls-tight)',
        lineHeight: 'var(--lh-snug)'
      }
    }, s.label), s.caption && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 2,
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--fs-small)',
        color: 'var(--text-muted)',
        lineHeight: 'var(--lh-normal)'
      }
    }, s.caption))), !last && /*#__PURE__*/React.createElement("div", {
      style: {
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: vertical ? '4px 0' : '0 4px',
        alignSelf: 'center'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: vertical ? 'arrow_downward' : 'arrow_forward',
      size: 30,
      color: "var(--novopan-green-600)"
    })));
  }));
}
Object.assign(__ds_scope, { FlowDiagram });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/process/FlowDiagram.jsx", error: String((e && e.message) || e) }); }

// components/structure/ActivityStep.jsx
try { (() => {
/**
 * ActivityStep — one numbered activity (4.1–4.15) in the Actividades section.
 * Big number, large instruction text, optional icon, role and key chips.
 */
function ActivityStep({
  number,
  title,
  children,
  icon,
  role,
  systemKey,
  done = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      padding: 'var(--space-5)',
      background: 'var(--surface-card)',
      border: `2px solid ${done ? 'var(--ok-border)' : 'var(--line-200)'}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      width: 64,
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: done ? 'var(--ok-accent)' : 'var(--novopan-green)',
      color: '#fff',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-black)',
      fontSize: '26px',
      lineHeight: 1
    }
  }, done ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 36
  }) : number), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginBottom: children ? 6 : 0,
      flexWrap: 'wrap'
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 26,
    color: "var(--novopan-green)"
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-h4)',
      color: 'var(--text-strong)',
      lineHeight: 'var(--lh-snug)'
    }
  }, title)), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-lg)',
      color: 'var(--text-body)',
      lineHeight: 'var(--lh-relaxed)'
    }
  }, children), (role || systemKey) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-3)',
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, role && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-caption)',
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: 'var(--ink-500)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "person",
    size: 16
  }), " ", role), systemKey && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--fs-caption)',
      color: 'var(--ink-500)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "keyboard",
    size: 16
  }), " Tecla\xA0", /*#__PURE__*/React.createElement("kbd", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      background: 'var(--surface-sunken)',
      border: '2px solid var(--line-200)',
      borderBottomWidth: 4,
      borderRadius: 'var(--radius-sm)',
      padding: '2px 10px',
      color: 'var(--text-strong)'
    }
  }, systemKey)))));
}
Object.assign(__ds_scope, { ActivityStep });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/structure/ActivityStep.jsx", error: String((e && e.message) || e) }); }

// components/structure/Badge.jsx
try { (() => {
/**
 * Badge — compact institutional label (role, frequency, status, doc code).
 * Tones: 'brand' | 'accent' | 'neutral' | 'warn' | 'danger' | 'ok' | 'info'.
 */
const TONES = {
  brand: {
    bg: 'var(--novopan-green)',
    fg: '#fff',
    bd: 'var(--novopan-green)'
  },
  accent: {
    bg: 'var(--novopan-yellow)',
    fg: 'var(--novopan-green)',
    bd: 'var(--novopan-yellow-600)'
  },
  neutral: {
    bg: 'var(--surface-sunken)',
    fg: 'var(--ink-700)',
    bd: 'var(--line-200)'
  },
  warn: {
    bg: 'var(--warn-bg)',
    fg: 'var(--warn-ink)',
    bd: 'var(--warn-border)'
  },
  danger: {
    bg: 'var(--danger-bg)',
    fg: 'var(--danger-ink)',
    bd: 'var(--danger-border)'
  },
  ok: {
    bg: 'var(--ok-bg)',
    fg: 'var(--ok-ink)',
    bd: 'var(--ok-border)'
  },
  info: {
    bg: 'var(--info-bg)',
    fg: 'var(--info-ink)',
    bd: 'var(--info-border)'
  }
};
function Badge({
  children,
  tone = 'neutral',
  icon,
  solid = false,
  style = {}
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-caption)',
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      lineHeight: 1,
      padding: '7px 12px',
      borderRadius: 'var(--radius-pill)',
      background: solid ? t.bd : t.bg,
      color: solid ? '#fff' : t.fg,
      border: `2px solid ${t.bd}`,
      whiteSpace: 'nowrap',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/structure/Badge.jsx", error: String((e && e.message) || e) }); }

// components/process/ProcessCard.jsx
try { (() => {
/**
 * ProcessCard — "ficha de proceso" card for HTML presentations / field guide.
 * Header strip with icon + code, body content, optional footer meta row.
 */
function ProcessCard({
  code,
  title,
  icon,
  tone = 'brand',
  responsible,
  frequency,
  children,
  footer,
  style = {}
}) {
  const head = tone === 'accent' ? {
    bg: 'var(--novopan-yellow)',
    fg: 'var(--novopan-green)',
    chip: 'var(--novopan-green)',
    chipFg: '#fff'
  } : {
    bg: 'var(--novopan-green)',
    fg: '#fff',
    chip: 'var(--novopan-yellow)',
    chipFg: 'var(--novopan-green)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '2px solid var(--line-200)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      padding: 'var(--space-4) var(--space-5)',
      background: head.bg,
      color: head.fg
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-md)',
      background: 'rgba(255,255,255,0.16)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 32,
    color: head.fg
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, code && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-caption)',
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      opacity: 0.9,
      marginBottom: 2
    }
  }, code), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-black)',
      fontSize: 'var(--fs-h3)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-tight)',
      lineHeight: 'var(--lh-tight)'
    }
  }, title))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: 'var(--space-5)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-lg)',
      color: 'var(--text-body)',
      lineHeight: 'var(--lh-relaxed)'
    }
  }, children), (responsible || frequency || footer) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      flexWrap: 'wrap',
      padding: 'var(--space-4) var(--space-5)',
      borderTop: '2px solid var(--line-100)',
      background: 'var(--surface-50)'
    }
  }, responsible && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "brand",
    icon: "person"
  }, responsible), frequency && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "accent",
    icon: "schedule"
  }, frequency), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-muted)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { ProcessCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/process/ProcessCard.jsx", error: String((e && e.message) || e) }); }

// components/structure/KeyCap.jsx
try { (() => {
/**
 * KeyCap — a system key from the "Teclas del sistema" section, drawn as a physical key.
 */
function KeyCap({
  children,
  label,
  size = 'md',
  style = {}
}) {
  const dims = size === 'lg' ? {
    minW: 64,
    h: 64,
    fs: '26px'
  } : size === 'sm' ? {
    minW: 36,
    h: 36,
    fs: '16px'
  } : {
    minW: 48,
    h: 48,
    fs: '20px'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      ...style
    }
  }, /*#__PURE__*/React.createElement("kbd", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: dims.minW,
      height: dims.h,
      padding: '0 12px',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: dims.fs,
      color: 'var(--text-strong)',
      background: 'var(--surface-0)',
      border: '2px solid var(--ink-700)',
      borderBottomWidth: 5,
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-sm)',
      lineHeight: 1
    }
  }, children), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-caption)',
      color: 'var(--text-muted)',
      fontWeight: 'var(--fw-medium)',
      textAlign: 'center'
    }
  }, label));
}
Object.assign(__ds_scope, { KeyCap });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/structure/KeyCap.jsx", error: String((e && e.message) || e) }); }

// components/structure/SectionHeader.jsx
try { (() => {
/**
 * SectionHeader — ISO-9001 style numbered section header for an IJP.
 * Keeps numbering and casing consistent across all instructivos.
 */
function SectionHeader({
  number,
  title,
  icon,
  eyebrow,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      padding: 'var(--space-4) var(--space-5)',
      background: 'var(--novopan-green)',
      color: '#fff',
      borderRadius: 'var(--radius-md)',
      ...style
    }
  }, number != null && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      minWidth: 56,
      height: 56,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 12px',
      background: 'var(--novopan-yellow)',
      color: 'var(--novopan-green)',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-black)',
      fontSize: 'var(--fs-h3)',
      borderRadius: 'var(--radius-sm)',
      lineHeight: 1
    }
  }, number), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-caption)',
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      color: 'var(--novopan-yellow)'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-black)',
      fontSize: 'var(--fs-h3)',
      letterSpacing: 'var(--ls-tight)',
      textTransform: 'uppercase',
      lineHeight: 'var(--lh-tight)'
    }
  }, title)), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      flex: '0 0 auto',
      opacity: 0.85
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 40,
    color: "var(--novopan-yellow)"
  })));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/structure/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/tables/InfoTable.jsx
try { (() => {
/**
 * InfoTable — clear, high-contrast table for roles, frequencies, definitions, equipment.
 * Columns describe headers; rows are arrays of cells (string or React node).
 */
function InfoTable({
  columns = [],
  rows = [],
  caption,
  zebra = true,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto',
      borderRadius: 'var(--radius-md)',
      border: '2px solid var(--line-200)',
      boxShadow: 'var(--shadow-sm)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-body)',
      background: 'var(--surface-card)'
    }
  }, caption && /*#__PURE__*/React.createElement("caption", {
    style: {
      captionSide: 'top',
      textAlign: 'left',
      padding: 'var(--space-4) var(--space-5)',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-h4)',
      color: 'var(--text-strong)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-tight)',
      background: 'var(--surface-sunken)',
      borderBottom: '2px solid var(--line-200)'
    }
  }, caption), /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map((c, i) => {
    const label = typeof c === 'string' ? c : c.label;
    const align = typeof c === 'object' && c.align ? c.align : 'left';
    const w = typeof c === 'object' ? c.width : undefined;
    return /*#__PURE__*/React.createElement("th", {
      key: i,
      style: {
        textAlign: align,
        width: w,
        padding: 'var(--space-4) var(--space-5)',
        background: 'var(--novopan-green)',
        color: '#fff',
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--fw-bold)',
        fontSize: 'var(--fs-body)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--ls-wide)',
        borderRight: i < columns.length - 1 ? '1px solid rgba(255,255,255,0.18)' : 'none',
        whiteSpace: 'nowrap'
      }
    }, label);
  }))), /*#__PURE__*/React.createElement("tbody", null, rows.map((row, ri) => /*#__PURE__*/React.createElement("tr", {
    key: ri,
    style: {
      background: zebra && ri % 2 ? 'var(--surface-50)' : 'transparent'
    }
  }, row.map((cell, ci) => {
    const align = typeof columns[ci] === 'object' && columns[ci].align ? columns[ci].align : 'left';
    return /*#__PURE__*/React.createElement("td", {
      key: ci,
      style: {
        textAlign: align,
        padding: 'var(--space-4) var(--space-5)',
        fontSize: 'var(--fs-body)',
        color: 'var(--text-body)',
        lineHeight: 'var(--lh-normal)',
        fontWeight: ci === 0 ? 'var(--fw-semibold)' : 'var(--fw-regular)',
        borderTop: '2px solid var(--line-100)',
        verticalAlign: 'middle'
      }
    }, cell);
  }))))));
}
Object.assign(__ds_scope, { InfoTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tables/InfoTable.jsx", error: String((e && e.message) || e) }); }

// ui_kits/guia_de_campo/GuiaApp.jsx
try { (() => {
// Guía de Campo — tablet shell. Cover + left nav rail + content.
const DSk = window.NovopanInstructivosDesignSystem_ed66c5;
const {
  Icon: DSIcon,
  Badge: DSBadge
} = DSk;
function Cover({
  onStart
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 40,
      background: 'var(--novopan-green)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/novopan-logo.jpg",
    alt: "Novopan",
    style: {
      width: 320,
      maxWidth: '70%',
      borderRadius: 10,
      marginBottom: 36,
      boxShadow: 'var(--shadow-lg)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 'var(--fs-caption)',
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      color: 'var(--novopan-yellow)',
      marginBottom: 12
    }
  }, "Instructivo de Procedimiento \xB7 IJP-REC-001"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 'var(--fs-h1)',
      textTransform: 'uppercase',
      letterSpacing: '-0.01em',
      lineHeight: 1.04,
      maxWidth: 720
    }
  }, "Recepci\xF3n de Madera"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '16px 0 0',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-lg)',
      color: 'rgba(255,255,255,0.85)',
      maxWidth: 560,
      lineHeight: 1.5
    }
  }, "Gu\xEDa de campo para operadores de balanza, ayudantes de patios y supervisores."), /*#__PURE__*/React.createElement("button", {
    onClick: onStart,
    style: {
      marginTop: 40,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer',
      minHeight: 'var(--touch-min)',
      padding: '0 32px',
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      background: 'var(--novopan-yellow)',
      color: 'var(--novopan-green)',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 'var(--fs-h4)',
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
      boxShadow: 'var(--shadow-md)'
    }
  }, "Comenzar ", /*#__PURE__*/React.createElement(DSIcon, {
    name: "arrow_forward",
    size: 28
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 20,
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'rgba(255,255,255,0.6)'
    }
  }, "Rev. 03 \xB7 Vigente desde 2026-01 \xB7 Planta Itulcachi, Quito"));
}
function App() {
  const nav = window.GuiaScreens.nav;
  const [view, setView] = React.useState('cover'); // 'cover' | section id
  const active = nav.find(s => s.id === view);
  const idx = nav.findIndex(s => s.id === view);
  if (view === 'cover') return /*#__PURE__*/React.createElement(Cover, {
    onStart: () => setView(nav[0].id)
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: '0 0 264px',
      background: 'var(--novopan-green)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      padding: '18px 14px',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView('cover'),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '6px 10px 16px',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement(DSIcon, {
    name: "home",
    size: 24,
    color: "var(--novopan-yellow)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 20,
      color: '#fff',
      textTransform: 'uppercase',
      letterSpacing: '-0.01em'
    }
  }, "Recepci\xF3n")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, nav.map(s => {
    const on = s.id === view;
    return /*#__PURE__*/React.createElement("button", {
      key: s.id,
      onClick: () => setView(s.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        textAlign: 'left',
        minHeight: 'var(--touch-min)',
        padding: '0 14px',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        background: on ? 'var(--novopan-yellow)' : 'transparent',
        color: on ? 'var(--novopan-green)' : 'rgba(255,255,255,0.92)',
        fontFamily: 'var(--font-body)',
        fontWeight: on ? 700 : 500,
        fontSize: 'var(--fs-body)',
        transition: 'background 120ms'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: '0 0 auto',
        width: 30,
        height: 30,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: on ? 'rgba(0,78,56,0.12)' : 'rgba(255,255,255,0.12)',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 15
      }
    }, s.n), /*#__PURE__*/React.createElement(DSIcon, {
      name: s.icon,
      size: 22
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, s.label));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '32px 40px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: '0 auto'
    }
  }, active && /*#__PURE__*/React.createElement(active.Comp, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 40px',
      borderTop: '2px solid var(--line-200)',
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView(nav[Math.max(0, idx - 1)].id),
    disabled: idx === 0,
    style: navBtn(idx === 0)
  }, /*#__PURE__*/React.createElement(DSIcon, {
    name: "arrow_back",
    size: 24
  }), " Anterior"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-small)',
      color: 'var(--text-muted)'
    }
  }, "Secci\xF3n ", active.n, " de ", nav.length), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView(nav[Math.min(nav.length - 1, idx + 1)].id),
    disabled: idx === nav.length - 1,
    style: {
      ...navBtn(idx === nav.length - 1),
      marginLeft: 'auto',
      background: 'var(--novopan-green)',
      color: '#fff'
    }
  }, "Siguiente ", /*#__PURE__*/React.createElement(DSIcon, {
    name: "arrow_forward",
    size: 24
  })))));
}
function navBtn(disabled) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    minHeight: 'var(--touch-min)',
    padding: '0 22px',
    borderRadius: 'var(--radius-pill)',
    border: '2px solid var(--line-200)',
    background: 'var(--surface-card)',
    color: 'var(--text-strong)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 'var(--fs-body)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em'
  };
}
window.GuiaApp = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/guia_de_campo/GuiaApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/guia_de_campo/Screens.jsx
try { (() => {
// Guía de Campo — section bodies. Composes Novopan DS components from the bundle.
// Exposes each section + nav metadata on window.GuiaScreens.
const DS = window.NovopanInstructivosDesignSystem_ed66c5;
const {
  SectionHeader,
  ActivityStep,
  Checklist,
  Callout,
  InfoTable,
  ProcessCard,
  FlowDiagram,
  Badge,
  KeyCap,
  Icon
} = DS;
const Stack = ({
  children,
  gap = 20
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    flexDirection: 'column',
    gap
  }
}, children);
const Lead = ({
  children
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    margin: 0,
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--fs-body-lg)',
    color: 'var(--text-body)',
    lineHeight: 'var(--lh-relaxed)',
    maxWidth: 760
  }
}, children);

// 1 — Definiciones
function Definiciones() {
  return /*#__PURE__*/React.createElement(Stack, null, /*#__PURE__*/React.createElement(SectionHeader, {
    number: "1",
    eyebrow: "IJP-REC-001",
    title: "Definiciones",
    icon: "menu_book"
  }), /*#__PURE__*/React.createElement(Lead, null, "T\xE9rminos usados en la recepci\xF3n de madera, rolliza y subproductos."), /*#__PURE__*/React.createElement(InfoTable, {
    columns: [{
      label: 'Término',
      width: '28%'
    }, 'Significado'],
    rows: [['Balanza', 'Báscula de pesaje vehicular a la entrada y salida de planta.'], ['Guía de remisión', 'Documento que respalda el transporte y la carga del vehículo.'], ['Muestra', 'Porción de material tomada para medir humedad y calidad.'], ['Patio', 'Zona de descarga y acopio del material recibido.'], ['Peso neto', 'Diferencia entre el peso de entrada (bruto) y el de salida (tara).'], ['Subproducto', 'Material derivado: aserrín, viruta, costaneras, recortes.']]
  }));
}

// 2 — Responsabilidad
function Responsabilidad() {
  return /*#__PURE__*/React.createElement(Stack, null, /*#__PURE__*/React.createElement(SectionHeader, {
    number: "2",
    eyebrow: "IJP-REC-001",
    title: "Responsabilidad",
    icon: "groups"
  }), /*#__PURE__*/React.createElement(Lead, null, "Qui\xE9n hace qu\xE9 y con qu\xE9 frecuencia durante la recepci\xF3n."), /*#__PURE__*/React.createElement(InfoTable, {
    columns: ['Rol', {
      label: 'Actividad principal',
      width: '46%'
    }, {
      label: 'Frecuencia',
      align: 'center'
    }],
    rows: [['Balanzero', 'Pesar, registrar y validar la guía de cada vehículo', /*#__PURE__*/React.createElement(Badge, {
      tone: "accent"
    }, "Por ingreso")], ['Ayudante de patios', 'Dirigir la descarga y verificar el material', /*#__PURE__*/React.createElement(Badge, {
      tone: "accent"
    }, "Por turno")], ['Laboratorio', 'Tomar muestra y medir humedad', /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, "Por lote")], ['Supervisor de recepción', 'Autorizar excepciones y firmar el cierre', /*#__PURE__*/React.createElement(Badge, {
      tone: "brand"
    }, "Diaria")]]
  }), /*#__PURE__*/React.createElement(FlowDiagram, {
    steps: [{
      label: 'Balanza',
      icon: 'balance',
      caption: 'Pesaje entrada'
    }, {
      label: 'Muestra',
      icon: 'science',
      caption: 'Humedad'
    }, {
      label: 'Patio',
      icon: 'warehouse',
      caption: 'Descarga'
    }, {
      label: 'Salida',
      icon: 'logout',
      caption: 'Pesaje salida'
    }]
  }));
}

// 3 — Actividades
function Actividades() {
  return /*#__PURE__*/React.createElement(Stack, null, /*#__PURE__*/React.createElement(SectionHeader, {
    number: "3",
    eyebrow: "IJP-REC-001",
    title: "Actividades",
    icon: "checklist"
  }), /*#__PURE__*/React.createElement(Lead, null, "Siga los pasos en orden. Marque cada verificaci\xF3n antes de continuar."), /*#__PURE__*/React.createElement(Checklist, {
    title: "Antes de pesar (4.1)",
    items: [{
      text: 'Vehículo detenido por completo sobre la balanza',
      hint: 'Freno de mano puesto'
    }, {
      text: 'Conductor entregó la guía de remisión'
    }, {
      text: 'Plataforma libre de obstáculos'
    }]
  }), /*#__PURE__*/React.createElement(ActivityStep, {
    number: "4.2",
    icon: "balance",
    title: "Registrar peso de entrada (bruto)",
    role: "Balanzero",
    systemKey: "F2"
  }, "Confirme la placa y el tipo de material. El sistema guarda el peso bruto."), /*#__PURE__*/React.createElement(ActivityStep, {
    number: "4.3",
    icon: "science",
    title: "Tomar muestra de humedad",
    role: "Laboratorio"
  }, "Tome la muestra del lote indicado y env\xEDela a laboratorio antes de la descarga."), /*#__PURE__*/React.createElement(ActivityStep, {
    number: "4.4",
    icon: "warehouse",
    title: "Dirigir el veh\xEDculo al patio asignado",
    role: "Ayudante de patios"
  }, "Indique la zona de descarga seg\xFAn el tipo de material."), /*#__PURE__*/React.createElement(ActivityStep, {
    number: "4.5",
    icon: "logout",
    title: "Registrar peso de salida (tara)",
    role: "Balanzero",
    systemKey: "Enter"
  }, "El sistema calcula el peso neto recibido autom\xE1ticamente."));
}

// 4 — Excepciones
function Excepciones() {
  return /*#__PURE__*/React.createElement(Stack, null, /*#__PURE__*/React.createElement(SectionHeader, {
    number: "4",
    eyebrow: "IJP-REC-001",
    title: "Excepciones",
    icon: "report"
  }), /*#__PURE__*/React.createElement(Lead, null, "Casos que se salen del flujo normal. Act\xFAe seg\xFAn la indicaci\xF3n."), /*#__PURE__*/React.createElement(Callout, {
    variant: "prohibido"
  }, "Prohibido el ingreso de veh\xEDculos sin gu\xEDa de remisi\xF3n."), /*#__PURE__*/React.createElement(Callout, {
    variant: "advertencia",
    title: "Carga h\xFAmeda"
  }, "No autorice la descarga si la humedad supera el l\xEDmite del lote. Tome una segunda muestra."), /*#__PURE__*/React.createElement(Callout, {
    variant: "excepcion",
    title: "Excepci\xF3n 4.3 \u2014 Balanza fuera de servicio"
  }, "Registre el peso manual en el formato FR-REC-02 y avise de inmediato al supervisor."), /*#__PURE__*/React.createElement(Callout, {
    variant: "correcto",
    title: "Recepci\xF3n conforme"
  }, "Si peso, gu\xEDa y muestra coinciden, cierre el ingreso y entregue el comprobante."));
}

// 5 — Equipos
function Equipos() {
  const items = [{
    icon: 'balance',
    name: 'Balanza vehicular',
    note: 'Capacidad 80 t'
  }, {
    icon: 'monitor',
    name: 'Terminal de pesaje',
    note: 'Sistema WIM'
  }, {
    icon: 'water_drop',
    name: 'Medidor de humedad',
    note: 'Laboratorio'
  }, {
    icon: 'print',
    name: 'Impresora de comprobantes',
    note: 'Caseta de balanza'
  }, {
    icon: 'forklift',
    name: 'Cargador frontal',
    note: 'Patio de acopio'
  }, {
    icon: 'health_and_safety',
    name: 'EPP del operador',
    note: 'Casco, chaleco, botas'
  }];
  return /*#__PURE__*/React.createElement(Stack, null, /*#__PURE__*/React.createElement(SectionHeader, {
    number: "5",
    eyebrow: "IJP-REC-001",
    title: "Equipos",
    icon: "construction"
  }), /*#__PURE__*/React.createElement(Lead, null, "Equipos requeridos para ejecutar el instructivo."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: 16
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      padding: 18,
      background: 'var(--surface-card)',
      border: '2px solid var(--line-200)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      width: 56,
      height: 56,
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-sunken)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 34,
    color: "var(--novopan-green)"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--fs-body-lg)',
      color: 'var(--text-strong)',
      lineHeight: 1.15
    }
  }, it.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-small)',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, it.note))))));
}

// 6 — Teclas del sistema
function Teclas() {
  const keys = [{
    k: 'F2',
    label: 'Pesar entrada'
  }, {
    k: 'F4',
    label: 'Tomar muestra'
  }, {
    k: 'F8',
    label: 'Asignar patio'
  }, {
    k: 'Enter',
    label: 'Pesar salida'
  }, {
    k: 'F12',
    label: 'Imprimir comprobante'
  }, {
    k: 'Esc',
    label: 'Cancelar registro'
  }];
  return /*#__PURE__*/React.createElement(Stack, null, /*#__PURE__*/React.createElement(SectionHeader, {
    number: "6",
    eyebrow: "IJP-REC-001",
    title: "Teclas del sistema",
    icon: "keyboard"
  }), /*#__PURE__*/React.createElement(Lead, null, "Atajos del terminal de pesaje. Misma asignaci\xF3n en todos los turnos."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 28,
      padding: 24,
      background: 'var(--surface-card)',
      border: '2px solid var(--line-200)',
      borderRadius: 'var(--radius-md)'
    }
  }, keys.map((it, i) => /*#__PURE__*/React.createElement(KeyCap, {
    key: i,
    size: "lg",
    label: it.label
  }, it.k))));
}

// 7 — Documentos relacionados
function Documentos() {
  const docs = [{
    code: 'FR-REC-01',
    name: 'Registro de recepción de madera'
  }, {
    code: 'FR-REC-02',
    name: 'Registro de pesaje manual (contingencia)'
  }, {
    code: 'FR-LAB-03',
    name: 'Reporte de humedad por lote'
  }, {
    code: 'IJP-DES-001',
    name: 'Instructivo de Descargas y Consumo'
  }, {
    code: 'IJP-INV-001',
    name: 'Instructivo de Inventario'
  }];
  return /*#__PURE__*/React.createElement(Stack, null, /*#__PURE__*/React.createElement(SectionHeader, {
    number: "7",
    eyebrow: "IJP-REC-001",
    title: "Documentos relacionados",
    icon: "description"
  }), /*#__PURE__*/React.createElement(Lead, null, "Formatos e instructivos vinculados a la recepci\xF3n."), /*#__PURE__*/React.createElement(Stack, {
    gap: 12
  }, docs.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px 20px',
      background: 'var(--surface-card)',
      border: '2px solid var(--line-200)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "description",
    size: 30,
    color: "var(--novopan-green)"
  }), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, d.code), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-lg)',
      color: 'var(--text-strong)',
      fontWeight: 500
    }
  }, d.name), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron_right",
    size: 28,
    color: "var(--ink-300)",
    style: {
      marginLeft: 'auto'
    }
  })))));
}
window.GuiaScreens = {
  nav: [{
    id: 'def',
    n: '1',
    label: 'Definiciones',
    icon: 'menu_book',
    Comp: Definiciones
  }, {
    id: 'resp',
    n: '2',
    label: 'Responsabilidad',
    icon: 'groups',
    Comp: Responsabilidad
  }, {
    id: 'act',
    n: '3',
    label: 'Actividades',
    icon: 'checklist',
    Comp: Actividades
  }, {
    id: 'exc',
    n: '4',
    label: 'Excepciones',
    icon: 'report',
    Comp: Excepciones
  }, {
    id: 'equ',
    n: '5',
    label: 'Equipos',
    icon: 'construction',
    Comp: Equipos
  }, {
    id: 'key',
    n: '6',
    label: 'Teclas del sistema',
    icon: 'keyboard',
    Comp: Teclas
  }, {
    id: 'doc',
    n: '7',
    label: 'Documentos',
    icon: 'description',
    Comp: Documentos
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/guia_de_campo/Screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Checklist = __ds_scope.Checklist;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.FlowDiagram = __ds_scope.FlowDiagram;

__ds_ns.ProcessCard = __ds_scope.ProcessCard;

__ds_ns.ActivityStep = __ds_scope.ActivityStep;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.KeyCap = __ds_scope.KeyCap;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.InfoTable = __ds_scope.InfoTable;

})();
