import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { formatAmount } from '../../utils/currency';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';

export default function SettlementCard({ transaction, group }) {
  const { dispatch, state } = useApp();
  const fromMember = group.members.find((m) => m.id === transaction.from);
  const toMember = group.members.find((m) => m.id === transaction.to);
  const isMySettlement = transaction.from === state.currentUserId || transaction.to === state.currentUserId;

  const handleSettle = () => {
    dispatch({
      type: 'ADD_SETTLEMENT',
      payload: {
        groupId: group.id,
        settlement: {
          from: transaction.from,
          to: transaction.to,
          amount: transaction.amount,
          currency: group.currency,
        },
      },
    });
    toast.success('Settlement recorded! 🎉');
  };

  return (
    <GlassCard
      style={{
        padding: '16px 20px',
        borderColor: isMySettlement ? 'rgba(16,185,129,0.2)' : 'var(--glass-border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name={fromMember?.name} color={fromMember?.color} size={36} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{fromMember?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Owes</div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--accent-amber)' }}>
            {formatAmount(transaction.amount, group.currency)}
          </div>
          <ArrowRight size={16} color="var(--text-muted)" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{toMember?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Gets paid</div>
          </div>
          <Avatar name={toMember?.name} color={toMember?.color} size={36} />
        </div>
      </div>

      {isMySettlement && (
        <div style={{ marginTop: 14, borderTop: '1px solid var(--glass-border)', paddingTop: 14, display: 'flex', gap: 10 }}>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={handleSettle}
            icon={<CheckCircle size={14} />}
          >
            Mark as Settled
          </Button>
          {transaction.from === state.currentUserId && (
            <Button variant="amber" size="sm" fullWidth>
              Pay via UPI
            </Button>
          )}
        </div>
      )}
    </GlassCard>
  );
}