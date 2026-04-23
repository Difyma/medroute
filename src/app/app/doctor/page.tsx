import Link from "next/link";

import { requireRole } from "@/lib/auth";
import { listAvailableCasesForDoctor, listCaseDoctorChats } from "@/lib/case-store";

type DoctorDashboardProps = {
  searchParams: Promise<{
    case?: string;
  }>;
};

export default async function DoctorDashboardPage({ searchParams }: DoctorDashboardProps) {
  const user = await requireRole(["doctor"]);
  const cases = listAvailableCasesForDoctor(user.id);
  const params = await searchParams;
  const requestedCaseId = typeof params.case === "string" ? params.case : "";
  const selectedEntry =
    cases.find((entry) => entry.caseData.id === requestedCaseId) ??
    cases.find((entry) => entry.accepted) ??
    cases[0] ??
    null;

  const selectedCase = selectedEntry?.caseData;
  const selectedCaseAccepted = selectedEntry?.accepted ?? false;
  const myChat = selectedCaseAccepted && selectedCase
    ? listCaseDoctorChats(selectedCase.id).find((chat) => chat.doctorId === user.id)
    : null;

  return (
    <main className="app-page app-page-wide app-page-doctor">
      <section className="dashboard-head">
        <div>
          <p className="eyebrow">Кабинет врача</p>
          <h1>{user.fullName}</h1>
          <p>
            Доступные кейсы по направлению: <strong>{user.specialty}</strong>. Вы можете принять любой кейс
            и вести консультационный диалог с пациентом. Этапы лечения заполняет пациент.
          </p>
        </div>
      </section>

      <section className="summary-surface">
        {cases.length === 0 ? (
          <>
            <h2>Доступные кейсы</h2>
            <p>По вашему направлению пока нет открытых кейсов.</p>
          </>
        ) : (
          <div className="doctor-workspace">
            <div className="doctor-cases-column">
              <h2>Доступные кейсы</h2>
              <div className="doctor-cases-list">
                {cases.map((entry) => {
                  const isActive = selectedCase?.id === entry.caseData.id;

                  return (
                    <article
                      key={entry.caseData.id}
                      className={`dashboard-case-card doctor-case-card${isActive ? " doctor-case-card-active" : ""}`}
                    >
                      <Link href={`/app/doctor?case=${entry.caseData.id}`} className="doctor-case-select">
                        <div className="dashboard-case-head">
                          <h3>{entry.caseData.patientName}</h3>
                          <span className={`doctor-case-status${entry.accepted ? " doctor-case-status-accepted" : ""}`}>
                            {entry.accepted ? "Принят" : "Новый"}
                          </span>
                        </div>
                        <p>{entry.caseData.diagnosis}</p>
                        <small>
                          {entry.caseData.city} · направление {entry.caseData.direction}
                        </small>
                      </Link>
                      <div className="hero-actions">
                        {entry.accepted ? null : (
                          <form action={`/api/doctor/cases/${entry.caseData.id}/accept`} method="post">
                            <input type="hidden" name="redirectTo" value={`/app/doctor?case=${entry.caseData.id}`} />
                            <button type="submit" className="button button-small">
                              Принять кейс
                            </button>
                          </form>
                        )}
                        <Link href={`/cases/${entry.caseData.slug}`} className="button button-small button-ghost">
                          Публичный вид
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="doctor-chat-column">
              <h2>Чат с пациентом</h2>
              {!selectedCase ? (
                <p>Выберите кейс слева, чтобы открыть диалог.</p>
              ) : !selectedCaseAccepted ? (
                <article className="doctor-chat-card">
                  <h3>{selectedCase.patientName}</h3>
                  <p>{selectedCase.diagnosis}</p>
                  <p>
                    Для начала консультации примите кейс. После этого справа появится чат с пациентом.
                  </p>
                  <form action={`/api/doctor/cases/${selectedCase.id}/accept`} method="post" className="hero-actions">
                    <input type="hidden" name="redirectTo" value={`/app/doctor?case=${selectedCase.id}`} />
                    <button type="submit" className="button button-small">
                      Принять кейс
                    </button>
                  </form>
                </article>
              ) : myChat ? (
                <article className="doctor-chat-card doctor-chat-card-modern">
                  <header className="doctor-chat-head">
                    <h3>{selectedCase.patientName}</h3>
                    <p>
                      Вы можете только консультировать: давать рекомендации и предлагать альтернативный план.
                    </p>
                  </header>

                  <div className="doctor-chat-window">
                    {myChat.messages.length === 0 ? (
                      <p className="doctor-chat-empty">Диалог пока пуст. Отправьте первое сообщение пациенту.</p>
                    ) : (
                      myChat.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`doctor-chat-row ${
                            message.senderRole === "doctor" ? "doctor-chat-row-doctor" : "doctor-chat-row-patient"
                          }`}
                        >
                          <article
                            className={`doctor-chat-message ${
                              message.senderRole === "doctor"
                                ? "doctor-chat-message-doctor"
                                : "doctor-chat-message-patient"
                            } ${
                              message.messageKind === "recommendation"
                                ? "doctor-chat-message-recommendation"
                                : message.messageKind === "alternative-plan"
                                  ? "doctor-chat-message-alternative"
                                  : ""
                            }`}
                          >
                            <header>
                              <div className="doctor-chat-author">
                                <strong>{message.senderName}</strong>
                                {message.senderRole === "doctor" && message.messageKind !== "comment" ? (
                                  <span
                                    className={`message-kind-badge ${
                                      message.messageKind === "recommendation"
                                        ? "message-kind-badge-recommendation"
                                        : "message-kind-badge-alternative"
                                    }`}
                                  >
                                    {message.messageKind === "recommendation"
                                      ? "Рекомендация"
                                      : "Альтернативное лечение"}
                                  </span>
                                ) : null}
                              </div>
                              <small>{new Date(message.createdAt).toLocaleString("ru-RU")}</small>
                            </header>
                            <p>{message.body}</p>
                          </article>
                        </div>
                      ))
                    )}
                  </div>

                  <form className="inline-form doctor-chat-composer" action={`/api/chats/${myChat.id}/messages`} method="post">
                    <input type="hidden" name="redirectTo" value={`/app/doctor?case=${selectedCase.id}`} />
                    <label>
                      Формат ответа
                      <select name="messageKind" defaultValue="" required>
                        <option value="" disabled>
                          Выберите тип сообщения
                        </option>
                        <option value="recommendation">Рекомендация</option>
                        <option value="alternative-plan">Альтернативное лечение</option>
                      </select>
                    </label>
                    <label>
                      Сообщение пациенту
                      <textarea
                        name="body"
                        rows={4}
                        required
                        placeholder="Опишите вашу рекомендацию, на что обратить внимание и какой следующий шаг вы предлагаете."
                      />
                    </label>
                    <button type="submit" className="button button-small">
                      Отправить
                    </button>
                  </form>
                </article>
              ) : (
                <p>Чат не найден. Обновите страницу или примите кейс повторно.</p>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
