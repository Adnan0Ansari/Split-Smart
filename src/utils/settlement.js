export function calculateSettlements(members, expenses) {
  const balances = {};
  members.forEach((m) => (balances[m.id] = 0));

  expenses.forEach((expense) => {
    const payer = expense.paidBy;
    const total = parseFloat(expense.amount);
    if (expense.splitType === 'equal') {
      const share = total / expense.splitWith.length;
      expense.splitWith.forEach((memberId) => {
        if (memberId !== payer) {
          balances[memberId] -= share;
          balances[payer] += share;
        }
      });
    } else if (expense.splitType === 'custom') {
      Object.entries(expense.customAmounts || {}).forEach(([memberId, amount]) => {
        if (memberId !== payer) {
          balances[memberId] -= parseFloat(amount);
          balances[payer] += parseFloat(amount);
        }
      });
    } else if (expense.splitType === 'percentage') {
      Object.entries(expense.percentages || {}).forEach(([memberId, pct]) => {
        if (memberId !== payer) {
          const share = (total * parseFloat(pct)) / 100;
          balances[memberId] -= share;
          balances[payer] += share;
        }
      });
    }
  });

  const creditors = [], debtors = [];
  Object.entries(balances).forEach(([id, balance]) => {
    if (balance > 0.01) creditors.push({ id, amount: balance });
    else if (balance < -0.01) debtors.push({ id, amount: -balance });
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i], debtor = debtors[j];
    const amount = Math.min(creditor.amount, debtor.amount);
    transactions.push({ from: debtor.id, to: creditor.id, amount: parseFloat(amount.toFixed(2)) });
    creditor.amount -= amount;
    debtor.amount -= amount;
    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }
  return transactions;
}