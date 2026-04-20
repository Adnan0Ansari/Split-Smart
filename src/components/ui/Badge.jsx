import React from 'react';

export default function Badge({ children, color = '#1a7a4a', bg, style = {} }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px',
      borderRadius: 999, fontSize: 11, fontWeight: 600,
      background: bg || `${color}15`, color, border: `1px solid ${color}25`, ...style,
    }}>
      {children}
    </span>
  );
}