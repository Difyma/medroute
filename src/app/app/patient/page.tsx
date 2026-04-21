import Link from "next/link";

import { requireRole } from "@/lib/auth";
import { listCasesForPatient } from "@/lib/case-store";
import { formatMoney, percent } from "@/lib/format";

export default async function PatientDashboardPage() {
  const user = await requireRole(["patient"]);
  const cases = listCasesForPatient(user.id);

  return (
    <main className="app-page">
      <section className="dashboard-head">
        <div>
          <p className="eyebrow">Кабинет пациента</p>
          <h1>Здравствуйте, {user.fullName}</h1>
          <p>Управляйте своими кейсами, отслеживайте этапы и статус помощи.</p>
        </div>
        <div className="app-links">
          <Link href="/app/start" className="button">
            Создать новый кейс
          </Link>
          <Link href="/app/clinics" className="button button-ghost">
            Поиск клиник
          </Link>
        </div>
      </section>

      <section className="summary-surface">
        <h2>Мои кейсы</h2>
        {cases.length === 0 ? (
          <p>У вас пока нет кейсов. Запустите первый кейс, чтобы получить маршрут лечения.</p>
        ) : (
          <div className="dashboard-cases-grid">
            {cases.map((item) => {
              const progress = percent(item.fundraising.raised, item.fundraising.target);
              return (
                <article key={item.id} className="dashboard-case-card">
                  <div className="dashboard-case-head">
                    <h3>{item.patientName}</h3>
                    <span className={item.isVerified ? "verify-badge" : "verify-badge verify-badge-pending"}>
                      {item.isVerified ? "Проверено" : "Проверка"}
                    </span>
                  </div>
                  <p>{item.diagnosis}</p>
                  <small>
                    {item.city} · создан {item.createdAt.slice(0, 10)}
                  </small>
                  <div className="funding-meter">
                    <div style={{ width: `${progress}%` }} />
                  </div>
                  <p>
                    {formatMoney(item.fundraising.raised)} из {formatMoney(item.fundraising.target)} ({progress}%)
                  </p>
                  <div className="hero-actions">
                    <Link href={`/app/cases/${item.id}`} className="button button-small">
                      Открыть кейс
                    </Link>
                    <Link href={`/cases/${item.slug}`} className="button button-small button-ghost">
                      Публичная страница
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
