import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";

export default async function AppRootRedirectPage() {
  const user = await requireUser();

  if (user.role === "doctor") {
    redirect("/app/doctor");
  }

  if (user.role === "admin") {
    redirect("/app/admin");
  }

  redirect("/app/patient");
}
