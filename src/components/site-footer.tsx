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
                src="/brand/logomedroute-icon-512.png"
                alt="Логотип MedRoute"
                width={36}
                height={36}
                className="site-footer-brand-logo"
                decoding="async"
              />
            </span>
            <span className="eyebrow site-footer-brand-title">MedRoute</span>
          </div>
          <p className="site-footer-copy">
            Сервис навигации по лечению с поддержкой пациента и семьи на каждом этапе.
          </p>
          <p className="site-footer-doctors">
            Обращение для врачей:{" "}
            <a href="mailto:medrout@yandex.com">medrout@yandex.com</a>
          </p>
        </div>
        <div className="site-footer-links">
          <Link href="/">Главная</Link>
          <Link href="/consultation">Консультации</Link>
          <Link href="/online">Онлайн</Link>
          <Link href="/treatment">Помощь в лечении</Link>
          <Link href="/help">К какому врачу</Link>
          <Link href="/clinics">Клиники</Link>
          {user ? <Link href={profileHref}>Мой кабинет</Link> : <Link href="/auth/login">Войти</Link>}
        </div>
      </div>
    </footer>
  );
}
