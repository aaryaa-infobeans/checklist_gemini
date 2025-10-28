import React from 'react';
import { Link } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';

const Sidebar = () => {
  const { role } = useRole();
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <nav className="flex flex-col gap-2">
        <Link to="/">Dashboard</Link>
        {role === 'admin' && <Link to="/admin">Admin</Link>}
        {role === 'project_manager' && <Link to="/manager">Manager</Link>}
        <Link to="/templates">Templates</Link>
        <Link to="/executions">Executions</Link>
        <Link to="/reports">Reports</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
