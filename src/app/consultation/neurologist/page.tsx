import type { Metadata } from "next";
import Link from "next/link";

import { MarketingLanding, MarketingSection } from "@/components/marketing-landing";

export const metadata: Metadata = {
  title: "Консультация невролога — оценка симптомов и план обследования",
  description:
    "Консультация врача-невролога: разбор жалоб, направление на диагностику и связка с другими специалистами при необходимости.",
};

export default function ConsultationNeurologistPage() {
  return (
    <MarketingLanding
      eyebrow="Невролог"
      heading="Консультация невролога — структурируем симптомы и следующий шаг"
      intro="Неврологический запрос часто пугает формулировками из поиска. Мы помогаем собрать анамнез и документы так, чтобы консультация была предметной, а дальнейшие исследования — по делу."
      ctas={[
        { href: "/app/start", label: "Передать жалобы и выписки", variant: "primary" },
        { href: "/online", label: "Онлайн-формат", variant: "secondary" },
        { href: "/consultation", label: "Другие врачи", variant: "ghost" },
      ]}
    >
      <MarketingSection title="Что подготовить к консультации">
        <ul className="marketing-list">
          <li>Хронология симптомов и что уже делали (МРТ, ЭЭГ и т.д.).</li>
          <li>Текущие препараты и сопутствующие диагнозы.</li>
          <li>Конкретный вопрос: второе мнение, подготовка к приёму или план обследования.</li>
        </ul>
      </MarketingSection>
    </MarketingLanding>
  );
}
