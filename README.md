# MedRoute

Веб-сервис онко-навигации и сопровождения пациента с ролевой моделью и внутренними кабинетами.

## Что реализовано

- Продающий лендинг в медицинском high-tech стиле (`/`)
- Авторизация и регистрация (`/auth/login`, `/auth/register`)
- Роли: `patient`, `doctor`, `admin`
- Кабинет пациента (`/app/patient`) и создание кейса (`/app/start`)
- Кабинет врача (`/app/doctor`) и рабочая карточка назначенного кейса (`/app/doctor/cases/[id]`)
- Панель администратора (`/app/admin`) с верификацией кейсов и назначением врачей
- Внутренняя страница поиска клиник (`/app/clinics`)
- Рабочий кабинет кейса пациента (`/app/cases/[id]`)
- Экран этапа лечения (`/app/cases/[id]/stages/[stageId]`)
- Экран адресной поддержки этапа (`/app/cases/[id]/fundraising`)
- Публичная карточка кейса для доноров (`/cases/[id|slug]`)
- Социальный шеринг кейса (copy link / Telegram / VK)
- Апдейты по статусам лечения и счетчик реакций поддержки
- Чек-лист модерации и прозрачный статус верификации
- API:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
  - `GET/POST /api/cases`
  - `GET /api/cases/[id]`
  - `POST /api/cases/[id]/ai-summary`
  - `POST /api/cases/[id]/donations`
  - `POST /api/admin/cases/[id]/verify`
  - `POST /api/admin/cases/[id]/assign-doctor`
  - `POST /api/doctor/cases/[id]/updates`
  - `POST /api/doctor/cases/[id]/stages/[stageId]/status`
- SQLite база данных с автоматической инициализацией (`data/medroute.db`)
- Сид-данные: demo patient/doctor/admin + demo кейс

## Технологии

- Next.js (App Router, TypeScript)
- React
- SQLite (`better-sqlite3`)
- CSS (кастомная система стилей и анимаций)

## Быстрый старт

```bash
npm install
npm run dev
```

Открыть: `http://localhost:3000`

## Ролевые demo-аккаунты

- `patient@medroute.local` / `Patient123!`
- `doctor@medroute.local` / `Doctor123!`
- `admin@medroute.local` / `Admin123!`
