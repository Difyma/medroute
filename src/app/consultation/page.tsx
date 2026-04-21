import type { Metadata } from "next";
import Link from "next/link";

import { MarketingLanding, MarketingSection } from "@/components/marketing-landing";

export const metadata: Metadata = {
  title: "Получить консультацию врача — онлайн и с подбором специалистов",
  description:
    "Платная и первичная консультация врача: подбор профиля под запрос, понятные шаги и сопровождение. Онлайн и очные форматы.",
};

const specialties = [
  {
    href: "/consultation/oncologist",
    title: "Онколог",
    text: "Второе мнение, разбор документов и план терапии под диагноз.",
  },
  {
    href: "/consultation/therapist",
    title: "Терапевт",
    text: "С чего начать обследование, куда направить и как собрать выписки.",
  },
  {
    href: "/consultation/neurologist",
    title: "Невролог",
    text: "Оценка симптомов и направление к узким специалистам при необходимости.",
  },
  {
    href: "/consultation/surgeon",
    title: "Хирург",
    text: "Показания к операции, подготовка и выбор клиники под этап.",
  },
];

export default function ConsultationPage() {
  return (
    <MarketingLanding
      eyebrow="Консультации врачей"
      heading="Получить консультацию врача — с подбором специалиста и ясным планом"
      intro="Люди ищут не «платформу», а врача и понятный следующий шаг. MedRoute связывает запрос на консультацию с проверенными профилями и помогает не потеряться в документах и очередях."
      ctas={[
        { href: "/app/start", label: "Отправить кейс и документы", variant: "primary" },
        { href: "/online", label: "Консультация онлайн", variant: "secondary" },
        { href: "/auth/register", label: "Регистрация", variant: "ghost" },
      ]}
    >
      <MarketingSection title="Как проходит консультация через MedRoute">
        <ul className="marketing-list">
          <li>Оставляете кейс: симптомы, диагноз (если есть), выписки и вопросы.</li>
          <li>Подбираем профиль врача и формат: очно, онлайн или комбинированно.</li>
          <li>После консультации фиксируем выводы и при необходимости строим маршрут лечения.</li>
        </ul>
      </MarketingSection>

      <MarketingSection title="Консультации по специализациям">
        <div className="marketing-card-grid">
          {specialties.map((item) => (
            <Link key={item.href} href={item.href} className="marketing-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Link>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection title="Запросы, которые закрывает эта страница">
        <ul className="marketing-list">
          <li>консультация врача, первичная и повторная;</li>
          <li>платная консультация врача с понятной логикой записи;</li>
          <li>получить консультацию врача онлайн или с выездом в клинику — по ситуации.</li>
        </ul>
        <p>
          <Link href="/help" className="button button-ghost button-small">
            Не знаете, к какому врачу обратиться
          </Link>
        </p>
      </MarketingSection>
    </MarketingLanding>
  );
}
