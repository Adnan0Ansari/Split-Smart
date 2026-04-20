import React from 'react';
import GroupCard from './GroupCard';

export default function GroupList({ groups }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
      {groups.map((group, i) => <GroupCard key={group.id} group={group} index={i} />)}
    </div>
  );
}