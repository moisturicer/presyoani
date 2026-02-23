/**
 * Hook for local harvest ledger (IndexedDB via Dexie.js)
 * Digital Notebook - stores harvest photos, timestamps, GPS locally
 * Works in Airplane Mode
 *
 * TODO: Implement with Dexie.js when backend is ready
 */
export function useLocalLedger() {
  // Placeholder - will use IndexedDB for offline storage
  const entries: unknown[] = []
  const addEntry = async (_entry: unknown) => {
    // TODO: Dexie.js implementation
  }
  const syncPending = async () => {
    // TODO: Sync unsent records when app reconnects
  }

  return { entries, addEntry, syncPending }
}
