import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../ui/GlassCard';
import { getCategoryById } from '../../utils/categories';
import { formatAmount } from '../../utils/currency';

export default function CategoryBreakdown({ byCategory, currency, total }) {
  const data = Object.entries(byCategory).map(([catId, amount]) => { const cat = getCategoryById(catId); return { name: cat.label, icon: cat.icon, value: amount, color: cat.color, bg: cat.bg }; }).sort((a, b) => b.value - a.value);
  return (
    <GlassCard style={{ padding: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>By Category</h3>
      {!data.length ? <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0', fontSize: 13 }}>No data</div> : (
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <ResponsiveContainer width={110} height={110}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={32} outerRadius={52} dataKey="value" strokeWidth={3} stroke="#fff">
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={({ active, payload }) => active && payload?.length ? (
                <div style={{ background: '#fff', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '8px 12px', boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{payload[0].name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: payload[0].payload.color }}>{formatAmount(payload[0].value, currency)}</div>
                </div>
              ) : null} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {data.slice(0, 5).map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.name}</span>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{((item.value / total) * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 3, background: 'var(--bg-secondary)', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${(item.value / total) * 100}%`, background: item.color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}