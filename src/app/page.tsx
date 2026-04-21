import Image from "next/image";
import Link from "next/link";

import { LandingProductDemo } from "@/components/landing-product-demo";

const journey = [
  {
    step: "01",
    title: "Создание кейса",
    text: "Загрузите документы и базовые данные пациента.",
    hint: "3-5 минут",
  },
  {
    step: "02",
    title: "Первичная оценка",
    text: "Получите понятное описание диагноза и рисков.",
    hint: "Автоструктура",
  },
  {
    step: "03",
    title: "Roadmap лечения",
    text: "Видите этапы, сроки и приоритеты лечения.",
    hint: "Единый план",
  },
  {
    step: "04",
    title: "Поддержка реализации",
    text: "Сопровождаем до завершения текущего этапа.",
    hint: "С координатором",
  },
];

const aidDirections = [
  {
    title: "Медицинская помощь",
    text: "Подбираем маршрут, клиники и специалистов по диагнозу.",
    hint: "Профильная экспертиза",
  },
  {
    title: "Организационная помощь",
    text: "Помогаем с документами и подготовкой к консультациям.",
    hint: "Без лишних пауз",
  },
  {
    title: "Информационная помощь",
    text: "Переводим сложные медицинские данные в понятные шаги.",
    hint: "Понятно семье",
  },
  {
    title: "Финансовая помощь",
    text: "При необходимости подключаем сбор под конкретный этап.",
    hint: "Точечная поддержка",
  },
];

const productFeatures = [
  "Кейс пациента с документами и ручной верификацией",
  "Первичная оценка документов и автоструктура диагноза",
  "Roadmap лечения с этапами, сроками и критичностью",
  "Подбор клиник и врачей под конкретный диагноз",
  "Оценка стоимости по этапам (min / optimal / max)",
  "Публичная карточка и прозрачные обновления прогресса",
];

const mechanicsLayers = [
  {
    title: "Карточка кейса",
    text: "Вся информация о пациенте и лечении в одном месте.",
    hint: "Прозрачный статус",
  },
  {
    title: "Лечение по этапам",
    text: "Каждый этап лечения понятен и имеет следующий шаг.",
    hint: "Маршрут действий",
  },
  {
    title: "Проверенные специалисты",
    text: "Подключаем только верифицированных специалистов и клиники.",
    hint: "Ручная проверка",
  },
  {
    title: "Поддержка реализации",
    text: "Координатор ведет кейс до результата этапа.",
    hint: "До результата",
  },
];

const productCore = [
  "Карточка кейса + цель лечения + прогресс + апдейты",
  "Апдейты формата: завершили этап / начали лечение / скорректировали план",
  "Ручная верификация и бейдж «проверено»",
  "Поддержка семьи на всех этапах маршрута",
  "Социальный шеринг кейсов как драйвер роста",
];

const productBoundaries = [
  "Сложное сообщество (комментарии и форумы)",
  "Пользовательские медицинские советы",
  "Мультикатегорийность на старте",
];

const productAdvantages = [
  "Roadmap лечения как центральный объект",
  "Подбор клиник по этапам",
  "Подбор врачей по диагнозу",
  "Прозрачный расчет стоимости лечения",
  "Первичная оценка медицинских документов",
];

const supportShowcases = [
  {
    id: "care-navigation",
    eyebrow: "Сопровождение пациента",
    title: "Координация лечения,",
    accent: "построенная вокруг человека",
    description:
      "Команда MedRoute помогает пройти путь без пробелов: от первого консилиума до контроля после терапии, с понятными шагами для семьи.",
    leadTitle: "Что уже делает команда сопровождения",
    bullets: [
      "Навигация по этапам и срокам лечения",
      "Подбор клиник и специалистов под диагноз",
      "Подготовка документов для консультаций",
      "Контроль обновлений по кейсу",
    ],
    leadImage: "/highlights/highlight-1.jpg",
    gallery: ["/highlights/highlight-2.jpg", "/highlights/highlight-3.jpg"],
    cta: "Открыть сценарий сопровождения",
    href: "/app/cases/case-demo-onco",
  },
  {
    id: "care-coordination",
    eyebrow: "Координация помощи",
    title: "Поддержка семьи и пациента,",
    accent: "когда особенно важно не остаться одним",
    description:
      "MedRoute помогает семье держать весь маршрут под контролем: кто отвечает за этап, какие документы нужны и что делать дальше.",
    leadTitle: "Как мы координируем помощь в MedRoute",
    bullets: [
      "Единый план действий для пациента и семьи",
      "Подсказки по документам и следующим шагам",
      "Оперативная связь по изменениям в лечении",
      "Прозрачный статус каждого этапа",
    ],
    leadImage: "/highlights/highlight-4.jpg",
    gallery: ["/highlights/highlight-5.jpg", "/highlights/highlight-6.jpg"],
    cta: "Посмотреть, как это работает",
    href: "/app/cases/case-demo-onco",
  },
];

