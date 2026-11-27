import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Loader2,
  Plus,
  Send,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CandidateAccount, EvidenceAnalysisItem, SkillItem } from "../../types/skillproof";
import { generateSimulatedProjectAnalysis } from "../../utils/simulatedAnalysis";
import { SkillStatusBadge } from "../common/StatusIndicator";

interface EvidenceEngineSectionProps {
  candidate: CandidateAccount;
  initialProjectId?: string | null;
  onUpdateCandidate: (updated: CandidateAccount) => void;
  onGoToAssessment: () => void;
}

export function EvidenceEngineSection({
  candidate,
  initialProjectId,
  onUpdateCandidate,
  onGoToAssessment,
}: EvidenceEngineSectionProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || candidate.projects[0]?.id || ""
  );
  const [aiStatus, setAiStatus] = useState<{ configured: boolean; provider: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "info" | "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (initialProjectId) {
      setSelectedProjectId(initialProjectId);
    }
  }, [initialProjectId]);

  useEffect(() => {
    fetch("/api/ai-status")
      .then((res) => res.json())
      .then((data) => setAiStatus(data))
      .catch(() => setAiStatus({ configured: false, provider: "demonstration-simulation" }));
  }, []);

  const activeProject =
    candidate.projects.find((p) => p.id === selectedProjectId) || candidate.projects[0];

  async function runAnalysis(mode: "live" | "simulated") {
    if (!activeProject) {
      setStatusMessage({
        type: "error",
        text: "Add a project in My Project Showcase before running evidence analysis.",
      });
      return;
    }

    setIsAnalyzing(true);
    setStatusMessage(null);

    if (mode === "simulated") {
      const result = generateSimulatedProjectAnalysis(activeProject, candidate.skills);
      const remainingOthers = candidate.evidenceAnalyses.filter(
        (e) => e.projectId !== activeProject.id
      );
      onUpdateCandidate({
        ...candidate,
        projects: candidate.projects.map((p) =>
          p.id === activeProject.id ? { ...p, analysisStatus: "simulated-demo-analysis" } : p
        ),
        evidenceAnalyses: [...remainingOthers, ...result.competencies],
      });
      setIsAnalyzing(false);
      setStatusMessage({
        type: "info",
        text: "Simulated demonstration analysis generated strictly from submitted project text. All suggestions remain AI-suggested until reviewed by a human assessor.",
      });
      return;
    }

    try {
      const response = await fetch("/api/analyze-evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: activeProject,
          skills: candidate.skills,
          qualifications: candidate.qualifications,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Live AI evidence analysis failed.");
      }

      const mapped: EvidenceAnalysisItem[] = (payload.competencies || []).map(
        (
          item: {
            skillName: string;
            category: string;
            supportingEvidence: string;
            explanation: string;
            evidenceLimitations: string;
            recommendedAssessment: string;
            recommendedNextStep: string;
          },
          idx: number
        ) => {
          const matchedSkill = candidate.skills.find(
            (s) => s.name.toLowerCase() === item.skillName.toLowerCase()
          );
          return {
            id: `ev-ai-${activeProject.id}-${idx}-${Date.now()}`,
            skillId: matchedSkill?.id,
            projectId: activeProject.id,
            skillName: item.skillName,
            category: item.category || "Technical Competency",
            supportingEvidence: item.supportingEvidence,
            explanation: item.explanation,
            evidenceLimitations: item.evidenceLimitations,
            recommendedAssessment: item.recommendedAssessment,
            recommendedNextStep: item.recommendedNextStep,
            analysisSource: "live-gemini-ai",
            assessmentStatus:
              matchedSkill &&
              (matchedSkill.status === "human-assessed" ||
                matchedSkill.status === "verified-organisation")
                ? matchedSkill.status
                : "ai-suggested",
            humanDecision: {
              status: "pending-review",
              assessorName: "",
              assessorOrganisation: "",
              reviewNotes: "",
              decidedAt: "",
            },
          };
        }
      );

      const remainingOthers = candidate.evidenceAnalyses.filter(
        (e) => e.projectId !== activeProject.id
      );
      onUpdateCandidate({
        ...candidate,
        projects: candidate.projects.map((p) =>
          p.id === activeProject.id ? { ...p, analysisStatus: "live-ai-analysis" } : p
        ),
        evidenceAnalyses: [...remainingOthers, ...mapped],
      });
      setStatusMessage({
        type: "success",
        text:
          payload.analysisNote ||
          "Live AI-assisted interpretation completed. All outputs remain advisory until reviewed by a human assessor.",
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Could not complete live AI analysis. You may run Simulated Demonstration Mode instead.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleAdoptSkill(item: EvidenceAnalysisItem) {
    const alreadyExists = candidate.skills.some(
      (s) => s.name.toLowerCase() === item.skillName.toLowerCase()
    );
    if (alreadyExists) {
      setStatusMessage({
        type: "info",
        text: `"${item.skillName}" is already tracked in My Skills.`,
      });
      return;
    }
    const created: SkillItem = {
      id: `skill-${Date.now()}`,
      name: item.skillName,
      category: item.category,
      proficiencyContext: "Extracted from submitted project evidence.",
      status: "ai-suggested",
      linkedProjectIds: [item.projectId],
      linkedQualificationIds: [],
      evidenceSummary: item.supportingEvidence,
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
    onUpdateCandidate({
      ...candidate,
      skills: [...candidate.skills, created],
      evidenceAnalyses: candidate.evidenceAnalyses.map((e) =>
        e.id === item.id ? { ...e, skillId: created.id } : e
      ),
    });
    setStatusMessage({
      type: "success",
      text: `Added "${item.skillName}" to My Skills as AI-Suggested (Unverified).`,
    });
  }

  function handleSubmitForHumanReview(item: EvidenceAnalysisItem) {
    onUpdateCandidate({
      ...candidate,
      evidenceAnalyses: candidate.evidenceAnalyses.map((e) =>
        e.id === item.id ? { ...e, assessmentStatus: "pending-human-assessment" } : e
      ),
      skills: candidate.skills.map((s) =>
        s.id === item.skillId || s.name.toLowerCase() === item.skillName.toLowerCase()
          ? {
              ...s,
              status: "pending-human-assessment",
              lastUpdated: new Date().toISOString().slice(0, 10),
            }
          : s
      ),
      projects: candidate.projects.map((p) =>
        p.id === item.projectId && p.humanAssessmentStatus === "not-submitted"
          ? { ...p, humanAssessmentStatus: "pending-human-assessment" }
          : p
      ),
    });
    setStatusMessage({
      type: "success",
      text: `"${item.skillName}" queued for human assessor review.`,
    });
  }

  const displayedAnalyses = activeProject
    ? candidate.evidenceAnalyses.filter((e) => e.projectId === activeProject.id)
    : candidate.evidenceAnalyses;

  return (
    <div className="space-y-8">
      {/* Control Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              Central Innovation · Evidence-to-Skills Engine
            </p>
            <h2 className="font-display text-xl font-bold text-navy-900">
              Evidence-Based Competency Interpretation
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Connects claimed skills, project evidence, AI-assisted explanations, explicit
              limitations, and human assessor decisions—never claiming official verification from
              AI alone.
            </p>
          </div>

          <div className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 shrink-0">
            <p className="font-semibold text-navy-900">Analysis Engine Mode</p>
            <p className="text-slate-600 mt-0.5">
              {aiStatus?.configured
                ? "Live Gemini AI available + Demonstration Mode"
                : "Demonstration Mode (Simulated Analysis)"}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="flex-1 max-w-md">
            <label htmlFor="evProjSelect" className="block text-xs font-semibold text-navy-900 mb-1">
              Select Showcase Project to Analyse
            </label>
            <select
              id="evProjSelect"
              value={activeProject?.id || ""}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              {candidate.projects.length === 0 && (
                <option value="">No projects submitted yet</option>
              )}
              {candidate.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            {aiStatus?.configured && (
              <button
                type="button"
                disabled={isAnalyzing || !activeProject}
                onClick={() => runAnalysis("live")}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <FileSearch className="w-4 h-4" aria-hidden="true" />
                )}
                <span>Run Live AI Evidence Analysis</span>
              </button>
            )}
            <button
              type="button"
              disabled={isAnalyzing || !activeProject}
              onClick={() => runAnalysis("simulated")}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-teal-900 bg-teal-50 border border-teal-300 rounded-lg hover:bg-teal-100 disabled:opacity-50 cursor-pointer"
            >
              <FileSearch className="w-4 h-4" aria-hidden="true" />
              <span>Run Simulated Demo Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          role="status"
          className={`p-4 rounded-lg border text-sm ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : statusMessage.type === "error"
              ? "bg-red-50 border-red-200 text-red-900"
              : "bg-teal-50 border-teal-200 text-teal-950"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Competency Evidence Chain Cards */}
      {displayedAnalyses.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center">
          <p className="text-sm text-slate-600 mb-3">
            No evidence analysis generated for this project yet. Run an analysis above to inspect
            competency mappings and evidence gaps.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedAnalyses.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
            >
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-mono text-slate-500">
                    {item.category} ·{" "}
                    {item.analysisSource === "live-gemini-ai"
                      ? "Live AI Interpretation (Advisory)"
                      : "Simulated Demonstration Analysis"}
                  </p>
                  <h3 className="font-display text-lg font-bold text-navy-900 mt-0.5">
                    {item.skillName}
                  </h3>
                </div>
                <SkillStatusBadge status={item.assessmentStatus} />
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-navy-900 mb-1">
                      1. Supporting Project / Qualification Evidence
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {item.supportingEvidence}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-navy-900 mb-1">
                      2. AI-Assisted Competency Explanation
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">{item.explanation}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-center gap-2 text-amber-900 mb-1">
                      <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <p className="text-xs font-semibold">3. Evidence Limitations & Gaps</p>
                    </div>
                    <p className="text-xs text-amber-950 leading-relaxed">
                      {item.evidenceLimitations}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-navy-900 mb-1">
                      4. Recommended Assessment & Next Step
                    </p>
                    <p className="text-sm text-slate-700">{item.recommendedAssessment}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.recommendedNextStep}</p>
                  </div>
                </div>
              </div>

              {/* Human Assessor Decision Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-2.5">
                  {item.humanDecision.status === "pending-review" ? (
                    <ShieldAlert
                      className="w-4 h-4 text-slate-500 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  ) : (
                    <UserCheck
                      className="w-4 h-4 text-navy-900 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  )}
                  <div className="text-xs">
                    <p className="font-semibold text-navy-900">
                      Human Assessor Decision:{" "}
                      {item.humanDecision.status.replace(/-/g, " ")}
                    </p>
                    {item.humanDecision.reviewNotes ? (
                      <p className="text-slate-600 mt-0.5">
                        {item.humanDecision.assessorName} ({item.humanDecision.assessorOrganisation}
                        ): "{item.humanDecision.reviewNotes}"
                      </p>
                    ) : (
                      <p className="text-slate-500 mt-0.5">
                        No human assessor decision recorded yet. AI suggestions are never treated as
                        verified.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {!item.skillId && (
                    <button
                      type="button"
                      onClick={() => handleAdoptSkill(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-navy-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Add to My Skills</span>
                    </button>
                  )}
                  {(item.assessmentStatus === "ai-suggested" ||
                    item.assessmentStatus === "evidence-submitted") && (
                    <button
                      type="button"
                      onClick={() => handleSubmitForHumanReview(item)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Request Human Review</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onGoToAssessment}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 cursor-pointer"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Take Sample Assessment</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clarification Banner */}
      <div className="bg-navy-900 text-white rounded-xl p-5 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-slate-200 leading-relaxed">
          <strong>Assessor Separation Guarantee:</strong> Switch to the{" "}
          <strong>Assessor</strong> workspace mode in the left sidebar to see how human assessors
          review these exact evidence packets independently and record verification statuses.
        </p>
      </div>
    </div>
  );
}
