import Image from "next/image";
import Link from "next/link";

const journey = [
  {
    step: "01",
    title: "Создание кейса",
    text: "Загружаете выписки и анализы. Система собирает основу кейса и отправляет документы на верификацию.",
  },
  {
    step: "02",
    title: "AI-разбор",
    text: "Медицинский язык переводится в понятный формат: диагноз, риски, этапы и приоритеты лечения.",
  },
  {
    step: "03",
    title: "Roadmap лечения",
    text: "Вы получаете маршрут: диагностика, консультации, терапия, операция и реабилитация с критичностью и сроками.",
  },
  {
    step: "04",
    title: "Поддержка реализации",
    text: "Команда помогает согласовать следующий шаг лечения и сопровождать пациента до его выполнения.",
  },
];

const aidDirections = [
  {
    title: "Медицинская помощь",
    text: "Формируем маршрут лечения, подбираем клиники и проверенных врачей по конкретному диагнозу.",
  },
  {
    title: "Организационная помощь",
    text: "Помогаем собрать документы, подготовиться к консультациям и не терять время между этапами.",
  },
  {
    title: "Информационная помощь",
    text: "Переводим сложный медицинский язык в понятные шаги для пациента и его семьи.",
  },
  {
    title: "Финансовая помощь",
    text: "При необходимости подключаем финансовую поддержку как часть общего плана помощи пациенту.",
  },
];

const productFeatures = [
  "Кейс пациента с документами и ручной верификацией",
  "AI summary и автоструктура диагноза",
  "Roadmap лечения с этапами, сроками и критичностью",
  "Подбор клиник и врачей под конкретный диагноз",
  "Оценка стоимости по этапам (min / optimal / max)",
  "Публичная карточка и прозрачные обновления прогресса",
];

const mechanicsLayers = [
  {
    title: "Карточка кейса",
    text: "Пациент публикует историю, диагноз и цель лечения, а семья получает понятную картину прогресса.",
  },
  {
    title: "Лечение по этапам",
    text: "Система формирует рабочий roadmap: текущий этап, сроки, приоритет и понятная логика следующего шага.",
  },
  {
    title: "Проверенные специалисты",
    text: "В кейсы подключаются врачи и клиники с предварительной верификацией профиля, опыта и специализации.",
  },
  {
    title: "Поддержка реализации",
    text: "После согласования этапа сервис помогает пройти его без пауз и потери времени.",
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
  "AI-разбор медицинских документов",
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
        <header className="topbar">
          <Link href="/" className="brand-mark">
            MedRoute
          </Link>
          <nav className="topnav">
            <a href="#flow">Сценарий</a>
            <a href="#directions">Направления помощи</a>
            <a href="#mechanics">Как это работает</a>
            <a href="#product">Продукт</a>
            <a href="#support">Поддержка</a>
            <Link href="/clinics">Клиники</Link>
            <a href="#specialists">Специалисты</a>
            <a href="#trust">Доверие</a>
          </nav>
          <Link href="/app/start" className="button button-small">
            Создать кейс
          </Link>
        </header>

        <div className="hero-grid">
          <div className="hero-copy reveal-up">
            <p className="eyebrow">Комплексная помощь по всему маршруту лечения</p>
            <h1>
              Помогаем пройти лечение
              <br />
              в нескольких направлениях.
            </h1>
            <p>
              MedRoute объединяет медицинскую, организационную и информационную помощь: от AI-разбора
              документов и подбора врачей до координации каждого следующего шага лечения.
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
                src="/style/reference-2.jpg"
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

      <section id="flow" className="surface-section">
        <div className="section-head">
          <p className="eyebrow">Путь пользователя</p>
          <h2>Диагноз → План лечения → Стоимость → Сбор</h2>
        </div>
        <div className="journey-grid">
          {journey.map((item) => (
            <article key={item.step} className="journey-item">
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="directions" className="surface-section">
        <div className="section-head">
          <p className="eyebrow">Направления помощи</p>
          <h2>Сбор средств это важная часть, но не единственная ценность MedRoute</h2>
        </div>
        <div className="journey-grid">
          {aidDirections.map((item, index) => (
            <article key={item.title} className="journey-item">
              <span>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="mechanics" className="surface-section">
        <div className="section-head">
          <p className="eyebrow">Как работает MedRoute</p>
          <h2>Мы ведем пациента и семью от диагноза до следующего шага лечения</h2>
        </div>
        <div className="journey-grid">
          {mechanicsLayers.map((layer, index) => (
            <article key={layer.title} className="journey-item">
              <span>0{index + 1}</span>
              <h3>{layer.title}</h3>
              <p>{layer.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="product" className="surface-section product-view">
        <div className="product-media">
          <Image src="/style/reference-1.jpg" alt="Medical style board" width={905} height={1268} />
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
