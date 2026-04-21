import { NextResponse } from "next/server";

import { registerUser } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const fullName = String(body.fullName ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const city = String(body.city ?? "").trim();
  const password = String(body.password ?? "");
  const role = body.role === "doctor" ? "doctor" : "patient";

  if (!fullName || !email || !city || !password) {
    return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Минимальная длина пароля — 8 символов" }, { status: 400 });
  }

  try {
    const user = await registerUser({ fullName, email, city, password, role });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "email-already-exists") {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 409 });
    }

    return NextResponse.json({ error: "Не удалось зарегистрировать пользователя" }, { status: 500 });
  }
}
