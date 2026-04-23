import { randomUUID } from "node:crypto";

import { buildPrimarySummary, calculateCost, makeBaseRoadmap } from "@/lib/case-templates";
import { getDb } from "@/lib/db";
import {
  DoctorCaseChatThread,
  ClinicDirectoryEntry,
  CreateCaseInput,
  PatientCase,
  StageStatus,
  TreatmentStage,
  UserRole,
} from "@/lib/types";

function resolveMessageKind(params: {
  messageKind: string | null;
  body: string;
}): "comment" | "recommendation" | "alternative-plan" {
  if (params.messageKind === "recommendation" || params.messageKind === "alternative-plan") {
    return params.messageKind;
  }

  if (params.body.startsWith("Рекомендация специалиста:")) {
    return "recommendation";
  }

  if (params.body.startsWith("Альтернативный план лечения:")) {
    return "alternative-plan";
  }

  return "comment";
}

function normalizeMessageBody(params: {
  body: string;
  messageKind: "comment" | "recommendation" | "alternative-plan";
}): string {
  if (params.messageKind === "recommendation" && params.body.startsWith("Рекомендация специалиста:")) {
    return params.body.replace(/^Рекомендация специалиста:\s*/u, "");
  }
  if (params.messageKind === "alternative-plan" && params.body.startsWith("Альтернативный план лечения:")) {
    return params.body.replace(/^Альтернативный план лечения:\s*/u, "");
  }

  return params.body;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function parseStringArray(value: string | null): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item));
    }
    return [];
  } catch {
    return [];
  }
}

type CaseJoinedRow = {
  id: string;
  slug: string;
  patient_id: string;
  patient_name: string;
  direction: string;
  age: number;
  city: string;
  diagnosis: string;
  current_state: string;
  completed_actions: string;
  documents: string;
  summary: string;
  is_verified: number;
  created_at: string;
  current_stage_key: string | null;
  target: number | null;
  raised: number | null;
  documents_are_readable: number | null;
  diagnosis_matches_documents: number | null;
  patient_identity_confirmed: number | null;
  fundraising_goal_validated: number | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
};

type StageRow = {
  stageId: string;
  stageKey: string;
  title: string;
  description: string;
  duration: string;
  criticality: "high" | "medium" | "low";
  status: StageStatus;
  costMin: number;
  costMax: number;
};

