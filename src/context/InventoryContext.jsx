import { createContext, useContext } from 'react';
import { useFetchRecords } from '../hooks/useFetchRecords';

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const inventory = useFetchRecords();
  return (
    <InventoryContext.Provider value={inventory}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
}