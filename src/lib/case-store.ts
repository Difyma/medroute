import { randomUUID } from "node:crypto";

import { CreateCaseInput, PatientCase, TreatmentStage } from "@/lib/types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .slice(0, 48);
}

function makeBaseRoadmap(diagnosis: string): TreatmentStage[] {
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

function calculateCost(roadmap: TreatmentStage[]) {
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

function buildAiSummary(input: Pick<PatientCase, "diagnosis" | "currentState" | "city">): string {
  return `Пациенту требуется лечение по диагнозу «${input.diagnosis}». Текущее состояние: ${input.currentState}. Маршрут сформирован с приоритетом на быстрое подтверждение стадии, запуск терапии и безопасный переход к операции. Подобраны клиники в ${input.city} и зарубежом с диапазоном стоимости по каждому этапу.`;
}

function createSeedCase(): PatientCase {
  const roadmap = makeBaseRoadmap("Аденокарцинома ободочной кишки IIIB стадия");

  return {
    id: "case-demo-onco",
    slug: "aleksei-kazantsev-onco-route",
    patientName: "Алексей Казанцев",
    age: 43,
    city: "Казань",
    diagnosis: "Аденокарцинома ободочной кишки IIIB стадия",
    currentState: "После биопсии, требуется консилиум и старт системной терапии",
    completedActions: ["Биопсия", "КТ брюшной полости", "Первичный прием онколога"],
    documents: ["Выписка_12_04_2026.pdf", "Гистология_05_04_2026.pdf"],
    summary: buildAiSummary({
      diagnosis: "Аденокарцинома ободочной кишки IIIB стадия",
      currentState: "После биопсии, требуется консилиум и старт системной терапии",
      city: "Казань",
    }),
    roadmap,
    costEstimation: calculateCost(roadmap),
    fundraising: {
      currentStageId: "surgery",
      target: 420_000,
      raised: 186_000,
    },
    isVerified: true,
    verificationChecklist: {
      documentsAreReadable: true,
      diagnosisMatchesDocuments: true,
      patientIdentityConfirmed: true,
      fundraisingGoalValidated: true,
      reviewedBy: "Модератор Анна К.",
      reviewedAt: "2026-04-20",
    },
    createdAt: "2026-04-18T09:20:00.000Z",
    updates: [
      {
        id: "up-1",
        date: "2026-04-19",
        kind: "treatment-started",
        title: "Получено второе мнение",
        body: "Подтверждено, что можно начинать химиотерапию в ближайшие 5 дней.",
        reactions: 34,
      },
      {
        id: "up-2",
        date: "2026-04-20",
        kind: "plan-adjusted",
        title: "Согласован план операции",
        body: "Хирургический этап запланирован после 6 курсов, сейчас собираем средства именно на этот этап.",
        reactions: 49,
      },
      {
        id: "up-3",
        date: "2026-04-21",
        kind: "stage-completed",
        title: "Завершили этап диагностики",
        body: "Диагностический этап закрыт, переходим к консилиуму и финальному подтверждению тактики лечения.",
        reactions: 57,
      },
    ],
  };
}

declare global {
  var __medrouteCases: PatientCase[] | undefined;
}

const store = globalThis.__medrouteCases ?? [createSeedCase()];
globalThis.__medrouteCases = store;

export function listCases(): PatientCase[] {
  return store;
}

export function getCase(idOrSlug: string): PatientCase | undefined {
  return store.find((item) => item.id === idOrSlug || item.slug === idOrSlug);
}

export function createCase(input: CreateCaseInput): PatientCase {
  const id = `case-${randomUUID().slice(0, 8)}`;
  const slugBase = slugify(`${input.patientName}-${input.diagnosis}`) || `case-${id}`;
  const roadmap = makeBaseRoadmap(input.diagnosis);

  const created: PatientCase = {
    id,
    slug: `${slugBase}-${Date.now().toString().slice(-4)}`,
    patientName: input.patientName,
    age: input.age,
    city: input.city,
    diagnosis: input.diagnosis,
    currentState: input.currentState,
    completedActions: input.completedActions
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean),
    documents: input.documentNames,
    summary: "AI-разбор еще не запускался. Нажмите «Сформировать AI summary» в кабинете кейса.",
    roadmap,
    costEstimation: calculateCost(roadmap),
    fundraising: {
      currentStageId: "surgery",
      target: 410_000,
      raised: 0,
    },
    isVerified: false,
    verificationChecklist: {
      documentsAreReadable: false,
      diagnosisMatchesDocuments: false,
      patientIdentityConfirmed: false,
      fundraisingGoalValidated: false,
      reviewedBy: "Не назначен",
      reviewedAt: "Ожидается",
    },
    createdAt: new Date().toISOString(),
    updates: [
      {
        id: `up-${randomUUID().slice(0, 6)}`,
        date: new Date().toISOString().slice(0, 10),
        kind: "general",
        title: "Кейс создан",
        body: "Документы загружены и отправлены на ручную верификацию.",
        reactions: 0,
      },
    ],
  };

  store.unshift(created);
  return created;
}

export function generateAiSummary(id: string): PatientCase | undefined {
  const target = getCase(id);
  if (!target) {
    return undefined;
  }

  target.summary = buildAiSummary(target);
  target.updates.unshift({
    id: `up-${randomUUID().slice(0, 6)}`,
    date: new Date().toISOString().slice(0, 10),
    kind: "plan-adjusted",
    title: "AI-разбор обновлен",
    body: "Система упростила медицинский язык и обновила последовательность этапов лечения.",
    reactions: 0,
  });

  return target;
}

export function donateToCase(id: string, amount: number): PatientCase | undefined {
  const target = getCase(id);
  if (!target) {
    return undefined;
  }

  target.fundraising.raised += amount;
  target.updates.unshift({
    id: `up-${randomUUID().slice(0, 6)}`,
    date: new Date().toISOString().slice(0, 10),
    kind: "general",
    title: "Новый перевод",
    body: `Получено ${new Intl.NumberFormat("ru-RU").format(amount)} ₽ на этап «Операция».`,
    reactions: 0,
  });

  return target;
}

export function getStageById(caseId: string, stageId: string): TreatmentStage | undefined {
  const target = getCase(caseId);
  return target?.roadmap.find((stage) => stage.id === stageId);
}
