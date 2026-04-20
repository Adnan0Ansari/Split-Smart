import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../utils/categories';
import toast from 'react-hot-toast';

const inp = { width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box' };
const lbl = { fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' };

export default function AddExpenseModal({ isOpen, onClose, group }) {
  const { dispatch, state } = useApp();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [paidBy, setPaidBy] = useState(state.currentUserId);
  const [splitType, setSplitType] = useState('equal');
  const [splitWith, setSplitWith] = useState(group?.members.map((m) => m.id) || []);
  const [customAmounts, setCustomAmounts] = useState({});
  const [percentages, setPercentages] = useState({});
  const [notes, setNotes] = useState('');

  const toggleMember = (id) => setSplitWith((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const handleSubmit = () => {
    if (!title.trim()) return toast.error('Title required');
    if (!amount || isNaN(parseFloat(amount))) return toast.error('Valid amount required');
    if (!splitWith.length) return toast.error('Select at least one member');
    dispatch({ type: 'ADD_EXPENSE', payload: { groupId: group.id, expense: { title, amount: parseFloat(amount), category, paidBy, splitType, splitWith, customAmounts: splitType === 'custom' ? customAmounts : {}, percentages: splitType === 'percentage' ? percentages : {}, notes } } });
    toast.success('Expense added!');
    setTitle(''); setAmount(''); setCategory('food'); setPaidBy(state.currentUserId);
    setSplitType('equal'); setSplitWith(group?.members.map((m) => m.id) || []);
    setCustomAmounts({}); setPercentages({}); setNotes('');
    onClose();
  };

  if (!group) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense" width={560}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={lbl}>Title</label>
            <input style={inp} placeholder="Hotel booking..." value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Amount</label>
            <input style={inp} type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </div>

        <div>
          <label style={lbl}>Category</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setCategory(cat.id)} style={{ padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: category === cat.id ? cat.bg : 'var(--bg-secondary)', border: `1px solid ${category === cat.id ? cat.color + '44' : 'var(--glass-border)'}`, color: category === cat.id ? cat.color : 'var(--text-muted)', transition: 'var(--transition)', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 5 }}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={lbl}>Paid By</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {group.members.map((m) => (
              <button key={m.id} onClick={() => setPaidBy(m.id)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: paidBy === m.id ? `${m.color}12` : 'var(--bg-secondary)', border: `1px solid ${paidBy === m.id ? m.color + '44' : 'var(--glass-border)'}`, color: paidBy === m.id ? m.color : 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontWeight: paidBy === m.id ? 600 : 400, transition: 'var(--transition)' }}>
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={lbl}>Split Type</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['equal', 'custom', 'percentage'].map((type) => (
              <button key={type} onClick={() => setSplitType(type)} style={{ flex: 1, padding: '9px', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: splitType === type ? 'var(--accent-green-light)' : 'var(--bg-secondary)', border: `1px solid ${splitType === type ? 'var(--accent-green-mid)' : 'var(--glass-border)'}`, color: splitType === type ? 'var(--accent-green)' : 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 500, textTransform: 'capitalize', transition: 'var(--transition)' }}>
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={lbl}>Split With</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {group.members.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => toggleMember(m.id)} style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${splitWith.includes(m.id) ? m.color : 'var(--bg-tertiary)'}`, background: splitWith.includes(m.id) ? m.color : 'transparent', cursor: 'pointer', flexShrink: 0, transition: 'var(--transition)' }} />
                <span style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1, fontWeight: 500 }}>{m.name}</span>
                {splitType === 'custom' && splitWith.includes(m.id) && (
                  <input style={{ ...inp, width: 110 }} type="number" placeholder="Amount" value={customAmounts[m.id] || ''} onChange={(e) => setCustomAmounts((p) => ({ ...p, [m.id]: e.target.value }))} />
                )}
                {splitType === 'percentage' && splitWith.includes(m.id) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input style={{ ...inp, width: 70 }} type="number" placeholder="%" value={percentages[m.id] || ''} onChange={(e) => setPercentages((p) => ({ ...p, [m.id]: e.target.value }))} />
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>%</span>
                  </div>
                )}
                {splitType === 'equal' && splitWith.includes(m.id) && amount && (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>÷{(parseFloat(amount) / splitWith.length).toFixed(0)}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label style={lbl}>Notes</label>
          <input style={inp} placeholder="Optional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="ghost" fullWidth onClick={onClose}>Cancel</Button>
          <Button variant="primary" fullWidth onClick={handleSubmit}>Add Expense</Button>
        </div>
      </div>
    </Modal>
  );
}