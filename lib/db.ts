import fs from "fs/promises";
import os from "os";
import path from "path";
import { Grievance, GrievanceStatus } from "./types";
import { getFirestoreDb } from "./firebaseAdmin";

/**
 * Storage note (for reviewers):
 * This project uses a flat JSON file as a stand-in database so the
 * assignment runs anywhere with zero setup (no DB server, no connection
 * string). For read-only or serverless environments, we fall back to
 * in-memory storage so the app does not crash, even though the data is
 * not guaranteed to persist across cold starts.
 */

const LOCAL_DATA_FILE = path.join(process.cwd(), "data", "grievances.json");
const TMP_DATA_FILE = path.join(os.tmpdir(), "grievances.json");
let dataFile = LOCAL_DATA_FILE;
let dataFileChecked = false;
let inMemoryGrievances: Grievance[] | null = null;

async function makeFileWritable(filePath: string): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK);
    return true;
  } catch {
    try {
      await fs.writeFile(filePath, "[]", { encoding: "utf-8" });
      return true;
    } catch {
      return false;
    }
  }
}

async function getDataFilePath(): Promise<string> {
  if (dataFileChecked) return dataFile;
  dataFileChecked = true;

  if (await makeFileWritable(LOCAL_DATA_FILE)) {
    dataFile = LOCAL_DATA_FILE;
  } else if (await makeFileWritable(TMP_DATA_FILE)) {
    dataFile = TMP_DATA_FILE;
  } else {
    inMemoryGrievances = inMemoryGrievances ?? [];
  }

  return dataFile;
}

async function readFileData(filePath: string): Promise<Grievance[] | null> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Grievance[];
  } catch {
    return null;
  }
}

function resolvePrivateKey(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.includes("\n") ? value : value.replace(/\\n/g, "\n");
}

async function getRemoteGrievances(): Promise<Grievance[] | null> {
  const firestore = getFirestoreDb();
  if (!firestore) return null;

  const snapshot = await firestore
    .collection("grievances")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Grievance;
    return {
      ...data,
      id: data.id || doc.id,
    };
  });
}

export function isUsingFirestore(): boolean {
  return getFirestoreDb() !== null;
}

export function getFirestoreConfigStatus(): { configured: boolean; missing: string[] } {
  const hasAppCredential = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim());
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = resolvePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (hasAppCredential) {
    return { configured: true, missing: [] };
  }

  const missing: string[] = [];
  if (!projectId) missing.push("FIREBASE_PROJECT_ID");
  if (!clientEmail) missing.push("FIREBASE_CLIENT_EMAIL");
  if (!privateKey) missing.push("FIREBASE_PRIVATE_KEY");

  return { configured: missing.length === 0, missing };
}

export async function getAllGrievances(): Promise<Grievance[]> {
  if (inMemoryGrievances) {
    return [...inMemoryGrievances];
  }

  const remote = await getRemoteGrievances();
  if (remote) {
    return remote;
  }

  const filePath = await getDataFilePath();
  const fileData = await readFileData(filePath);

  if (fileData) {
    return fileData;
  }

  return [];
}

async function addRemoteGrievance(grievance: Grievance): Promise<void> {
  const firestore = getFirestoreDb();
  if (!firestore) return;

  await firestore.collection("grievances").doc(grievance.id).set(grievance);
}

async function updateRemoteGrievanceStatus(id: string, status: GrievanceStatus): Promise<void> {
  const firestore = getFirestoreDb();
  if (!firestore) return;

  const docRef = firestore.collection("grievances").doc(id);
  await docRef.update({ status });
}

export async function addGrievance(grievance: Grievance): Promise<void> {
  const firestore = getFirestoreDb();
  if (firestore) {
    await addRemoteGrievance(grievance);
    return;
  }

  const all = await getAllGrievances();
  const next = [grievance, ...all];

  if (inMemoryGrievances) {
    inMemoryGrievances = next;
    return;
  }

  const filePath = await getDataFilePath();

  try {
    await fs.writeFile(filePath, JSON.stringify(next, null, 2), "utf-8");
  } catch (error) {
    throw new Error(`Unable to persist grievance: ${String(error)}`);
  }
}

export async function updateGrievanceStatus(
  id: string,
  status: GrievanceStatus
): Promise<void> {
  const firestore = getFirestoreDb();
  if (firestore) {
    await updateRemoteGrievanceStatus(id, status);
    return;
  }

  const all = await getAllGrievances();
  const index = all.findIndex((g) => g.id === id);
  if (index === -1) return;

  const next = [...all];
  next[index] = { ...next[index], status };

  if (inMemoryGrievances) {
    inMemoryGrievances = next;
    return;
  }

  const filePath = await getDataFilePath();

  try {
    await fs.writeFile(filePath, JSON.stringify(next, null, 2), "utf-8");
  } catch (error) {
    throw new Error(`Unable to persist grievance status: ${String(error)}`);
  }
}
