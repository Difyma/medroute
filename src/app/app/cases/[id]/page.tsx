import Link from "next/link";
import { notFound } from "next/navigation";

import { AiSummaryButton } from "@/components/ai-summary-button";
import { DonationForm } from "@/components/donation-form";
import { checklistEntries, updateKindLabel } from "@/lib/case-view";
import { getCase } from "@/lib/case-store";
import { formatMoney, percent } from "@/lib/format";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CaseDashboardPage({ params }: PageProps) {
  const { id } = await params;
  const patientCase = getCase(id);

  if (!patientCase) {
    notFound();
  }

  const progress = percent(patientCase.fundraising.raised, patientCase.fundraising.target);
  const currentStage = patientCase.roadmap.find(
    (stage) => stage.id === patientCase.fundraising.currentStageId,
  );

  return (
    <main className="app-page">
      <div className="app-top">
        <Link href="/" className="brand-mark">
          MedRoute
        </Link>
        <div className="app-links">
          <Link href={`/cases/${patientCase.slug}`} className="button button-small button-ghost">
            Публичная карточка
          </Link>
          <AiSummaryButton caseId={patientCase.id} />
        </div>
      </div>

      <section className="dashboard-head">
        <div>
          <p className="eyebrow">Кабинет кейса</p>
          <h1>{patientCase.patientName}</h1>
          <p>
            {patientCase.age} лет, {patientCase.city} · {patientCase.diagnosis}
          </p>
        </div>
        <span className={patientCase.isVerified ? "verify-badge" : "verify-badge verify-badge-pending"}>
          {patientCase.isVerified ? "Документы проверены" : "На ручной проверке"}
        </span>
      </section>

      <section className="summary-surface">
        <h2>AI summary</h2>
        <p>{patientCase.summary}</p>
      </section>

      <section className="cost-surface">
        <h2>Оценка стоимости лечения</h2>
        <div className="cost-grid">
          <div>
            <span>Минимум</span>
            <strong>{formatMoney(patientCase.costEstimation.min)}</strong>
          </div>
          <div>
            <span>Оптимально</span>
            <strong>{formatMoney(patientCase.costEstimation.optimal)}</strong>
          </div>
          <div>
            <span>Максимум</span>
            <strong>{formatMoney(patientCase.costEstimation.max)}</strong>
          </div>
        </div>
      </section>

      <section className="roadmap-surface">
        <div className="section-head-inline">
          <h2>Roadmap лечения</h2>
          <p>Каждый этап содержит сроки, критичность, клиники и профильных врачей.</p>
        </div>
        <div className="timeline-list">
          {patientCase.roadmap.map((stage) => (
            <article key={stage.id} className={`timeline-item timeline-${stage.status}`}>
              <div className="timeline-meta">
                <span>
                  {stage.status === "done"
                    ? "Завершен"
                    : stage.status === "in-progress"
                      ? "В работе"
                      : "Запланирован"}
                </span>
                <small>{stage.duration}</small>
              </div>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
              <div className="timeline-foot">
                <span>Критичность: {stage.criticality}</span>
                <strong>
                  {formatMoney(stage.costMin)} - {formatMoney(stage.costMax)}
                </strong>
              </div>
              <div className="split-list">
                <div>
                  <h4>Клиники</h4>
                  <ul>
                    {stage.clinics.map((clinic) => (
                      <li key={clinic.id}>
                        {clinic.name} ({clinic.country}) · {clinic.specialization}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Врачи</h4>
                  <ul>
                    {stage.doctors.map((doctor) => (
                      <li key={doctor.id}>
                        {doctor.fullName} · {doctor.focus}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="timeline-actions">
                <Link href={`/app/cases/${patientCase.id}/stages/${stage.id}`} className="button button-small button-ghost">
                  Экран этапа
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="funding-surface">
        <div>
          <p className="eyebrow">Умный сбор</p>
          <h2>Сейчас открыт сбор на этап «{currentStage?.title ?? "Операция"}»</h2>
          <p>
            Собираем адресно на конкретный медицинский шаг, чтобы доноры понимали точную цель и срок.
          </p>
          <div className="funding-meter">
            <div style={{ width: `${progress}%` }} />
          </div>
          <p>
            {formatMoney(patientCase.fundraising.raised)} из {formatMoney(patientCase.fundraising.target)} ({progress}%)
          </p>
          <Link href={`/app/cases/${patientCase.id}/fundraising`} className="button button-small button-ghost">
            Открыть экран сбора
          </Link>
        </div>
        <DonationForm caseId={patientCase.id} />
      </section>

      <section className="summary-surface">
        <h2>Верификация кейса</h2>
        <div className="moderation-list">
          {checklistEntries(patientCase.verificationChecklist).map((entry) => (
            <div key={entry.title} className={`moderation-item ${entry.done ? "moderation-item-done" : ""}`}>
              <span>{entry.done ? "Пройдено" : "Ожидает"}</span>
              <p>{entry.title}</p>
            </div>
          ))}
        </div>
        <small className="moderation-meta">
          {patientCase.verificationChecklist.reviewedBy} · {patientCase.verificationChecklist.reviewedAt}
        </small>
      </section>

      <section className="updates-surface">
        <h2>Обновления по кейсу</h2>
        <div className="updates-list">
          {patientCase.updates.map((update) => (
            <article key={update.id}>
              <div className="update-head">
                <span>{update.date}</span>
                <small>{updateKindLabel(update.kind)}</small>
              </div>
              <h3>{update.title}</h3>
              <p>{update.body}</p>
              <strong className="reaction-stat">{update.reactions} реакций поддержки</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
