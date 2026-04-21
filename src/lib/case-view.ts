import { CaseUpdate, VerificationChecklist } from "@/lib/types";

export function updateKindLabel(kind: CaseUpdate["kind"]): string {
  switch (kind) {
    case "stage-completed":
      return "Этап завершен";
    case "treatment-started":
      return "Лечение начато";
    case "plan-adjusted":
      return "Корректировка плана";
    default:
      return "Обновление";
  }
}

export function checklistEntries(checklist: VerificationChecklist): Array<{ title: string; done: boolean }> {
  return [
    {
      title: "Документы читаемы и полны",
      done: checklist.documentsAreReadable,
    },
    {
      title: "Диагноз подтвержден выписками",
      done: checklist.diagnosisMatchesDocuments,
    },
    {
      title: "Личность пациента верифицирована",
      done: checklist.patientIdentityConfirmed,
    },
    {
      title: "Цель сбора валидирована модератором",
      done: checklist.fundraisingGoalValidated,
    },
  ];
}
