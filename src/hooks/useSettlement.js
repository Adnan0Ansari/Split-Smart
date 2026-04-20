import { useMemo } from 'react';
import { calculateSettlements } from '../utils/settlement';

export function useSettlement(group) {
  const transactions = useMemo(() => {
    if (!group) return [];
    return calculateSettlements(group.members, group.expenses);
  }, [group]);

  const getMemberById = (id) => group?.members.find((m) => m.id === id);
  const totalOwed = (memberId) => transactions.filter((t) => t.from === memberId).reduce((s, t) => s + t.amount, 0);
  const totalToReceive = (memberId) => transactions.filter((t) => t.to === memberId).reduce((s, t) => s + t.amount, 0);

  return { transactions, getMemberById, totalOwed, totalToReceive };
}