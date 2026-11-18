import { useState, useEffect, useCallback } from 'react';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '');

export function useFetchRecords() {
  const [records, setRecords] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // READ (GET)
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [recordsRes, storeRes] = await Promise.all([
        fetch(`${API_URL}/records`),
        fetch(`${API_URL}/store_info`),
      ]);
      if (!recordsRes.ok || !storeRes.ok) throw new Error('Failed to load store inventory');

      const recordsData = await recordsRes.json();
      const storeData = await storeRes.json();
      setRecords(recordsData);
      setStoreInfo(storeData[0] || null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // CREATE (POST)
  const addRecord = async (newRecord) => {
    const res = await fetch(`${API_URL}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newRecord, price: Number(newRecord.price) }),
    });
    if (!res.ok) throw new Error('Failed to add record');
    const created = await res.json();
    setRecords((prev) => [...prev, created]);
    return created;
  };

  // UPDATE (PATCH)
  const updateRecord = async (id, updates) => {
    const res = await fetch(`${API_URL}/records/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update record');
    const updated = await res.json();
    setRecords((prev) => prev.map((rec) => (rec.id === id ? updated : rec)));
    return updated;
  };

  // DELETE (DELETE)
  const deleteRecord = async (id) => {
    const res = await fetch(`${API_URL}/records/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete record');
    setRecords((prev) => prev.filter((rec) => rec.id !== id));
  };

  return { records, storeInfo, loading, error, addRecord, updateRecord, deleteRecord };
}