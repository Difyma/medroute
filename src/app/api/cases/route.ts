import { NextResponse } from "next/server";

import { createCase, listCases } from "@/lib/case-store";

export async function GET() {
  return NextResponse.json({ cases: listCases() });
}

export async function POST(request: Request) {
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
  });

  return NextResponse.json({ case: created }, { status: 201 });
}
