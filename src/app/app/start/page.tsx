import Link from "next/link";

import { StartCaseForm } from "@/components/start-case-form";
import { requireRole } from "@/lib/auth";

export default async function StartCasePage() {
  await requireRole(["patient"]);

  return (
    <main className="app-page">
      <div className="app-links">
        <Link href="/app/patient" className="button button-small button-ghost">
          В кабинет пациента
        </Link>
      </div>

      <section className="app-hero">
        <p className="eyebrow">Шаг 1 / Создание кейса</p>
        <h1>Заполните данные пациента и загрузите медицинские документы</h1>
        <p>
          После создания кейса вы получите первичную оценку, маршрут лечения и расчет стоимости по этапам.
        </p>
      </section>

      <section className="form-shell">
        <StartCaseForm />
      </section>
    </main>
  );
}
