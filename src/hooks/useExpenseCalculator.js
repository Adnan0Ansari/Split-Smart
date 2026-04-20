import { useMemo } from 'react';
import { getCategoryById } from '../utils/categories';

export function useExpenseCalculator(group) {
  return useMemo(() => {
    if (!group || !group.expenses.length) return { total: 0, byCategory: {}, byMember: {}, byMonth: {} };
    let total = 0;
    const byCategory = {}, byMember = {}, byMonth = {};
    group.expenses.forEach((expense) => {
      const amount = parseFloat(expense.amount);
      total += amount;
      const cat = getCategoryById(expense.category);
      byCategory[cat.id] = (byCategory[cat.id] || 0) + amount;
      byMember[expense.paidBy] = (byMember[expense.paidBy] || 0) + amount;
      const month = expense.date.slice(0, 7);
      byMonth[month] = (byMonth[month] || 0) + amount;
    });
    return { total, byCategory, byMember, byMonth };
  }, [group]);
}