"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateGrievanceStatus } from "@/lib/db";
import { isAuthenticated, destroySession } from "@/lib/auth";
import { GrievanceStatus } from "@/lib/types";

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
