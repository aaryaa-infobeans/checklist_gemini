import React, { useEffect, useState } from 'react';
import * as api from '../../api/executions';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
const isDueSoon = (dueDateStr) => {
  if (!dueDateStr) return false;
  const due = new Date(dueDateStr);
  const now = new Date();
  const diff = due - now;
  // due within 48 hours
  return diff > 0 && diff <= 48 * 60 * 60 * 1000;
};

const ExecutionListPage = () => {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.fetchExecutions();
      setExecutions(data);
    } catch (err) {
      setError(err.message || 'Failed to load executions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleOpen = (id) => navigate(`/executions/${id}`);

  const handlePause = async (e, ex) => {
    e.stopPropagation();
    try {
      await api.pauseExecution(ex.id);
      setExecutions(prev => prev.map(p => p.id === ex.id ? { ...p, status: 'paused' } : p));
    } catch (err) {
  toast.error('Failed to pause execution');
    }
  };

  const handleResume = async (e, ex) => {
    e.stopPropagation();
    try {
      await api.resumeExecution(ex.id);
      setExecutions(prev => prev.map(p => p.id === ex.id ? { ...p, status: 'in_progress' } : p));
    } catch (err) {
  toast.error('Failed to resume execution');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Checklists</h1>
      <div className="grid gap-2 mt-4">
        {(executions || []).map(ex => (
          <div key={ex.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{ex.title || `${ex.template.title}`}</div>
              <div className="text-sm text-gray-600">Due: {ex.completed_at ? new Date(ex.completed_at).toLocaleString() : 'No due date'}</div>
              {isDueSoon(ex.completed_at) && <div className="text-sm text-red-600">Due soon</div>}
              <div className="text-sm text-gray-600">Status: {ex.status}</div>

              {<div className="text-sm text-gray-600">
              {ex.status === 'Completed' ? (
                <span>Completed On: {ex.completed_at ? new Date(ex.completed_at).toLocaleString() : 'Unknown'}</span>
              ) : (
                <span>Assigned On: {ex.started_at ? new Date(ex.started_at).toLocaleString() : 'Unknown'}</span>
              )}
            </div>}

              
            </div>
            {<div className="flex gap-2">
              {ex.status === 'Completed' ? (
                <button className="px-2 py-1 bg-green-600 text-white rounded cursor-not-allowed">{ex.status}</button>
              ) : (
                <button onClick={() => handleOpen(ex.id)} className="px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer">{ex.status}</button>
              )}
            </div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutionListPage;
