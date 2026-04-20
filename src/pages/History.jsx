import React from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import GlassCard from '../components/ui/GlassCard';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { formatAmount } from '../utils/currency';
import { getCategoryById } from '../utils/categories';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function History() {
  const { state } = useApp();
  const all = [
    ...state.groups.flatMap((g) => g.expenses.map((e) => ({ ...e, type: 'expense', groupName: g.name, currency: g.currency, members: g.members }))),
    ...state.groups.flatMap((g) => (g.settlements || []).map((s) => ({ ...s, type: 'settlement', groupName: g.name, currency: g.currency, members: g.members }))),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ padding: '0 0 48px' }}>
      <Header title="History" subtitle="All transactions across groups" />
      <div style={{ padding: '0 32px' }}>
        {!all.length ? (
          <GlassCard style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-muted)' }}>No history yet</div>
          </GlassCard>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {all.map((item, i) => {
              if (item.type === 'expense') {
                const payer = item.members.find((m) => m.id === item.paidBy);
                const cat = getCategoryById(item.category);
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}>
                    <GlassCard style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{cat.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</span>
                            <Badge color={cat.color} bg={cat.bg} style={{ fontSize: 10 }}>{item.groupName}</Badge>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Avatar name={payer?.name} color={payer?.color} size={16} />
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{payer?.name} · {format(new Date(item.date), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{formatAmount(item.amount, item.currency)}</div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              }
              if (item.type === 'settlement') {
                const from = item.members.find((m) => m.id === item.from);
                const to = item.members.find((m) => m.id === item.to);
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}>
                    <GlassCard style={{ padding: '14px 20px', borderColor: '#bbf7d0', background: '#f0fdf4' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CheckCircle size={18} color="var(--accent-green)" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-green)' }}>Settlement</span>
                            <Badge color="#1a7a4a" bg="#dcfce7" style={{ fontSize: 10 }}>{item.groupName}</Badge>
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{from?.name} → {to?.name} · {format(new Date(item.date), 'MMM d, yyyy')}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: 'var(--accent-green)' }}>{formatAmount(item.amount, item.currency)}</div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}