import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import CreateGroupModal from '../groups/CreateGroupModal';

export default function Layout() {
  const [showCreate, setShowCreate] = useState(false);
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onCreateGroup={() => setShowCreate(true)} />
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0, background: 'var(--bg-primary)' }}>
        <Outlet />
      </main>
      <CreateGroupModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}