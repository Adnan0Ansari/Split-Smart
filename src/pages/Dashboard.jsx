import React, { useState } from 'react';
import { Plus, TrendingUp, Users, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import GroupList from '../components/groups/GroupList';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import CreateGroupModal from '../components/groups/CreateGroupModal';
import { formatAmount } from '../utils/currency';

export default function Dashboard() {
  const { state } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const totalSpent = state.groups.reduce((s, g) => s + g.expenses.reduce((ss, e) => ss + parseFloat(e.amount), 0), 0);
  const totalExpenses = state.groups.reduce((s, g) => s + g.expenses.length, 0);

  return (
    <div style={{ padding: '0 0 48px' }}>
      <Header title="Dashboard" subtitle={`${state.groups.length} active groups`}
        actions={<Button variant="primary" onClick={() => setShowCreate(true)} icon={<Plus size={14} />}>New Group</Button>}
      />
      <div style={{ padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
          {[
            { label: 'Total Groups', value: state.groups.length, icon: Users, color: '#1d4ed8', bg: '#dbeafe' },
            { label: 'Total Expenses', value: totalExpenses, icon: Receipt, color: '#b45309', bg: '#fef3c7' },
            { label: 'Total Spent', value: formatAmount(totalSpent), icon: TrendingUp, color: '#1a7a4a', bg: '#e8f5ee', mono: true },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <GlassCard style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
                    <div style={{ fontSize: s.mono ? 20 : 28, fontWeight: 700, color: 'var(--text-primary)', fontFamily: s.mono ? 'var(--font-mono)' : undefined }}>{s.value}</div>
                  </div>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon size={18} color={s.color} />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Your Groups</h2>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{state.groups.length} total</span>
        </div>

        {state.groups.length === 0 ? (
          <GlassCard style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>💸</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No groups yet</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Create your first group and start splitting smartly</p>
            <Button variant="primary" onClick={() => setShowCreate(true)} icon={<Plus size={14} />}>Create First Group</Button>
          </GlassCard>
        ) : (
          <GroupList groups={state.groups} />
        )}
      </div>
      <CreateGroupModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}