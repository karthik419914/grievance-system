import { NextResponse } from "next/server";
import { z } from "zod";
import { getAllGrievances } from "@/lib/db";

const requestSchema = z.object({
  codes: z.array(z.string().min(1)).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ submissions: [] }, { status: 400 });
  }

  const codes = parsed.data.codes ?? [];
  const all = await getAllGrievances();
  const submissions = codes.length > 0 ? all.filter((g) => codes.includes(g.referenceCode)) : [];

  return NextResponse.json({ submissions });
}
