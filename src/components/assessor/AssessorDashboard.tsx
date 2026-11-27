import {
  CheckCircle2,
  ExternalLink,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import {
  CandidateAccount,
  HumanAssessorDecisionStatus,
  SkillStatus,
} from "../../types/skillproof";
import { QualificationStatusBadge, SkillStatusBadge } from "../common/StatusIndicator";

interface AssessorDashboardProps {
  candidates: CandidateAccount[];
  onUpdateCandidate: (updated: CandidateAccount) => void;
}

export function AssessorDashboard({ candidates, onUpdateCandidate }: AssessorDashboardProps) {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidates[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "pending">("all");

  // Assessor Decision Form State
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>("");
  const [assessorName, setAssessorName] = useState("Dr. Tariq Haddad (Demo Assessor)");
  const [assessorOrganisation, setAssessorOrganisation] = useState(
    "Regional Skills Recognition Panel (Demo)"
  );
  const [decisionStatus, setDecisionStatus] = useState<HumanAssessorDecisionStatus>(
    "human-assessed-confirmed"
  );
  const [reviewNotes, setReviewNotes] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((cand) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        cand.profile.fullName.toLowerCase().includes(q) ||
        cand.profile.headline.toLowerCase().includes(q) ||
        cand.passportId.toLowerCase().includes(q);
      const hasPending =
        cand.skills.some((s) => s.status === "pending-human-assessment") ||
        cand.evidenceAnalyses.some((e) => e.humanDecision.status === "pending-review");
      return matchesSearch && (filterMode === "all" || hasPending);
    });
  }, [candidates, searchQuery, filterMode]);

  const activeCandidate =
    candidates.find((c) => c.id === selectedCandidateId) || filteredCandidates[0] || candidates[0];

  const pendingEvidenceQueue = useMemo(() => {
    return candidates.flatMap((cand) =>
      cand.evidenceAnalyses
        .filter((ev) => ev.humanDecision.status === "pending-review")
        .map((ev) => ({ candidate: cand, evidence: ev }))
    );
  }, [candidates]);

  const targetEvidence =
    activeCandidate?.evidenceAnalyses.find((e) => e.id === selectedEvidenceId) ||
    activeCandidate?.evidenceAnalyses[0];

  function mapDecisionToSkillStatus(decision: HumanAssessorDecisionStatus): SkillStatus {
    switch (decision) {
      case "verified-by-authorised-organisation":
        return "verified-organisation";
      case "human-assessed-confirmed":
      case "recommended-for-authority-verification":
        return "human-assessed";
      case "needs-more-evidence":
        return "evidence-submitted";
      default:
        return "pending-human-assessment";
    }
  }

  function handleRecordDecision(e: FormEvent) {
    e.preventDefault();
    if (!activeCandidate || !targetEvidence) return;
    if (!assessorName.trim() || !reviewNotes.trim()) {
      setFeedback("Assessor name and review notes are required before saving a decision.");
      return;
    }

    const nextSkillStatus = mapDecisionToSkillStatus(decisionStatus);
    const decidedAt = new Date().toISOString().slice(0, 10);

    const updatedEvidence = activeCandidate.evidenceAnalyses.map((ev) =>
      ev.id === targetEvidence.id
        ? {
            ...ev,
            assessmentStatus: nextSkillStatus,
            humanDecision: {
              status: decisionStatus,
              assessorName: assessorName.trim(),
              assessorOrganisation: assessorOrganisation.trim(),
              reviewNotes: reviewNotes.trim(),
              decidedAt,
            },
          }
        : ev
    );

    const updatedSkills = activeCandidate.skills.map((skill) => {
      if (
        skill.id === targetEvidence.skillId ||
        skill.name.toLowerCase() === targetEvidence.skillName.toLowerCase()
      ) {
        return {
          ...skill,
          status: nextSkillStatus,
          lastUpdated: decidedAt,
        };
      }
      return skill;
    });

    const updatedProjects = activeCandidate.projects.map((proj) => {
      if (proj.id !== targetEvidence.projectId) return proj;
      return {
        ...proj,
        humanAssessmentStatus:
          nextSkillStatus === "verified-organisation"
            ? ("verified-organisation" as const)
            : nextSkillStatus === "human-assessed"
            ? ("human-assessed" as const)
            : ("pending-human-assessment" as const),
      };
    });

    onUpdateCandidate({
      ...activeCandidate,
      evidenceAnalyses: updatedEvidence,
      skills: updatedSkills,
      projects: updatedProjects,
    });

    setReviewNotes("");
    setFeedback(
      `Recorded human assessor decision for "${targetEvidence.skillName}" (${nextSkillStatus.replace(/-/g, " ")}).`
    );
  }

  function handleQualificationStatusUpdate(qualId: string, status: CandidateAccount["qualifications"][0]["verificationStatus"]) {
    if (!activeCandidate) return;
    onUpdateCandidate({
      ...activeCandidate,
      qualifications: activeCandidate.qualifications.map((q) =>
        q.id === qualId ? { ...q, verificationStatus: status } : q
      ),
    });
    setFeedback("Qualification verification status updated by assessor.");
  }

  return (
    <div className="space-y-8">
      {/* Assessor Governance Notice */}
      <div className="bg-navy-900 text-white rounded-xl p-5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs leading-relaxed">
          <p className="font-semibold text-white">
            Assessor & Verification Management Console
          </p>
          <p className="text-slate-300 mt-0.5">
            AI-assisted interpretations are shown solely as candidate-submitted advisory context.
            Human assessors independently inspect supporting evidence, record review notes, and
            manage formal verification statuses.
          </p>
        </div>
      </div>

      {feedback && (
        <div role="status" className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-900">
          {feedback}
        </div>
      )}

      {/* Pending Assessments Queue */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-navy-900">
              Pending Assessments Queue
            </h2>
            <p className="text-xs text-slate-600">
              Evidence items awaiting human assessor review across all candidates.
            </p>
          </div>
          <span className="font-mono text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-md tabular-nums">
            {pendingEvidenceQueue.length} Pending
          </span>
        </div>

        {pendingEvidenceQueue.length === 0 ? (
          <p className="text-xs text-slate-500">All submitted evidence items have a recorded review.</p>
        ) : (
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
            {pendingEvidenceQueue.map(({ candidate, evidence }) => (
              <div
                key={evidence.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-semibold text-navy-900">
                    {evidence.skillName} — {candidate.profile.fullName}
                  </p>
                  <p className="text-xs text-slate-500">{evidence.supportingEvidence}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCandidateId(candidate.id);
                    setSelectedEvidenceId(evidence.id);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 whitespace-nowrap cursor-pointer"
                >
                  Inspect & Decide
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Candidate Directory + Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Candidate Directory */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h3 className="font-display text-base font-bold text-navy-900">Candidate Directory</h3>
          <div className="relative">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search name or passport ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1 text-xs font-medium rounded-md cursor-pointer ${
                filterMode === "all" ? "bg-navy-900 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              All ({candidates.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("pending")}
              className={`px-3 py-1 text-xs font-medium rounded-md cursor-pointer ${
                filterMode === "pending"
                  ? "bg-navy-900 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Pending Review
            </button>
          </div>

          <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
            {filteredCandidates.map((cand) => {
              const isSelected = cand.id === activeCandidate?.id;
              return (
                <button
                  key={cand.id}
                  type="button"
                  onClick={() => {
                    setSelectedCandidateId(cand.id);
                    setSelectedEvidenceId("");
                  }}
                  className={`w-full p-3.5 text-left transition-colors cursor-pointer ${
                    isSelected ? "bg-teal-50" : "hover:bg-slate-50"
                  }`}
                >
                  <p className="text-sm font-semibold text-navy-900">{cand.profile.fullName}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{cand.profile.headline}</p>
                  <p className="text-[11px] font-mono text-slate-500 mt-1">
                    {cand.passportId} · {cand.skills.length} skills
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Candidate Evidence & Decision Panel */}
        {activeCandidate && (
          <div className="lg:col-span-8 space-y-6">
            {/* Candidate Summary */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <p className="text-xs font-mono text-slate-500">
                    {activeCandidate.passportId}
                    {activeCandidate.isDemoAccount ? " · Fictional Demo Candidate" : ""}
                  </p>
                  <h3 className="font-display text-xl font-bold text-navy-900 mt-0.5">
                    {activeCandidate.profile.fullName}
                  </h3>
                  <p className="text-sm text-slate-600">{activeCandidate.profile.headline}</p>
                </div>
                <div className="text-xs text-slate-600">
                  <p>Origin: {activeCandidate.profile.originCountry || "N/A"}</p>
                  <p>Host: {activeCandidate.profile.currentCountry || "N/A"}</p>
                </div>
              </div>

              {/* Competency Summary */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Candidate Competency Summary
                </h4>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                  {activeCandidate.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-sm font-semibold text-navy-900">{skill.name}</p>
                        <p className="text-xs text-slate-500">{skill.evidenceSummary}</p>
                      </div>
                      <SkillStatusBadge status={skill.status} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualification Verification Status Management */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Qualifications Verification Status
                </h4>
                {activeCandidate.qualifications.length === 0 ? (
                  <p className="text-xs text-slate-500">No qualifications submitted.</p>
                ) : (
                  <div className="space-y-2">
                    {activeCandidate.qualifications.map((q) => (
                      <div
                        key={q.id}
                        className="p-3.5 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-navy-900">{q.title}</p>
                          <p className="text-xs text-slate-500">
                            {q.institution} ({q.yearOfCompletion})
                          </p>
                          <div className="mt-1.5">
                            <QualificationStatusBadge status={q.verificationStatus} />
                          </div>
                        </div>
                        <select
                          aria-label={`Update status for ${q.title}`}
                          value={q.verificationStatus}
                          onChange={(e) =>
                            handleQualificationStatusUpdate(
                              q.id,
                              e.target.value as CandidateAccount["qualifications"][0]["verificationStatus"]
                            )
                          }
                          className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="unverified">Unverified Record</option>
                          <option value="documentation-incomplete">Documentation Incomplete</option>
                          <option value="submitted-for-review">Submitted for Advisory Review</option>
                          <option value="assessment-recommended">
                            Practical Assessment Recommended
                          </option>
                          <option value="verified-by-authority">Verified by Authorised Body</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submitted Projects */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Submitted Project Evidence
                </h4>
                {activeCandidate.projects.map((p) => (
                  <div key={p.id} className="p-3.5 border border-slate-200 rounded-lg space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-navy-900">{p.title}</p>
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:underline"
                        >
                          <span>Repository Link</span>
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">{p.supportingEvidence}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Record Human Assessment Decision */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-navy-900" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold text-navy-900">
                  Human Assessor Decision & Review Notes
                </h3>
              </div>

              {activeCandidate.evidenceAnalyses.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No evidence analysis items submitted for this candidate yet.
                </p>
              ) : (
                <form onSubmit={handleRecordDecision} className="space-y-5">
                  <div>
                    <label
                      htmlFor="evSelect"
                      className="block text-xs font-semibold text-navy-900 mb-1"
                    >
                      Select Evidence / Competency Item to Review
                    </label>
                    <select
                      id="evSelect"
                      value={targetEvidence?.id || ""}
                      onChange={(e) => setSelectedEvidenceId(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      {activeCandidate.evidenceAnalyses.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.skillName} — Current: {ev.assessmentStatus.replace(/-/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  {targetEvidence && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <div>
                        <p className="font-semibold text-navy-900 mb-1">
                          AI-Suggested Context (Advisory Only)
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                          {targetEvidence.explanation}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-amber-900 mb-1 flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Known Evidence Limitations</span>
                        </p>
                        <p className="text-amber-950 leading-relaxed">
                          {targetEvidence.evidenceLimitations}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="assessorName"
                        className="block text-xs font-semibold text-navy-900 mb-1"
                      >
                        Assessor Name *
                      </label>
                      <input
                        id="assessorName"
                        type="text"
                        required
                        value={assessorName}
                        onChange={(e) => setAssessorName(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="assessorOrg"
                        className="block text-xs font-semibold text-navy-900 mb-1"
                      >
                        Assessor Organisation / Authority
                      </label>
                      <input
                        id="assessorOrg"
                        type="text"
                        value={assessorOrganisation}
                        onChange={(e) => setAssessorOrganisation(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="decisionStatus"
                      className="block text-xs font-semibold text-navy-900 mb-1"
                    >
                      Human Assessment Decision *
                    </label>
                    <select
                      id="decisionStatus"
                      value={decisionStatus}
                      onChange={(e) =>
                        setDecisionStatus(e.target.value as HumanAssessorDecisionStatus)
                      }
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="human-assessed-confirmed">
                        Human-Assessed (Practical evidence reviewed & confirmed)
                      </option>
                      <option value="needs-more-evidence">
                        Needs Additional Evidence (Return to candidate)
                      </option>
                      <option value="recommended-for-authority-verification">
                        Human-Assessed & Recommended for Partner Verification
                      </option>
                      <option value="verified-by-authorised-organisation">
                        Verified by Authorised Organisation
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="reviewNotes"
                      className="block text-xs font-semibold text-navy-900 mb-1"
                    >
                      Assessor Review Notes *
                    </label>
                    <textarea
                      id="reviewNotes"
                      rows={3}
                      required
                      placeholder="Record objective observations from portfolio walkthrough, test output, or documentation check..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      <span>Record Human Decision</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
