import type { Metadata } from "next";
import Link from "next/link";

import { MarketingLanding, MarketingSection } from "@/components/marketing-landing";

export const metadata: Metadata = {
  title: "Консультация онколога — подбор врача и план лечения",
  description:
    "Консультация врача-онколога: разбор гистологии и снимков, второе мнение, roadmap терапии и подбор клиники под этап.",
};

export default function ConsultationOncologistPage() {
  return (
    <MarketingLanding
      eyebrow="Онкология"
      heading="Консультация онколога — подбор врача и план лечения"
      intro="Закрываем интент «врач онколог консультация»: верифицируем документы, подключаем профильного специалиста и помогаем семье понять, что делать дальше — без лишних обещаний и «магических» протоколов."
      ctas={[
        { href: "/app/start", label: "Отправить документы на разбор", variant: "primary" },
        { href: "/treatment", label: "Помощь в лечении и маршруте", variant: "secondary" },
        { href: "/consultation", label: "Другие специализации", variant: "ghost" },
      ]}
    >
      <MarketingSection title="Что вы получаете">
        <ul className="marketing-list">
          <li>Разбор имеющихся данных и формулировка вопросов к онкологу.</li>
          <li>Подбор консультации под профиль опухоли и стадию (по документам).</li>
          <li>При необходимости — переход к полному маршруту: этапы, клиники, оценка стоимости.</li>
        </ul>
      </MarketingSection>
      <MarketingSection title="Связанные разделы">
        <div className="hero-actions marketing-hero-actions">
          <Link href="/online" className="button button-secondary">
            Онлайн-консультация
          </Link>
          <Link href="/clinics" className="button button-ghost">
            Поиск клиник
          </Link>
        </div>
      </MarketingSection>
    </MarketingLanding>
  );
}
