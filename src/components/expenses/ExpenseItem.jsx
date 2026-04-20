import React from 'react';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { formatAmount } from '../../utils/currency';
import { getCategoryById } from '../../utils/categories';
import { format } from 'date-fns';
import { useApp } from '../../context/AppContext';

export default function ExpenseItem({ expense, group, onDelete, index }) {
  const { state } = useApp();
  const payer = group.members.find((m) => m.id === expense.paidBy);
  const category = getCategoryById(expense.category);
  const isMe = expense.paidBy === state.currentUserId;

  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--bg-secondary)' }}
    >
      <div style={{ width: 42, height: 42, borderRadius: 12, background: category.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
        {category.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{expense.title}</span>
          <Badge color={category.color} bg={category.bg} style={{ fontSize: 10 }}>{category.label}</Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name={payer?.name} color={payer?.color} size={18} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {isMe ? 'You' : payer?.name} paid · {format(new Date(expense.date), 'MMM d')}
          </span>
          <span style={{ fontSize: 10, background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 4, padding: '1px 6px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
            {expense.splitType}
          </span>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{formatAmount(expense.amount, group.currency)}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatAmount(expense.amount / expense.splitWith.length, group.currency)} each</div>
      </div>
      <button onClick={() => onDelete(expense.id)}
        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6, borderRadius: 6, display: 'flex', transition: 'var(--transition)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-rose)'; e.currentTarget.style.background = '#fff1f2'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
      >
        <Trash2 size={15} />
      </button>
    </motion.div>
  );
}