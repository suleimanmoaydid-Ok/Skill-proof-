import { DEMO_CANDIDATES, INITIAL_STATE } from "../data/demoData";
import { CandidateAccount, SkillProofState } from "../types/skillproof";

const STORAGE_KEY = "skillproof_mvp_state_v1";

export function loadSkillProofState(): SkillProofState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_STATE;
    }
    const parsed = JSON.parse(raw) as Partial<SkillProofState>;
    if (!parsed || !Array.isArray(parsed.candidates) || parsed.candidates.length === 0) {
      return INITIAL_STATE;
    }
    const activeExists = parsed.candidates.some((c) => c.id === parsed.activeCandidateId);
    return {
      activeCandidateId: activeExists ? (parsed.activeCandidateId as string) : parsed.candidates[0].id,
      candidates: parsed.candidates,
      activeRole: parsed.activeRole === "assessor" ? "assessor" : "candidate",
      activeSection: parsed.activeSection || "overview",
      preferSimulatedAnalysis: Boolean(parsed.preferSimulatedAnalysis),
    };
  } catch {
    return INITIAL_STATE;
  }
}

export function saveSkillProofState(state: SkillProofState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function resetSkillProofState(): SkillProofState {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
  return {
    ...INITIAL_STATE,
    candidates: structuredClone(DEMO_CANDIDATES),
  };
}

export interface JourneyStepStatus {
  id: number;
  label: string;
  completed: boolean;
  section: SkillProofState["activeSection"];
}

export function calculateCandidateJourney(candidate: CandidateAccount): {
  steps: JourneyStepStatus[];
  completedCount: number;
  percentage: number;
} {
  const hasProfile =
    candidate.profile.fullName.trim().length > 0 &&
    candidate.profile.headline.trim().length > 0 &&
    candidate.profile.bio.trim().length > 0;
  const hasQualification = candidate.qualifications.length > 0;
  const hasSkills = candidate.skills.length > 0;
  const hasProject = candidate.projects.length > 0;
  const hasRepoOrEvidence = candidate.projects.some(
    (p) => p.githubUrl.trim().length > 0 || p.supportingEvidence.trim().length > 0
  );
  const hasEvidenceAnalysis = candidate.evidenceAnalyses.length > 0;
  const hasAssessment = candidate.assessments.length > 0;
  const hasGapsViewed =
    hasEvidenceAnalysis || candidate.assessments.some((a) => a.identifiedGaps.length > 0);
  const hasBridging = candidate.bridgingPathways.length > 0;
  const hasPassportReady = hasProfile && (hasSkills || hasProject || hasQualification);

  const steps: JourneyStepStatus[] = [
    { id: 1, label: "Enter demo or personal account", completed: true, section: "overview" },
    { id: 2, label: "Complete professional profile", completed: hasProfile, section: "profile" },
    { id: 3, label: "Add academic or trade qualifications", completed: hasQualification, section: "qualifications" },
    { id: 4, label: "Add professional skills", completed: hasSkills, section: "skills" },
    { id: 5, label: "Submit project in Showcase", completed: hasProject, section: "projects" },
    { id: 6, label: "Attach GitHub URL or evidence notes", completed: hasRepoOrEvidence, section: "projects" },
    { id: 7, label: "Review AI-assisted competency analysis", completed: hasEvidenceAnalysis, section: "evidence" },
    { id: 8, label: "Complete a skills assessment", completed: hasAssessment, section: "assessment" },
    { id: 9, label: "Inspect evidence & competency gaps", completed: hasGapsViewed, section: "evidence" },
    { id: 10, label: "Review credential recognition guidance", completed: hasQualification, section: "credential-mapper" },
    { id: 11, label: "Review bridging pathway options", completed: hasBridging, section: "bridging" },
    { id: 12, label: "View digital SkillProof Passport", completed: hasPassportReady, section: "passport" },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const percentage = Math.round((completedCount / steps.length) * 100);
  return { steps, completedCount, percentage };
}
