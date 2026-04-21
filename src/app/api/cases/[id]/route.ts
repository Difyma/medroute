import { NextResponse } from "next/server";

import { getCase } from "@/lib/case-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const found = getCase(id);

  if (!found) {
    return NextResponse.json({ error: "Кейс не найден" }, { status: 404 });
  }

  return NextResponse.json({ case: found });
}
