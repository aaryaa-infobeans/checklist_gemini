import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.role && typeof parsed.role === 'object' && parsed.role.name) parsed.role = parsed.role.name;
        setUser(parsed);
      } catch (e) {
        // If parsing fails, the data is corrupt. Clear it.
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post('/auth/login/', { email, password });
      // backend may return { token } or { access }
      const token = res.data.token || res.data.access;
      // backend may return user object or user_id/email
  let userData = res.data.user || (res.data.email ? { email: res.data.email, id: res.data.user_id } : null);

      if (!token) throw new Error('No token in login response');

      localStorage.setItem('access_token', token);
      // If backend didn't return role, try to fetch full user profile via the
      // authenticated `/users/me/` endpoint which is safe for non-admin users.
      if (userData && !userData.role) {
        try {
          const u = await axiosInstance.get(`/users/me/`);
          userData = u.data;
        } catch (e) {
          // ignore; we'll proceed with partial userData
        }
      }

      // Prefer `role_name` if backend provided it; otherwise normalize nested role
      if (userData && userData.role_name) {
        userData.role = userData.role_name;
      } else if (userData && userData.role && typeof userData.role === 'object') {
        userData.role = userData.role.name;
      }

      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      return userData;
    } catch (err) {
      // Normalize Axios error so callers can react
      if (err.response && err.response.status === 401) {
        // invalid credentials
        return null;
      }
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
