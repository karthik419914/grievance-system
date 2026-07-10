"use client";

import { useCallback, useEffect, useState } from "react";

const DRAFT_KEY = "grievance_system_draft_v1";

/**
 * Persists partial form data to localStorage so a resident/family member
 * can close the tab mid-way and pick up where they left off. No account
 * or server round-trip needed for this — it's a convenience save, not the
 * final submission (that goes through the Server Action).
 */
export function useDraft<T extends Record<string, unknown>>(initial: T) {
  const [data, setData] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        setData((prev) => ({ ...prev, ...JSON.parse(raw) }));
      }
    } catch {
      // corrupted or unavailable storage — start fresh
    } finally {
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = useCallback((next: T) => {
    setData(next);
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable (private browsing, quota) — fail silently
    }
  }, []);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { data, save, clear, loaded };
}
