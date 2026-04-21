import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const digest = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${digest}`;
}

export function verifyPassword(password: string, encoded: string): boolean {
  const [salt, digest] = encoded.split(":");
  if (!salt || !digest) {
    return false;
  }

  const passwordBuffer = scryptSync(password, salt, 64);
  const digestBuffer = Buffer.from(digest, "hex");

  if (passwordBuffer.length !== digestBuffer.length) {
    return false;
  }

  return timingSafeEqual(passwordBuffer, digestBuffer);
}

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
