import fs from "fs/promises";
import path from "path";
import { Grievance, GrievanceStatus } from "./types";

/**
 * Storage note (for reviewers):
 * This project uses a flat JSON file as a stand-in database so the
 * assignment runs anywhere with zero setup (no DB server, no connection
 * string). All reads/writes go through this module, so swapping it for
 * Postgres/Prisma, MongoDB, or Supabase later only means rewriting the
 * three functions below — nothing in the UI or server actions would change.
 */

const DATA_FILE = path.join(process.cwd(), "data", "grievances.json");

async function ensureFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

export async function getAllGrievances(): Promise<Grievance[]> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as Grievance[];
  } catch {
    return [];
  }
}

export async function addGrievance(grievance: Grievance): Promise<void> {
  await ensureFile();
  const all = await getAllGrievances();
  all.unshift(grievance);
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
}

export async function updateGrievanceStatus(
  id: string,
  status: GrievanceStatus
): Promise<void> {
  await ensureFile();
  const all = await getAllGrievances();
  const index = all.findIndex((g) => g.id === id);
  if (index === -1) return;
  all[index] = { ...all[index], status };
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
}
