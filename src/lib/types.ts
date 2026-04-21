export type StageCriticality = "high" | "medium" | "low";
export type StageStatus = "planned" | "in-progress" | "done";
export type UserRole = "patient" | "doctor" | "admin";

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  city: string;
  createdAt: string;
}

export interface ClinicOption {
  id: string;
  name: string;
  country: string;
  specialization: string;
  estimatedCost: number;
  rating: number;
  reviews: number;
}

export interface DoctorOption {
  id: string;
  fullName: string;
  role: string;
  clinicName: string;
  experienceYears: number;
  rating: number;
  focus: string;
}

export interface TreatmentStage {
  id: string;
  title: string;
  description: string;
  duration: string;
  criticality: StageCriticality;
  status: StageStatus;
  costMin: number;
  costMax: number;
  clinics: ClinicOption[];
  doctors: DoctorOption[];
}

export interface CostEstimation {
  min: number;
  optimal: number;
  max: number;
  byStage: Array<{
    stageId: string;
    title: string;
    amount: number;
  }>;
}

export interface CaseUpdate {
  id: string;
  date: string;
  kind: "stage-completed" | "treatment-started" | "plan-adjusted" | "general";
  title: string;
  body: string;
  reactions: number;
}

export interface FundraisingState {
  currentStageId: string;
  target: number;
  raised: number;
}

export interface VerificationChecklist {
  documentsAreReadable: boolean;
  diagnosisMatchesDocuments: boolean;
  patientIdentityConfirmed: boolean;
  fundraisingGoalValidated: boolean;
  reviewedBy: string;
  reviewedAt: string;
}

export interface PatientCase {
  id: string;
  slug: string;
  patientId: string;
  patientName: string;
  age: number;
  city: string;
  diagnosis: string;
  currentState: string;
  completedActions: string[];
  documents: string[];
  summary: string;
  roadmap: TreatmentStage[];
  costEstimation: CostEstimation;
  fundraising: FundraisingState;
  isVerified: boolean;
  verificationChecklist: VerificationChecklist;
  createdAt: string;
  updates: CaseUpdate[];
}

export interface CreateCaseInput {
  patientName: string;
  age: number;
  city: string;
  diagnosis: string;
  currentState: string;
  completedActions: string;
  documentNames: string[];
}

export interface ClinicDirectoryEntry {
  id: string;
  name: string;
  city: string;
  country: string;
  stage: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  description: string;
}
