import { cookies } from "next/headers";
import { getFirestoreDb } from "./firebaseAdmin";

export const SESSION_COOKIE = "grievance_admin_session";

const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

interface AdminCredentials {
  username: string;
  password: string;
}

async function fetchAdminCredentials(): Promise<AdminCredentials> {
  const firestore = getFirestoreDb();
  if (!firestore) {
    return {
      username: DEFAULT_ADMIN_USERNAME,
      password: DEFAULT_ADMIN_PASSWORD,
    };
  }

  const credRef = firestore.collection("admin_credentials").doc("default");
  const snapshot = await credRef.get();

  if (snapshot.exists) {
    const data = snapshot.data();
    if (data?.username && data?.password) {
      return {
        username: String(data.username),
        password: String(data.password),
      };
    }
  }

  const fallback = {
    username: DEFAULT_ADMIN_USERNAME,
    password: DEFAULT_ADMIN_PASSWORD,
  };

  await credRef.set(fallback, { merge: true });
  return fallback;
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  const creds = await fetchAdminCredentials();
  return username === creds.username && password === creds.password;
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "authenticated", {
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
  return cookieStore.get(SESSION_COOKIE)?.value === "authenticated";
}
