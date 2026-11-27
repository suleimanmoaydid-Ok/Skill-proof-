import { Check, Copy, ExternalLink, Printer, ShieldAlert, User } from "lucide-react";
import { useState } from "react";
import { CandidateAccount } from "../../types/skillproof";
import { QualificationStatusBadge, SkillStatusBadge } from "../common/StatusIndicator";

interface DigitalPassportSectionProps {
  candidate: CandidateAccount;
}

export function DigitalPassportSection({ candidate }: DigitalPassportSectionProps) {
  const [copied, setCopied] = useState(false);

  function handleCopyShareSummary() {
    const shareText = [
      `SKILLPROOF DIGITAL SKILLS PASSPORT (${candidate.passportId})`,
      candidate.isDemoAccount ? "[FICTIONAL DEMONSTRATION PROFILE — NOT OFFICIAL VERIFICATION]" : "",
      `Candidate: ${candidate.profile.fullName}`,
      `Headline: ${candidate.profile.headline}`,
      `Location Context: ${candidate.profile.originCountry || "N/A"} -> ${candidate.profile.currentCountry || "N/A"}`,
      "",
      "SKILLS & VERIFICATION STATUS:",
      ...candidate.skills.map((s) => `- ${s.name} [${s.status.replace(/-/g, " ")}]`),
      "",
      "QUALIFICATIONS:",
      ...candidate.qualifications.map(
        (q) => `- ${q.title}, ${q.institution} (${q.yearOfCompletion}) [${q.verificationStatus}]`
      ),
      "",
      "FEATURED PROJECTS:",
      ...candidate.projects.map((p) => `- ${p.title}${p.githubUrl ? ` (${p.githubUrl})` : ""}`),
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
            Module 1 · Shareable Digital SkillProof Passport
          </p>
          <p className="text-sm text-slate-600 mt-0.5">
            Portable, evidence-backed summary distinguishing self-reported, AI-suggested,
            human-assessed, and verified skills.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCopyShareSummary}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-navy-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200/70 cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
            ) : (
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>{copied ? "Passport Summary Copied" : "Copy Shareable Summary"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Passport Document */}
      <article className="bg-white border border-slate-300 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-navy-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {candidate.profile.avatarUrl ? (
              <img
                src={candidate.profile.avatarUrl}
                alt={candidate.profile.fullName}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-xl object-cover border border-navy-700 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-teal-300" aria-hidden="true" />
              </div>
            )}
            <div>
              <p className="text-xs font-mono text-teal-300">
                SkillProof Passport · {candidate.passportId}
                {candidate.isDemoAccount ? " · Fictional Demonstration Profile" : ""}
              </p>
              <h2 className="font-display text-2xl font-bold mt-1">
                {candidate.profile.fullName || "Unnamed Candidate"}
              </h2>
              <p className="text-sm text-slate-200 mt-0.5">
                {candidate.profile.headline || "Professional headline not set"}
              </p>
              <p className="text-xs text-slate-300 mt-1.5">
                {candidate.profile.originCountry
                  ? `Origin: ${candidate.profile.originCountry}`
                  : "Origin: Not specified"}
                {" · "}
                {candidate.profile.currentCountry
                  ? `Current Location: ${candidate.profile.currentCountry}`
                  : "Host Country: Not specified"}
                {candidate.profile.languages.length > 0
                  ? ` · Languages: ${candidate.profile.languages.join(", ")}`
                  : ""}
              </p>
            </div>
          </div>

          <div className="sm:text-right text-xs font-mono text-slate-300 shrink-0">
            <p>Issued View: {new Date().toISOString().slice(0, 10)}</p>
            <p className="text-teal-300 mt-1">Track 1 · Credential Recognition</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Biography */}
          {candidate.profile.bio && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Professional Summary
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">{candidate.profile.bio}</p>
            </section>
          )}

          {/* Skills & Assessment Status Table */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Skills & Verification Status
            </h3>
            {candidate.skills.length === 0 ? (
              <p className="text-sm text-slate-500">No skills recorded yet.</p>
            ) : (
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                {candidate.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{skill.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {skill.category} · {skill.evidenceSummary}
                      </p>
                    </div>
                    <SkillStatusBadge status={skill.status} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Qualifications */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Education & Qualifications
            </h3>
            {candidate.qualifications.length === 0 ? (
              <p className="text-sm text-slate-500">No qualifications recorded yet.</p>
            ) : (
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                {candidate.qualifications.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{q.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {q.institution} · {q.countryOfAward} ·{" "}
                        <span className="font-mono tabular-nums">{q.yearOfCompletion}</span>
                      </p>
                      {q.missingDocumentsNote && (
                        <p className="text-xs text-amber-800 mt-1">{q.missingDocumentsNote}</p>
                      )}
                    </div>
                    <QualificationStatusBadge status={q.verificationStatus} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Work Experience */}
          {candidate.workExperience.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Work Experience
              </h3>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                {candidate.workExperience.map((exp) => (
                  <div key={exp.id} className="p-4">
                    <p className="text-sm font-semibold text-navy-900">{exp.roleTitle}</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {exp.organisation} · {exp.country} ·{" "}
                      <span className="font-mono tabular-nums">
                        {exp.startYear} – {exp.endYear || "Present"}
                      </span>
                    </p>
                    {exp.summary && (
                      <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                        {exp.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Project Portfolio Evidence */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Practical Project Evidence
            </h3>
            {candidate.projects.length === 0 ? (
              <p className="text-sm text-slate-500">No showcase projects submitted yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidate.projects.map((p) => (
                  <div key={p.id} className="border border-slate-200 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-navy-900">{p.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                    <p className="text-xs font-mono text-slate-500">
                      {p.technologies.join(" · ")}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-1">
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:underline"
                        >
                          <span>{p.isDemoData ? "Sample GitHub URL" : "Repository"}</span>
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Assessments Summary */}
          {candidate.assessments.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Sample Assessment Records
              </h3>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                {candidate.assessments.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{a.title}</p>
                      <p className="text-xs text-slate-500">
                        {a.domain} · Completed {a.completedAt} · Non-official sample diagnostic
                      </p>
                    </div>
                    <p className="font-mono text-sm font-bold text-navy-900 tabular-nums">
                      {a.score}/{a.maxScore}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Mandatory Verification Governance Notice */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
            <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              <strong>Verification Governance:</strong> Only items marked{" "}
              <em>Human-Assessed</em> or <em>Verified by Authorised Organisation</em> have undergone
              human review. <em>AI-Suggested</em> and <em>Self-Reported</em> skills are advisory
              until assessed.{" "}
              {candidate.isDemoAccount
                ? "This record belongs to a fictional demonstration account and does not represent a real person."
                : ""}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
