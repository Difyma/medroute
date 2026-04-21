import type { Metadata } from "next";
import Link from "next/link";

import { MarketingLanding, MarketingSection } from "@/components/marketing-landing";

export const metadata: Metadata = {
  title: "Консультация врача онлайн и телемедицина",
  description:
    "Онлайн консультация врача, в том числе по телефону и в защищённом формате: подбор специалиста, разбор документов и план действий без поездки в клинику.",
};

export default function OnlineConsultationPage() {
  return (
    <MarketingLanding
      eyebrow="Онлайн"
      heading="Консультация врача онлайн — без очередей и с понятным итогом"
      intro="Закрываем кластер «консультация врача онлайн», «по телефону», «телемедицина»: вы заранее передаёте документы, получаете слот и фиксируете выводы в кейсе — при необходимости дополняем очным визитом."
      ctas={[
        { href: "/app/start", label: "Начать онлайн-запрос", variant: "primary" },
        { href: "/consultation", label: "Все форматы консультаций", variant: "secondary" },
        { href: "/auth/register", label: "Регистрация", variant: "ghost" },
      ]}
    >
      <MarketingSection title="Как это устроено">
        <ul className="marketing-list">
          <li>Загружаете выписки, заключения, снимки (если есть) и формулируете вопрос.</li>
          <li>Согласуем время и канал: видео, аудио или чат по правилам сервиса.</li>
          <li>После созвона — краткое резюме и рекомендованные шаги в карточке кейса.</li>
        </ul>
      </MarketingSection>
      <MarketingSection title="Когда онлайн недостаточно">
        <p>
          Некоторые диагнозы требуют очного осмотра или инструментальной диагностики. В таких
          случаях онлайн-консультация — это подготовка и приоритизация, а не замена очному приёму.
        </p>
        <p>
          <Link href="/consultation" className="button button-secondary">
            Смешанный маршрут: онлайн + клиника
          </Link>
        </p>
      </MarketingSection>
    </MarketingLanding>
  );
}
