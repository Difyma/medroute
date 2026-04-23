"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  patientName: string;
  age: string;
  city: string;
  diagnosis: string;
  currentState: string;
  completedActions: string;
};

const initialState: FormState = {
  patientName: "",
  age: "",
  city: "",
  diagnosis: "",
  currentState: "",
  completedActions: "",
};

export function StartCaseForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [files, setFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return form.patientName && form.age && form.city && form.diagnosis && form.currentState;
  }, [form]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("Заполните обязательные поля.");
      return;
    }

    try {
      setPending(true);
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          documentNames: files.map((file) => file.name),
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        case?: { id: string };
      };

      if (!response.ok || !payload.case) {
        setError(payload.error ?? "Не удалось создать кейс. Проверьте поля и попробуйте снова.");
        return;
      }

      router.push(`/app/cases/${payload.case.id}`);
    } catch {
      setError("Не удалось создать кейс. Проверьте поля и попробуйте снова.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="case-form">
      <label>
        ФИО пациента
        <input
          type="text"
          value={form.patientName}
          onChange={(event) => setForm((prev) => ({ ...prev, patientName: event.target.value }))}
          placeholder="Например: Мария Иванова"
          required
        />
      </label>

      <div className="field-row">
        <label>
          Возраст
          <input
            type="number"
            value={form.age}
            onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
            placeholder="45"
            required
          />
        </label>
        <label>
          Город
          <input
            type="text"
            value={form.city}
            onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
            placeholder="Москва"
            required
          />
        </label>
      </div>

      <label>
        Диагноз
        <textarea
          value={form.diagnosis}
          onChange={(event) => setForm((prev) => ({ ...prev, diagnosis: event.target.value }))}
          placeholder="Точный диагноз или формулировка из выписки"
          rows={3}
          required
        />
      </label>

      <label>
        Текущее состояние
        <textarea
          value={form.currentState}
          onChange={(event) => setForm((prev) => ({ ...prev, currentState: event.target.value }))}
          placeholder="Что уже сделано и что требуется сейчас"
          rows={3}
          required
        />
      </label>

      <label>
        Что уже выполнено (необязательно)
        <input
          type="text"
          value={form.completedActions}
          onChange={(event) => setForm((prev) => ({ ...prev, completedActions: event.target.value }))}
          placeholder="Через запятую: КТ, биопсия, первичный прием"
        />
      </label>

      <label>
        Документы (выписки, анализы, назначения)
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
        />
      </label>
      <p className="form-help-text">
        Можно заполнить только описание ситуации и приложить документы. Этого достаточно для старта кейса.
      </p>

      {files.length ? (
        <div className="file-list">
          {files.map((file) => (
            <span key={file.name}>{file.name}</span>
          ))}
        </div>
      ) : null}

      {error ? <p className="field-error">{error}</p> : null}

      <div className="form-actions">
        <button type="submit" className="button" disabled={pending || !canSubmit}>
          {pending ? "Создание кейса..." : "Создать кейс"}
        </button>
        <p>Следующий шаг: первичная оценка и формирование маршрута лечения.</p>
      </div>
    </form>
  );
}
