import React from 'react';
import ChecklistItem from './ChecklistItem';
import ProgressBar from '../common/ProgressBar';

const ChecklistExecutionView = ({ items, title, onItemsChange }) => {
  const completed = items.filter(i => i.completed).length;
  const percent = Math.round((completed / (items.length || 1)) * 100 || 0);

  const toggle = (id) => {
    const updated = items.map(it => it.id === id ? { ...it, completed: !it.completed } : it);
    if (onItemsChange) {
      onItemsChange(updated);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <ProgressBar percent={percent} />
      <div className="mt-4 border rounded">
        {items.map(item => (
          <ChecklistItem key={item.id} item={item} onToggle={() => toggle(item.id)} />
        ))}
      </div>
    </div>
  );
};

export default ChecklistExecutionView;