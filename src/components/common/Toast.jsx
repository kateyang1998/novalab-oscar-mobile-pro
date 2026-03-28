import React, { useState, useCallback, useEffect } from 'react';
import { ToastContext } from './toastContext';
import theme from '../../styles/theme';
import { IconCheckCircle, IconAlertCircle, IconInfo, IconX, IconAlert } from './Icons';

let idCounter = 1;

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ message, variant = 'general', duration = 4000 }) => {
    const id = idCounter++;
    setToasts((t) => [...t, { id, message, variant }]);
    if (duration > 0) {
      setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), duration);
    }
    return id;
  }, []);

  const hideToast = useCallback((id) => setToasts((t) => t.filter(x => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div aria-live="polite" aria-atomic="true" style={containerStyle}>
        <div style={stackStyle}>
          {toasts.map(t => (
            <Toast key={t.id} variant={t.variant} onClose={() => hideToast(t.id)}>
              {t.message}
            </Toast>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ children, variant = 'general', onClose }) {
  useEffect(() => {
    // no-op
  }, []);

  // Helper: create a solid light background by mixing the color with white
  const hexToLightBg = (hex, weight = 0.92) => {
    if (!hex) return '#ffffff';
    const h = hex.replace('#', '');
    const hexFull = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const bigint = parseInt(hexFull, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    // mix with white using weight (0..1) where 1 yields white, 0 yields original color
    const r2 = Math.round(r + (255 - r) * weight);
    const g2 = Math.round(g + (255 - g) * weight);
    const b2 = Math.round(b + (255 - b) * weight);
    return `rgb(${r2}, ${g2}, ${b2})`;
  };

  const variantCfg = {
    success: { border: theme.colors.oscarGreen, icon: <IconCheckCircle color={theme.colors.oscarGreen} /> },
    error: { border: theme.colors.oscarRed, icon: <IconAlertCircle color={theme.colors.oscarRed} /> },
    warning: { border: theme.colors.yukonGold, icon: <IconAlert color={theme.colors.yukonGold} /> },
    general: { border: theme.colors.oscarBlue, icon: <IconInfo color={theme.colors.oscarBlue} /> },
  };

  const cfg = variantCfg[variant] || variantCfg.general;
  // produce a light opaque background color based on the border color
  const bg = hexToLightBg(cfg.border, 0.92);

  return (
    <div role="status" style={{ ...toastStyle, backgroundColor: bg, borderLeft: `4px solid ${cfg.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>{cfg.icon}</div>
        <div style={{ flex: 1 }}>{children}</div>
      </div>
      <button onClick={onClose} aria-label="Dismiss" style={closeBtnStyle}><IconX color={theme.colors.shark} /></button>
    </div>
  );
}

const containerStyle = {
  position: 'fixed',
  right: 16,
  bottom: 20,
  zIndex: 2000,
  pointerEvents: 'none',
};

const stackStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  alignItems: 'flex-end',
};

const toastStyle = {
  pointerEvents: 'auto',
  minWidth: 220,
  maxWidth: 380,
  color: 'var(--oscar-black)',
  padding: '10px 12px',
  borderRadius: 8,
  boxShadow: '0 6px 18px rgba(16,24,40,0.12)',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
};

const closeBtnStyle = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
};

export default ToastProvider;