const specialistsValidation = [
  {
    step: "01",
    name: "Алина Громова",
    role: "Клинический онколог",
    text: "Проверяем дипломы, сертификаты и профильную специализацию врача.",
    badge: "15 лет практики",
    photo: "/specialists/doctor-1.jpg",
    headline: "Проверка документов и профильной квалификации",
    tone: "mint",
  },
  {
    step: "02",
    name: "Илья Рощин",
    role: "Онкохирург",
    text: "Оцениваем релевантный опыт именно по онкологическим диагнозам.",
    badge: "280+ операций",
    photo: "/specialists/doctor-2.jpg",
    headline: "Оцениваем опыт по сложным онкологическим кейсам",
    tone: "blue",
  },
  {
    step: "03",
    name: "Мария Соколова",
    role: "Химиотерапевт",
    text: "Подтверждаем клиническую практику и работу по актуальным протоколам.",
    badge: "12 лет практики",
    photo: "/specialists/doctor-3.jpg",
    headline: "Подтверждаем клиническую практику и результаты",
    tone: "mint",
  },
  {
    step: "04",
    name: "Дмитрий Артемьев",
    role: "Врач-реабилитолог",
    text: "Подключаем к кейсам только верифицированных специалистов с подтвержденной репутацией.",
    badge: "Рейтинг 4.9",
    photo: "/specialists/doctor-4.jpg",
    headline: "В кейс попадают только проверенные эксперты",
    tone: "blue",
  },
];

