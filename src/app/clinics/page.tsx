import Link from "next/link";

import { ClinicSearchBlock } from "@/components/clinic-search-block";

export default function ClinicsPage() {
  return (
    <main className="landing-root">
      <section className="surface-section clinics-page-head">
        <p className="eyebrow">MedRoute</p>
        <h1>Поиск клиник под этап лечения</h1>
        <p>
          Отдельный каталог клиник для маршрута пациента: фильтры по этапам, быстрый поиск по городу и
          специализации, сравнение стоимости и доступных вариантов.
        </p>
        <div className="hero-actions">
          <Link href="/" className="button button-ghost">
            На главную
          </Link>
        </div>
      </section>

      <ClinicSearchBlock />
    </main>
  );
}
