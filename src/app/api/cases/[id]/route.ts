import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getCase, isDoctorAssignedToCase } from "@/lib/case-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const { id } = await context.params;
  const found = getCase(id);

  if (!found) {
    return NextResponse.json({ error: "Кейс не найден" }, { status: 404 });
  }

  if (
    user.role !== "admin" &&
    !(user.role === "patient" && found.patientId === user.id) &&
    !(user.role === "doctor" && isDoctorAssignedToCase(user.id, found.id))
  ) {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  return NextResponse.json({ case: found });
}
