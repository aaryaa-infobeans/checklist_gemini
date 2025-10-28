import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <div className="font-bold">Johns Hopkins Hospital</div>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span>{user.email}</span>
            <button onClick={logout} className="text-sm text-red-500">Logout</button>
          </div>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
