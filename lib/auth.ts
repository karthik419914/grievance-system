import { cookies } from "next/headers";
import { getFirestoreDb } from "./firebaseAdmin";

export const SESSION_COOKIE = "grievance_admin_session";

const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || "karthik419914@gmail.com";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123456";

interface AdminCredentials {
  username: string;
  password: string;
}

function parseAdminCredentialsEnv(): AdminCredentials[] {
  const raw = process.env.ADMIN_CREDENTIALS?.trim();
  if (!raw) {
    return [
      { username: DEFAULT_ADMIN_USERNAME, password: DEFAULT_ADMIN_PASSWORD },
    ];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const list = parsed
        .filter(
          (item): item is { username: string; password: string } =>
            typeof item === "object" && item !== null &&
            typeof (item as any).username === "string" &&
            typeof (item as any).password === "string"
        )
        .map((item) => ({ username: item.username, password: item.password }));
      if (list.length > 0) {
        return list;
      }
    }
  } catch {
    // Ignore JSON parse errors and fall back to comma-separated parsing.
  }

  const pairs = raw.split(",").map((entry) => entry.trim()).filter(Boolean);
  const creds = pairs
    .map((pair) => {
      const [username, password] = pair.split(":");
      if (!username || !password) {
        return null;
      }
      return { username: username.trim(), password: password.trim() };
    })
    .filter((item): item is AdminCredentials => item !== null);

  return creds.length > 0
    ? creds
    : [
        { username: DEFAULT_ADMIN_USERNAME, password: DEFAULT_ADMIN_PASSWORD },
      ];
}

async function fetchAdminCredentials(): Promise<AdminCredentials[]> {
  const firestore = getFirestoreDb();
  if (!firestore) {
    return parseAdminCredentialsEnv();
  }

  const snapshot = await firestore.collection("admin_credentials").get();
  const creds: AdminCredentials[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (typeof data.username === "string" && typeof data.password === "string") {
      creds.push({ username: data.username, password: data.password });
    } else if (typeof data.password === "string") {
      creds.push({ username: doc.id, password: data.password });
    }
  });

  if (creds.length > 0) {
    return creds;
  }

  const fallback = parseAdminCredentialsEnv();
  const defaultCred = fallback[0];
  await firestore.collection("admin_credentials").doc(defaultCred.username).set(defaultCred, { merge: true });
  return fallback;
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  const creds = await fetchAdminCredentials();
  return creds.some((cred) => cred.username === username && cred.password === password);
}

export async function createSession(username: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, username.trim().toLowerCase(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const val = cookieStore.get(SESSION_COOKIE)?.value;
  return !!val && val !== "";
}

export async function getLoggedInAdminEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value || null;
}

export async function isMainAdmin(): Promise<boolean> {
  const email = await getLoggedInAdminEmail();
  return email === "karthik419914@gmail.com";
}
