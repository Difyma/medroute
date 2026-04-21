"use client";

import { useMemo, useState } from "react";

import { formatMoney } from "@/lib/format";

type Clinic = {
  id: string;
  name: string;
  city: string;
  stage: "Диагностика" | "Консилиум" | "Терапия" | "Операция" | "Реабилитация";
  specialization: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
};

const CLINICS: Clinic[] = [
  {
    id: "clinic-1",
    name: "НМИЦ онкологии им. Н.Н. Блохина",
    city: "Москва",
    stage: "Диагностика",
    specialization: "Комплексная онкодиагностика",
    rating: 4.9,
    reviewCount: 420,
    priceFrom: 95_000,
  },
  {
    id: "clinic-2",
    name: "Европейская клиника",
    city: "Москва",
    stage: "Консилиум",
    specialization: "Онкологический консилиум и второе мнение",
    rating: 4.8,
    reviewCount: 210,
    priceFrom: 48_000,
  },
  {
    id: "clinic-3",
    name: "НМХЦ им. Пирогова",
    city: "Москва",
    stage: "Операция",
    specialization: "Онкохирургия и послеоперационное ведение",
    rating: 4.7,
    reviewCount: 268,
    priceFrom: 340_000,
  },
  {
    id: "clinic-4",
    name: "Sourasky Medical Center",
    city: "Тель-Авив",
    stage: "Терапия",
    specialization: "Системная терапия по международным протоколам",
    rating: 4.8,
    reviewCount: 199,
    priceFrom: 520_000,
  },
  {
    id: "clinic-5",
    name: "Три сестры",
    city: "Москва",
    stage: "Реабилитация",
    specialization: "Онкореабилитация и контроль восстановления",
    rating: 4.8,
    reviewCount: 141,
    priceFrom: 135_000,
  },
  {
    id: "clinic-6",
    name: "Acibadem Oncology Center",
    city: "Стамбул",
    stage: "Диагностика",
    specialization: "Уточняющая диагностика и маршрутизация",
    rating: 4.7,
    reviewCount: 186,
    priceFrom: 125_000,
  },
];

const STAGES = ["Все этапы", "Диагностика", "Консилиум", "Терапия", "Операция", "Реабилитация"];

export function ClinicSearchBlock() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<(typeof STAGES)[number]>("Все этапы");

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();

    return CLINICS.filter((clinic) => {
      const matchesStage = stage === "Все этапы" || clinic.stage === stage;
      const haystack = `${clinic.name} ${clinic.city} ${clinic.specialization}`.toLowerCase();
      const matchesQuery = !normalized || haystack.includes(normalized);
      return matchesStage && matchesQuery;
    });
  }, [query, stage]);

  return (
    <section id="clinic-search" className="surface-section clinic-search-section">
      <div className="section-head">
        <p className="eyebrow">Поиск клиник</p>
        <h2>Подберите клинику под конкретный этап лечения</h2>
      </div>

      <div className="clinic-search-controls">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Введите город, клинику или специализацию"
          aria-label="Поиск клиники"
        />
        <div className="clinic-stage-tabs">
          {STAGES.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`clinic-tab ${stage === tab ? "clinic-tab-active" : ""}`}
              onClick={() => setStage(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="clinic-results-grid">
        {filtered.map((clinic) => (
          <article key={clinic.id} className="clinic-card">
            <div className="clinic-card-head">
              <span>{clinic.stage}</span>
              <strong>{clinic.rating} ({clinic.reviewCount})</strong>
            </div>
            <h3>{clinic.name}</h3>
            <p>{clinic.city}</p>
            <small>{clinic.specialization}</small>
            <div className="clinic-card-foot">
              <span>от {formatMoney(clinic.priceFrom)}</span>
              <button type="button" className="button button-small button-ghost">
                Смотреть детали
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
