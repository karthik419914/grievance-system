import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let firestoreDb: FirebaseFirestore.Firestore | null = null;

function normalizeEnvString(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function resolvePrivateKey(value: string | undefined): string | undefined {
  const normalized = normalizeEnvString(value);
  if (!normalized) return undefined;
  return normalized.includes("\n") ? normalized : normalized.replace(/\\n/g, "\n");
}

export function getFirestoreDb(): FirebaseFirestore.Firestore | null {
  if (firestoreDb) {
    return firestoreDb;
  }

  if (getApps().length > 0) {
    firestoreDb = getFirestore();
    return firestoreDb;
  }

  const projectId = normalizeEnvString(process.env.FIREBASE_PROJECT_ID);
  const clientEmail = normalizeEnvString(process.env.FIREBASE_CLIENT_EMAIL);
  const privateKey = resolvePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (projectId && clientEmail && privateKey) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    firestoreDb = getFirestore();
    return firestoreDb;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp();
    firestoreDb = getFirestore();
    return firestoreDb;
  }

  return null;
}
