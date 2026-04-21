import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDb } from "@/lib/db";
import { createSessionToken, hashToken, verifyPassword } from "@/lib/security";
import { createUser, getUserByEmail, getUserById } from "@/lib/user-store";
import { AppUser, UserRole } from "@/lib/types";

const SESSION_COOKIE = "medroute_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;

function makeSessionExpiry(): Date {
  return new Date(Date.now() + SESSION_TTL_MS);
}

async function readSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const token = await readSessionToken();
  if (!token) {
    return null;
  }

  const db = getDb();
  const nowIso = new Date().toISOString();

  const session = db
    .prepare(
      `SELECT s.id, s.user_id as userId
       FROM sessions s
       WHERE s.token_hash = ? AND s.expires_at > ?
       LIMIT 1`,
    )
    .get(hashToken(token), nowIso) as { id: string; userId: string } | undefined;

  if (!session) {
    return null;
  }

  const user = getUserById(session.userId);
  return user ?? null;
}

export async function requireUser(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  return user;
}

export async function requireRole(roles: UserRole[]): Promise<AppUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    redirect("/app");
  }

  return user;
}

export async function createSession(userId: string): Promise<void> {
  const token = createSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = makeSessionExpiry();

  const db = getDb();
  db.prepare("INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)").run(
    randomUUID(),
    userId,
    tokenHash,
    expiresAt.toISOString(),
    new Date().toISOString(),
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function logout(): Promise<void> {
  const token = await readSessionToken();
  if (token) {
    getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashToken(token));
  }

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function loginWithPassword(email: string, password: string): Promise<AppUser | null> {
  const user = getUserByEmail(email);
  if (!user) {
    return null;
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return null;
  }

  await createSession(user.id);
  return user;
}

export async function registerUser(input: {
  fullName: string;
  email: string;
  role: Extract<UserRole, "patient" | "doctor">;
  city: string;
  password: string;
}): Promise<AppUser> {
  const existing = getUserByEmail(input.email);
  if (existing) {
    throw new Error("email-already-exists");
  }

  const user = createUser(input);
  await createSession(user.id);
  return user;
}
