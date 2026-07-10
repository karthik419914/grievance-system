export interface DeviceGrievanceHistoryItem {
  referenceCode: string;
  createdAt: string;
  submitterName: string;
  category: string;
  description: string;
}

const GRIEVANCE_HISTORY_KEY = "grievance_system_history_v1";

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

export function getGrievanceHistory(): DeviceGrievanceHistoryItem[] {
  const raw = getStoredValue(GRIEVANCE_HISTORY_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is DeviceGrievanceHistoryItem =>
        item && typeof item.referenceCode === "string" && typeof item.createdAt === "string"
    );
  } catch {
    return [];
  }
}

export function appendGrievanceHistory(entry: DeviceGrievanceHistoryItem) {
  const existing = getGrievanceHistory();
  const withoutDuplicate = existing.filter((item) => item.referenceCode !== entry.referenceCode);
  const next = [entry, ...withoutDuplicate].slice(0, 20);
  setStoredValue(GRIEVANCE_HISTORY_KEY, JSON.stringify(next));
}
