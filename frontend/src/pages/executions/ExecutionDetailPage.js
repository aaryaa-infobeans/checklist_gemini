import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../../api/executions';
import ChecklistExecutionView from '../../components/checklist/ChecklistExecutionView';
import { toast } from 'react-toastify';

const ExecutionDetailPage = () => {
  const { id } = useParams();
  const [execution, setExecution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]); // new state

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.fetchExecution(id);
      setExecution(data);
      if (data.template && data.template.items) {
        const initialItems = data.template.items.map(item => {
          const executionItem = data.item_executions.find(e => e.item === item.id);
          return { ...item, completed: executionItem ? executionItem.completed : false };
        });
        setItems(initialItems);
      }
    } catch (err) {
      setError(err.message || 'Failed to load execution');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleSave = async () => {
    try {
      const item_executions = items.map(i => ({ item: i.id, completed: i.completed }));
      const payload = { ...execution, item_executions };
      const saved = await api.updateExecution(id, payload);
      setExecution(saved);
      toast.success('Execution saved');
    } catch (err) {
      toast.error('Failed to save execution');
    }
  };

  const handlePause = async () => {
    try {
      await api.pauseExecution(execution.id);
      setExecution(prev => ({ ...prev, status: 'paused' }));
    } catch (err) {
      toast.error('Failed to pause');
    }
  };

  const handleResume = async () => {
    try {
      await api.resumeExecution(execution.id);
      setExecution(prev => ({ ...prev, status: 'in_progress' }));
    } catch (err) {
      toast.error('Failed to resume');
    }
  };

  const handleComplete = async () => {
    try {
      const item_executions = items.map(i => ({ item: i.id, completed: i.completed }));
      const payload = { ...execution, item_executions, status: 'completed' };
      const saved = await api.updateExecution(id, payload);
      setExecution(saved);
      toast.success('Execution marked as complete');
    } catch (err) {
      toast.error('Failed to mark as complete');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Execution Detail</h1>
      {execution ? (
        <div>
          <div className="mb-4">Status: <strong>{execution.status}</strong></div>
          <div className="mb-4">Due: {execution.due_date ? new Date(execution.due_date).toLocaleString() : 'No due date'}</div>
          <div className="mb-4">
            {/* {execution.status === 'paused' ? (
              <button onClick={handleResume} className="px-3 py-1 bg-green-600 text-white rounded">Resume</button>
            ) : (
              <button onClick={handlePause} className="px-3 py-1 bg-yellow-500 text-white rounded">Pause</button>
            )} */}
            <button onClick={handleSave} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">Save</button>
            <button onClick={handleComplete} className="ml-2 px-3 py-1 bg-green-600 text-white rounded">Mark as Complete</button>
          </div>
          <ChecklistExecutionView
            template={{ ...execution.template, items: items }}
            onItemsChange={setItems}
          />
        </div>
      ) : <div>No execution found</div>}
    </div>
  );
};

export default ExecutionDetailPage;
