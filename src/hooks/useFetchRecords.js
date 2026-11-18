import { useState, useEffect, useCallback } from 'react';
import seedData from '../../db.json';

const DEMO_STORAGE_KEY = 'vinyl-crate-demo-records';

function getApiUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/+$/, '');
  return import.meta.env.PROD ? null : 'http://localhost:3001';
}

function readDemoRecords() {
  const savedRecords = window.localStorage.getItem(DEMO_STORAGE_KEY);
  if (savedRecords === null) return seedData.records;

  const records = JSON.parse(savedRecords);
  if (!Array.isArray(records)) throw new Error('Saved demo inventory is invalid.');
  return records;
}

export function useFetchRecords() {
  const API_URL = getApiUrl();
  const [records, setRecords] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // READ (GET)
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      if (!API_URL) {
        setRecords(readDemoRecords());
        setStoreInfo(seedData.store_info[0] || null);
        setError(null);
        return;
      }

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
  }, [API_URL]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // CREATE (POST)
  const addRecord = async (newRecord) => {
    if (!API_URL) {
      const created = {
        ...newRecord,
        id: globalThis.crypto?.randomUUID?.() || String(Date.now()),
        price: Number(newRecord.price),
      };
      const nextRecords = [...records, created];
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(nextRecords));
      setRecords(nextRecords);
      return created;
    }

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
    if (!API_URL) {
      const nextRecords = records.map((record) =>
        record.id === id ? { ...record, ...updates } : record
      );
      if (nextRecords.every((record) => record.id !== id)) {
        throw new Error('Record not found');
      }
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(nextRecords));
      setRecords(nextRecords);
      return nextRecords.find((record) => record.id === id);
    }

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
    if (!API_URL) {
      const nextRecords = records.filter((record) => record.id !== id);
      if (nextRecords.length === records.length) throw new Error('Record not found');
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(nextRecords));
      setRecords(nextRecords);
      return;
    }

    const res = await fetch(`${API_URL}/records/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete record');
    setRecords((prev) => prev.filter((rec) => rec.id !== id));
  };

  return { records, storeInfo, loading, error, addRecord, updateRecord, deleteRecord };
}