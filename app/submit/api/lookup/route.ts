import { NextResponse } from "next/server";
import { z } from "zod";
import { getAllGrievances } from "@/lib/db";

const requestSchema = z.object({
  referenceCode: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ submission: null, error: "Please provide a valid code." }, { status: 400 });
  }

  const all = await getAllGrievances();
  const submission = all.find((g) => g.referenceCode.toUpperCase() === parsed.data.referenceCode.toUpperCase()) ?? null;

  return NextResponse.json({
    submission,
    error: submission ? null : "No report found for that code.",
  });
}
