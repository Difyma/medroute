import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { listClinicDirectory } from "@/lib/case-store";
import { formatMoney } from "@/lib/format";

type PageProps = {
  searchParams: Promise<{ q?: string; stage?: string }>;
};

const STAGES = ["Все этапы", "Диагностика", "Консилиум", "Терапия", "Операция", "Реабилитация"];

export default async function AppClinicsPage({ searchParams }: PageProps) {
  const user = await requireUser();
  const params = await searchParams;

  const query = params.q ?? "";
  const stage = STAGES.includes(params.stage ?? "") ? (params.stage as string) : "Все этапы";

  const clinics = listClinicDirectory({ query, stage });

  return (
    <main className="app-page">
      <section className="app-hero">
        <p className="eyebrow">Каталог клиник</p>
        <h1>Поиск клиник по этапам лечения</h1>
        <p>
          Внутренний каталог MedRoute: фильтрация по этапам маршрута, городу и специализации. Доступен для роли {" "}
          <strong>{user.role}</strong>.
        </p>
        <div className="hero-actions">
          <Link href="/clinics" className="button button-small button-ghost">
            Открыть публичную страницу
          </Link>
        </div>
      </section>

      <section className="surface-section clinic-search-section">
        <form method="get" className="clinic-search-controls">
          <input type="text" name="q" defaultValue={query} placeholder="Введите город, клинику или специализацию" />
          <div className="clinic-stage-tabs">
            {STAGES.map((tab) => (
              <button key={tab} type="submit" name="stage" value={tab} className={`clinic-tab ${stage === tab ? "clinic-tab-active" : ""}`}>
                {tab}
              </button>
            ))}
          </div>
        </form>

        <div className="clinic-results-grid">
          {clinics.map((clinic) => (
            <article key={clinic.id} className="clinic-card">
              <div className="clinic-card-head">
                <span>{clinic.stage}</span>
                <strong>
                  {clinic.rating} ({clinic.reviewCount})
                </strong>
              </div>
              <h3>{clinic.name}</h3>
              <p>
                {clinic.city}, {clinic.country}
              </p>
              <small>{clinic.specialization}</small>
              <small>{clinic.description}</small>
              <div className="clinic-card-foot">
                <span>от {formatMoney(clinic.priceFrom)}</span>
                <button type="button" className="button button-small button-ghost">
                  Смотреть детали
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
