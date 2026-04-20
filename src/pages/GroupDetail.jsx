import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useSettlement } from '../hooks/useSettlement';
import { useExpenseCalculator } from '../hooks/useExpenseCalculator';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import ExpenseList from '../components/expenses/ExpenseList';
import SettlementList from '../components/settlement/SettlementList';
import AddExpenseModal from '../components/expenses/AddExpenseModal';
import SpendingChart from '../components/analytics/SpendingChart';
import CategoryBreakdown from '../components/analytics/CategoryBreakdown';
import { formatAmount } from '../utils/currency';
import toast from 'react-hot-toast';

const TABS = ['Expenses', 'Settle Up', 'Analytics', 'Members'];

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getGroupById, dispatch, state } = useApp();
  const group = getGroupById(id);
  const [tab, setTab] = useState('Expenses');
  const [showAdd, setShowAdd] = useState(false);
  const { transactions } = useSettlement(group);
  const stats = useExpenseCalculator(group);

  if (!group) return (
    <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
      <p style={{ marginBottom: 16 }}>Group not found.</p>
      <Button variant="ghost" onClick={() => navigate('/')}>Go Home</Button>
    </div>
  );

  const myBalance = transactions.filter((t) => t.to === state.currentUserId).reduce((s, t) => s + t.amount, 0) - transactions.filter((t) => t.from === state.currentUserId).reduce((s, t) => s + t.amount, 0);

  return (
    <div style={{ padding: '0 0 60px' }}>
      <div style={{ padding: '28px 32px 0' }}>
        <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, marginBottom: 20, padding: 0, fontFamily: 'var(--font-body)' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>{group.name}</h1>
            {group.description && <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{group.description}</p>}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="primary" onClick={() => setShowAdd(true)} icon={<Plus size={14} />}>Add Expense</Button>
            <Button variant="danger" onClick={() => { dispatch({ type: 'DELETE_GROUP', payload: id }); toast.success('Group deleted'); navigate('/'); }} icon={<Trash2 size={13} />}>Delete</Button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Total Spent', value: formatAmount(stats.total, group.currency), mono: true, color: 'var(--text-primary)' },
            { label: 'Pending', value: transactions.length, color: '#b45309' },
            { label: 'Your Balance', value: formatAmount(Math.abs(myBalance), group.currency), mono: true, color: myBalance >= 0 ? 'var(--accent-green)' : 'var(--accent-rose)' },
            { label: 'Members', value: group.members.length, color: '#1d4ed8' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <GlassCard style={{ padding: '16px 18px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: s.mono ? 'var(--font-mono)' : undefined }}>{s.value}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--glass-border)', marginBottom: 24 }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 18px', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid var(--accent-green)' : '2px solid transparent', color: tab === t ? 'var(--accent-green)' : 'var(--text-muted)', fontSize: 13, fontWeight: tab === t ? 700 : 500, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'var(--transition)', marginBottom: -1 }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 32px' }}>
        {tab === 'Expenses' && <GlassCard style={{ padding: 24 }}><ExpenseList expenses={group.expenses} group={group} /></GlassCard>}

        {tab === 'Settle Up' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {transactions.length > 0 && (
              <div style={{ padding: '12px 18px', borderRadius: 10, background: '#fffbeb', border: '1px solid #fde68a', fontSize: 13, color: 'var(--accent-amber)', fontWeight: 600 }}>
                {transactions.length} pending · {formatAmount(transactions.reduce((s, t) => s + t.amount, 0), group.currency)} total outstanding
              </div>
            )}
            <SettlementList transactions={transactions} group={group} />
          </div>
        )}

        {tab === 'Analytics' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <SpendingChart byMonth={stats.byMonth} currency={group.currency} />
            <CategoryBreakdown byCategory={stats.byCategory} currency={group.currency} total={stats.total} />
          </div>
        )}

        {tab === 'Members' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {group.members.map((member) => {
              const paid = group.expenses.filter((e) => e.paidBy === member.id).reduce((s, e) => s + parseFloat(e.amount), 0);
              const iOwe = transactions.filter((t) => t.from === member.id).reduce((s, t) => s + t.amount, 0);
              const owedToMem = transactions.filter((t) => t.to === member.id).reduce((s, t) => s + t.amount, 0);
              const net = owedToMem - iOwe;
              return (
                <GlassCard key={member.id} style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <Avatar name={member.name} color={member.color} size={44} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{member.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{member.id === state.currentUserId ? '👤 You' : 'Member'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Paid</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{formatAmount(paid, group.currency)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Net</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: net >= 0 ? 'var(--accent-green)' : 'var(--accent-rose)' }}>
                        {net >= 0 ? '+' : ''}{formatAmount(net, group.currency)}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      <AddExpenseModal isOpen={showAdd} onClose={() => setShowAdd(false)} group={group} />
    </div>
  );
}