import React from 'react';
import ExpenseItem from './ExpenseItem';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';

export default function ExpenseList({ expenses, group }) {
  const { dispatch } = useApp();
  const handleDelete = (expenseId) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: { groupId: group.id, expenseId } });
    toast.success('Expense removed');
  };
  if (!expenses.length) return (
    <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🧾</div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>No expenses yet</div>
      <div style={{ fontSize: 13, marginTop: 4 }}>Add your first expense to get started</div>
    </div>
  );
  return <div>{expenses.map((e, i) => <ExpenseItem key={e.id} expense={e} group={group} onDelete={handleDelete} index={i} />)}</div>;
}