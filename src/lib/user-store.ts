import { randomUUID } from "node:crypto";

import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/security";
import { AppUser, UserRole } from "@/lib/types";

type UserRow = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  city: string;
  specialty: string;
  password_hash: string;
  created_at: string;
};

function mapUser(row: UserRow): AppUser {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    city: row.city,
    specialty: row.specialty,
    createdAt: row.created_at,
  };
}

export function getUserById(id: string): AppUser | undefined {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT id, full_name, email, role, city, specialty, password_hash, created_at FROM users WHERE id = ? LIMIT 1",
    )
    .get(id) as UserRow | undefined;

  return row ? mapUser(row) : undefined;
}

export function getUserByEmail(email: string): (AppUser & { passwordHash: string }) | undefined {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT id, full_name, email, role, city, specialty, password_hash, created_at FROM users WHERE email = ? LIMIT 1",
    )
    .get(email.trim().toLowerCase()) as UserRow | undefined;

  if (!row) {
    return undefined;
  }

  return {
    ...mapUser(row),
    passwordHash: row.password_hash,
  };
}

export function createUser(input: {
  fullName: string;
  email: string;
  role: Extract<UserRole, "patient" | "doctor">;
  city: string;
  specialty?: string;
  password: string;
}): AppUser {
  const db = getDb();

  const user: AppUser = {
    id: randomUUID(),
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    city: input.city.trim(),
    specialty: input.specialty?.trim() || "Онкология",
    createdAt: new Date().toISOString(),
  };

  db.prepare(
    `INSERT INTO users (id, full_name, email, role, city, specialty, password_hash, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    user.id,
    user.fullName,
    user.email,
    user.role,
    user.city,
    user.specialty,
    hashPassword(input.password),
    user.createdAt,
  );

  return user;
}

export function listUsers(): AppUser[] {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT id, full_name, email, role, city, specialty, password_hash, created_at FROM users ORDER BY created_at DESC",
    )
    .all() as UserRow[];

  return rows.map((row) => mapUser(row));
}
