import React from 'react';

const ChecklistItem = ({ item, onToggle }) => (
  <div className="flex items-center justify-between p-2 border-b">
    <div>{item.description}</div>
    <div>
      <button onClick={() => onToggle(item.id)} className="px-2 py-1 bg-blue-500 text-white rounded">
        {item.completed ? 'Complete' : 'Mark Complete'}
      </button>
    </div>
  </div>
);

export default ChecklistItem;
