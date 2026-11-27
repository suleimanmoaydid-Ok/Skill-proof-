import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Compass,
  FileSearch,
  FolderGit2,
} from "lucide-react";
import { CandidateAccount, DashboardSection } from "../../types/skillproof";
import { calculateCandidateJourney } from "../../utils/storage";
import { SkillStatusBadge } from "../common/StatusIndicator";

interface OverviewSectionProps {
  candidate: CandidateAccount;
  onNavigate: (section: DashboardSection) => void;
}

export function OverviewSection({ candidate, onNavigate }: OverviewSectionProps) {
  const journey = calculateCandidateJourney(candidate);
  const verifiedOrAssessedCount = candidate.skills.filter(
    (s) => s.status === "human-assessed" || s.status === "verified-organisation"
  ).length;

  return (
    <div className="space-y-8">
      {/* Top Summary Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <p className="text-xs font-medium text-teal-700 mb-1">
              SkillProof Candidate Overview · {candidate.passportId}
            </p>
            <h2 className="font-display text-2xl font-bold text-navy-900">
              {candidate.profile.fullName || "Complete your candidate profile"}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {candidate.profile.headline ||
                "Add your professional headline, origin/host context, and core skills to begin."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate("projects")}
              className="px-4 py-2 text-xs font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              Manage Project Showcase
            </button>
            <button
              type="button"
              onClick={() => onNavigate("passport")}
              className="px-4 py-2 text-xs font-semibold text-navy-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200/70 transition-colors whitespace-nowrap cursor-pointer"
            >
              Open Digital Passport
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          <div>
            <p className="text-xs text-slate-500">Journey Completion</p>
            <p className="font-display text-2xl font-bold text-navy-900 tabular-nums mt-1">
              {journey.percentage}%
            </p>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              {journey.completedCount} of 12 steps completed
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Tracked Skills</p>
            <p className="font-display text-2xl font-bold text-navy-900 tabular-nums mt-1">
              {candidate.skills.length}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              {verifiedOrAssessedCount} human-assessed or verified
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Showcase Projects</p>
            <p className="font-display text-2xl font-bold text-navy-900 tabular-nums mt-1">
              {candidate.projects.length}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              {candidate.evidenceAnalyses.length} evidence mappings
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Qualifications & Bridging</p>
            <p className="font-display text-2xl font-bold text-navy-900 tabular-nums mt-1">
              {candidate.qualifications.length} / {candidate.bridgingPathways.length}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Credentials / Bridging pathways
            </p>
          </div>
        </div>
      </div>

      {/* 12-Step Candidate Journey Checklist */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="font-display text-lg font-bold text-navy-900">
              12-Step Recognition & Validation Journey
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Follow each step to turn qualifications and practical projects into an assessable
              SkillProof Passport.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-teal-800 font-semibold">
            {journey.completedCount} / 12 Complete
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {journey.steps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => onNavigate(step.section)}
              className={`flex items-start gap-3 p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${
                step.completed
                  ? "bg-teal-50/50 border-teal-200 hover:bg-teal-50"
                  : "bg-slate-50 border-slate-200 hover:border-navy-600"
              }`}
            >
              {step.completed ? (
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
              )}
              <div className="min-w-0">
                <p className="text-[11px] font-mono text-slate-500">Step {step.id}</p>
                <p className="text-xs font-semibold text-navy-900 leading-snug">{step.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Three Core Modules Quick Access + Skills Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-navy-900">
              Skills & Recognition Status
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("skills")}
              className="text-xs font-semibold text-teal-800 hover:text-teal-900 cursor-pointer"
            >
              Manage Skills
            </button>
          </div>
          {candidate.skills.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-slate-300 rounded-lg">
              <p className="text-sm text-slate-600 mb-3">
                No skills recorded yet. Add your core professional skills to link evidence.
              </p>
              <button
                type="button"
                onClick={() => onNavigate("skills")}
                className="px-4 py-2 text-xs font-semibold text-white bg-navy-900 rounded-lg cursor-pointer"
              >
                Add First Skill
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {candidate.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{skill.name}</p>
                    <p className="text-xs text-slate-500">{skill.category}</p>
                  </div>
                  <SkillStatusBadge status={skill.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <h3 className="font-display text-lg font-bold text-navy-900 mb-2">
            Core Platform Workflows
          </h3>
          {[
            {
              section: "evidence" as DashboardSection,
              icon: FileSearch,
              title: "Evidence-to-Skills Engine",
              desc: "Inspect AI-assisted mappings, limitations, and human review decisions.",
            },
            {
              section: "assessment" as DashboardSection,
              icon: ClipboardCheck,
              title: "Skills Assessment",
              desc: "Take a sample domain assessment and inspect competency gaps.",
            },
            {
              section: "credential-mapper" as DashboardSection,
              icon: Compass,
              title: "Credential Mapper",
              desc: "Identify missing qualification records and recognition pathways.",
            },
            {
              section: "bridging" as DashboardSection,
              icon: BookOpen,
              title: "Bridging Pathways",
              desc: "Track learning recommendations and assessment referrals.",
            },
            {
              section: "projects" as DashboardSection,
              icon: FolderGit2,
              title: "My Project Showcase",
              desc: "Add real project proof with validated repository links.",
            },
            {
              section: "passport" as DashboardSection,
              icon: Award,
              title: "Digital SkillProof Passport",
              desc: "Generate a clean shareable and printable credentials summary.",
            },
          ].map((action) => (
            <button
              key={action.section}
              type="button"
              onClick={() => onNavigate(action.section)}
              className="w-full flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 hover:border-teal-600 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-start gap-3 min-w-0">
                <action.icon className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-navy-900">{action.title}</p>
                  <p className="text-xs text-slate-500 truncate">{action.desc}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
