import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchTemplates } from '../../api/templates';
import { createExecution } from '../../api/executions';
import CreateChecklistForm from '../../components/checklist/CreateChecklistForm';
import Modal from '../../components/common/Modal';

const EndUserDashboard = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadTemplates = async () => {
    try {
      const data = await fetchTemplates();
      setTemplates(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleExecute = async (templateId) => {
    try {
      await createExecution({ template_id: templateId });
      alert('Checklist execution started!');
    } catch (err) {
      console.error(err);
      alert('Failed to start checklist execution');
    }
  };

  const myChecklists = templates.filter((t) => t.owner.id === user.id);
  const adminChecklists = templates.filter((t) => t.owner.role.name === 'admin');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">End User Dashboard</h1>
        <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 text-white p-2 rounded">
          Create Checklist
        </button>
      </div>

      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <CreateChecklistForm
            onCreated={() => {
              setShowCreateModal(false);
              loadTemplates();
            }}
          />
        </Modal>
      )}

      <div>
        <h2 className="text-xl font-bold mb-4">My Checklists</h2>
        {myChecklists.length > 0 ? (
          <ul>
            {myChecklists.map((template) => (
              <li key={template.id} className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{template.title}</h3>
                  <p className="text-gray-600">{template.category}</p>
                </div>
                <button onClick={() => handleExecute(template.id)} className="bg-green-500 text-white p-2 rounded">
                  Execute
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't created any checklists yet.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Admin Checklists</h2>
        {adminChecklists.length > 0 ? (
          <ul>
            {adminChecklists.map((template) => (
              <li key={template.id} className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{template.title}</h3>
                  <p className="text-gray-600">{template.category}</p>
                </div>
                <button onClick={() => handleExecute(template.id)} className="bg-green-500 text-white p-2 rounded">
                  Execute
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No checklists available from admin.</p>
        )}
      </div>
    </div>
  );
};

export default EndUserDashboard;