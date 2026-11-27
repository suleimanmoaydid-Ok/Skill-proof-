export type SkillStatus =
  | "self-reported"
  | "evidence-submitted"
  | "ai-suggested"
  | "pending-human-assessment"
  | "human-assessed"
  | "verified-organisation";

export type QualificationStatus =
  | "unverified"
  | "documentation-incomplete"
  | "submitted-for-review"
  | "assessment-recommended"
  | "verified-by-authority";

export type HumanAssessorDecisionStatus =
  | "pending-review"
  | "needs-more-evidence"
  | "human-assessed-confirmed"
  | "recommended-for-authority-verification"
  | "verified-by-authorised-organisation";

export type BridgingProgressStatus = "not-started" | "in-progress" | "completed";
export type ReferralStatus = "not-requested" | "referral-drafted" | "pending-partner-review";

export type DashboardSection =
  | "overview"
  | "profile"
  | "qualifications"
  | "skills"
  | "projects"
  | "evidence"
  | "assessment"
  | "credential-mapper"
  | "bridging"
  | "passport"
  | "settings";

export interface CandidateProfile {
  fullName: string;
  headline: string;
  bio: string;
  originCountry: string;
  currentCountry: string;
  languages: string[];
  targetSector: string;
  avatarUrl: string;
  email: string;
  availabilityNote: string;
}

export interface WorkExperienceRecord {
  id: string;
  roleTitle: string;
  organisation: string;
  country: string;
  startYear: string;
  endYear: string;
  summary: string;
}

export interface QualificationRecord {
  id: string;
  title: string;
  institution: string;
  countryOfAward: string;
  yearOfCompletion: string;
  qualificationLevel: string;
  supportingDocuments: string;
  missingDocumentsNote: string;
  verificationStatus: QualificationStatus;
  isDemoData?: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  proficiencyContext: string;
  status: SkillStatus;
  linkedProjectIds: string[];
  linkedQualificationIds: string[];
  evidenceSummary: string;
  lastUpdated: string;
  isDemoData?: boolean;
}

export interface ProjectShowcase {
  id: string;
  title: string;
  description: string;
  problemAddressed: string;
  solutionDeveloped: string;
  technologies: string[];
  roleAndContributions: string;
  githubUrl: string;
  liveDemoUrl: string;
  coverImageUrl: string;
  skillsDemonstrated: string[];
  completionDate: string;
  supportingEvidence: string;
  analysisStatus: "not-analyzed" | "simulated-demo-analysis" | "live-ai-analysis";
  humanAssessmentStatus: "not-submitted" | "pending-human-assessment" | "human-assessed" | "verified-organisation";
  isDemoData?: boolean;
}

export interface EvidenceAnalysisItem {
  id: string;
  skillId?: string;
  projectId: string;
  skillName: string;
  category: string;
  supportingEvidence: string;
  explanation: string;
  evidenceLimitations: string;
  recommendedAssessment: string;
  recommendedNextStep: string;
  analysisSource: "simulated-demo" | "live-gemini-ai";
  assessmentStatus: SkillStatus;
  humanDecision: {
    status: HumanAssessorDecisionStatus;
    assessorName: string;
    assessorOrganisation: string;
    reviewNotes: string;
    decidedAt: string;
  };
}

export interface AssessmentAnswerRecord {
  questionId: string;
  questionPrompt: string;
  selectedOption: string;
  isCorrect: boolean;
  competencyTag: string;
}

export interface AssessmentReport {
  id: string;
  title: string;
  domain: string;
  completedAt: string;
  isSampleDemo: boolean;
  score: number;
  maxScore: number;
  status: "sample-completed" | "submitted-for-human-review" | "human-reviewed";
  competencyObservations: string[];
  identifiedGaps: string[];
  answers: AssessmentAnswerRecord[];
}

export interface BridgingRecommendation {
  id: string;
  competencyGap: string;
  recommendedLearningArea: string;
  suggestedCourse: string;
  assessmentOpportunity: string;
  certificationPathway: string;
  progress: BridgingProgressStatus;
  referralStatus: ReferralStatus;
  notes: string;
  isDemoData?: boolean;
}

export interface CandidateAccount {
  id: string;
  isDemoAccount: boolean;
  demoLabel?: string;
  passportId: string;
  createdAt: string;
  profile: CandidateProfile;
  workExperience: WorkExperienceRecord[];
  qualifications: QualificationRecord[];
  skills: SkillItem[];
  projects: ProjectShowcase[];
  evidenceAnalyses: EvidenceAnalysisItem[];
  assessments: AssessmentReport[];
  bridgingPathways: BridgingRecommendation[];
}

export interface SkillProofState {
  activeCandidateId: string;
  candidates: CandidateAccount[];
  activeRole: "candidate" | "assessor";
  activeSection: DashboardSection;
  preferSimulatedAnalysis: boolean;
}
