# MedRoute MVP

MVP веб-сервиса онко-навигации и адресного сбора средств.

Ключевая идея: не просто сбор денег, а понятный маршрут лечения:

`Диагноз -> AI-разбор -> Roadmap этапов -> Стоимость -> Сбор на конкретный этап`.

## Что реализовано

- Продающий лендинг в медицинском high-tech стиле (`/`)
- Создание кейса пациента (`/app/start`)
- Рабочий кабинет кейса с roadmap, клиниками, врачами и стоимостью (`/app/cases/[id]`)
- Отдельный экран этапа лечения (`/app/cases/[id]/stages/[stageId]`)
- Отдельный экран сбора на текущий этап (`/app/cases/[id]/fundraising`)
- Публичная карточка кейса для доноров (`/cases/[id|slug]`)
- Социальный шеринг кейса (copy link / Telegram / VK)
- Апдейты по статусам лечения и счетчик реакций поддержки
- Чек-лист модерации и прозрачный статус верификации
- API для MVP:
  - `GET/POST /api/cases`
  - `GET /api/cases/[id]`
  - `POST /api/cases/[id]/ai-summary`
  - `POST /api/cases/[id]/donations`
- In-memory store с демо-кейсом (`case-demo-onco`)

## Технологии

- Next.js (App Router, TypeScript)
- React
- CSS (кастомная система стилей и анимаций)

## Быстрый старт

```bash
npm install
npm run dev
```

Открыть: `http://localhost:3000`

## Демо ссылки

- Лендинг: `/`
- Создать кейс: `/app/start`
- Демо кабинет: `/app/cases/case-demo-onco`
- Демо экран этапа: `/app/cases/case-demo-onco/stages/surgery`
- Демо экран сбора: `/app/cases/case-demo-onco/fundraising`
- Публичный кейс: `/cases/aleksei-kazantsev-onco-route`

## Важно про MVP

Сейчас данные хранятся в памяти процесса (без БД). Для прод-версии следующий шаг:

- Postgres + Prisma
- Загрузка/хранение документов в S3-совместимом хранилище
- Интеграция LLM (OpenAI/Yandex GPT) и OCR/PDF-парсинга
- Платежи (CloudPayments/ЮKassa)
- Полноценный модуль верификации документов
