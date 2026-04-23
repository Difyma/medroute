import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string; stageId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user || user.role !== "doctor") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const { id } = await context.params;
  return NextResponse.redirect(new URL(`/app/doctor?case=${id}`, request.url), { status: 303 });
}
