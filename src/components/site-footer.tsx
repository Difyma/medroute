import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";

export async function SiteFooter() {
  const user = await getCurrentUser();
  const profileHref =
    user?.role === "doctor" ? "/app/doctor" : user?.role === "admin" ? "/app/admin" : "/app/patient";

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <div className="site-footer-brand-row">
            <span className="site-footer-brand-graphic">
              <img
                src="/style/logomedroute-Photoroom.png"
                alt=""
                width={60}
                height={60}
                className="site-footer-brand-logo"
                decoding="async"
              />
            </span>
            <span className="eyebrow site-footer-brand-title">MedRoute</span>
          </div>
          <p className="site-footer-copy">
            Сервис навигации по лечению с поддержкой пациента и семьи на каждом этапе.
          </p>
        </div>
        <div className="site-footer-links">
          <Link href="/">Главная</Link>
          <Link href="/clinics">Поиск клиник</Link>
          {user ? <Link href={profileHref}>Мой кабинет</Link> : <Link href="/auth/login">Войти</Link>}
        </div>
      </div>
    </footer>
  );
}
