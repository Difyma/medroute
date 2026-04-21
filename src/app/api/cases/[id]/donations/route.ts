import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { donateToCase } from "@/lib/case-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const amount = Number(body.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Некорректная сумма" }, { status: 400 });
  }

  const updated = donateToCase(id, amount);

  if (!updated) {
    return NextResponse.json({ error: "Кейс не найден" }, { status: 404 });
  }

  return NextResponse.json({ case: updated });
}
