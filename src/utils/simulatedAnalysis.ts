import {
  BridgingRecommendation,
  EvidenceAnalysisItem,
  ProjectShowcase,
  QualificationRecord,
  SkillItem,
} from "../types/skillproof";

export interface CredentialGuidance {
  completenessScore: number;
  missingInformation: string[];
  verificationCheckpoints: string[];
  recognitionPathways: string[];
  bridgingOptions: string[];
  nextSteps: string[];
  disclaimer: string;
}

export function generateSimulatedProjectAnalysis(
  project: ProjectShowcase,
  claimedSkills: SkillItem[]
): {
  summary: string;
  competencies: EvidenceAnalysisItem[];
} {
  const techList = project.technologies.map((t) => t.toLowerCase());
  const textBlob = `${project.title} ${project.description} ${project.problemAddressed} ${project.solutionDeveloped} ${project.roleAndContributions} ${project.supportingEvidence}`.toLowerCase();

  const competencies: EvidenceAnalysisItem[] = [];

  const matchedSkills = claimedSkills.filter((skill) => {
    const tokens = skill.name
      .toLowerCase()
      .split(/[\s,/&]+/)
      .filter((w) => w.length > 2);
    return tokens.some(
      (token) =>
        textBlob.includes(token) || techList.some((tech) => tech.includes(token))
    );
  });

  const baseCandidates =
    matchedSkills.length > 0
      ? matchedSkills.map((s) => ({
          skillId: s.id,
          skillName: s.name,
          category: s.category,
          status: s.status,
        }))
      : project.technologies.slice(0, 3).map((tech) => ({
          skillId: undefined,
          skillName: `${tech} Applied Implementation`,
          category: "Technical Implementation",
          status: "ai-suggested" as const,
        }));

  baseCandidates.forEach((item, index) => {
    const hasRepo = Boolean(project.githubUrl.trim());
    const hasDemo = Boolean(project.liveDemoUrl.trim());
    const evidenceParts = [
      `Project "${project.title}" (${project.completionDate || "date unspecified"})`,
      project.roleAndContributions
        ? `Candidate role: ${project.roleAndContributions.slice(0, 140)}`
        : "",
      project.supportingEvidence
        ? `Evidence notes: ${project.supportingEvidence.slice(0, 140)}`
        : "",
    ].filter(Boolean);

    competencies.push({
      id: `ev-sim-${project.id}-${index}-${Date.now()}`,
      skillId: item.skillId,
      projectId: project.id,
      skillName: item.skillName,
      category: item.category,
      supportingEvidence: evidenceParts.join(" · "),
      explanation: `Submitted project narrative and technology stack (${project.technologies.join(", ") || "unspecified"}) indicate practical application of ${item.skillName} to solve "${project.problemAddressed.slice(0, 100)}".`,
      evidenceLimitations: [
        "Simulated demonstration analysis based solely on candidate-submitted text; external GitHub repository code was not live-fetched or compiled.",
        !hasRepo ? "No repository URL provided for source inspection." : "",
        !hasDemo ? "No live demonstration URL provided for runtime verification." : "",
        "Automated test coverage, code maintainability, and independent authorship require human technical review.",
      ]
        .filter(Boolean)
        .join(" "),
      recommendedAssessment: `Structured 30-minute practical code walkthrough & scenario evaluation covering ${item.skillName}.`,
      recommendedNextStep:
        "Complete the SkillProof sample assessment and submit this project evidence packet for human assessor review.",
      analysisSource: "simulated-demo",
      assessmentStatus: item.status === "human-assessed" || item.status === "verified-organisation" ? item.status : "ai-suggested",
      humanDecision: {
        status: "pending-review",
        assessorName: "",
        assessorOrganisation: "",
        reviewNotes: "",
        decidedAt: "",
      },
    });
  });

  const summary = `Simulated demonstration interpretation of "${project.title}": ${competencies.length} competency area(s) mapped from submitted project documentation (${project.technologies.join(", ") || "general"}). External links have not been automatically inspected; human assessor review is required before formal recognition.`;

  return { summary, competencies };
}

export function generateCredentialGuidance(q: QualificationRecord): CredentialGuidance {
  const missingInformation: string[] = [];
  if (!q.qualificationLevel.trim()) {
    missingInformation.push("Qualification framework level (e.g., EQF Level 6 / Bachelor equivalent) is not recorded.");
  }
  if (!q.supportingDocuments.trim()) {
    missingInformation.push("Supporting document reference (certificate scan, transcript, or syllabus) is missing.");
  }
  if (q.missingDocumentsNote.trim()) {
    missingInformation.push(`Candidate-noted gap: ${q.missingDocumentsNote.trim()}`);
  }
  if (!q.yearOfCompletion.trim()) {
    missingInformation.push("Year of completion is missing.");
  }

  const verificationCheckpoints = [
    `Confirm official institution name and accreditation status of ${q.institution || "awarding institution"} in ${q.countryOfAward || "country of award"}.`,
    "Verify whether certified translations or institutional transcripts can be retrieved, or whether an alternative reconstructed credential pathway applies.",
    "Check whether employer or practical portfolio evidence can supplement missing academic transcripts.",
  ];

  const recognitionPathways = [
    "UNESCO Qualifications Passport (UQP) / Council of Europe European Qualifications Passport for Refugees (EQPR) — designed for candidates with partial or inaccessible documentation.",
    "Host-country ENIC-NARIC academic recognition advisory service for non-binding comparability statements.",
    "Sectoral Recognition of Prior Learning (RPL) combining academic records with verified project portfolios and practical assessments.",
  ];

  const bridgingOptions = [
    "Targeted technical terminology and host-country standards orientation module.",
    "Practical skills verification assessment to establish current applied competency independent of paper transcripts.",
    "Short bridging micro-credential or portfolio review with an accredited training partner.",
  ];

  const nextSteps = [
    missingInformation.length > 0
      ? "Update missing qualification metadata or upload/record available supporting document references."
      : "Submit qualification summary alongside linked project evidence for assessor review.",
    "Link this qualification to your active skills in the My Skills workspace so assessors see academic and practical evidence together.",
    "Consult a qualified national recognition centre (ENIC-NARIC or ILO partner) for formal equivalency decisions.",
  ];

  const totalFields = 6;
  const filledFields = [
    q.title,
    q.institution,
    q.countryOfAward,
    q.yearOfCompletion,
    q.qualificationLevel,
    q.supportingDocuments,
  ].filter((v) => v.trim().length > 0).length;

  return {
    completenessScore: Math.round((filledFields / totalFields) * 100),
    missingInformation,
    verificationCheckpoints,
    recognitionPathways,
    bridgingOptions,
    nextSteps,
    disclaimer:
      "Advisory guidance only. SkillProof does not issue official qualification equivalency or replace authorised national recognition bodies (ENIC-NARIC, ministries, or licensing boards).",
  };
}

export function buildBridgingFromGap(gapTitle: string, domain: string): BridgingRecommendation {
  return {
    id: `bridge-${Date.now()}`,
    competencyGap: gapTitle,
    recommendedLearningArea: `${domain} — Applied Standards & Verification Readiness`,
    suggestedCourse: `Structured RPL & Technical Documentation Workshop (${domain})`,
    assessmentOpportunity: "Peer & Authorised Assessor Practical Portfolio Walkthrough",
    certificationPathway: "Host-Country Recognition of Prior Learning (RPL) Competency Statement (subject to authorised body approval)",
    progress: "not-started",
    referralStatus: "not-requested",
    notes: "Generated from identified evidence or assessment gap. No funding or fee waiver is implied unless confirmed by an external partner.",
  };
}
