import { NextResponse } from "next/server";

import { logout } from "@/lib/auth";

export async function POST(request: Request) {
  await logout();

  const wantsJson = request.headers.get("content-type")?.includes("application/json");
  if (wantsJson) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
