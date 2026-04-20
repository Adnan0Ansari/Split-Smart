import React from 'react';

export default function Avatar({ name, color = '#1a7a4a', size = 36, style = {} }) {
  const initials = name ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) : '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${color}18`, border: `2px solid ${color}33`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)', fontSize: size * 0.34, fontWeight: 700,
      color, flexShrink: 0, ...style,
    }}>
      {initials}
    </div>
  );
}