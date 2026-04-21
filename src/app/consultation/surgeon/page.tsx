import type { Metadata } from "next";
import Link from "next/link";

import { MarketingLanding, MarketingSection } from "@/components/marketing-landing";

export const metadata: Metadata = {
  title: "Консультация хирурга — показания и подготовка к операции",
  description:
    "Консультация врача-хирурга: оценка показаний, рисков, подготовка к вмешательству и выбор клиники под этап.",
};

export default function ConsultationSurgeonPage() {
  return (
    <MarketingLanding
      eyebrow="Хирург"
      heading="Консультация хирурга — когда операция уместна и как подготовиться"
      intro="Помогаем связать диагностику, заключения и вопрос к хирургу: что обсудить на приёме, какие данные нужны и как планировать стационар, если вмешательство подтверждается."
      ctas={[
        { href: "/app/start", label: "Загрузить заключения и снимки", variant: "primary" },
        { href: "/clinics", label: "Подбор клиники", variant: "secondary" },
        { href: "/consultation", label: "Все консультации", variant: "ghost" },
      ]}
    >
      <MarketingSection title="Типовые сценарии">
        <ul className="marketing-list">
          <li>Нужно понять, есть ли показания к операции сейчас или сначала консервативно.</li>
          <li>Уже рекомендовали операцию — нужно второе мнение и сравнение клиник.</li>
          <li>Подготовка к госпиталю: анализы, сопровождение, оценка стоимости этапа.</li>
        </ul>
      </MarketingSection>
      <MarketingSection title="Связка с маршрутом">
        <p>
          <Link href="/treatment" className="button">
            Помощь в лечении — roadmap и стоимость по этапам
          </Link>
        </p>
      </MarketingSection>
    </MarketingLanding>
  );
}
