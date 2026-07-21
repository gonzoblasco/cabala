import { useState, useEffect } from 'react';
import { getAllEntries } from '../db/queries';
import type { Entry } from '../db/queries';

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      const data = await getAllEntries();
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  }

  return { entries, loading, refresh: loadEntries };
}
