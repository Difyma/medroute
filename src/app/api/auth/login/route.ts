import { NextResponse } from "next/server";

import { loginWithPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Укажите email и пароль" }, { status: 400 });
  }

  const user = await loginWithPassword(email, password);
  if (!user) {
    return NextResponse.json({ error: "Неверные учетные данные" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
