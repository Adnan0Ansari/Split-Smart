import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
  collection, doc, setDoc, deleteDoc, onSnapshot,
  addDoc, updateDoc, serverTimestamp, query, where, getDocs
} from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth, googleProvider } from '../firebase';

const AppContext = createContext(null);
const MEMBER_COLORS = ['#1a7a4a','#1d4ed8','#b45309','#be123c','#6d28d9','#0369a1','#065f46'];

function localReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUserId: action.payload };
    case 'SET_GROUPS': return { ...state, groups: action.payload };
    case 'CREATE_GROUP': return { ...state, groups: [...state.groups, { id: uuid(), expenses: [], settlements: [], createdAt: new Date().toISOString(), ...action.payload }] };
    case 'DELETE_GROUP': return { ...state, groups: state.groups.filter((g) => g.id !== action.payload) };
    case 'ADD_EXPENSE': return { ...state, groups: state.groups.map((g) => g.id === action.payload.groupId ? { ...g, expenses: [{ id: uuid(), date: new Date().toISOString(), settled: false, ...action.payload.expense }, ...g.expenses] } : g) };
    case 'DELETE_EXPENSE': return { ...state, groups: state.groups.map((g) => g.id === action.payload.groupId ? { ...g, expenses: g.expenses.filter((e) => e.id !== action.payload.expenseId) } : g) };
    case 'ADD_SETTLEMENT': return { ...state, groups: state.groups.map((g) => g.id === action.payload.groupId ? { ...g, settlements: [...(g.settlements || []), { id: uuid(), date: new Date().toISOString(), ...action.payload.settlement }] } : g) };
    default: return state;
  }
}

const DEMO_MEMBERS = [
  { id: 'adnan', name: 'Adnan', avatar: 'A', color: '#1a7a4a' },
  { id: 'rahul', name: 'Rahul', avatar: 'R', color: '#1d4ed8' },
  { id: 'priya', name: 'Priya', avatar: 'P', color: '#be123c' },
  { id: 'sara', name: 'Sara', avatar: 'S', color: '#6d28d9' },
];

const INITIAL_STATE = {
  currentUserId: 'adnan',
  groups: [
    {
      id: 'demo-goa',
      name: 'Goa Trip 🏖️',
      description: 'Feb 2025 beach vacation',
      currency: 'INR',
      members: DEMO_MEMBERS,
      createdAt: new Date('2025-02-01').toISOString(),
      color: '#1a7a4a',
      expenses: [
        { id: uuid(), title: 'Hotel Booking', amount: 12000, category: 'accommodation', paidBy: 'adnan', splitType: 'equal', splitWith: ['adnan','rahul','priya','sara'], date: new Date('2025-02-10').toISOString(), settled: false, notes: 'Beach resort 2 nights' },
        { id: uuid(), title: 'Seafood Dinner', amount: 3200, category: 'food', paidBy: 'priya', splitType: 'equal', splitWith: ['adnan','rahul','priya','sara'], date: new Date('2025-02-10').toISOString(), settled: false, notes: '' },
        { id: uuid(), title: 'Cab from Airport', amount: 1400, category: 'transport', paidBy: 'rahul', splitType: 'equal', splitWith: ['adnan','rahul','priya','sara'], date: new Date('2025-02-10').toISOString(), settled: false, notes: '' },
        { id: uuid(), title: 'Watersports', amount: 5600, category: 'entertainment', paidBy: 'sara', splitType: 'equal', splitWith: ['adnan','rahul','priya','sara'], date: new Date('2025-02-11').toISOString(), settled: false, notes: 'Parasailing + jet ski' },
      ],
      settlements: [],
    },
    {
      id: 'demo-flat',
      name: 'Flat 4B 🏠',
      description: 'Monthly shared expenses',
      currency: 'INR',
      members: [DEMO_MEMBERS[0], DEMO_MEMBERS[1]],
      createdAt: new Date('2025-01-01').toISOString(),
      color: '#1d4ed8',
      expenses: [
        { id: uuid(), title: 'Internet Bill', amount: 1200, category: 'utilities', paidBy: 'adnan', splitType: 'equal', splitWith: ['adnan','rahul'], date: new Date('2025-02-05').toISOString(), settled: false, notes: '' },
      ],
      settlements: [],
    },
  ],
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const savedState = (() => {
    try {
      const r = localStorage.getItem('splitsmart_v2');
      return r ? JSON.parse(r) : null;
    } catch { return null; }
  })();

  const [state, dispatch] = useReducer(
    localReducer,
    savedState
      ? { ...INITIAL_STATE, ...savedState, currentUserId: savedState.currentUserId || INITIAL_STATE.currentUserId }
      : INITIAL_STATE
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);

      if (firebaseUser) {
        const firstName = firebaseUser.displayName?.split(' ')[0].toLowerCase();
        const allMembers = state.groups.flatMap((g) => g.members);
        const matched = allMembers.find((m) => m.name.toLowerCase() === firstName);
        dispatch({
          type: 'SET_CURRENT_USER',
          payload: matched?.id || 'adnan',
        });
      } else {
        dispatch({ type: 'SET_CURRENT_USER', payload: 'adnan' });
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    localStorage.setItem('splitsmart_v2', JSON.stringify(state));
  }, [state]);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);
  const getGroupById = (id) => state.groups.find((g) => g.id === id);
  const getRandomColor = () => MEMBER_COLORS[Math.floor(Math.random() * MEMBER_COLORS.length)];

  return (
    <AppContext.Provider value={{ state, dispatch, user, authLoading, loginWithGoogle, logout, getGroupById, getRandomColor }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};