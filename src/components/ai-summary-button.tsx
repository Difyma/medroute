"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AiSummaryButton({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    try {
      setPending(true);
      const response = await fetch(`/api/cases/${caseId}/ai-summary`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("failed");
      }

      router.refresh();
    } catch {
      // Keep retries simple and avoid noisy UI while request can be repeated safely.
    } finally {
      setPending(false);
    }
  }

  return (
    <button className="button button-secondary" onClick={handleClick} disabled={pending}>
      {pending ? "Обновляем..." : "Сформировать AI summary"}
    </button>
  );
}
