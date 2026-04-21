import { TreatmentStage } from "@/lib/types";

export function makeBaseRoadmap(diagnosis: string): TreatmentStage[] {
  return [
    {
      id: "diagnostics",
      title: "Диагностика",
      description: `КТ/МРТ, лабораторные анализы и подтверждение стадии по диагнозу ${diagnosis}.`,
      duration: "7-10 дней",
      criticality: "high",
      status: "done",
      costMin: 90_000,
      costMax: 150_000,
      clinics: [
        {
          id: "ru-nn-blokhina",
          name: "НМИЦ онкологии им. Н.Н. Блохина",
          country: "Россия",
          specialization: "Комплексная диагностика",
          estimatedCost: 120_000,
          rating: 4.8,
          reviews: 410,
        },
        {
          id: "tr-acibadem",
          name: "Acibadem Oncology Center",
          country: "Турция",
          specialization: "Уточняющая диагностика",
          estimatedCost: 145_000,
          rating: 4.7,
          reviews: 198,
        },
      ],
      doctors: [
        {
          id: "doc-1",
          fullName: "Ирина Кузнецова",
          role: "Клинический онколог",
          clinicName: "НМИЦ онкологии им. Н.Н. Блохина",
          experienceYears: 14,
          rating: 4.9,
          focus: "Солидные опухоли",
        },
      ],
    },
    {
      id: "consultation",
      title: "Консилиум и персональный план",
      description:
        "Консультации профильных онкологов, верификация тактики лечения и финализация roadmap.",
      duration: "3-5 дней",
      criticality: "high",
      status: "in-progress",
      costMin: 45_000,
      costMax: 120_000,
      clinics: [
        {
          id: "ru-european-clinic",
          name: "Европейская клиника",
          country: "Россия",
          specialization: "Онкоконcилиумы",
          estimatedCost: 80_000,
          rating: 4.6,
          reviews: 177,
        },
        {
          id: "de-charite",
          name: "Charite Comprehensive Cancer Center",
          country: "Германия",
          specialization: "Второе мнение",
          estimatedCost: 115_000,
          rating: 4.8,
          reviews: 290,
        },
      ],
      doctors: [
        {
          id: "doc-2",
          fullName: "Антон Савельев",
          role: "Онкохирург",
          clinicName: "Европейская клиника",
          experienceYears: 18,
          rating: 4.8,
          focus: "Оперативное лечение опухолей ЖКТ",
        },
        {
          id: "doc-3",
          fullName: "Miriam Falk",
          role: "Senior Oncologist",
          clinicName: "Charite CCC",
          experienceYears: 16,
          rating: 4.9,
          focus: "Персонализированная терапия",
        },
      ],
    },
    {
      id: "chemotherapy",
      title: "Химиотерапия (6 курсов)",
      description:
        "Проведение курсов по утвержденному протоколу с контролем токсичности и промежуточной оценкой ответа.",
      duration: "16-20 недель",
      criticality: "high",
      status: "planned",
      costMin: 500_000,
      costMax: 760_000,
      clinics: [
        {
          id: "ru-lapino",
          name: "Лапино Клиник",
          country: "Россия",
          specialization: "Системная терапия",
          estimatedCost: 620_000,
          rating: 4.7,
          reviews: 152,
        },
        {
          id: "il-sourasky",
          name: "Sourasky Medical Center",
          country: "Израиль",
          specialization: "Протоколы high-intensity",
          estimatedCost: 730_000,
          rating: 4.8,
          reviews: 204,
        },
      ],
      doctors: [
        {
          id: "doc-4",
          fullName: "Елена Шматова",
          role: "Химиотерапевт",
          clinicName: "Лапино Клиник",
          experienceYears: 12,
          rating: 4.7,
          focus: "Химиотерапия при солидных опухолях",
        },
      ],
    },
    {
      id: "surgery",
      title: "Операция",
      description:
        "Хирургический этап по результатам консилиума. Подготовка, операция, стационар и раннее восстановление.",
      duration: "7-14 дней",
      criticality: "high",
      status: "planned",
      costMin: 340_000,
      costMax: 560_000,
      clinics: [
        {
          id: "ru-pirogov",
          name: "НМХЦ им. Пирогова",
          country: "Россия",
          specialization: "Онкохирургия",
          estimatedCost: 420_000,
          rating: 4.7,
          reviews: 266,
        },
        {
          id: "kr-samsung",
          name: "Samsung Medical Center",
          country: "Южная Корея",
          specialization: "Роботическая хирургия",
          estimatedCost: 540_000,
          rating: 4.8,
          reviews: 183,
        },
      ],
      doctors: [
        {
          id: "doc-5",
          fullName: "Сергей Ладыгин",
          role: "Онкохирург",
          clinicName: "НМХЦ им. Пирогова",
          experienceYears: 19,
          rating: 4.9,
          focus: "Резекционные операции",
        },
      ],
    },
    {
      id: "rehab",
      title: "Реабилитация и мониторинг",
      description:
        "Программа восстановления, контроль анализов, предотвращение осложнений и долгосрочное наблюдение.",
      duration: "6-10 недель",
      criticality: "medium",
      status: "planned",
      costMin: 140_000,
      costMax: 280_000,
      clinics: [
        {
          id: "ru-three-sisters",
          name: "Три сестры",
          country: "Россия",
          specialization: "Онкореабилитация",
          estimatedCost: 190_000,
          rating: 4.7,
          reviews: 140,
        },
      ],
      doctors: [
        {
          id: "doc-6",
          fullName: "Марина Коновалова",
          role: "Врач реабилитолог",
          clinicName: "Три сестры",
          experienceYears: 11,
          rating: 4.8,
          focus: "Послеоперационное восстановление",
        },
      ],
    },
  ];
}

export function calculateCost(roadmap: TreatmentStage[]) {
  const min = roadmap.reduce((sum, stage) => sum + stage.costMin, 0);
  const max = roadmap.reduce((sum, stage) => sum + stage.costMax, 0);
  const optimal = Math.round((min + max) / 2);

  return {
    min,
    optimal,
    max,
    byStage: roadmap.map((stage) => ({
      stageId: stage.id,
      title: stage.title,
      amount: Math.round((stage.costMin + stage.costMax) / 2),
    })),
  };
}

export function buildPrimarySummary(input: {
  diagnosis: string;
  currentState: string;
  city: string;
}): string {
  return `Пациенту требуется лечение по диагнозу «${input.diagnosis}». Текущее состояние: ${input.currentState}. Сформирован маршрут с приоритетом на быстрое подтверждение стадии, запуск терапии и безопасный переход к операции. Подобраны клиники в ${input.city} и за рубежом с диапазоном стоимости по каждому этапу.`;
}
