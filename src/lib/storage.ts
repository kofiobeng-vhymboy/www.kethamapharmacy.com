// Storage may be disabled, full, or contain data from an older version.
export function readStoredIds(key: string): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    if (!Array.isArray(value)) return [];
    return [...new Set(value.flatMap(item => typeof item === 'string' ? [item] :
      item && typeof item.id === 'string' ? [item.id] : []))];
  } catch { return []; }
}

export function writeStoredIds(key: string, ids: string[]): boolean {
  try { localStorage.setItem(key, JSON.stringify(ids)); return true; }
  catch { return false; }
}
