import { NextResponse } from "next/server";

import { generateAiSummary } from "@/lib/case-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const updated = generateAiSummary(id);

  if (!updated) {
    return NextResponse.json({ error: "Кейс не найден" }, { status: 404 });
  }

  return NextResponse.json({ case: updated });
}
