import { BookOpen, Info, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import {
  BridgingProgressStatus,
  BridgingRecommendation,
  CandidateAccount,
  ReferralStatus,
} from "../../types/skillproof";

interface BridgingPathwaysSectionProps {
  candidate: CandidateAccount;
  onUpdateCandidate: (updated: CandidateAccount) => void;
}

export function BridgingPathwaysSection({
  candidate,
  onUpdateCandidate,
}: BridgingPathwaysSectionProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [gap, setGap] = useState("");
  const [learningArea, setLearningArea] = useState("");
  const [course, setCourse] = useState("");
  const [assessmentOpt, setAssessmentOpt] = useState("");
  const [certPathway, setCertPathway] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleProgressChange(id: string, progress: BridgingProgressStatus) {
    onUpdateCandidate({
      ...candidate,
      bridgingPathways: candidate.bridgingPathways.map((item) =>
        item.id === id ? { ...item, progress } : item
      ),
    });
  }

  function handleReferralChange(id: string, referralStatus: ReferralStatus) {
    onUpdateCandidate({
      ...candidate,
      bridgingPathways: candidate.bridgingPathways.map((item) =>
        item.id === id ? { ...item, referralStatus } : item
      ),
    });
  }

  function handleDelete(id: string) {
    onUpdateCandidate({
      ...candidate,
      bridgingPathways: candidate.bridgingPathways.filter((b) => b.id !== id),
    });
    setFeedback("Bridging recommendation removed.");
  }

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!gap.trim() || !learningArea.trim()) {
      return;
    }
    const created: BridgingRecommendation = {
      id: `bridge-${Date.now()}`,
      competencyGap: gap.trim(),
      recommendedLearningArea: learningArea.trim(),
      suggestedCourse: course.trim() || "To be selected with training adviser",
      assessmentOpportunity:
        assessmentOpt.trim() || "Practical competency review with partner assessor",
      certificationPathway:
        certPathway.trim() || "Advisory RPL documentation (requires authorised confirmation)",
      progress: "not-started",
      referralStatus: "not-requested",
      notes: "Candidate-created bridging goal.",
    };
    onUpdateCandidate({
      ...candidate,
      bridgingPathways: [created, ...candidate.bridgingPathways],
    });
    setGap("");
    setLearningArea("");
    setCourse("");
    setAssessmentOpt("");
    setCertPathway("");
    setShowAdd(false);
    setFeedback("Bridging pathway added to your plan.");
  }

  const completedCount = candidate.bridgingPathways.filter(
    (b) => b.progress === "completed"
  ).length;

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
            Module 3 · Bridging Pathways
          </p>
          <h2 className="font-display text-xl font-bold text-navy-900">
            Targeted Upskilling, Assessment & Referral Plan
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Addresses identified competency and documentation gaps through structured learning
            areas, bridging courses, and assessment pathways.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Bridging Goal</span>
        </button>
      </div>

      {/* Transparency Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-950">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          <strong>Important Notice:</strong> Bridging recommendations guide next learning and
          assessment steps. Listing a pathway does not promise scholarship funding, fee waivers, or
          automatic certification unless formally confirmed by an external training or recognition
          partner.
        </p>
      </div>

      {feedback && (
        <div role="status" className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-900">
          {feedback}
        </div>
      )}

      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
        >
          <h3 className="font-display text-base font-bold text-navy-900">
            Add Custom Bridging Recommendation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Identified Competency Gap *"
              value={gap}
              onChange={(e) => setGap(e.target.value)}
              className="px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              required
              placeholder="Recommended Learning Area *"
              value={learningArea}
              onChange={(e) => setLearningArea(e.target.value)}
              className="px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Suggested Bridging Course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Assessment Opportunity"
              value={assessmentOpt}
              onChange={(e) => setAssessmentOpt(e.target.value)}
              className="px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <input
            type="text"
            placeholder="Certification Pathway Suggestion"
            value={certPathway}
            onChange={(e) => setCertPathway(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-navy-900 rounded-lg cursor-pointer"
            >
              Save Bridging Goal
            </button>
          </div>
        </form>
      )}

      {/* Progress Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-teal-700" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-navy-900">Bridging Progress Overview</p>
            <p className="text-xs text-slate-500">
              Update learning progress and partner referral status as you prepare for assessment.
            </p>
          </div>
        </div>
        <p className="font-display text-lg font-bold text-navy-900 tabular-nums">
          {completedCount} / {candidate.bridgingPathways.length} Completed
        </p>
      </div>

      {/* Bridging Cards */}
      {candidate.bridgingPathways.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center">
          <p className="text-sm text-slate-600">
            No bridging recommendations yet. Complete a Sample Skills Assessment or add a custom
            bridging goal above.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {candidate.bridgingPathways.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-mono text-amber-800">
                    Identified Gap{item.isDemoData ? " · Demonstration Recommendation" : ""}
                  </p>
                  <h3 className="font-display text-base font-bold text-navy-900 mt-0.5">
                    {item.competencyGap}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-700 cursor-pointer"
                  aria-label="Delete bridging recommendation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-navy-900 mb-1">Recommended Learning Area</p>
                  <p className="text-slate-700">{item.recommendedLearningArea}</p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-navy-900 mb-1">Suggested Bridging Course</p>
                  <p className="text-slate-700">{item.suggestedCourse}</p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-navy-900 mb-1">Assessment Opportunity</p>
                  <p className="text-slate-700">{item.assessmentOpportunity}</p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-navy-900 mb-1">Certification Pathway Suggestion</p>
                  <p className="text-slate-700">{item.certificationPathway}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Learning Progress
                    </label>
                    <select
                      value={item.progress}
                      onChange={(e) =>
                        handleProgressChange(item.id, e.target.value as BridgingProgressStatus)
                      }
                      className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Referral Status
                    </label>
                    <select
                      value={item.referralStatus}
                      onChange={(e) =>
                        handleReferralChange(item.id, e.target.value as ReferralStatus)
                      }
                      className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="not-requested">Not Requested</option>
                      <option value="referral-drafted">Referral Drafted</option>
                      <option value="pending-partner-review">Pending Partner Review</option>
                    </select>
                  </div>
                </div>

                {item.notes && <p className="text-xs text-slate-500 max-w-md">{item.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
