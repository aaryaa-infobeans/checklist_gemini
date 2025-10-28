import React, { createContext, useContext, useState } from 'react';

const ChecklistContext = createContext();

export const ChecklistProvider = ({ children }) => {
  const [currentExecution, setCurrentExecution] = useState(null);
  return (
    <ChecklistContext.Provider value={{ currentExecution, setCurrentExecution }}>
      {children}
    </ChecklistContext.Provider>
  );
};

export const useChecklist = () => useContext(ChecklistContext);
