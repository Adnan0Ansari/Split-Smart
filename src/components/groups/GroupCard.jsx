import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Avatar from '../ui/Avatar';
import { formatAmount } from '../../utils/currency';
import { useExpenseCalculator } from '../../hooks/useExpenseCalculator';
import { useSettlement } from '../../hooks/useSettlement';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';

export default function GroupCard({ group, index }) {
  const navigate = useNavigate();
  const { state } = useApp();
  const stats = useExpenseCalculator(group);
  const { transactions } = useSettlement(group);
  const iOwe = transactions.filter((t) => t.from === state.currentUserId).reduce((s, t) => s + t.amount, 0);
  const owedToMe = transactions.filter((t) => t.to === state.currentUserId).reduce((s, t) => s + t.amount, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07, duration: 0.3 }}>
      <GlassCard hoverable onClick={() => navigate(`/group/${group.id}`)} style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{group.name.match(/[\u{1F300}-\u{1FFFF}]/u)?.[0] || '💰'}</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
              {group.name.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').trim()}
            </h3>
            {group.description && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{group.description}</p>}
          </div>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRight size={14} color="var(--text-muted)" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 0, marginBottom: 16, background: 'var(--bg-secondary)', borderRadius: 10, overflow: 'hidden' }}>
          {[
            { label: 'Spent', value: formatAmount(stats.total, group.currency), mono: true },
            { label: 'Expenses', value: group.expenses.length },
            { label: 'Pending', value: transactions.length, highlight: transactions.length > 0 },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: 1, padding: '10px 12px', borderRight: i < 2 ? '1px solid var(--glass-border)' : 'none' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontFamily: s.mono ? 'var(--font-mono)' : undefined, fontSize: 14, fontWeight: 700, color: s.highlight ? 'var(--accent-amber)' : 'var(--text-primary)' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {(iOwe > 0 || owedToMe > 0) && (
          <div style={{ padding: '8px 12px', borderRadius: 8, background: iOwe > 0 ? '#fff1f2' : '#f0fdf4', border: `1px solid ${iOwe > 0 ? '#fecdd3' : '#bbf7d0'}`, fontSize: 12, color: iOwe > 0 ? 'var(--accent-rose)' : 'var(--accent-green)', fontWeight: 600, marginBottom: 14 }}>
            {iOwe > 0 ? `You owe ${formatAmount(iOwe, group.currency)}` : `You're owed ${formatAmount(owedToMe, group.currency)}`}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            {group.members.slice(0, 4).map((m, i) => (
              <Avatar key={m.id} name={m.name} color={m.color} size={26} style={{ marginLeft: i > 0 ? -8 : 0, border: '2px solid #fff' }} />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12 }}>
            <Users size={12} /> {group.members.length} members
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}