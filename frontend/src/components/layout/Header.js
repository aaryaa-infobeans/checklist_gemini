import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-gray-300">
          Checklist App
        </Link>
        <nav>
          {user ? (
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user.email}</span>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Logout
              </button>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Header;
