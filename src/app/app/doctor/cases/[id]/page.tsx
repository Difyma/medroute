import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth";
import { getCase, isDoctorAssignedToCase } from "@/lib/case-store";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DoctorCaseRedirectPage({ params }: PageProps) {
  const user = await requireRole(["doctor"]);
  const { id } = await params;
  const patientCase = getCase(id);

  if (!patientCase || !isDoctorAssignedToCase(user.id, patientCase.id)) {
    redirect("/app/doctor");
  }

  redirect(`/app/doctor?case=${patientCase.id}`);
}
