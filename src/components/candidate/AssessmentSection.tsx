import { ArrowRight, CheckCircle2, ClipboardCheck, XCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { SAMPLE_ASSESSMENT_TRACKS } from "../../data/demoData";
import { AssessmentAnswerRecord, AssessmentReport, CandidateAccount } from "../../types/skillproof";
import { buildBridgingFromGap } from "../../utils/simulatedAnalysis";

interface AssessmentSectionProps {
  candidate: CandidateAccount;
  onUpdateCandidate: (updated: CandidateAccount) => void;
  onNavigateToBridging: () => void;
}

export function AssessmentSection({
  candidate,
  onUpdateCandidate,
  onNavigateToBridging,
}: AssessmentSectionProps) {
  const [selectedTrackKey, setSelectedTrackKey] = useState<string>("software-systems");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeTrack = SAMPLE_ASSESSMENT_TRACKS[selectedTrackKey];

  function handleSubmitQuiz(e: FormEvent) {
    e.preventDefault();
    const answerRecords: AssessmentAnswerRecord[] = activeTrack.questions.map((q) => {
      const selected = answers[q.id] || "";
      return {
        questionId: q.id,
        questionPrompt: q.prompt,
        selectedOption: selected,
        isCorrect: selected === q.correctOption,
        competencyTag: q.competencyTag,
      };
    });

    const score = answerRecords.filter((a) => a.isCorrect).length;
    const missedTags = answerRecords
      .filter((a) => !a.isCorrect)
      .map((a) => a.competencyTag);
    const passedTags = answerRecords
      .filter((a) => a.isCorrect)
      .map((a) => a.competencyTag);

    const newReport: AssessmentReport = {
      id: `assess-${Date.now()}`,
      title: activeTrack.title,
      domain: activeTrack.domain,
      completedAt: new Date().toISOString().slice(0, 10),
      isSampleDemo: true,
      score,
      maxScore: activeTrack.questions.length,
      status: "sample-completed",
      competencyObservations:
        passedTags.length > 0
          ? [`Correctly answered scenario items in: ${passedTags.join(", ")}.`]
          : ["Review core technical concepts across all 5 scenario items."],
      identifiedGaps:
        missedTags.length > 0
          ? missedTags.map((tag) => `${tag} — Recommended for targeted bridging review`)
          : ["No scenario gaps detected in this sample check; proceed to human portfolio review."],
      answers: answerRecords,
    };

    onUpdateCandidate({
      ...candidate,
      assessments: [newReport, ...candidate.assessments],
    });
    setIsTakingQuiz(false);
    setAnswers({});
    setFeedback(
      `Sample Assessment completed (${score}/${activeTrack.questions.length}). Results are recorded as a demonstration assessment report.`
    );
  }

  function handleSendGapToBridging(gapText: string, domain: string) {
    const exists = candidate.bridgingPathways.some(
      (b) => b.competencyGap.toLowerCase() === gapText.toLowerCase()
    );
    if (exists) {
      onNavigateToBridging();
      return;
    }
    const created = buildBridgingFromGap(gapText, domain);
    onUpdateCandidate({
      ...candidate,
      bridgingPathways: [created, ...candidate.bridgingPathways],
    });
    onNavigateToBridging();
  }

  return (
    <div className="space-y-8">
      {/* Intro & Launcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              Practical Competency Check
            </p>
            <h2 className="font-display text-xl font-bold text-navy-900">
              Sample Skills Assessment
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Complete a scenario-based sample assessment to surface strengths and pinpoint
              evidence gaps. Results are clearly labelled as sample assessments—never official
              licences.
            </p>
          </div>
          {!isTakingQuiz && (
            <button
              type="button"
              onClick={() => setIsTakingQuiz(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 whitespace-nowrap cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4" aria-hidden="true" />
              <span>Start Sample Assessment</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-medium text-slate-600 mr-1">Assessment Track:</span>
          {Object.entries(SAMPLE_ASSESSMENT_TRACKS).map(([key, track]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSelectedTrackKey(key);
                setAnswers({});
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${
                selectedTrackKey === key
                  ? "bg-navy-900 text-white border-navy-900"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {track.domain}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div role="status" className="p-4 rounded-lg bg-teal-50 border border-teal-200 text-sm text-teal-950">
          {feedback}
        </div>
      )}

      {/* Interactive Assessment Form */}
      {isTakingQuiz && (
        <form
          onSubmit={handleSubmitQuiz}
          className="bg-white border border-slate-200 rounded-xl p-6 space-y-6"
        >
          <div className="pb-4 border-b border-slate-200 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-teal-700">Sample Demonstration Assessment</p>
              <h3 className="font-display text-lg font-bold text-navy-900">{activeTrack.title}</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsTakingQuiz(false)}
              className="text-xs text-slate-500 hover:text-navy-900 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-6">
            {activeTrack.questions.map((q, index) => (
              <fieldset key={q.id} className="space-y-2.5 pb-5 border-b border-slate-200 last:border-b-0">
                <legend className="text-sm font-semibold text-navy-900">
                  <span className="font-mono text-teal-700 mr-2">0{index + 1}.</span>
                  {q.prompt}
                </legend>
                <p className="text-xs text-slate-500">Competency: {q.competencyTag}</p>
                <div className="space-y-2 pt-1">
                  {q.options.map((option) => (
                    <label
                      key={option}
                      className={`flex items-start gap-3 p-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                        answers[q.id] === option
                          ? "bg-teal-50 border-teal-500 text-navy-900"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={option}
                        required
                        checked={answers[q.id] === option}
                        onChange={() => setAnswers({ ...answers, [q.id]: option })}
                        className="mt-1"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsTakingQuiz(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 cursor-pointer"
            >
              Submit Sample Assessment
            </button>
          </div>
        </form>
      )}

      {/* Recorded Sample Assessment Reports */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-bold text-navy-900">
          Assessment Reports ({candidate.assessments.length})
        </h3>
        {candidate.assessments.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center">
            <p className="text-sm text-slate-600">
              No assessment reports recorded yet. Click "Start Sample Assessment" above to generate
              a sample competency report.
            </p>
          </div>
        ) : (
          candidate.assessments.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <p className="text-xs font-mono text-teal-800">
                    Sample Assessment Report · Completed {report.completedAt}
                  </p>
                  <h4 className="font-display text-base font-bold text-navy-900 mt-0.5">
                    {report.title}
                  </h4>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-display text-2xl font-bold text-navy-900 tabular-nums">
                    {report.score} / {report.maxScore}
                  </p>
                  <p className="text-xs text-slate-500">Sample diagnostic score (non-official)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-navy-900 mb-2">
                    Observed Strengths
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-700">
                    {report.competencyObservations.map((obs, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2
                          className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{obs}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-navy-900 mb-2">
                    Identified Gaps & Bridging Actions
                  </p>
                  <div className="space-y-2">
                    {report.identifiedGaps.map((gap, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="flex items-start gap-2 text-xs text-amber-950">
                          <XCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{gap}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSendGapToBridging(gap, report.domain)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-navy-900 hover:text-teal-800 whitespace-nowrap cursor-pointer"
                        >
                          <span>Add to Bridging</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
