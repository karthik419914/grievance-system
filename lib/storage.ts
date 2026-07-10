export function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    try {
      return window.sessionStorage;
    } catch {
      return null;
    }
  }
}

export function getStoredValue(key: string): string | null {
  const storage = getBrowserStorage();
  if (!storage) return null;

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function setStoredValue(key: string, value: string) {
  const storage = getBrowserStorage();
  if (!storage) return;

  try {
    storage.setItem(key, value);
  } catch {
    // Safari private mode or storage restrictions may throw.
  }
}

export function removeStoredValue(key: string) {
  const storage = getBrowserStorage();
  if (!storage) return;

  try {
    storage.removeItem(key);
  } catch {
    // ignore storage errors
  }
}
