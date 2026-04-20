import React from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import GlassCard from '../components/ui/GlassCard';
import { formatAmount } from '../utils/currency';
import SpendingChart from '../components/analytics/SpendingChart';
import CategoryBreakdown from '../components/analytics/CategoryBreakdown';
import { motion } from 'framer-motion';

export default function Analytics() {
  const { state } = useApp();
  const allExpenses = state.groups.flatMap((g) => g.expenses.map((e) => ({ ...e, currency: g.currency })));
  let total = 0;
  const byMonth = {}, byCategory = {};
  allExpenses.forEach((e) => {
    const amount = parseFloat(e.amount);
    total += amount;
    byMonth[e.date.slice(0, 7)] = (byMonth[e.date.slice(0, 7)] || 0) + amount;
    byCategory[e.category] = (byCategory[e.category] || 0) + amount;
  });

  return (
    <div style={{ padding: '0 0 48px' }}>
      <Header title="Analytics" subtitle="Across all groups" />
      <div style={{ padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'All-Time Spent', value: formatAmount(total), mono: true },
            { label: 'Total Expenses', value: allExpenses.length },
            { label: 'Active Groups', value: state.groups.length },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <GlassCard style={{ padding: '18px 22px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: s.mono ? 'var(--font-mono)' : undefined }}>{s.value}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <SpendingChart byMonth={byMonth} currency="INR" />
          <CategoryBreakdown byCategory={byCategory} currency="INR" total={total} />
        </div>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>By Group</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {state.groups.map((group) => {
            const gTotal = group.expenses.reduce((s, e) => s + parseFloat(e.amount), 0);
            const pct = total > 0 ? (gTotal / total) * 100 : 0;
            return (
              <GlassCard key={group.id} style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{group.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--accent-green)' }}>{formatAmount(gTotal, group.currency)}</span>
                </div>
                <div style={{ height: 5, background: 'var(--bg-secondary)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: group.color || 'var(--accent-green)', borderRadius: 99, transition: 'width 0.8s ease' }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>{pct.toFixed(1)}% of total</div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}