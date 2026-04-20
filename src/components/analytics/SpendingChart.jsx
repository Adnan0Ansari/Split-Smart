import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../ui/GlassCard';
import { formatAmount } from '../../utils/currency';
import { format, parseISO } from 'date-fns';

const CustomTooltip = ({ active, payload, currency }) => {
  if (active && payload?.length) return (
    <div style={{ background: '#fff', border: '1px solid var(--glass-border)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--accent-green)' }}>{formatAmount(payload[0].value, currency)}</div>
    </div>
  );
  return null;
};

export default function SpendingChart({ byMonth, currency }) {
  const data = Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b)).map(([month, amount]) => ({ month: format(parseISO(`${month}-01`), 'MMM yy'), amount }));
  return (
    <GlassCard style={{ padding: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Spending Over Time</h3>
      {!data.length ? <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0', fontSize: 13 }}>No data yet</div> : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a7a4a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1a7a4a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: '#9c9289', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9c9289', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Area type="monotone" dataKey="amount" stroke="#1a7a4a" strokeWidth={2.5} fill="url(#colorAmt)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </GlassCard>
  );
}