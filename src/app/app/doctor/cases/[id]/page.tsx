import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireRole } from "@/lib/auth";
import { getCase, isDoctorAssignedToCase, listCaseAssignments } from "@/lib/case-store";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DoctorCaseDetailPage({ params }: PageProps) {
  const user = await requireRole(["doctor"]);
  const { id } = await params;
  const patientCase = getCase(id);

  if (!patientCase) {
    notFound();
  }

  if (!isDoctorAssignedToCase(user.id, patientCase.id)) {
    redirect("/app/doctor");
  }

  const assignments = listCaseAssignments(patientCase.id);

  return (
    <main className="app-page">
      <div className="app-links">
        <Link href="/app/doctor" className="button button-small button-ghost">
          Назад в кабинет врача
        </Link>
      </div>

      <section className="dashboard-head">
        <div>
          <p className="eyebrow">Рабочая карточка врача</p>
          <h1>{patientCase.patientName}</h1>
          <p>
            {patientCase.diagnosis} · {patientCase.city}
          </p>
        </div>
      </section>

      <section className="summary-surface">
        <h2>Назначения по кейсу</h2>
        <div className="moderation-list">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="moderation-item moderation-item-done">
              <span>{assignment.stageKey ? `Этап: ${assignment.stageKey}` : "Общий маршрут"}</span>
              <p>
                {assignment.doctorName} · {assignment.doctorEmail}
              </p>
              {assignment.note ? <small>{assignment.note}</small> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="roadmap-surface">
        <h2>Управление этапами лечения</h2>
        <div className="doctor-stage-grid">
          {patientCase.roadmap.map((stage) => (
            <article key={stage.id} className="option-card">
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
              <form action={`/api/doctor/cases/${patientCase.id}/stages/${stage.id}/status`} method="post" className="inline-form">
                <label>
                  Статус этапа
                  <select name="status" defaultValue={stage.status}>
                    <option value="planned">Запланирован</option>
                    <option value="in-progress">В работе</option>
                    <option value="done">Завершен</option>
                  </select>
                </label>
                <button type="submit" className="button button-small">
                  Обновить
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section className="summary-surface">
        <h2>Публикация обновления по кейсу</h2>
        <form className="case-form" action={`/api/doctor/cases/${patientCase.id}/updates`} method="post">
          <label>
            Заголовок
            <input type="text" name="title" required placeholder="Например: Завершен очередной этап" />
          </label>
          <label>
            Тип обновления
            <select name="kind" defaultValue="general">
              <option value="general">Обновление</option>
              <option value="treatment-started">Лечение начато</option>
              <option value="stage-completed">Этап завершен</option>
              <option value="plan-adjusted">Корректировка плана</option>
            </select>
          </label>
          <label>
            Текст
            <textarea name="body" rows={4} required placeholder="Опишите текущее состояние пациента и следующий шаг" />
          </label>
          <button type="submit" className="button">
            Опубликовать обновление
          </button>
        </form>
      </section>
    </main>
  );
}
