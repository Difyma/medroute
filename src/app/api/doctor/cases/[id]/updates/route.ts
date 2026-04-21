import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { addCaseUpdate, isDoctorAssignedToCase } from "@/lib/case-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user || user.role !== "doctor") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const { id } = await context.params;
  if (!isDoctorAssignedToCase(user.id, id)) {
    return NextResponse.json({ error: "Кейс не назначен врачу" }, { status: 403 });
  }

  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  const kindRaw = String(form.get("kind") ?? "general");

  if (!title || !body) {
    return NextResponse.redirect(new URL(`/app/doctor/cases/${id}`, request.url), { status: 303 });
  }

  const kind = ["stage-completed", "treatment-started", "plan-adjusted", "general"].includes(kindRaw)
    ? (kindRaw as "stage-completed" | "treatment-started" | "plan-adjusted" | "general")
    : "general";

  addCaseUpdate({
    caseId: id,
    title,
    body,
    kind,
  });

  return NextResponse.redirect(new URL(`/app/doctor/cases/${id}`, request.url), { status: 303 });
}
