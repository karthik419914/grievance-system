"use server";

import { redirect } from "next/navigation";
import { validateCredentials, createSession } from "@/lib/auth";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");

  if (!(await validateCredentials(username, password))) {
    return { error: "Invalid username or password." };
  }

  await createSession();
  redirect("/admin/dashboard");
}
