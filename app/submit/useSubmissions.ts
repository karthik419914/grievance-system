import { getStoredValue, removeStoredValue, setStoredValue } from "@/lib/storage";

const SUBMISSION_KEY = "grievance_system_submission_ids_v1";

export function getSavedSubmissionIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = getStoredValue(SUBMISSION_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function addSavedSubmissionId(id: string) {
  if (typeof window === "undefined") return;

  try {
    const ids = getSavedSubmissionIds();
    if (!ids.includes(id)) {
      setStoredValue(SUBMISSION_KEY, JSON.stringify([id, ...ids]));
    }
  } catch {
    // ignore storage errors
  }
}

export function clearSavedSubmissionIds() {
  if (typeof window === "undefined") return;
  removeStoredValue(SUBMISSION_KEY);
}
