"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("Онкология");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!fullName || !email || !city || !password) {
      setError("Заполните обязательные поля");
      return;
    }

    try {
      setPending(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, city, specialty, password, role }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setError(payload.error ?? "Не удалось создать аккаунт");
        return;
      }

      if (role === "doctor") {
        router.push("/app/doctor");
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
        <p className="eyebrow">Регистрация</p>
        <h1>Создание аккаунта</h1>
        <p>Выберите роль и получите доступ к соответствующему рабочему кабинету.</p>

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            Имя и фамилия
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Мария Иванова"
              required
            />
          </label>

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
            Город
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Москва"
              required
            />
          </label>

          {role === "doctor" ? (
            <label>
              Направление врача
              <input
                type="text"
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
                placeholder="Онкология"
                required
              />
            </label>
          ) : null}

          <label>
            Пароль
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Минимум 8 символов"
              required
            />
          </label>

          <fieldset className="role-switch">
            <legend>Роль</legend>
            <label>
              <input
                type="radio"
                value="patient"
                checked={role === "patient"}
                onChange={() => setRole("patient")}
              />
              Пациент
            </label>
            <label>
              <input
                type="radio"
                value="doctor"
                checked={role === "doctor"}
                onChange={() => setRole("doctor")}
              />
              Врач
            </label>
          </fieldset>

          {error ? <p className="field-error">{error}</p> : null}

          <button className="button" type="submit" disabled={pending}>
            {pending ? "Создаем аккаунт..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="auth-footnote">
          Уже есть аккаунт? <Link href="/auth/login">Войти</Link>
        </p>
      </section>
    </main>
  );
}
