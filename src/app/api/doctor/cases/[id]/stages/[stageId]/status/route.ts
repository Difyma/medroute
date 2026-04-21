import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { isDoctorAssignedToCase, updateCaseStageStatus } from "@/lib/case-store";
import { StageStatus } from "@/lib/types";

type RouteContext = {
  params: Promise<{ id: string; stageId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user || user.role !== "doctor") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const { id, stageId } = await context.params;
  if (!isDoctorAssignedToCase(user.id, id)) {
    return NextResponse.json({ error: "Кейс не назначен врачу" }, { status: 403 });
  }

  const form = await request.formData();
  const rawStatus = String(form.get("status") ?? "planned");
  const status: StageStatus = ["planned", "in-progress", "done"].includes(rawStatus)
    ? (rawStatus as StageStatus)
    : "planned";

  updateCaseStageStatus({
    caseId: id,
    stageKey: stageId,
    status,
    actorName: user.fullName,
  });

  return NextResponse.redirect(new URL(`/app/doctor/cases/${id}`, request.url), { status: 303 });
}
