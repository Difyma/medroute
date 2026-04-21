import type { Metadata } from "next";
import Link from "next/link";

import { MarketingLanding, MarketingSection } from "@/components/marketing-landing";

export const metadata: Metadata = {
  title: "К какому врачу обратиться — консультация и направление",
  description:
    "Нужна консультация врача, но непонятно к кому идти? Разберём симптомы и документы, подскажем профиль и следующий шаг без самолечения и угадывания.",
};

export default function HelpSymptomsPage() {
  return (
    <MarketingLanding
      eyebrow="Не знаете к кому?"
      heading="К какому врачу обратиться — разберёмся и направим"
      intro="Интент «консультация какого врача», «к кому идти», «нужна консультация врача, но страшно ошибиться» — золото для доверия. Мы не ставим диагноз в поиске: собираем данные, задаём уточняющие вопросы и предлагаем логичную линию — часто через терапевта или узкого специалиста."
      ctas={[
        { href: "/app/start", label: "Описать ситуацию в кейсе", variant: "primary" },
        { href: "/consultation/therapist", label: "Сразу к терапевту", variant: "secondary" },
        { href: "/online", label: "Онлайн-разбор", variant: "ghost" },
      ]}
    >
      <MarketingSection title="Как мы помогаем выбрать вектор">
        <ul className="marketing-list">
          <li>Фиксируем жалобы, длительность, что уже обследовали.</li>
          <li>Сопоставляем с типовыми маршрутами и красными флагами (когда срочно в ER).</li>
          <li>Предлагаем 1–2 приоритетных специалиста и что спросить на приёме.</li>
        </ul>
      </MarketingSection>
      <MarketingSection title="Важно">
        <p>
          Острые состояния (боль, кровотечение, внезапная слабость, удушье) требуют скорой помощи, а
          не ожидания ответа в сервисе. При подозрении на экстренное — вызывайте врачей немедленно.
        </p>
      </MarketingSection>
      <MarketingSection title="Дальше">
        <div className="hero-actions marketing-hero-actions">
          <Link href="/consultation" className="button button-secondary">
            Все консультации
          </Link>
          <Link href="/treatment" className="button button-ghost">
            Полное сопровождение лечения
          </Link>
        </div>
      </MarketingSection>
    </MarketingLanding>
  );
}
