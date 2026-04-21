import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { generateAiSummary, getCase, isDoctorAssignedToCase } from "@/lib/case-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const { id } = await context.params;
  const target = getCase(id);
  if (!target) {
    return NextResponse.json({ error: "Кейс не найден" }, { status: 404 });
  }

  if (
    user.role !== "admin" &&
    !(user.role === "patient" && target.patientId === user.id) &&
    !(user.role === "doctor" && isDoctorAssignedToCase(user.id, target.id))
  ) {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const updated = generateAiSummary(id);

  if (!updated) {
    return NextResponse.json({ error: "Кейс не найден" }, { status: 404 });
  }

  return NextResponse.json({ case: updated });
}
