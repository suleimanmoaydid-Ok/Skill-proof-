import { AlertTriangle, CheckCircle2, Compass, Info, ShieldAlert } from "lucide-react";
import { CandidateAccount } from "../../types/skillproof";
import { generateCredentialGuidance } from "../../utils/simulatedAnalysis";
import { QualificationStatusBadge } from "../common/StatusIndicator";

interface CredentialMapperSectionProps {
  candidate: CandidateAccount;
  onGoToQualifications: () => void;
  onGoToBridging: () => void;
}

export function CredentialMapperSection({
  candidate,
  onGoToQualifications,
  onGoToBridging,
}: CredentialMapperSectionProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
            Module 2 · Credential Mapper
          </p>
          <h2 className="font-display text-xl font-bold text-navy-900">
            Qualification Recognition & Documentation Guidance
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Analyses recorded qualifications for completeness, flags items needing verification,
            and outlines realistic host-country recognition pathways—without claiming official
            equivalency.
          </p>
        </div>
        <button
          type="button"
          onClick={onGoToQualifications}
          className="px-4 py-2 text-xs font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 whitespace-nowrap cursor-pointer"
        >
          Manage Qualifications
        </button>
      </div>

      {/* Host-Country Context Card */}
      <div className="bg-navy-900 text-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Compass className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs leading-relaxed">
            <p className="font-semibold text-white">
              Mapping Context: {candidate.profile.originCountry || "Origin not specified"} →{" "}
              {candidate.profile.currentCountry || "Host country not specified"}
            </p>
            <p className="text-slate-300 mt-0.5">
              Official qualification equivalency can only be granted by authorised national
              recognition centres (e.g., ENIC-NARIC, ministries of education, or statutory
              licensing boards).
            </p>
          </div>
        </div>
      </div>

      {candidate.qualifications.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center">
          <p className="text-sm text-slate-600 mb-4">
            No qualifications recorded yet. Add your degree, diploma, or trade certificate in
            Qualifications to generate recognition guidance.
          </p>
          <button
            type="button"
            onClick={onGoToQualifications}
            className="px-4 py-2 text-xs font-semibold text-white bg-navy-900 rounded-lg cursor-pointer"
          >
            Add Qualification
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {candidate.qualifications.map((q) => {
            const guidance = generateCredentialGuidance(q);
            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden"
              >
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-lg font-bold text-navy-900">{q.title}</h3>
                      <QualificationStatusBadge status={q.verificationStatus} />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {q.institution} · {q.countryOfAward} · Year{" "}
                      <span className="font-mono tabular-nums">{q.yearOfCompletion}</span>
                      {q.qualificationLevel ? ` · ${q.qualificationLevel}` : ""}
                    </p>
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <p className="text-xs text-slate-500">Record Completeness</p>
                    <p className="font-display text-xl font-bold text-navy-900 tabular-nums">
                      {guidance.completenessScore}%
                    </p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Missing Information & Verification Gaps</span>
                      </h4>
                      {guidance.missingInformation.length === 0 ? (
                        <p className="text-xs text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                          <span>Core metadata fields are populated; external attestation still applies.</span>
                        </p>
                      ) : (
                        <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
                          {guidance.missingInformation.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-900 mb-2">
                        Items Requiring Verification
                      </h4>
                      <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
                        {guidance.verificationCheckpoints.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-800 mb-2">
                        Possible Recognition Pathways
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-700">
                        {guidance.recognitionPathways.map((item, idx) => (
                          <li
                            key={idx}
                            className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs leading-relaxed"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-900 mb-2">
                        Recommended Next Steps & Bridging Options
                      </h4>
                      <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
                        {guidance.nextSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={onGoToBridging}
                        className="mt-3 text-xs font-semibold text-teal-800 hover:text-teal-900 underline underline-offset-2 cursor-pointer"
                      >
                        Explore Bridging Courses & Assessment Options
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-600">
                  <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <p>{guidance.disclaimer}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          <strong>Why Credential Mapper pairs with Project Showcase:</strong> When original academic
          transcripts cannot be retrieved, practical project portfolios and human-assessed
          competency records give host-country recognition bodies concrete evidence under
          Recognition of Prior Learning (RPL) frameworks.
        </p>
      </div>
    </div>
  );
}
