"use server";

import { randomUUID } from "crypto";
import { grievanceSchema } from "@/lib/schema";
import { addGrievance } from "@/lib/db";
import { Grievance } from "@/lib/types";

export type SubmitResult =
  | { success: true; id: string }
  | { success: false; error: string };

/**
 * Final submission handler. Re-validates the full payload server-side with
 * the same Zod schema used on the client — client-side validation is for
 * UX, this is the actual guard, since a request could reach this action
 * without going through the form UI at all.
 */
export async function submitGrievance(data: unknown): Promise<SubmitResult> {
  const parsed = grievanceSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error:
        "Some details are missing or invalid. Please review the form and try again.",
    };
  }

  const grievance: Grievance = {
    id: randomUUID(),
    ...parsed.data,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  await addGrievance(grievance);

  return { success: true, id: grievance.id };
}
