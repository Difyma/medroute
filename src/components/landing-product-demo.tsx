const roadmapPreview = [
  { id: "1", title: "Диагностика", hint: "7–10 дн.", status: "done" as const },
  { id: "2", title: "Консилиум и план", hint: "3–5 дн.", status: "active" as const },
  { id: "3", title: "Системная терапия", hint: "16–20 нед.", status: "planned" as const },
  { id: "4", title: "Операция", hint: "7–14 дн.", status: "focus" as const },
];

const docTags = ["Выписка", "Гистология", "КТ / МРТ"];

export function LandingProductDemo() {
  return (
    <div className="product-demo" aria-label="Пример экрана кабинета кейса MedRoute">
      <div className="product-demo-chrome">
        <span className="product-demo-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="product-demo-chrome-title">medroute.app / кабинет кейса</span>
      </div>

      <div className="product-demo-body">
        <div className="product-demo-top">
          <div>
            <p className="product-demo-eyebrow">Активный кейс</p>
            <p className="product-demo-case-title">Аденокарцинома · маршрут лечения</p>
          </div>
          <div className="product-demo-badges">
            <span className="product-demo-badge product-demo-badge--ok">Верифицирован</span>
          </div>
        </div>

        <div className="product-demo-grid">
          <div className="product-demo-panel">
            <p className="product-demo-panel-title">Roadmap этапов</p>
            <ul className="product-demo-steps">
              {roadmapPreview.map((step, i) => (
                <li key={step.id} className={`product-demo-step product-demo-step--${step.status}`}>
                  <span className="product-demo-step-track" aria-hidden="true">
                    <span className="product-demo-step-dot" />
                    {i < roadmapPreview.length - 1 ? <span className="product-demo-step-line" /> : null}
                  </span>
                  <div className="product-demo-step-body">
                    <span className="product-demo-step-title">{step.title}</span>
                    <span className="product-demo-step-hint">{step.hint}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="product-demo-panel product-demo-panel--side">
            <p className="product-demo-panel-title">Сбор на этап</p>
            <div className="product-demo-fund">
              <div className="product-demo-fund-bar" role="presentation">
                <span style={{ width: "44%" }} />
              </div>
              <div className="product-demo-fund-row">
                <span>186 000 ₽</span>
                <span className="product-demo-fund-target">из 420 000 ₽</span>
              </div>
              <p className="product-demo-fund-caption">Текущий фокус: операция после терапии</p>
            </div>

            <p className="product-demo-panel-title product-demo-panel-title--spaced">Документы кейса</p>
            <div className="product-demo-docs">
              {docTags.map((tag) => (
                <span key={tag} className="product-demo-doc-pill">
                  {tag}
                </span>
              ))}
            </div>

            <div className="product-demo-hint-card">
              <strong>Первичная оценка</strong>
              <p>Понятное резюме ситуации и очередности шагов для семьи и координатора.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
