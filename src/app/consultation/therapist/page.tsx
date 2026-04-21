import type { Metadata } from "next";
import Link from "next/link";

import { MarketingLanding, MarketingSection } from "@/components/marketing-landing";

export const metadata: Metadata = {
  title: "Консультация терапевта — с чего начать обследование",
  description:
    "Первичная консультация терапевта: куда направить, какие анализы и обследования собрать, подготовка к узким специалистам.",
};

export default function ConsultationTherapistPage() {
  return (
    <MarketingLanding
      eyebrow="Терапевт"
      heading="Консультация терапевта — вход в систему здравоохранения без лишних кругов"
      intro="Терапевтическая линия помогает, когда симптомы размыты или уже есть направления, но непонятно, в каком порядке идти. Мы помогаем собрать базу и не потерять время."
      ctas={[
        { href: "/app/start", label: "Описать ситуацию и документы", variant: "primary" },
        { href: "/help", label: "Не знаю, к какому врачу идти", variant: "secondary" },
        { href: "/consultation", label: "Все консультации", variant: "ghost" },
      ]}
    >
      <MarketingSection title="Когда это уместно">
        <ul className="marketing-list">
          <li>Нужна консультация врача «с нуля» — с чего начать.</li>
          <li>Есть выписки из поликлиники, но нет целостной картины.</li>
          <li>Требуется понятный список шагов до узкого специалиста.</li>
        </ul>
      </MarketingSection>
      <MarketingSection title="Дальше по маршруту">
        <p>
          <Link href="/treatment" className="button button-secondary">
            Помощь в лечении и организации
          </Link>
        </p>
      </MarketingSection>
    </MarketingLanding>
  );
}
