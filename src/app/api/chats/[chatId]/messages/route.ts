import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { addChatMessage, isDoctorInChat, isPatientInChat } from "@/lib/case-store";

type RouteContext = {
  params: Promise<{ chatId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const { chatId } = await context.params;
  const form = await request.formData();
  const messageKindRaw = String(form.get("messageKind") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  const redirectTo = String(form.get("redirectTo") ?? "/app");

  if (!body) {
    return NextResponse.redirect(new URL(redirectTo, request.url), { status: 303 });
  }

  if (user.role === "doctor") {
    if (!isDoctorInChat(chatId, user.id)) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }
    if (!["recommendation", "alternative-plan"].includes(messageKindRaw)) {
      return NextResponse.redirect(new URL(redirectTo, request.url), { status: 303 });
    }

    addChatMessage({
      chatId,
      senderRole: "doctor",
      messageKind: messageKindRaw as "recommendation" | "alternative-plan",
      senderName: user.fullName,
      body,
    });

    return NextResponse.redirect(new URL(redirectTo, request.url), { status: 303 });
  }

  if (user.role === "patient") {
    if (!isPatientInChat(chatId, user.id)) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    addChatMessage({
      chatId,
      senderRole: "patient",
      messageKind: "comment",
      senderName: user.fullName,
      body,
    });

    return NextResponse.redirect(new URL(redirectTo, request.url), { status: 303 });
  }

  return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
}
