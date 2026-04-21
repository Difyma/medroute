"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function DonationForm({
  caseId,
  suggestedAmount = 3000,
  quickAmounts = [1000, 3000, 5000, 10000],
}: {
  caseId: string;
  suggestedAmount?: number;
  quickAmounts?: number[];
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(suggestedAmount);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      setPending(true);
      const response = await fetch(`/api/cases/${caseId}/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error("invalid");
      }

      setAmount(suggestedAmount);
      router.refresh();
    } catch {
      setError("Не удалось отправить платеж. Попробуйте снова.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="donation-form" onSubmit={handleSubmit}>
      <label htmlFor="donationAmount">Сумма, ₽</label>
      <div className="quick-amounts">
        {quickAmounts.map((value) => (
          <button
            key={value}
            className={`quick-pill ${amount === value ? "quick-pill-active" : ""}`}
            type="button"
            onClick={() => setAmount(value)}
          >
            {new Intl.NumberFormat("ru-RU").format(value)} ₽
          </button>
        ))}
      </div>
      <div className="donation-row">
        <input
          id="donationAmount"
          type="number"
          min={500}
          step={500}
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
          required
        />
        <button className="button" type="submit" disabled={pending}>
          {pending ? "Отправка..." : "Поддержать"}
        </button>
      </div>
      {error ? <p className="field-error">{error}</p> : null}
    </form>
  );
}
