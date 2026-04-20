export const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: '🍽️', color: '#b45309', bg: '#fef3c7' },
  { id: 'transport', label: 'Transport', icon: '🚗', color: '#1d4ed8', bg: '#dbeafe' },
  { id: 'accommodation', label: 'Stay', icon: '🏨', color: '#6d28d9', bg: '#ede9fe' },
  { id: 'entertainment', label: 'Fun', icon: '🎉', color: '#be123c', bg: '#ffe4e6' },
  { id: 'groceries', label: 'Groceries', icon: '🛒', color: '#1a7a4a', bg: '#e8f5ee' },
  { id: 'utilities', label: 'Utilities', icon: '⚡', color: '#0369a1', bg: '#e0f2fe' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#be123c', bg: '#ffe4e6' },
  { id: 'health', label: 'Health', icon: '💊', color: '#065f46', bg: '#d1fae5' },
  { id: 'other', label: 'Other', icon: '📦', color: '#4a4540', bg: '#f0ede8' },
];

export const getCategoryById = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];