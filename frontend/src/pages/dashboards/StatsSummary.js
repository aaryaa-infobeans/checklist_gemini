import React from 'react';

const StatsSummary = ({ stats = {} }) => (
  <div className="grid grid-cols-3 gap-4">
    <div className="p-4 bg-white shadow">Templates: {stats.templates || 0}</div>
    <div className="p-4 bg-white shadow">Active Executions: {stats.active || 0}</div>
    <div className="p-4 bg-white shadow">Completed: {stats.completed || 0}</div>
  </div>
);

export default StatsSummary;
