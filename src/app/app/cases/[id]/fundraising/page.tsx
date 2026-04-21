import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { DonationForm } from "@/components/donation-form";
import { requireUser } from "@/lib/auth";
import { getCase } from "@/lib/case-store";
import { formatMoney, percent } from "@/lib/format";

type FundraisingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function FundraisingPage({ params }: FundraisingPageProps) {
  const user = await requireUser();
  const { id } = await params;
  const patientCase = getCase(id);

  if (!patientCase) {
    notFound();
  }

  if (user.role === "patient" && patientCase.patientId !== user.id) {
    redirect("/app/patient");
  }
  if (user.role === "doctor") {
    redirect("/app/doctor");
  }

  const currentStage = patientCase.roadmap.find(
    (stage) => stage.id === patientCase.fundraising.currentStageId,
  );
  const progress = percent(patientCase.fundraising.raised, patientCase.fundraising.target);

  return (
    <main className="app-page">
      <div className="app-links">
        <Link href={`/app/cases/${patientCase.id}`} className="button button-small button-ghost">
          Назад к кейсу
        </Link>
      </div>

      <section className="app-hero">
        <p className="eyebrow">Экран сбора</p>
        <h1>Сбор на этап «{currentStage?.title ?? "Операция"}»</h1>
        <p>
          Конкретная цель повышает доверие: донор видит, что его перевод закрывает четкую часть маршрута
          лечения.
        </p>
      </section>

      <section className="funding-surface">
        <div>
          <h2>Прогресс сбора</h2>
          <div className="funding-meter">
            <div style={{ width: `${progress}%` }} />
          </div>
          <p>
            {formatMoney(patientCase.fundraising.raised)} из {formatMoney(patientCase.fundraising.target)} ({progress}%)
          </p>
          <div className="small-cost-list">
            <div>
              <span>Минимальная оценка этапа</span>
              <strong>{formatMoney(currentStage?.costMin ?? 0)}</strong>
            </div>
            <div>
              <span>Оптимальная цель</span>
              <strong>{formatMoney(patientCase.fundraising.target)}</strong>
            </div>
            <div>
              <span>Верхняя граница</span>
              <strong>{formatMoney(currentStage?.costMax ?? patientCase.fundraising.target)}</strong>
            </div>
          </div>
        </div>

        <DonationForm
          caseId={patientCase.id}
          suggestedAmount={3000}
          quickAmounts={[1000, 3000, 5000, 10000, 25000]}
        />
      </section>
    </main>
  );
}