function hydrateCase(base: CaseJoinedRow): PatientCase {
  const db = getDb();

  const stages = db
    .prepare(
      `SELECT
        id AS stageId,
        stage_key AS stageKey,
        title,
        description,
        duration,
        criticality,
        status,
        cost_min AS costMin,
        cost_max AS costMax
      FROM stages
      WHERE case_id = ?
      ORDER BY sort_order ASC`,
    )
    .all(base.id) as StageRow[];

  const stageClinics = db
    .prepare(
      `SELECT
        s.stage_key AS stageKey,
        sc.id,
        sc.name,
        sc.country,
        sc.specialization,
        sc.estimated_cost AS estimatedCost,
        sc.rating,
        sc.reviews
      FROM stage_clinics sc
      JOIN stages s ON s.id = sc.stage_id
      WHERE s.case_id = ?`,
    )
    .all(base.id) as Array<{
    stageKey: string;
    id: string;
    name: string;
    country: string;
    specialization: string;
    estimatedCost: number;
    rating: number;
    reviews: number;
  }>;

  const stageDoctors = db
    .prepare(
      `SELECT
        s.stage_key AS stageKey,
        sd.id,
        sd.full_name AS fullName,
        sd.role,
        sd.clinic_name AS clinicName,
        sd.experience_years AS experienceYears,
        sd.rating,
        sd.focus
      FROM stage_doctors sd
      JOIN stages s ON s.id = sd.stage_id
      WHERE s.case_id = ?`,
    )
    .all(base.id) as Array<{
    stageKey: string;
    id: string;
    fullName: string;
    role: string;
    clinicName: string;
    experienceYears: number;
    rating: number;
    focus: string;
  }>;

  const clinicByStage = new Map<string, typeof stageClinics>();
  for (const clinic of stageClinics) {
    const list = clinicByStage.get(clinic.stageKey) ?? [];
    list.push(clinic);
    clinicByStage.set(clinic.stageKey, list);
  }

  const doctorByStage = new Map<string, typeof stageDoctors>();
  for (const doctor of stageDoctors) {
    const list = doctorByStage.get(doctor.stageKey) ?? [];
    list.push(doctor);
    doctorByStage.set(doctor.stageKey, list);
  }

  const roadmap: TreatmentStage[] = stages.map((stage) => ({
    id: stage.stageKey,
    title: stage.title,
    description: stage.description,
    duration: stage.duration,
    criticality: stage.criticality,
    status: stage.status,
    costMin: stage.costMin,
    costMax: stage.costMax,
    clinics: (clinicByStage.get(stage.stageKey) ?? []).map((clinic) => ({
      id: clinic.id,
      name: clinic.name,
      country: clinic.country,
      specialization: clinic.specialization,
      estimatedCost: clinic.estimatedCost,
      rating: clinic.rating,
      reviews: clinic.reviews,
    })),
    doctors: (doctorByStage.get(stage.stageKey) ?? []).map((doctor) => ({
      id: doctor.id,
      fullName: doctor.fullName,
      role: doctor.role,
      clinicName: doctor.clinicName,
      experienceYears: doctor.experienceYears,
      rating: doctor.rating,
      focus: doctor.focus,
    })),
  }));

  const costEstimation = calculateCost(roadmap);

  const updates = db
    .prepare(
      `SELECT
        id,
        date,
        kind,
        title,
        body,
        reactions
      FROM case_updates
      WHERE case_id = ?
      ORDER BY date DESC, created_at DESC`,
    )
    .all(base.id) as PatientCase["updates"];

  return {
    id: base.id,
    slug: base.slug,
    patientId: base.patient_id,
    patientName: base.patient_name,
    direction: base.direction || "Онкология",
    age: base.age,
    city: base.city,
    diagnosis: base.diagnosis,
    currentState: base.current_state,
    completedActions: parseStringArray(base.completed_actions),
    documents: parseStringArray(base.documents),
    summary: base.summary,
    roadmap,
    costEstimation,
    fundraising: {
      currentStageId: base.current_stage_key ?? "diagnostics",
      target: base.target ?? 0,
      raised: base.raised ?? 0,
    },
    isVerified: Boolean(base.is_verified),
    verificationChecklist: {
      documentsAreReadable: Boolean(base.documents_are_readable),
      diagnosisMatchesDocuments: Boolean(base.diagnosis_matches_documents),
      patientIdentityConfirmed: Boolean(base.patient_identity_confirmed),
      fundraisingGoalValidated: Boolean(base.fundraising_goal_validated),
      reviewedBy: base.reviewed_by ?? "Не назначен",
      reviewedAt: base.reviewed_at ?? "Ожидается",
    },
    createdAt: base.created_at,
    updates,
  };
}

function getCaseBase(whereSql: string, values: readonly string[]): CaseJoinedRow | undefined {
  const db = getDb();
  return db
    .prepare(
      `SELECT
        c.*,
        f.current_stage_key,
        f.target,
        f.raised,
        v.documents_are_readable,
        v.diagnosis_matches_documents,
        v.patient_identity_confirmed,
        v.fundraising_goal_validated,
        v.reviewed_by,
        v.reviewed_at
      FROM cases c
      LEFT JOIN fundraising f ON f.case_id = c.id
      LEFT JOIN verification v ON v.case_id = c.id
      WHERE ${whereSql}
      LIMIT 1`,
    )
    .get(...values) as CaseJoinedRow | undefined;
}

