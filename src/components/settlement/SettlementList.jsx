import React from 'react';
import SettlementCard from './SettlementCard';
import { motion } from 'framer-motion';

export default function SettlementList({ transactions, group }) {
  if (!transactions.length) return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-green)' }}>All settled up!</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>No pending transactions</div>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {transactions.map((t, i) => (
        <motion.div key={`${t.from}-${t.to}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
          <SettlementCard transaction={t} group={group} />
        </motion.div>
      ))}
    </div>
  );
}