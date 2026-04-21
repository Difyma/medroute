import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { createCase, listAssignedCasesForDoctor, listCases, listCasesForPatient } from "@/lib/case-store";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  if (user.role === "admin") {
    return NextResponse.json({ cases: listCases() });
  }

  if (user.role === "doctor") {
    return NextResponse.json({ cases: listAssignedCasesForDoctor(user.id) });
  }

  return NextResponse.json({ cases: listCasesForPatient(user.id) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }
  if (user.role !== "patient") {
    return NextResponse.json({ error: "Создание кейса доступно только пациенту" }, { status: 403 });
  }

  const body = await request.json();

  if (!body.patientName || !body.city || !body.diagnosis) {
    return NextResponse.json(
      { error: "Не заполнены обязательные поля" },
      { status: 400 },
    );
  }

  const created = createCase({
    patientName: String(body.patientName),
    age: Number(body.age) || 0,
    city: String(body.city),
    diagnosis: String(body.diagnosis),
    currentState: String(body.currentState ?? ""),
    completedActions: String(body.completedActions ?? ""),
    documentNames: Array.isArray(body.documentNames)
      ? body.documentNames.map((item: unknown) => String(item))
      : [],
  }, user.id);

  return NextResponse.json({ case: created }, { status: 201 });
}
