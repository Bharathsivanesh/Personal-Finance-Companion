// src/context/TransactionContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";

const TransactionContext = createContext({
  refreshKey: 0,
  triggerRefresh: () => {},
});

export const TransactionProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Call this after any add / edit / delete
  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <TransactionContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionRefresh = () => useContext(TransactionContext);
