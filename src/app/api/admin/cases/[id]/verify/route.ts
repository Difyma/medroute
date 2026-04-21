import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { setCaseVerification } from "@/lib/case-store";

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

  const documentsAreReadable = form.get("documentsAreReadable") === "on";
  const diagnosisMatchesDocuments = form.get("diagnosisMatchesDocuments") === "on";
  const patientIdentityConfirmed = form.get("patientIdentityConfirmed") === "on";
  const fundraisingGoalValidated = form.get("fundraisingGoalValidated") === "on";

  const isVerified =
    documentsAreReadable &&
    diagnosisMatchesDocuments &&
    patientIdentityConfirmed &&
    fundraisingGoalValidated;

  setCaseVerification({
    caseId: id,
    isVerified,
    reviewedBy: user.fullName,
    checklist: {
      documentsAreReadable,
      diagnosisMatchesDocuments,
      patientIdentityConfirmed,
      fundraisingGoalValidated,
    },
  });

  return NextResponse.redirect(new URL("/app/admin", request.url), { status: 303 });
}
