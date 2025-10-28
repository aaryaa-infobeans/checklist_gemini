import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { user } = useAuth();
  const role = user?.role || null;
  return <RoleContext.Provider value={{ role }}>{children}</RoleContext.Provider>;
};

export const useRole = () => useContext(RoleContext);
