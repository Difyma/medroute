import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";

export async function SiteHeader() {
  const user = await getCurrentUser();

  const dashboardHref =
    user?.role === "doctor"
      ? "/app/doctor"
      : user?.role === "admin"
        ? "/app/admin"
        : "/app/patient";

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand-mark">
          <span className="brand-mark-graphic">
            <img
              src="/brand/logomedroute-icon-512.png"
              alt="Логотип MedRoute"
              width={36}
              height={36}
              className="brand-mark-logo"
              decoding="async"
              fetchPriority="high"
            />
          </span>
          <span className="brand-mark-text">MedRoute</span>
        </Link>
        <nav className="site-nav">
          <Link href="/consultation">Консультации</Link>
          <Link href="/online">Онлайн</Link>
          <Link href="/treatment">Лечение</Link>
          <Link href="/help">К кому идти</Link>
          <Link href="/clinics">Клиники</Link>
          {user ? (
            <>
              <Link href={dashboardHref}>Мой кабинет</Link>
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="site-nav-button">
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login">Войти</Link>
              <Link href="/auth/register">Регистрация</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
