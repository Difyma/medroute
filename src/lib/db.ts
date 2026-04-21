import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

import Database from "better-sqlite3";

import { buildPrimarySummary, makeBaseRoadmap } from "@/lib/case-templates";
import { hashPassword } from "@/lib/security";
import { UserRole } from "@/lib/types";

const DB_PATH = join(process.cwd(), "data", "medroute.db");

export const DEMO_CREDENTIALS = {
  patient: { email: "patient@medroute.local", password: "Patient123!" },
  doctor: { email: "doctor@medroute.local", password: "Doctor123!" },
  admin: { email: "admin@medroute.local", password: "Admin123!" },
} as const;

type DbUserSeed = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  city: string;
  password: string;
};

declare global {
  var __medrouteDb: Database.Database | undefined;
}

function initSchema(db: Database.Database) {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL CHECK(role IN ('patient', 'doctor', 'admin')),
      city TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      patient_id TEXT NOT NULL,
      patient_name TEXT NOT NULL,
      age INTEGER NOT NULL,
      city TEXT NOT NULL,
      diagnosis TEXT NOT NULL,
      current_state TEXT NOT NULL,
      completed_actions TEXT NOT NULL,
      documents TEXT NOT NULL,
      summary TEXT NOT NULL,
      is_verified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (patient_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS verification (
      case_id TEXT PRIMARY KEY,
      documents_are_readable INTEGER NOT NULL DEFAULT 0,
      diagnosis_matches_documents INTEGER NOT NULL DEFAULT 0,
      patient_identity_confirmed INTEGER NOT NULL DEFAULT 0,
      fundraising_goal_validated INTEGER NOT NULL DEFAULT 0,
      reviewed_by TEXT NOT NULL DEFAULT 'Не назначен',
      reviewed_at TEXT NOT NULL DEFAULT 'Ожидается',
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS stages (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      stage_key TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      duration TEXT NOT NULL,
      criticality TEXT NOT NULL CHECK(criticality IN ('high', 'medium', 'low')),
      status TEXT NOT NULL CHECK(status IN ('planned', 'in-progress', 'done')),
      cost_min INTEGER NOT NULL,
      cost_max INTEGER NOT NULL,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS stage_clinics (
      id TEXT PRIMARY KEY,
      stage_id TEXT NOT NULL,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      specialization TEXT NOT NULL,
      estimated_cost INTEGER NOT NULL,
      rating REAL NOT NULL,
      reviews INTEGER NOT NULL,
      FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS stage_doctors (
      id TEXT PRIMARY KEY,
      stage_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL,
      clinic_name TEXT NOT NULL,
      experience_years INTEGER NOT NULL,
      rating REAL NOT NULL,
      focus TEXT NOT NULL,
      FOREIGN KEY (stage_id) REFERENCES stages(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS fundraising (
      case_id TEXT PRIMARY KEY,
      current_stage_key TEXT NOT NULL,
      target INTEGER NOT NULL,
      raised INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS case_updates (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      date TEXT NOT NULL,
      kind TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      reactions INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS doctor_assignments (
      id TEXT PRIMARY KEY,
      doctor_id TEXT NOT NULL,
      case_id TEXT NOT NULL,
      stage_key TEXT,
      note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
      UNIQUE (doctor_id, case_id, stage_key)
    );

    CREATE TABLE IF NOT EXISTS clinics (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT NOT NULL,
      stage TEXT NOT NULL,
      specialization TEXT NOT NULL,
      rating REAL NOT NULL,
      reviews INTEGER NOT NULL,
      price_from INTEGER NOT NULL,
      description TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_cases_patient_id ON cases(patient_id);
    CREATE INDEX IF NOT EXISTS idx_stages_case_id ON stages(case_id);
    CREATE INDEX IF NOT EXISTS idx_updates_case_id ON case_updates(case_id);
    CREATE INDEX IF NOT EXISTS idx_assignments_case ON doctor_assignments(case_id);
    CREATE INDEX IF NOT EXISTS idx_assignments_doctor ON doctor_assignments(doctor_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
  `);
}

function seedUsers(db: Database.Database): DbUserSeed[] {
  const existingUsers = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (existingUsers.count > 0) {
    const rows = db
      .prepare(
        "SELECT id, full_name as fullName, email, role, city FROM users WHERE email IN (?, ?, ?)",
      )
      .all(DEMO_CREDENTIALS.patient.email, DEMO_CREDENTIALS.doctor.email, DEMO_CREDENTIALS.admin.email) as Array<{
      id: string;
      fullName: string;
      email: string;
      role: UserRole;
      city: string;
    }>;

    return rows.map((row) => ({ ...row, password: "" }));
  }

  const now = new Date().toISOString();
  const seeds: DbUserSeed[] = [
    {
      id: randomUUID(),
      fullName: "Пациент Demo",
      email: DEMO_CREDENTIALS.patient.email,
      role: "patient",
      city: "Казань",
      password: DEMO_CREDENTIALS.patient.password,
    },
    {
      id: randomUUID(),
      fullName: "Илья Рощин",
      email: DEMO_CREDENTIALS.doctor.email,
      role: "doctor",
      city: "Москва",
      password: DEMO_CREDENTIALS.doctor.password,
    },
    {
      id: randomUUID(),
      fullName: "Администратор MedRoute",
      email: DEMO_CREDENTIALS.admin.email,
      role: "admin",
      city: "Москва",
      password: DEMO_CREDENTIALS.admin.password,
    },
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (id, full_name, email, role, city, password_hash, created_at)
    VALUES (@id, @fullName, @email, @role, @city, @passwordHash, @createdAt)
  `);

  const insertMany = db.transaction((items: DbUserSeed[]) => {
    for (const item of items) {
      insertUser.run({
        id: item.id,
        fullName: item.fullName,
        email: item.email,
        role: item.role,
        city: item.city,
        passwordHash: hashPassword(item.password),
        createdAt: now,
      });
    }
  });

  insertMany(seeds);
  return seeds;
}

function seedClinics(db: Database.Database) {
  const existing = db.prepare("SELECT COUNT(*) as count FROM clinics").get() as { count: number };
  if (existing.count > 0) {
    return;
  }

  const clinics = [
    {
      id: randomUUID(),
      name: "НМИЦ онкологии им. Н.Н. Блохина",
      city: "Москва",
      country: "Россия",
      stage: "Диагностика",
      specialization: "Комплексная онкодиагностика",
      rating: 4.9,
      reviews: 420,
      price_from: 95_000,
      description: "Полный диагностический цикл и подготовка к консилиуму.",
    },
    {
      id: randomUUID(),
      name: "Европейская клиника",
      city: "Москва",
      country: "Россия",
      stage: "Консилиум",
      specialization: "Онкологический консилиум и второе мнение",
      rating: 4.8,
      reviews: 210,
      price_from: 48_000,
      description: "Консилиум с профильными онкологами по сложным диагнозам.",
    },
    {
      id: randomUUID(),
      name: "НМХЦ им. Пирогова",
      city: "Москва",
      country: "Россия",
      stage: "Операция",
      specialization: "Онкохирургия и послеоперационное ведение",
      rating: 4.7,
      reviews: 268,
      price_from: 340_000,
      description: "Хирургические этапы с протоколом быстрого восстановления.",
    },
    {
      id: randomUUID(),
      name: "Sourasky Medical Center",
      city: "Тель-Авив",
      country: "Израиль",
      stage: "Терапия",
      specialization: "Системная терапия по международным протоколам",
      rating: 4.8,
      reviews: 199,
      price_from: 520_000,
      description: "Онкологическая системная терапия по международным стандартам.",
    },
    {
      id: randomUUID(),
      name: "Три сестры",
      city: "Москва",
      country: "Россия",
      stage: "Реабилитация",
      specialization: "Онкореабилитация и контроль восстановления",
      rating: 4.8,
      reviews: 141,
      price_from: 135_000,
      description: "Реабилитационный контур для возврата к активной жизни.",
    },
    {
      id: randomUUID(),
      name: "Acibadem Oncology Center",
      city: "Стамбул",
      country: "Турция",
      stage: "Диагностика",
      specialization: "Уточняющая диагностика и маршрутизация",
      rating: 4.7,
      reviews: 186,
      price_from: 125_000,
      description: "Уточнение диагноза и подбор тактики лечения.",
    },
  ];

  const insert = db.prepare(`
    INSERT INTO clinics (id, name, city, country, stage, specialization, rating, reviews, price_from, description)
    VALUES (@id, @name, @city, @country, @stage, @specialization, @rating, @reviews, @price_from, @description)
  `);

  const tx = db.transaction(() => {
    for (const clinic of clinics) {
      insert.run(clinic);
    }
  });

  tx();
}

function seedDemoCase(db: Database.Database, patientId: string, doctorId: string) {
  const existingCase = db.prepare("SELECT id FROM cases WHERE id = ?").get("case-demo-onco") as
    | { id: string }
    | undefined;

  if (existingCase) {
    return;
  }

  const now = new Date().toISOString();
  const roadmap = makeBaseRoadmap("Аденокарцинома ободочной кишки IIIB стадия");

  const insertCase = db.prepare(`
    INSERT INTO cases (
      id, slug, patient_id, patient_name, age, city, diagnosis, current_state,
      completed_actions, documents, summary, is_verified, created_at, updated_at
    ) VALUES (
      @id, @slug, @patientId, @patientName, @age, @city, @diagnosis, @currentState,
      @completedActions, @documents, @summary, @isVerified, @createdAt, @updatedAt
    )
  `);

  const insertVerification = db.prepare(`
    INSERT INTO verification (
      case_id, documents_are_readable, diagnosis_matches_documents, patient_identity_confirmed,
      fundraising_goal_validated, reviewed_by, reviewed_at
    ) VALUES (
      @caseId, @documentsAreReadable, @diagnosisMatchesDocuments, @patientIdentityConfirmed,
      @fundraisingGoalValidated, @reviewedBy, @reviewedAt
    )
  `);

  const insertStage = db.prepare(`
    INSERT INTO stages (
      id, case_id, stage_key, sort_order, title, description, duration,
      criticality, status, cost_min, cost_max
    ) VALUES (
      @id, @caseId, @stageKey, @sortOrder, @title, @description, @duration,
      @criticality, @status, @costMin, @costMax
    )
  `);

  const insertStageClinic = db.prepare(`
    INSERT INTO stage_clinics (id, stage_id, name, country, specialization, estimated_cost, rating, reviews)
    VALUES (@id, @stageId, @name, @country, @specialization, @estimatedCost, @rating, @reviews)
  `);

  const insertStageDoctor = db.prepare(`
    INSERT INTO stage_doctors (
      id, stage_id, full_name, role, clinic_name, experience_years, rating, focus
    ) VALUES (
      @id, @stageId, @fullName, @role, @clinicName, @experienceYears, @rating, @focus
    )
  `);

  const insertFundraising = db.prepare(
    "INSERT INTO fundraising (case_id, current_stage_key, target, raised) VALUES (?, ?, ?, ?)",
  );

  const insertUpdate = db.prepare(`
    INSERT INTO case_updates (id, case_id, date, kind, title, body, reactions, created_at)
    VALUES (@id, @caseId, @date, @kind, @title, @body, @reactions, @createdAt)
  `);

  const insertAssignment = db.prepare(`
    INSERT INTO doctor_assignments (id, doctor_id, case_id, stage_key, note, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    insertCase.run({
      id: "case-demo-onco",
      slug: "aleksei-kazantsev-onco-route",
      patientId,
      patientName: "Алексей Казанцев",
      age: 43,
      city: "Казань",
      diagnosis: "Аденокарцинома ободочной кишки IIIB стадия",
      currentState: "После биопсии, требуется консилиум и старт системной терапии",
      completedActions: JSON.stringify(["Биопсия", "КТ брюшной полости", "Первичный прием онколога"]),
      documents: JSON.stringify(["Выписка_12_04_2026.pdf", "Гистология_05_04_2026.pdf"]),
      summary: buildPrimarySummary({
        diagnosis: "Аденокарцинома ободочной кишки IIIB стадия",
        currentState: "После биопсии, требуется консилиум и старт системной терапии",
        city: "Казань",
      }),
      isVerified: 1,
      createdAt: "2026-04-18T09:20:00.000Z",
      updatedAt: now,
    });

    insertVerification.run({
      caseId: "case-demo-onco",
      documentsAreReadable: 1,
      diagnosisMatchesDocuments: 1,
      patientIdentityConfirmed: 1,
      fundraisingGoalValidated: 1,
      reviewedBy: "Модератор Анна К.",
      reviewedAt: "2026-04-20",
    });

    roadmap.forEach((stage, index) => {
      const stageRowId = `stage-${randomUUID()}`;

      insertStage.run({
        id: stageRowId,
        caseId: "case-demo-onco",
        stageKey: stage.id,
        sortOrder: index,
        title: stage.title,
        description: stage.description,
        duration: stage.duration,
        criticality: stage.criticality,
        status: stage.status,
        costMin: stage.costMin,
        costMax: stage.costMax,
      });

      stage.clinics.forEach((clinic) => {
        insertStageClinic.run({
          id: randomUUID(),
          stageId: stageRowId,
          name: clinic.name,
          country: clinic.country,
          specialization: clinic.specialization,
          estimatedCost: clinic.estimatedCost,
          rating: clinic.rating,
          reviews: clinic.reviews,
        });
      });

      stage.doctors.forEach((doctor) => {
        insertStageDoctor.run({
          id: randomUUID(),
          stageId: stageRowId,
          fullName: doctor.fullName,
          role: doctor.role,
          clinicName: doctor.clinicName,
          experienceYears: doctor.experienceYears,
          rating: doctor.rating,
          focus: doctor.focus,
        });
      });
    });

    insertFundraising.run("case-demo-onco", "surgery", 420_000, 186_000);

    [
      {
        id: "up-1",
        date: "2026-04-19",
        kind: "treatment-started",
        title: "Получено второе мнение",
        body: "Подтверждено, что можно начинать химиотерапию в ближайшие 5 дней.",
        reactions: 34,
      },
      {
        id: "up-2",
        date: "2026-04-20",
        kind: "plan-adjusted",
        title: "Согласован план операции",
        body: "Хирургический этап запланирован после 6 курсов, сейчас собираем средства именно на этот этап.",
        reactions: 49,
      },
      {
        id: "up-3",
        date: "2026-04-21",
        kind: "stage-completed",
        title: "Завершили этап диагностики",
        body: "Диагностический этап закрыт, переходим к консилиуму и финальному подтверждению тактики лечения.",
        reactions: 57,
      },
    ].forEach((update) => {
      insertUpdate.run({
        ...update,
        caseId: "case-demo-onco",
        createdAt: now,
      });
    });

    insertAssignment.run(
      randomUUID(),
      doctorId,
      "case-demo-onco",
      "consultation",
      "Ведущий врач по консилиуму и хирургическому этапу",
      now,
    );
  });

  tx();
}

function seedDatabase(db: Database.Database) {
  const seeds = seedUsers(db);
  const patient = seeds.find((item) => item.role === "patient");
  const doctor = seeds.find((item) => item.role === "doctor");

  if (patient && doctor) {
    seedDemoCase(db, patient.id, doctor.id);
  }

  seedClinics(db);
}

function createConnection(): Database.Database {
  mkdirSync(dirname(DB_PATH), { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");

  initSchema(db);
  seedDatabase(db);

  return db;
}

export function getDb(): Database.Database {
  if (!globalThis.__medrouteDb) {
    globalThis.__medrouteDb = createConnection();
  }

  return globalThis.__medrouteDb;
}