export default function Home() {
  return (
    <main className="landing-root">
      <section className="hero-screen">
        <div className="hero-noise" aria-hidden="true" />

        <div className="hero-grid">
          <div className="hero-copy reveal-up">
            <p className="eyebrow">Комплексная помощь по всему маршруту лечения</p>
            <h1>
              Помогаем пройти лечение
              <br />
              в нескольких направлениях.
            </h1>
            <p>
              MedRoute объединяет медицинскую, организационную и информационную помощь: от первичной
              оценки документов и подбора врачей до координации каждого следующего шага лечения.
            </p>
            <div className="hero-actions">
              <Link href="/app/start" className="button">
                Запустить кейс
              </Link>
              <Link href="/cases/aleksei-kazantsev-onco-route" className="button button-ghost">
                Смотреть публичный кейс
              </Link>
            </div>
            <div className="hero-metric-strip">
              <div>
                <span>Направления помощи</span>
                <strong>4 ключевых блока</strong>
              </div>
              <div>
                <span>Средний маршрут</span>
                <strong>5 этапов лечения</strong>
              </div>
              <div>
                <span>Прогресс и статусы</span>
                <strong>Прозрачно для семьи и доноров</strong>
              </div>
            </div>
          </div>

          <div className="hero-visual reveal-up-delay">
            <div className="floating-card">
              <Image
                src="/style/hero-first-block.jpg"
                alt="Visual style reference"
                width={960}
                height={640}
                priority
              />
            </div>
            <div className="floating-panel">
              <p>Текущий этап лечения</p>
              <h3>Консилиум</h3>
              <div className="progress-track">
                <div style={{ width: "63%" }} />
              </div>
              <small>Следующий шаг: старт терапии</small>
            </div>
          </div>
        </div>
      </section>

      <section id="flow" className="surface-section light-section light-section-flow">
        <div className="section-head section-head-compact">
          <p className="eyebrow">Путь пользователя</p>
          <h2>Диагноз → План лечения → Стоимость → Сбор</h2>
          <div className="section-pills">
            <span>4 шага</span>
            <span>Быстрый старт</span>
          </div>
        </div>
        <div className="journey-grid journey-grid-compact">
          {journey.map((item) => (
            <article key={item.step} className="journey-item journey-item-compact">
              <div className="journey-item-top">
                <span className="journey-step">{item.step}</span>
                <span className="journey-chip">{item.hint}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="directions" className="surface-section light-section light-section-directions">
        <div className="section-head section-head-compact">
          <p className="eyebrow">Направления помощи</p>
          <h2>Помощь в нескольких направлениях, не только в финансировании</h2>
          <div className="section-pills">
            <span>Медицинская</span>
            <span>Организационная</span>
            <span>Информационная</span>
          </div>
        </div>
        <div className="journey-grid journey-grid-compact">
          {aidDirections.map((item, index) => (
            <article key={item.title} className="journey-item journey-item-compact">
              <div className="journey-item-top">
                <span className="journey-step">0{index + 1}</span>
                <span className="journey-chip">{item.hint}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="mechanics" className="surface-section light-section light-section-mechanics">
        <div className="section-head section-head-compact">
          <p className="eyebrow">Как работает MedRoute</p>
          <h2>Сервис ведет пациента и семью по маршруту лечения</h2>
          <div className="section-pills">
            <span>Кейс</span>
            <span>Этапы</span>
            <span>Специалисты</span>
          </div>
        </div>
        <div className="journey-grid journey-grid-compact">
          {mechanicsLayers.map((layer, index) => (
            <article key={layer.title} className="journey-item journey-item-compact">
              <div className="journey-item-top">
                <span className="journey-step">0{index + 1}</span>
                <span className="journey-chip">{layer.hint}</span>
              </div>
              <h3>{layer.title}</h3>
              <p>{layer.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="product" className="surface-section product-view">
        <div className="product-media product-media--demo">
          <LandingProductDemo />
        </div>
        <div className="product-copy">
          <p className="eyebrow">Платформа в работе</p>
          <h2>Комплексная помощь пациенту на каждом этапе лечения</h2>
          <ul>
            {productFeatures.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link href="/app/cases/case-demo-onco" className="button">
            Открыть рабочий кабинет кейса
          </Link>
        </div>
      </section>

      <section className="surface-section care-poster">
        <div id="specialists" className="section-head">
          <p className="eyebrow">Проверенные врачи-специалисты</p>
          <h2>Команда специалистов MedRoute</h2>
        </div>
        <div className="specialist-avatar-grid">
          {specialistsValidation.map((item) => (
            <article key={item.name} className="specialist-avatar-card">
              <Image className="specialist-avatar-large" src={item.photo} alt={item.name} width={220} height={220} />
              <h3>{item.name}</h3>
              <p>{item.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="support" className="surface-section support-showcases">
        {supportShowcases.map((item, index) => (
          <article
            key={item.id}
            className={`support-row ${index % 2 === 1 ? "support-row-reverse" : ""}`}
          >
            <div className="support-left">
              <div className="support-lead-media">
                <Image src={item.leadImage} alt={item.title} width={1200} height={900} />
              </div>
              <div className="support-list-card">
                <h3>{item.leadTitle}</h3>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="support-right">
              <p className="eyebrow">{item.eyebrow}</p>
              <h2>
                {item.title} <span>{item.accent}</span>
              </h2>
              <div className="support-gallery">
                <div className="support-gallery-item">
                  <Image src={item.gallery[0]} alt={item.title} width={920} height={1200} />
                </div>
                <div className="support-gallery-item">
                  <Image src={item.gallery[1]} alt={item.title} width={920} height={1200} />
                </div>
              </div>
              <p className="support-description">{item.description}</p>
              <Link href={item.href} className="button support-cta">
                {item.cta}
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="surface-section matrix-section">
        <div className="matrix-column">
          <p className="eyebrow">Что уже доступно</p>
          <h3>Сервисы, которые помогают пройти лечение</h3>
          <ul className="matrix-list">
            {productCore.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="matrix-column">
          <p className="eyebrow">Безопасность и доверие</p>
          <h3>Что мы исключили ради защиты пациентов</h3>
          <ul className="matrix-list matrix-list-muted">
            {productBoundaries.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="matrix-column">
          <p className="eyebrow">Почему выбирают MedRoute</p>
          <h3>Понятный путь лечения и прозрачная помощь</h3>
          <ul className="matrix-list">
            {productAdvantages.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="trust" className="surface-section trust-block">
        <div>
          <p className="eyebrow">Ключ к доверию</p>
          <h2>Верификация документов и регулярные обновления статуса лечения</h2>
          <p>
            Пользователь должен за 30 секунд понять: что случилось, какой этап идет сейчас и какой
            результат уже достигнут. Именно это формирует доверие к сервису и процессу помощи.
          </p>
        </div>
        <div className="trust-badges">
          <span>Ручная проверка документов</span>
          <span>Статус «Проверено»</span>
          <span>Подключаем только проверенных врачей-специалистов</span>
          <span>История обновлений</span>
          <span>Разбивка стоимости по этапам</span>
        </div>
      </section>

      <section className="surface-section ai-note-block">
        <p className="eyebrow">Первичная оценка</p>
        <h2>Можно запросить первичную оценку простым языком</h2>
        <p>
          Сервис помогает быстро понять текущую ситуацию по документам: что важно сейчас и к каким
          специалистам обратиться в первую очередь.
        </p>
      </section>

      <section className="final-cta">
        <h2>Ключевое отличие: помощь по всем направлениям в одном сервисе</h2>
        <p>
          MedRoute это инструмент прохождения лечения: медицинская навигация, организационная поддержка и
          понятная информация, чтобы пациент и семья знали, что делать на каждом шаге.
        </p>
        <div className="hero-actions">
          <Link href="/app/start" className="button">
            Создать кейс сейчас
          </Link>
          <Link href="/app/cases/case-demo-onco" className="button button-ghost">
            Открыть кабинет пациента
          </Link>
        </div>
      </section>
    </main>
  );
}
