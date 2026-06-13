export interface ComplianceAuditLog {
  timestamp: string;
  action: string;
  performedBy: string;
  details: string;
}

export interface EvaluationObjective {
  must_have: string[];
  min_years_experience: number;
  minimum_education: string;
  custom_attributes: string[];
}

export interface Job {
  id: string;
  organizationId: string;
  title: string;
  department: string;
  location: string;
  description: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  evaluationObjectives: EvaluationObjective;
  screeningQuestions?: string[];
  matchAlertThreshold?: number; // Configurable per-job match alert threshold
  createdAt: string;
}

export interface Candidate {
  id: string;
  organizationId: string;
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  resumeFileName: string;
  resumeText: string;
  sourceType: "Upload" | "CyberCafePortal";
  aiScore: number | null;
  aiAnalysis: {
    strengths: string[];
    gaps: string[];
    experienceRating: string;
    skillsMatched: string[];
    recommendations: string;
    auditLogs: ComplianceAuditLog[];
  } | null;
  screeningAnswers?: { question: string; answer: string }[];
  blitzScore?: number | null; // Anti-CV Fraud Technical Blitz Score
  blitzFeedback?: string; // Feedback from Gemini on their technical blitz
  blitzTranscript?: { question: string; answer: string; score?: number; critique?: string }[];
  isErased?: boolean; // Section 40 complete erasure state
  status: "Applied" | "Reviewing" | "Shortlisted" | "Rejected";
  createdAt: string;
}

export interface RecruiterEmailAlert {
  id: string;
  recipientEmail: string;
  candidateName: string;
  jobTitle: string;
  score: number;
  subject: string;
  body: string;
  sentAt: string;
}

export interface InVoice {
  id: string;
  accountNo: string;
  amount: number;
  description: string;
  status: "PENDING" | "PAID";
  createdAt: string;
}

export interface TenantConfig {
  id: string;
  name: string;
  slug: string;
  email?: string;
  billingPlan: "pay_as_you_go" | "standard" | "premium";
  hasActiveSubscription: boolean;
  mpesaTillNo: string;
  mpesaShortCode: string;
}

export interface UserActivityLog {
  id: string;
  timestamp: string;
  ip: string;
  tenantSlug: string;
  actor: string;
  action: string;
  details: string;
}
