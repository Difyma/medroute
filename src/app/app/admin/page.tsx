import Link from "next/link";

import { requireRole } from "@/lib/auth";
import { listCases, listDoctors, listUsersByRole } from "@/lib/case-store";

export default async function AdminDashboardPage() {
  const user = await requireRole(["admin"]);
  const cases = listCases();
  const doctors = listDoctors();
  const patients = listUsersByRole("patient");

  const verifiedCount = cases.filter((item) => item.isVerified).length;

  return (
    <main className="app-page">
      <section className="dashboard-head">
        <div>
          <p className="eyebrow">Панель администратора</p>
          <h1>{user.fullName}</h1>
          <p>Управление пользователями, верификацией кейсов и назначением врачей.</p>
        </div>
        <div className="app-links">
          <Link href="/app/clinics" className="button button-ghost">
            Страница поиска клиник
          </Link>
        </div>
      </section>

      <section className="cost-surface">
        <h2>Сводка системы</h2>
        <div className="cost-grid">
          <div>
            <span>Всего кейсов</span>
            <strong>{cases.length}</strong>
          </div>
          <div>
            <span>Проверенных кейсов</span>
            <strong>{verifiedCount}</strong>
          </div>
          <div>
            <span>Пациентов</span>
            <strong>{patients.length}</strong>
          </div>
        </div>
      </section>

      <section className="summary-surface">
        <h2>Команда врачей</h2>
        <div className="dashboard-users-grid">
          {doctors.map((doctor) => (
            <article key={doctor.id} className="dashboard-case-card">
              <h3>{doctor.fullName}</h3>
              <p>{doctor.email}</p>
              <small>{doctor.city}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="summary-surface">
        <h2>Управление кейсами</h2>
        <div className="dashboard-cases-grid">
          {cases.map((item) => (
            <article key={item.id} className="dashboard-case-card">
              <div className="dashboard-case-head">
                <h3>{item.patientName}</h3>
                <span className={item.isVerified ? "verify-badge" : "verify-badge verify-badge-pending"}>
                  {item.isVerified ? "Проверено" : "На проверке"}
                </span>
              </div>
              <p>{item.diagnosis}</p>

              <form className="admin-form" action={`/api/admin/cases/${item.id}/verify`} method="post">
                <label>
                  <input type="checkbox" name="documentsAreReadable" defaultChecked={item.verificationChecklist.documentsAreReadable} />
                  Документы читаемы
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="diagnosisMatchesDocuments"
                    defaultChecked={item.verificationChecklist.diagnosisMatchesDocuments}
                  />
                  Диагноз подтвержден
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="patientIdentityConfirmed"
                    defaultChecked={item.verificationChecklist.patientIdentityConfirmed}
                  />
                  Личность подтверждена
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="fundraisingGoalValidated"
                    defaultChecked={item.verificationChecklist.fundraisingGoalValidated}
                  />
                  Цель верифицирована
                </label>
                <button type="submit" className="button button-small">
                  Обновить верификацию
                </button>
              </form>

              <form className="inline-form" action={`/api/admin/cases/${item.id}/assign-doctor`} method="post">
                <label>
                  Назначить врача
                  <select name="doctorId" defaultValue="">
                    <option value="" disabled>
                      Выберите врача
                    </option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.fullName}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Этап
                  <select name="stageKey" defaultValue="consultation">
                    <option value="diagnostics">Диагностика</option>
                    <option value="consultation">Консилиум</option>
                    <option value="chemotherapy">Терапия</option>
                    <option value="surgery">Операция</option>
                    <option value="rehab">Реабилитация</option>
                  </select>
                </label>
                <label>
                  Комментарий
                  <input type="text" name="note" placeholder="Роль врача в кейсе" />
                </label>
                <button type="submit" className="button button-small button-ghost">
                  Назначить
                </button>
              </form>

              <div className="hero-actions">
                <Link href={`/app/cases/${item.id}`} className="button button-small button-ghost">
                  Кабинет пациента
                </Link>
                <Link href={`/cases/${item.slug}`} className="button button-small button-ghost">
                  Публичная карточка
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
