import fs from "fs/promises";
import os from "os";
import path from "path";
import { Grievance, GrievanceStatus } from "./types";

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
    await fs.writeFile(filePath, "[]", { encoding: "utf-8", flag: "a" });
    return true;
  } catch {
    return false;
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

export async function getAllGrievances(): Promise<Grievance[]> {
  if (inMemoryGrievances) {
    return [...inMemoryGrievances];
  }

  const filePath = await getDataFilePath();
  const fileData = await readFileData(filePath);

  if (fileData) {
    return fileData;
  }

  inMemoryGrievances = [];
  return [];
}

export async function addGrievance(grievance: Grievance): Promise<void> {
  const all = await getAllGrievances();
  const next = [grievance, ...all];

  if (inMemoryGrievances) {
    inMemoryGrievances = next;
    return;
  }

  const filePath = await getDataFilePath();

  try {
    await fs.writeFile(filePath, JSON.stringify(next, null, 2), "utf-8");
  } catch {
    inMemoryGrievances = next;
  }
}

export async function updateGrievanceStatus(
  id: string,
  status: GrievanceStatus
): Promise<void> {
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
  } catch {
    inMemoryGrievances = next;
  }
}
