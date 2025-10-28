import React, { useEffect, useState } from 'react';
import * as api from '../../api/templates';
import { toast } from 'react-toastify';
import Modal from '../../components/common/Modal';
import TemplateFormPage from './TemplateFormPage';

// Accept optional `api` prop for testing and `initialTemplates` to seed data
const TemplateListPage = ({ api: apiOverride, initialTemplates } = {}) => {
  const apiClient = apiOverride || api;
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiClient.fetchTemplates();
      setTemplates(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTemplates) {
      setTemplates(initialTemplates);
      setLoading(false);
    } else {
      load();
    }
  }, [initialTemplates]);

  const handleCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (t) => {
    setEditing(t);
    setOpen(true);
  };

  const handleDelete = async (t) => {
    if (!confirm(`Delete template '${t.name}'?`)) return;
    try {
  await apiClient.deleteTemplate(t.id);
  setTemplates(prev => prev.filter(x => x.id !== t.id));
    } catch (err) {
      // server rule: prevent deletion if in use
  const msg = err?.response?.data?.detail || err.message || 'Delete failed';
  // use toast for consistent notifications (tests mock react-toastify)
  toast.error(`Cannot delete: ${msg}`);
    }
  };

  const handleSave = (saved) => {
    setOpen(false);
    setEditing(null);
    if (!saved) return; // defensive
    // upsert
    setTemplates(prev => {
      if (!saved.id) return [saved, ...prev].filter(Boolean);
      const exists = prev.find(p => p && p.id === saved.id);
      if (exists) return prev.map(p => p && p.id === saved.id ? saved : p);
      return [saved, ...prev];
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Templates</h1>
        <button onClick={handleCreate} className="bg-green-600 text-white px-3 py-1 rounded">New Template</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid gap-2">
        {(templates || []).map(t => (
          <div key={t.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-gray-600">{t.category}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(t)} className="px-2 py-1 border rounded">Edit</button>
              <button onClick={() => handleDelete(t)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} title={editing ? 'Edit Template' : 'New Template'} onClose={() => setOpen(false)}>
        <TemplateFormPage initial={editing} onSave={handleSave} onCancel={() => setOpen(false)} api={{ create: apiClient.createTemplate, update: apiClient.updateTemplate }} />
      </Modal>
    </div>
  );
};

export default TemplateListPage;
