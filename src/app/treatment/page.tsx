import type { Metadata } from "next";
import Link from "next/link";

import { MarketingLanding, MarketingSection } from "@/components/marketing-landing";

export const metadata: Metadata = {
  title: "Помощь в лечении — подбор клиник и план лечения под ваш диагноз",
  description:
    "Помощь в лечении и диагностике, организация лечения: roadmap по этапам, подбор клиник и врачей, оценка стоимости min / optimal / max.",
};

export default function TreatmentHelpPage() {
  return (
    <MarketingLanding
      eyebrow="Сопровождение"
      heading="Помощь в лечении — не только консультация, а маршрут до результата"
      intro="После точки входа «консультация врача» многим нужна помощь в лечении: куда ехать, в каком порядке оплачивать этапы, как не потерять документы. Здесь раскрываем вашу «фишку» — roadmap, клиники, прозрачные обновления."
      ctas={[
        { href: "/app/start", label: "Создать кейс и маршрут", variant: "primary" },
        { href: "/clinics", label: "Поиск клиник", variant: "secondary" },
        { href: "/consultation", label: "Сначала консультация", variant: "ghost" },
      ]}
    >
      <MarketingSection title="Что входит в помощь">
        <ul className="marketing-list">
          <li>Roadmap лечения: этапы, сроки, критичность и ответственные.</li>
          <li>Подбор клиник и специалистов под конкретный диагноз и город.</li>
          <li>Оценка стоимости по этапам (min / optimal / max) и прозрачные обновления в кейсе.</li>
          <li>При необходимости — точечный сбор на конкретный этап (как в демо-кейсе).</li>
        </ul>
      </MarketingSection>
      <MarketingSection title="Демо кабинета">
        <p>
          <Link href="/app/cases/case-demo-onco" className="button">
            Открыть пример рабочего кейса
          </Link>
        </p>
      </MarketingSection>
    </MarketingLanding>
  );
}
