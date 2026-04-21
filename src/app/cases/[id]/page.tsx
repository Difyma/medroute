import Link from "next/link";
import { notFound } from "next/navigation";

import { DonationForm } from "@/components/donation-form";
import { ShareButtons } from "@/components/share-buttons";
import { getCurrentUser } from "@/lib/auth";
import { updateKindLabel } from "@/lib/case-view";
import { getCase } from "@/lib/case-store";
import { formatMoney, percent } from "@/lib/format";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PublicCasePage({ params }: PageProps) {
  const user = await getCurrentUser();
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
    <main className="public-page">
      <div className="app-links">
        {user ? (
          <Link
            href={
              user.role === "doctor"
                ? `/app/doctor/cases/${patientCase.id}`
                : user.role === "admin"
                  ? `/app/cases/${patientCase.id}`
                  : `/app/cases/${patientCase.id}`
            }
            className="button button-small button-ghost"
          >
            Открыть внутренний кабинет
          </Link>
        ) : (
          <Link href="/auth/login" className="button button-small button-ghost">
            Войти в сервис
          </Link>
        )}
      </div>

      <section className="public-hero">
        <p className="eyebrow">Публичная карточка кейса</p>
        <h1>{patientCase.patientName}</h1>
        <p>
          {patientCase.diagnosis} · {patientCase.city}
        </p>
        <span className={patientCase.isVerified ? "verify-badge" : "verify-badge verify-badge-pending"}>
          {patientCase.isVerified ? "Документы проверены" : "Проверка документов"}
        </span>
      </section>

      <ShareButtons title={`Поддержите кейс ${patientCase.patientName}`} path={`/cases/${patientCase.slug}`} />

      <section className="public-grid">
        <article className="public-story">
          <h2>История и план лечения</h2>
          <p>{patientCase.summary}</p>
          <ul>
            {patientCase.roadmap.map((stage, index) => (
              <li key={stage.id}>
                <strong>
                  {index + 1}. {stage.title}
                </strong>
                <span>{stage.description}</span>
              </li>
            ))}
          </ul>
        </article>

        <aside className="public-funding">
          <p className="eyebrow">Сбор на текущий этап</p>
          <h2>{currentStage?.title ?? "Операция"}</h2>
          <div className="funding-meter">
            <div style={{ width: `${progress}%` }} />
          </div>
          <p>
            {formatMoney(patientCase.fundraising.raised)} из {formatMoney(patientCase.fundraising.target)}
          </p>
          <DonationForm caseId={patientCase.id} suggestedAmount={2000} quickAmounts={[1000, 2000, 5000, 10000]} />
          <div className="small-cost-list">
            {patientCase.costEstimation.byStage.map((item) => (
              <div key={item.stageId}>
                <span>{item.title}</span>
                <strong>{formatMoney(item.amount)}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="updates-surface">
        <h2>Последние обновления</h2>
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
