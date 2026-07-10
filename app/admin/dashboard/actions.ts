"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateGrievanceStatus } from "@/lib/db";
import { isAuthenticated, destroySession, isMainAdmin } from "@/lib/auth";
import { GrievanceStatus } from "@/lib/types";
import { getFirestoreDb } from "@/lib/firebaseAdmin";

export async function updateStatusAction(id: string, status: GrievanceStatus) {
  const authed = await isAuthenticated();
  if (!authed) {
    return { success: false as const, error: "Not authenticated" };
  }

  await updateGrievanceStatus(id, status);
  revalidatePath("/admin/dashboard");
  return { success: true as const };
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function addAdminAction(email: string, password: string) {
  const authed = await isAuthenticated();
  if (!authed) {
    return { success: false as const, error: "Not authenticated" };
  }

  const isMain = await isMainAdmin();
  if (!isMain) {
    return { success: false as const, error: "Access denied. Only the main admin can perform this action." };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { success: false as const, error: "Invalid email address." };
  }
  if (!password || password.length < 6) {
    return { success: false as const, error: "Password must be at least 6 characters long." };
  }

  const firestore = getFirestoreDb();
  if (!firestore) {
    return { success: false as const, error: "Database configuration error. Adding admins requires Firestore." };
  }

  try {
    const docRef = firestore.collection("admin_credentials").doc(cleanEmail);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return { success: false as const, error: "An admin with this email address already exists." };
    }

    await docRef.set({
      username: cleanEmail,
      password: password,
    });

    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: `Failed to create admin: ${String(error)}` };
  }
}

export async function fetchAdminsAction() {
  const authed = await isAuthenticated();
  if (!authed) {
    return { success: false as const, error: "Not authenticated" };
  }

  const isMain = await isMainAdmin();
  if (!isMain) {
    return { success: false as const, error: "Access denied. Only the main admin can perform this action." };
  }

  const firestore = getFirestoreDb();
  if (!firestore) {
    return { success: false as const, error: "Firestore is not configured." };
  }

  try {
    const snapshot = await firestore.collection("admin_credentials").get();
    const emails: string[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (typeof data.username === "string") {
        emails.push(data.username);
      } else {
        emails.push(doc.id);
      }
    });

    // Sort emails, keeping main admin at the top
    emails.sort((a, b) => {
      if (a === "karthik419914@gmail.com") return -1;
      if (b === "karthik419914@gmail.com") return 1;
      return a.localeCompare(b);
    });

    return { success: true as const, admins: emails };
  } catch (error) {
    return { success: false as const, error: `Failed to fetch admins: ${String(error)}` };
  }
}

export async function deleteAdminAction(email: string) {
  const authed = await isAuthenticated();
  if (!authed) {
    return { success: false as const, error: "Not authenticated" };
  }

  const isMain = await isMainAdmin();
  if (!isMain) {
    return { success: false as const, error: "Access denied. Only the main admin can perform this action." };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === "karthik419914@gmail.com") {
    return { success: false as const, error: "The main admin cannot be deleted." };
  }

  const firestore = getFirestoreDb();
  if (!firestore) {
    return { success: false as const, error: "Firestore is not configured." };
  }

  try {
    await firestore.collection("admin_credentials").doc(cleanEmail).delete();
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: `Failed to delete admin: ${String(error)}` };
  }
}
