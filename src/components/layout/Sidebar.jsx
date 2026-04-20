import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, History, Plus, Zap, LogOut, LogIn } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Avatar from '../ui/Avatar';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/history', label: 'History', icon: History },
];

export default function Sidebar({ onCreateGroup }) {
  const { state, user, loginWithGoogle, logout } = useApp();
  const navigate = useNavigate();

  return (
    <aside style={{
      width: 248, minHeight: '100vh',
      background: '#ffffff', borderRight: '1px solid var(--glass-border)',
      display: 'flex', flexDirection: 'column', padding: '24px 14px',
      position: 'sticky', top: 0, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, padding: '0 8px' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={18} color="#fff" fill="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', lineHeight: 1 }}>SplitSmart</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Expense Splitter</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 28 }}>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 10, fontSize: 14, fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--accent-green)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-green-light)' : 'transparent',
              border: isActive ? '1px solid var(--accent-green-mid)' : '1px solid transparent',
              transition: 'var(--transition)', textDecoration: 'none',
            })}
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Groups</span>
          <button onClick={onCreateGroup} style={{ background: 'var(--accent-green-light)', border: '1px solid var(--accent-green-mid)', borderRadius: 6, padding: '3px 8px', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={11} /> New
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {state.groups.map((group) => (
            <button key={group.id} onClick={() => navigate(`/group/${group.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', borderRadius: 8, background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', textAlign: 'left', transition: 'var(--transition)', width: '100%' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 16 }}>{group.name.match(/[\u{1F300}-\u{1FFFF}]/u)?.[0] || '💰'}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {group.name.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').trim()}
              </span>
              <span style={{ fontSize: 10, background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 99, padding: '1px 6px', color: 'var(--text-muted)', flexShrink: 0 }}>
                {group.members.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ padding: '12px 14px', borderRadius: 14, background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {user ? (
              <>
                <img src={user.photoURL} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--accent-green-mid)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.displayName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Google account</div>
                </div>
              </>
            ) : (
              <>
                <Avatar name="Adnan" color="#1a7a4a" size={32} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Adnan</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Active member</div>
                </div>
              </>
            )}
          </div>
        </div>
        <button
          onClick={user ? logout : loginWithGoogle}
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 14px', borderRadius: 10, background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', transition: 'var(--transition)', fontFamily: 'var(--font-body)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          {user ? <><LogOut size={14} /> Sign out</> : <><LogIn size={14} /> Sign in with Google</>}
        </button>
      </div>
    </aside>
  );
}