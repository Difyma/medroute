import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { assignDoctorToCase } from "@/lib/case-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const { id } = await context.params;
  const form = await request.formData();

  const doctorId = String(form.get("doctorId") ?? "").trim();
  const stageKey = String(form.get("stageKey") ?? "").trim();
  const note = String(form.get("note") ?? "").trim();

  if (!doctorId) {
    return NextResponse.redirect(new URL("/app/admin", request.url), { status: 303 });
  }

  assignDoctorToCase({
    caseId: id,
    doctorId,
    stageKey: stageKey || undefined,
    note,
  });

  return NextResponse.redirect(new URL("/app/admin", request.url), { status: 303 });
}
