// src/context/DocumentContext.tsx
import React, { createContext, useContext, useState } from 'react';

const DocumentContext = createContext(null);

export const DocumentProvider = ({ children }) => {
  const [documentText, setDocumentText] = useState('');

  return (
    <DocumentContext.Provider value={{ documentText, setDocumentText }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => useContext(DocumentContext);
