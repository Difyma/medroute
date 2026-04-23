import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { acceptCaseForDoctor, getCase } from "@/lib/case-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user || user.role !== "doctor") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const { id } = await context.params;
  const patientCase = getCase(id);

  if (!patientCase) {
    return NextResponse.json({ error: "Кейс не найден" }, { status: 404 });
  }

  acceptCaseForDoctor({
    doctorId: user.id,
    caseId: patientCase.id,
  });

  const form = await request.formData().catch(() => null);
  const redirectToRaw = String(form?.get("redirectTo") ?? "").trim();
  const redirectTo = redirectToRaw.startsWith("/") ? redirectToRaw : `/app/doctor?case=${patientCase.id}`;

  return NextResponse.redirect(new URL(redirectTo, request.url), { status: 303 });
}
