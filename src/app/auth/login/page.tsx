"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type ApiUser = {
  id: string;
  role: "patient" | "doctor" | "admin";
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Заполните email и пароль");
      return;
    }

    try {
      setPending(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        user?: ApiUser;
        error?: string;
      };

      if (!response.ok || !payload.user) {
        setError(payload.error ?? "Не удалось выполнить вход");
        return;
      }

      if (payload.user.role === "doctor") {
        router.push("/app/doctor");
        return;
      }

      if (payload.user.role === "admin") {
        router.push("/app/admin");
        return;
      }

      router.push("/app/patient");
    } catch {
      setError("Сервис временно недоступен. Повторите попытку.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Авторизация</p>
        <h1>Вход в MedRoute</h1>
        <p>Войдите, чтобы открыть рабочий кабинет пациента, врача или администратора.</p>

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Пароль
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Введите пароль"
              required
            />
          </label>

          {error ? <p className="field-error">{error}</p> : null}

          <button className="button" type="submit" disabled={pending}>
            {pending ? "Входим..." : "Войти"}
          </button>
        </form>

        <p className="auth-footnote">
          Нет аккаунта? <Link href="/auth/register">Зарегистрироваться</Link>
        </p>
      </section>
    </main>
  );
}
