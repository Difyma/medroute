import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getCase, getStageById } from "@/lib/case-store";
import { formatMoney } from "@/lib/format";

type StagePageProps = {
  params: Promise<{ id: string; stageId: string }>;
};

export default async function StagePage({ params }: StagePageProps) {
  const user = await requireUser();
  const { id, stageId } = await params;
  const patientCase = getCase(id);
  const stage = getStageById(id, stageId);

  if (!patientCase || !stage) {
    notFound();
  }

  if (user.role === "patient" && patientCase.patientId !== user.id) {
    redirect("/app/patient");
  }
  if (user.role === "doctor") {
    redirect("/app/doctor");
  }

  return (
    <main className="app-page">
      <div className="app-links">
        <Link href={`/app/cases/${patientCase.id}`} className="button button-small button-ghost">
          Назад к кейсу
        </Link>
      </div>

      <section className="app-hero">
        <p className="eyebrow">Экран этапа</p>
        <h1>{stage.title}</h1>
        <p>{stage.description}</p>
      </section>

      <section className="cost-surface">
        <h2>Что нужно сделать на этом этапе</h2>
        <div className="cost-grid">
          <div>
            <span>Срок</span>
            <strong>{stage.duration}</strong>
          </div>
          <div>
            <span>Критичность</span>
            <strong>{stage.criticality}</strong>
          </div>
          <div>
            <span>Стоимость</span>
            <strong>
              {formatMoney(stage.costMin)} - {formatMoney(stage.costMax)}
            </strong>
          </div>
        </div>
      </section>

      <section className="roadmap-surface">
        <h2>Клиники для этапа</h2>
        <div className="split-list">
          {stage.clinics.map((clinic) => (
            <article key={clinic.id} className="option-card">
              <h3>{clinic.name}</h3>
              <p>
                {clinic.country} · {clinic.specialization}
              </p>
              <strong>{formatMoney(clinic.estimatedCost)}</strong>
              <small>
                Рейтинг {clinic.rating} ({clinic.reviews} отзывов)
              </small>
            </article>
          ))}
        </div>
      </section>

      <section className="roadmap-surface">
        <h2>Врачи по этому этапу</h2>
        <div className="split-list">
          {stage.doctors.map((doctor) => (
            <article key={doctor.id} className="option-card">
              <h3>{doctor.fullName}</h3>
              <p>
                {doctor.role} · {doctor.clinicName}
              </p>
              <small>{doctor.focus}</small>
              <strong>Опыт {doctor.experienceYears} лет · Рейтинг {doctor.rating}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <h2>Этот этап уже связан со сбором</h2>
        <p>Поддержка открыта на конкретную медицинскую задачу, а не на абстрактную сумму.</p>
        <div className="hero-actions">
          <Link href={`/app/cases/${patientCase.id}/fundraising`} className="button button-small">
            Открыть экран сбора
          </Link>
          <Link href={`/cases/${patientCase.slug}`} className="button button-small button-ghost">
            Публичная карточка
          </Link>
        </div>
      </section>
    </main>
  );
}
