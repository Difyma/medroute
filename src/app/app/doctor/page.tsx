import Link from "next/link";

import { requireRole } from "@/lib/auth";
import { listAssignedCasesForDoctor } from "@/lib/case-store";

export default async function DoctorDashboardPage() {
  const user = await requireRole(["doctor"]);
  const cases = listAssignedCasesForDoctor(user.id);

  return (
    <main className="app-page">
      <section className="dashboard-head">
        <div>
          <p className="eyebrow">Кабинет врача</p>
          <h1>{user.fullName}</h1>
          <p>Назначенные кейсы пациентов, обновление этапов и публикация медицинских апдейтов.</p>
        </div>
      </section>

      <section className="summary-surface">
        <h2>Назначенные кейсы</h2>
        {cases.length === 0 ? (
          <p>Пока нет назначенных кейсов. Администратор может назначить вас на ведение этапов.</p>
        ) : (
          <div className="dashboard-cases-grid">
            {cases.map((item) => (
              <article key={item.id} className="dashboard-case-card">
                <h3>{item.patientName}</h3>
                <p>{item.diagnosis}</p>
                <small>
                  {item.city} · кейс {item.id}
                </small>
                <div className="hero-actions">
                  <Link href={`/app/doctor/cases/${item.id}`} className="button button-small">
                    Открыть рабочую карточку
                  </Link>
                  <Link href={`/cases/${item.slug}`} className="button button-small button-ghost">
                    Публичный вид
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
