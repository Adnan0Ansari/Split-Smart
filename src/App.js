import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import GroupDetail from './pages/GroupDetail';
import Analytics from './pages/Analytics';
import History from './pages/History';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="group/:id" element={<GroupDetail />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="history" element={<History />} />
          </Route>
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#1a1714',
              border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              borderRadius: '12px',
            },
            success: { iconTheme: { primary: '#1a7a4a', secondary: '#fff' } },
            error: { iconTheme: { primary: '#be123c', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </AppProvider>
  );
}