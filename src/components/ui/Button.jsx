import React from 'react';

const variants = {
  primary: { background: '#1a7a4a', color: '#fff', border: 'none', fontWeight: 600 },
  ghost: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)', fontWeight: 500 },
  danger: { background: '#fff1f2', color: 'var(--accent-rose)', border: '1px solid #fecdd3', fontWeight: 500 },
  amber: { background: '#fffbeb', color: 'var(--accent-amber)', border: '1px solid #fde68a', fontWeight: 500 },
  soft: { background: 'var(--accent-green-light)', color: 'var(--accent-green)', border: '1px solid var(--accent-green-mid)', fontWeight: 600 },
};

export default function Button({ children, variant = 'primary', size = 'md', onClick, disabled = false, style = {}, icon, fullWidth = false }) {
  const padding = size === 'sm' ? '6px 14px' : size === 'lg' ? '14px 28px' : '10px 20px';
  const fontSize = size === 'sm' ? '13px' : size === 'lg' ? '16px' : '14px';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7, padding, fontSize,
        fontFamily: 'var(--font-body)', borderRadius: 'var(--radius-sm)',
        transition: 'var(--transition)', opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto', justifyContent: fullWidth ? 'center' : undefined,
        ...variants[variant], ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.opacity = '0.85'; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.opacity = '1'; }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
}