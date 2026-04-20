import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { CURRENCIES } from '../../utils/currency';
import toast from 'react-hot-toast';
import { v4 as uuid } from 'uuid';

const COLORS = ['#1a7a4a','#1d4ed8','#b45309','#be123c','#6d28d9','#0369a1','#065f46','#92400e'];

const inp = { width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box' };

export default function CreateGroupModal({ isOpen, onClose }) {
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [members, setMembers] = useState([{ id: uuid(), name: '', color: COLORS[0] }]);

  const addMember = () => setMembers((m) => [...m, { id: uuid(), name: '', color: COLORS[m.length % COLORS.length] }]);
  const removeMember = (id) => setMembers((m) => m.filter((x) => x.id !== id));
  const updateMember = (id, val) => setMembers((m) => m.map((x) => x.id === id ? { ...x, name: val } : x));

  const handleSubmit = () => {
    if (!name.trim()) return toast.error('Group name required');
    const valid = members.filter((m) => m.name.trim());
    if (valid.length < 2) return toast.error('Add at least 2 members');
    dispatch({ type: 'CREATE_GROUP', payload: { name, description: desc, currency, members: valid, color: COLORS[0] } });
    toast.success(`"${name}" created!`);
    setName(''); setDesc(''); setCurrency('INR');
    setMembers([{ id: uuid(), name: '', color: COLORS[0] }]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Group" width={480}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Group Name</label>
          <input style={inp} placeholder="e.g. Goa Trip 🏖️" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
          <input style={inp} placeholder="Optional" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Currency</label>
          <select style={{ ...inp, cursor: 'pointer' }} value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.name} ({c.code})</option>)}
          </select>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Members</label>
            <Button variant="soft" size="sm" onClick={addMember} icon={<Plus size={12} />}>Add</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {members.map((m) => (
              <div key={m.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${m.color}18`, border: `2px solid ${m.color}44`, flexShrink: 0 }} />
                <input style={inp} placeholder="Member name" value={m.name} onChange={(e) => updateMember(m.id, e.target.value)} />
                {members.length > 1 && (
                  <button onClick={() => removeMember(m.id)} style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 6, padding: 7, color: 'var(--accent-rose)', cursor: 'pointer', display: 'flex', flexShrink: 0 }}>
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <Button variant="ghost" fullWidth onClick={onClose}>Cancel</Button>
          <Button variant="primary" fullWidth onClick={handleSubmit}>Create Group</Button>
        </div>
      </div>
    </Modal>
  );
}