function insertCaseGraph(params: {
  id: string;
  slug: string;
  patientId: string;
  patientName: string;
  direction: string;
  age: number;
  city: string;
  diagnosis: string;
  currentState: string;
  completedActions: string[];
  documents: string[];
  summary: string;
  isVerified: boolean;
  roadmap: TreatmentStage[];
  fundraisingTarget: number;
  currentStageId: string;
}) {
  const db = getDb();
  const now = new Date().toISOString();

  const insertCase = db.prepare(`
    INSERT INTO cases (
      id, slug, patient_id, patient_name, direction, age, city, diagnosis, current_state,
      completed_actions, documents, summary, is_verified, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertVerification = db.prepare(`
    INSERT INTO verification (
      case_id, documents_are_readable, diagnosis_matches_documents, patient_identity_confirmed,
      fundraising_goal_validated, reviewed_by, reviewed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertStage = db.prepare(`
    INSERT INTO stages (
      id, case_id, stage_key, sort_order, title, description, duration,
      criticality, status, cost_min, cost_max
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertStageClinic = db.prepare(`
    INSERT INTO stage_clinics (id, stage_id, name, country, specialization, estimated_cost, rating, reviews)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertStageDoctor = db.prepare(`
    INSERT INTO stage_doctors (id, stage_id, full_name, role, clinic_name, experience_years, rating, focus)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertFundraising = db.prepare(
    "INSERT INTO fundraising (case_id, current_stage_key, target, raised) VALUES (?, ?, ?, ?)",
  );

  const insertUpdate = db.prepare(
    "INSERT INTO case_updates (id, case_id, date, kind, title, body, reactions, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  );

  const tx = db.transaction(() => {
    insertCase.run(
      params.id,
      params.slug,
      params.patientId,
      params.patientName,
      params.direction,
      params.age,
      params.city,
      params.diagnosis,
      params.currentState,
      JSON.stringify(params.completedActions),
      JSON.stringify(params.documents),
      params.summary,
      params.isVerified ? 1 : 0,
      now,
      now,
    );

    insertVerification.run(
      params.id,
      0,
      0,
      0,
      0,
      params.isVerified ? "Модератор" : "Не назначен",
      params.isVerified ? now.slice(0, 10) : "Ожидается",
    );

    params.roadmap.forEach((stage, index) => {
      const stageRowId = randomUUID();
      insertStage.run(
        stageRowId,
        params.id,
        stage.id,
        index,
        stage.title,
        stage.description,
        stage.duration,
        stage.criticality,
        stage.status,
        stage.costMin,
        stage.costMax,
      );

      stage.clinics.forEach((clinic) => {
        insertStageClinic.run(
          randomUUID(),
          stageRowId,
          clinic.name,
          clinic.country,
          clinic.specialization,
          clinic.estimatedCost,
          clinic.rating,
          clinic.reviews,
        );
      });

      stage.doctors.forEach((doctor) => {
        insertStageDoctor.run(
          randomUUID(),
          stageRowId,
          doctor.fullName,
          doctor.role,
          doctor.clinicName,
          doctor.experienceYears,
          doctor.rating,
          doctor.focus,
        );
      });
    });

    insertFundraising.run(params.id, params.currentStageId, params.fundraisingTarget, 0);

    insertUpdate.run(
      randomUUID(),
      params.id,
      now.slice(0, 10),
      "general",
      "Кейс создан",
      "Документы загружены и отправлены на ручную верификацию.",
      0,
      now,
    );
  });

  tx();
}

export function listCases(): PatientCase[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT
        c.*,
        f.current_stage_key,
        f.target,
        f.raised,
        v.documents_are_readable,
        v.diagnosis_matches_documents,
        v.patient_identity_confirmed,
        v.fundraising_goal_validated,
        v.reviewed_by,
        v.reviewed_at
      FROM cases c
      LEFT JOIN fundraising f ON f.case_id = c.id
      LEFT JOIN verification v ON v.case_id = c.id
      ORDER BY c.created_at DESC`,
    )
    .all() as CaseJoinedRow[];

  return rows.map((row) => hydrateCase(row));
}

export function listCasesForPatient(patientId: string): PatientCase[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT
        c.*,
        f.current_stage_key,
        f.target,
        f.raised,
        v.documents_are_readable,
        v.diagnosis_matches_documents,
        v.patient_identity_confirmed,
        v.fundraising_goal_validated,
        v.reviewed_by,
        v.reviewed_at
      FROM cases c
      LEFT JOIN fundraising f ON f.case_id = c.id
      LEFT JOIN verification v ON v.case_id = c.id
      WHERE c.patient_id = ?
      ORDER BY c.created_at DESC`,
    )
    .all(patientId) as CaseJoinedRow[];

  return rows.map((row) => hydrateCase(row));
}

export function listAssignedCasesForDoctor(doctorId: string): PatientCase[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT DISTINCT
        c.*,
        f.current_stage_key,
        f.target,
        f.raised,
        v.documents_are_readable,
        v.diagnosis_matches_documents,
        v.patient_identity_confirmed,
        v.fundraising_goal_validated,
        v.reviewed_by,
        v.reviewed_at
      FROM cases c
      JOIN doctor_assignments a ON a.case_id = c.id
      LEFT JOIN fundraising f ON f.case_id = c.id
      LEFT JOIN verification v ON v.case_id = c.id
      WHERE a.doctor_id = ?
      ORDER BY c.created_at DESC`,
    )
    .all(doctorId) as CaseJoinedRow[];

  return rows.map((row) => hydrateCase(row));
}

export function listAvailableCasesForDoctor(doctorId: string): Array<{
  caseData: PatientCase;
  accepted: boolean;
}> {
  const db = getDb();
  const doctor = db
    .prepare("SELECT specialty FROM users WHERE id = ? LIMIT 1")
    .get(doctorId) as { specialty: string } | undefined;

  const specialty = doctor?.specialty?.trim() || "Онкология";
  const rows = db
    .prepare(
      `SELECT
        c.*,
        f.current_stage_key,
        f.target,
        f.raised,
        v.documents_are_readable,
        v.diagnosis_matches_documents,
        v.patient_identity_confirmed,
        v.fundraising_goal_validated,
        v.reviewed_by,
        v.reviewed_at
      FROM cases c
      LEFT JOIN fundraising f ON f.case_id = c.id
      LEFT JOIN verification v ON v.case_id = c.id
      WHERE c.direction = ? OR ? = ''
      ORDER BY c.created_at DESC`,
    )
    .all(specialty, specialty) as CaseJoinedRow[];

  const acceptedCaseIds = new Set(
    (
      db
        .prepare("SELECT case_id AS caseId FROM doctor_case_chats WHERE doctor_id = ?")
        .all(doctorId) as Array<{ caseId: string }>
    ).map((item) => item.caseId),
  );

  return rows.map((row) => ({
    caseData: hydrateCase(row),
    accepted: acceptedCaseIds.has(row.id),
  }));
}

export function getCase(idOrSlug: string): PatientCase | undefined {
  const row = getCaseBase("(c.id = ? OR c.slug = ?)", [idOrSlug, idOrSlug]);
  if (!row) {
    return undefined;
  }

  return hydrateCase(row);
}

export function createCase(input: CreateCaseInput, patientId: string): PatientCase {
  const id = `case-${randomUUID().slice(0, 8)}`;
  const slugBase = slugify(`${input.patientName}-${input.diagnosis}`) || `case-${id}`;
  const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;
  const roadmap = makeBaseRoadmap(input.diagnosis);

  insertCaseGraph({
    id,
    slug,
    patientId,
    patientName: input.patientName,
    direction: "Онкология",
    age: input.age,
    city: input.city,
    diagnosis: input.diagnosis,
    currentState: input.currentState,
    completedActions: input.completedActions
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean),
    documents: input.documentNames,
    summary: "Первичная оценка еще не запускалась. Нажмите «Сформировать первичную оценку» в кабинете кейса.",
    isVerified: false,
    roadmap,
    fundraisingTarget: 410_000,
    currentStageId: "surgery",
  });

  const created = getCase(id);
  if (!created) {
    throw new Error("case-create-failed");
  }

  return created;
}

export function generateAiSummary(id: string): PatientCase | undefined {
  const db = getDb();
  const target = getCase(id);
  if (!target) {
    return undefined;
  }

  const now = new Date();
  db.prepare("UPDATE cases SET summary = ?, updated_at = ? WHERE id = ?").run(
    buildPrimarySummary({
      diagnosis: target.diagnosis,
      currentState: target.currentState,
      city: target.city,
    }),
    now.toISOString(),
    target.id,
  );

  db.prepare(
    "INSERT INTO case_updates (id, case_id, date, kind, title, body, reactions, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(
    randomUUID(),
    target.id,
    now.toISOString().slice(0, 10),
    "plan-adjusted",
    "Первичная оценка обновлена",
    "Сервис упростил медицинский язык и обновил последовательность этапов лечения.",
    0,
    now.toISOString(),
  );

  return getCase(target.id);
}

export function donateToCase(id: string, amount: number): PatientCase | undefined {
  const db = getDb();
  const target = getCase(id);
  if (!target) {
    return undefined;
  }

  const now = new Date();
  db.prepare("UPDATE fundraising SET raised = raised + ? WHERE case_id = ?").run(amount, target.id);

  db.prepare(
    "INSERT INTO case_updates (id, case_id, date, kind, title, body, reactions, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(
    randomUUID(),
    target.id,
    now.toISOString().slice(0, 10),
    "general",
    "Новый перевод",
    `Получено ${new Intl.NumberFormat("ru-RU").format(amount)} ₽ на текущий этап.`,
    0,
    now.toISOString(),
  );

  return getCase(target.id);
}

export function getStageById(caseId: string, stageId: string): TreatmentStage | undefined {
  const target = getCase(caseId);
  return target?.roadmap.find((stage) => stage.id === stageId);
}

export function isDoctorAssignedToCase(doctorId: string, caseId: string): boolean {
  const db = getDb();
  const row = db
    .prepare("SELECT id FROM doctor_assignments WHERE doctor_id = ? AND case_id = ? LIMIT 1")
    .get(doctorId, caseId) as { id: string } | undefined;
  return Boolean(row);
}

export function listCaseAssignments(caseId: string): Array<{
  id: string;
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
  stageKey: string | null;
  note: string;
}> {
  const db = getDb();
  return db
    .prepare(
      `SELECT
        a.id,
        a.doctor_id AS doctorId,
        u.full_name AS doctorName,
        u.email AS doctorEmail,
        a.stage_key AS stageKey,
        a.note
      FROM doctor_assignments a
      JOIN users u ON u.id = a.doctor_id
      WHERE a.case_id = ?
      ORDER BY a.created_at DESC`,
    )
    .all(caseId) as Array<{
    id: string;
    doctorId: string;
    doctorName: string;
    doctorEmail: string;
    stageKey: string | null;
    note: string;
  }>;
}

export function listDoctors(): Array<{ id: string; fullName: string; email: string; city: string }> {
  const db = getDb();
  return db
    .prepare("SELECT id, full_name AS fullName, email, city FROM users WHERE role = 'doctor' ORDER BY full_name ASC")
    .all() as Array<{ id: string; fullName: string; email: string; city: string }>;
}

export function listUsersByRole(role: UserRole): Array<{ id: string; fullName: string; email: string; city: string }> {
  const db = getDb();
  return db
    .prepare("SELECT id, full_name AS fullName, email, city FROM users WHERE role = ? ORDER BY created_at DESC")
    .all(role) as Array<{ id: string; fullName: string; email: string; city: string }>;
}

export function setCaseVerification(params: {
  caseId: string;
  isVerified: boolean;
  reviewedBy: string;
  checklist: {
    documentsAreReadable: boolean;
    diagnosisMatchesDocuments: boolean;
    patientIdentityConfirmed: boolean;
    fundraisingGoalValidated: boolean;
  };
}) {
  const db = getDb();
  const reviewedAt = new Date().toISOString().slice(0, 10);

  const tx = db.transaction(() => {
    db.prepare("UPDATE cases SET is_verified = ?, updated_at = ? WHERE id = ?").run(
      params.isVerified ? 1 : 0,
      new Date().toISOString(),
      params.caseId,
    );

    db.prepare(
      `UPDATE verification SET
        documents_are_readable = ?,
        diagnosis_matches_documents = ?,
        patient_identity_confirmed = ?,
        fundraising_goal_validated = ?,
        reviewed_by = ?,
        reviewed_at = ?
      WHERE case_id = ?`,
    ).run(
      params.checklist.documentsAreReadable ? 1 : 0,
      params.checklist.diagnosisMatchesDocuments ? 1 : 0,
      params.checklist.patientIdentityConfirmed ? 1 : 0,
      params.checklist.fundraisingGoalValidated ? 1 : 0,
      params.reviewedBy,
      reviewedAt,
      params.caseId,
    );

    db.prepare(
      "INSERT INTO case_updates (id, case_id, date, kind, title, body, reactions, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    ).run(
      randomUUID(),
      params.caseId,
      reviewedAt,
      "general",
      params.isVerified ? "Кейс верифицирован" : "Статус верификации изменен",
      params.isVerified
        ? "Документы проверены модератором. Кейс отмечен как проверенный."
        : "Кейс переведен в режим дополнительной проверки.",
      0,
      new Date().toISOString(),
    );
  });

  tx();
}

export function assignDoctorToCase(params: {
  doctorId: string;
  caseId: string;
  stageKey?: string;
  note?: string;
}) {
  const db = getDb();
  db.prepare(
    `INSERT OR IGNORE INTO doctor_assignments (id, doctor_id, case_id, stage_key, note, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(
    randomUUID(),
    params.doctorId,
    params.caseId,
    params.stageKey ?? null,
    params.note ?? "",
    new Date().toISOString(),
  );
}

export function acceptCaseForDoctor(params: { doctorId: string; caseId: string }): string {
  const db = getDb();
  const now = new Date().toISOString();

  const existing = db
    .prepare("SELECT id FROM doctor_case_chats WHERE case_id = ? AND doctor_id = ? LIMIT 1")
    .get(params.caseId, params.doctorId) as { id: string } | undefined;

  if (existing) {
    return existing.id;
  }

  const chatId = randomUUID();

  const tx = db.transaction(() => {
    db.prepare(
      "INSERT OR IGNORE INTO doctor_assignments (id, doctor_id, case_id, stage_key, note, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    ).run(randomUUID(), params.doctorId, params.caseId, "general", "Кейс принят врачом для консультации", now);

    db.prepare("INSERT INTO doctor_case_chats (id, case_id, doctor_id, created_at) VALUES (?, ?, ?, ?)").run(
      chatId,
      params.caseId,
      params.doctorId,
      now,
    );
  });

  tx();
  return chatId;
}

export function listCaseDoctorChats(caseId: string): DoctorCaseChatThread[] {
  const db = getDb();
  const chats = db
    .prepare(
      `SELECT
        c.id,
        c.case_id AS caseId,
        c.doctor_id AS doctorId,
        c.created_at AS createdAt,
        u.full_name AS doctorName,
        u.email AS doctorEmail
      FROM doctor_case_chats c
      JOIN users u ON u.id = c.doctor_id
      WHERE c.case_id = ?
      ORDER BY c.created_at ASC`,
    )
    .all(caseId) as Array<{
    id: string;
    caseId: string;
    doctorId: string;
    createdAt: string;
    doctorName: string;
    doctorEmail: string;
  }>;

  if (chats.length === 0) {
    return [];
  }

  const messages = db
    .prepare(
      `SELECT
        id,
        chat_id AS chatId,
        sender_role AS senderRole,
        message_kind AS messageKind,
        sender_name AS senderName,
        body,
        created_at AS createdAt
      FROM doctor_case_messages
      WHERE chat_id IN (${chats.map(() => "?").join(",")})
      ORDER BY created_at ASC`,
    )
    .all(...chats.map((item) => item.id)) as Array<{
    id: string;
    chatId: string;
    senderRole: "doctor" | "patient";
    messageKind: string | null;
    senderName: string;
    body: string;
    createdAt: string;
  }>;

  const byChat = new Map<string, DoctorCaseChatThread["messages"]>();
  for (const message of messages) {
    const messageKind = resolveMessageKind({
      messageKind: message.messageKind,
      body: message.body,
    });
    const list = byChat.get(message.chatId) ?? [];
    list.push({
      id: message.id,
      senderRole: message.senderRole,
      messageKind,
      senderName: message.senderName,
      body: normalizeMessageBody({ body: message.body, messageKind }),
      createdAt: message.createdAt,
    });
    byChat.set(message.chatId, list);
  }

  return chats.map((chat) => ({
    id: chat.id,
    caseId: chat.caseId,
    doctorId: chat.doctorId,
    doctorName: chat.doctorName,
    doctorEmail: chat.doctorEmail,
    createdAt: chat.createdAt,
    messages: byChat.get(chat.id) ?? [],
  }));
}

export function isDoctorInChat(chatId: string, doctorId: string): boolean {
  const db = getDb();
  const row = db
    .prepare("SELECT id FROM doctor_case_chats WHERE id = ? AND doctor_id = ? LIMIT 1")
    .get(chatId, doctorId) as { id: string } | undefined;
  return Boolean(row);
}

export function isPatientInChat(chatId: string, patientId: string): boolean {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT c.id
       FROM doctor_case_chats c
       JOIN cases p ON p.id = c.case_id
       WHERE c.id = ? AND p.patient_id = ?
       LIMIT 1`,
    )
    .get(chatId, patientId) as { id: string } | undefined;
  return Boolean(row);
}

export function addChatMessage(params: {
  chatId: string;
  senderRole: "doctor" | "patient";
  messageKind?: "comment" | "recommendation" | "alternative-plan";
  senderName: string;
  body: string;
}) {
  const db = getDb();
  db.prepare(
    "INSERT INTO doctor_case_messages (id, chat_id, sender_role, message_kind, sender_name, body, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
  ).run(
    randomUUID(),
    params.chatId,
    params.senderRole,
    params.messageKind ?? "comment",
    params.senderName,
    params.body,
    new Date().toISOString(),
  );
}

export function updateCaseStageStatus(params: {
  caseId: string;
  stageKey: string;
  status: StageStatus;
  actorName: string;
}) {
  const db = getDb();
  const now = new Date();

  db.prepare("UPDATE stages SET status = ? WHERE case_id = ? AND stage_key = ?").run(
    params.status,
    params.caseId,
    params.stageKey,
  );

  db.prepare(
    "INSERT INTO case_updates (id, case_id, date, kind, title, body, reactions, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(
    randomUUID(),
    params.caseId,
    now.toISOString().slice(0, 10),
    params.status === "done" ? "stage-completed" : "plan-adjusted",
    "Статус этапа обновлен",
    `${params.actorName} обновил статус этапа ${params.stageKey} на «${params.status}».`,
    0,
    now.toISOString(),
  );

  db.prepare("UPDATE cases SET updated_at = ? WHERE id = ?").run(now.toISOString(), params.caseId);
}

export function addCaseUpdate(params: {
  caseId: string;
  kind: "stage-completed" | "treatment-started" | "plan-adjusted" | "general";
  title: string;
  body: string;
}) {
  const db = getDb();
  const now = new Date();

  db.prepare(
    "INSERT INTO case_updates (id, case_id, date, kind, title, body, reactions, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(
    randomUUID(),
    params.caseId,
    now.toISOString().slice(0, 10),
    params.kind,
    params.title,
    params.body,
    0,
    now.toISOString(),
  );

  db.prepare("UPDATE cases SET updated_at = ? WHERE id = ?").run(now.toISOString(), params.caseId);
}

export function listClinicDirectory(filters?: {
  query?: string;
  stage?: string;
}): ClinicDirectoryEntry[] {
  const db = getDb();
  const query = (filters?.query ?? "").trim().toLowerCase();
  const stage = (filters?.stage ?? "Все этапы").trim();

  const all = db
    .prepare(
      `SELECT
        id,
        name,
        city,
        country,
        stage,
        specialization,
        rating,
        reviews AS reviewCount,
        price_from AS priceFrom,
        description
      FROM clinics
      ORDER BY rating DESC, reviews DESC`,
    )
    .all() as ClinicDirectoryEntry[];

  return all.filter((clinic) => {
    const matchesStage = stage === "Все этапы" || clinic.stage === stage;
    const haystack = `${clinic.name} ${clinic.city} ${clinic.specialization} ${clinic.country}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    return matchesStage && matchesQuery;
  });
}
