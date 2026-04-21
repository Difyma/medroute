"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AiSummaryButton({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    try {
      setPending(true);
      setError(null);
      const response = await fetch(`/api/cases/${caseId}/ai-summary`, {
        method: "POST",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "failed");
      }

      router.refresh();
    } catch (err) {
      if (err instanceof Error && err.message === "Требуется авторизация") {
        setError("Войдите в сервис, чтобы обновить оценку.");
      } else if (err instanceof Error && err.message === "Доступ запрещен") {
        setError("Недостаточно прав для этого кейса.");
      } else {
        setError("Не удалось обновить оценку.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="inline-action-block">
      <button className="button button-secondary" onClick={handleClick} disabled={pending}>
        {pending ? "Обновляем..." : "Сформировать первичную оценку"}
      </button>
      {error ? <small className="field-error">{error}</small> : null}
    </div>
  );
}
