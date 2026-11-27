import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  FileCheck2,
  FolderGit2,
  Layers,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { CandidateAccount, DashboardSection } from "../types/skillproof";
import { SkillStatusBadge } from "./common/StatusIndicator";

interface LandingPageProps {
  demoCandidate: CandidateAccount;
  onEnterDemo: (section?: DashboardSection) => void;
  onStartPersonalProfile: () => void;
  onOpenAssessorConsole: () => void;
}

export function LandingPage({
  demoCandidate,
  onEnterDemo,
  onStartPersonalProfile,
  onOpenAssessorConsole,
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#top"
            className="font-display text-xl font-bold tracking-tight text-navy-900 whitespace-nowrap shrink-0"
          >
            SkillProof
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <a
              href="#problem"
              className="hover:text-navy-900 transition-colors whitespace-nowrap shrink-0"
            >
              The Challenge
            </a>
            <a
              href="#how-it-works"
              className="hover:text-navy-900 transition-colors whitespace-nowrap shrink-0"
            >
              How It Works
            </a>
            <a
              href="#modules"
              className="hover:text-navy-900 transition-colors whitespace-nowrap shrink-0"
            >
              Core Modules
            </a>
            <a
              href="#evidence-engine"
              className="hover:text-navy-900 transition-colors whitespace-nowrap shrink-0"
            >
              Evidence Engine
            </a>
            <a
              href="#passport-preview"
              className="hover:text-navy-900 transition-colors whitespace-nowrap shrink-0"
            >
              Passport Preview
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onEnterDemo("overview")}
              className="px-4 py-2 text-sm font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Open Workspace
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-medium text-teal-700 tracking-wide mb-4">
                    Track 1: Credential Recognition & Skills Validation · SDG 4 & SDG 8
                  </p>
                  <h1
                    className="font-display font-bold tracking-tight text-navy-900 leading-[1.12] mb-5"
                    style={{
                      fontSize: "clamp(2.25rem, 3.8vw, 3.5rem)",
                      textWrap: "balance",
                    }}
                  >
                    Turn practical work into verifiable evidence of professional skill.
                  </h1>
                  <p className="text-lg font-medium text-teal-800 mb-4">
                    Your skills. Your evidence. Your opportunities.
                  </p>
                  <p className="text-base text-slate-600 leading-relaxed max-w-2xl mb-8">
                    SkillProof helps refugees, displaced professionals, and international talent
                    document qualifications, showcase real projects, and connect claimed skills to
                    structured evidence—supporting host-country credential guidance and human
                    assessor review without replacing authorised institutions.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onEnterDemo("overview")}
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>Explore Demo Candidate</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={onStartPersonalProfile}
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-navy-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200/70 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>Create Candidate Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenAssessorConsole}
                    className="px-3 py-3 text-sm font-medium text-teal-800 hover:text-teal-900 underline underline-offset-4 whitespace-nowrap cursor-pointer"
                  >
                    Open Assessor Console
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col">
                <div className="relative h-full min-h-[300px] rounded-xl overflow-hidden border border-slate-200 bg-navy-900">
                  <img
                    src="/src/assets/images/hero_skillproof_workspace_1795617035372.jpg"
                    alt="Two engineers reviewing system architecture diagrams and notebooks together"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 via-navy-950/50 to-transparent p-5">
                    <p className="text-xs font-medium text-teal-300 mb-1">
                      Evidence-First Recognition
                    </p>
                    <p className="text-sm text-white leading-snug">
                      Linking practical project portfolios, qualification records, and structured
                      human assessments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Value Commitments Row */}
            <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">01 · Transparent Status</p>
                <p className="text-sm font-semibold text-navy-900">
                  6 explicit verification states from self-reported to authorised confirmation
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">02 · AI Guardrails</p>
                <p className="text-sm font-semibold text-navy-900">
                  AI surfaces suggestions & gaps; never claims official equivalency
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">03 · Practical Proof</p>
                <p className="text-sm font-semibold text-navy-900">
                  My Project Showcase ties repositories & field logs directly to skills
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">04 · Human Oversight</p>
                <p className="text-sm font-semibold text-navy-900">
                  Dedicated Assessor Console separates human review from AI outputs
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section id="problem" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mb-10">
              <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
                The Recognition Gap
              </p>
              <h2
                className="font-display text-3xl font-bold text-navy-900 tracking-tight mb-4"
                style={{ textWrap: "balance" }}
              >
                Skilled professionals are sidelined when paper credentials cannot travel.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Refugees and displaced professionals frequently hold university degrees, trade
                licences, and years of practical delivery—yet lose access to certified transcripts
                or face unfamiliar host-country qualification frameworks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <p className="text-xs font-mono text-slate-500 mb-2">01. Incomplete Documentation</p>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">
                  Lost or untranslated records
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Displacement disrupts access to sealed academic transcripts and institutional
                  attestations, causing qualified professionals to be treated as entry-level.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <p className="text-xs font-mono text-slate-500 mb-2">02. Unverifiable CVs</p>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">
                  Skills listed without evidence
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Generic résumés do not show employers or assessment bodies what a candidate has
                  actually built, maintained, or tested in practice.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <p className="text-xs font-mono text-slate-500 mb-2">03. Opaque Pathways</p>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">
                  Unclear bridging & recognition steps
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Candidates rarely receive structured guidance on which gaps require targeted
                  bridging modules, practical assessments, or ENIC-NARIC / RPL referral.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How SkillProof Works */}
        <section id="how-it-works" className="py-16 lg:py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
                  How SkillProof Works
                </p>
                <h2 className="font-display text-3xl font-bold text-navy-900 tracking-tight">
                  A structured journey from raw experience to assessable proof.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onEnterDemo("overview")}
                className="text-sm font-semibold text-teal-800 hover:text-teal-900 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <span>Walk through the 12-step candidate journey</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: "01. Document",
                  title: "Profile & Qualifications",
                  desc: "Record education, work history, partial credentials, and missing document notes safely.",
                },
                {
                  step: "02. Demonstrate",
                  title: "My Project Showcase",
                  desc: "Submit real technical or trade projects with problem statements, role details, and repository links.",
                },
                {
                  step: "03. Analyse",
                  title: "Evidence-to-Skills Engine",
                  desc: "Map evidence to competencies, surface limitations transparently, and take sample assessments.",
                },
                {
                  step: "04. Validate & Bridge",
                  title: "Assessor Review & Passport",
                  desc: "Receive human assessor decisions, bridging plans, and a shareable SkillProof Passport.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="border border-slate-200 rounded-xl p-6 bg-slate-50/60"
                >
                  <p className="text-xs font-mono font-medium text-teal-700 mb-2">{item.step}</p>
                  <h3 className="text-base font-semibold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Three Core Modules */}
        <section id="modules" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
                Three Connected Modules
              </p>
              <h2 className="font-display text-3xl font-bold text-navy-900 tracking-tight">
                Built strictly for credential recognition, validation, and bridging.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-navy-900 mb-3">
                    <Award className="w-5 h-5 text-teal-700" aria-hidden="true" />
                    <span className="text-xs font-mono text-slate-500">Module 01</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy-900 mb-2">
                    Digital Skill Passport
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    A portable, structured record combining professional profile, qualifications,
                    categorised skills, project evidence, and clear assessment statuses—with a
                    printable, shareable view that distinguishes AI suggestions from human-verified
                    competencies.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onEnterDemo("passport")}
                  className="self-start inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-teal-800 cursor-pointer"
                >
                  <span>Preview Demonstration Passport</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-navy-900 mb-3">
                    <Compass className="w-5 h-5 text-teal-700" aria-hidden="true" />
                    <span className="text-xs font-mono text-slate-500">Module 02</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy-900 mb-2">
                    Credential Mapper
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    Records international qualifications, flags missing transcripts, and outlines
                    realistic recognition pathways such as UNESCO Qualifications Passports and
                    ENIC-NARIC reviews.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onEnterDemo("credential-mapper")}
                  className="self-start inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-teal-800 cursor-pointer"
                >
                  <span>Explore Mapper</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-navy-900 mb-3">
                    <BookOpen className="w-5 h-5 text-teal-700" aria-hidden="true" />
                    <span className="text-xs font-mono text-slate-500">Module 03</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy-900 mb-2">
                    Bridging Pathways
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    Translates identified evidence gaps into targeted learning areas, bridging
                    courses, practical assessment opportunities, and referral tracking.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onEnterDemo("bridging")}
                  className="self-start inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-teal-800 cursor-pointer"
                >
                  <span>View Pathways</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Evidence-to-Skills Verification Engine Presentation */}
        <section id="evidence-engine" className="py-16 lg:py-20 bg-navy-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5">
                <p className="text-xs font-semibold text-teal-300 uppercase tracking-wider mb-2">
                  Central Innovation
                </p>
                <h2 className="font-display text-3xl font-bold tracking-tight mb-4">
                  Evidence-to-Skills Verification Engine
                </h2>
                <p className="text-slate-300 text-base leading-relaxed mb-6">
                  Rather than trusting unverified skill tags or letting AI invent credentials,
                  SkillProof anchors every claimed competency to concrete evidence, states its
                  limitations, and routes it to a human assessor.
                </p>
                <div className="border border-navy-700 bg-navy-950/60 rounded-xl p-5 mb-6">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-slate-200 leading-relaxed">
                      <strong>Human Authority Principle:</strong> AI assists with structuring
                      submitted project descriptions and highlighting gaps. Only authorised human
                      assessors and partner institutions grant verified statuses.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onEnterDemo("evidence")}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-navy-950 bg-teal-400 rounded-lg hover:bg-teal-300 transition-colors cursor-pointer"
                >
                  <span>Inspect Live Evidence Engine</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="lg:col-span-7 bg-white text-slate-900 rounded-xl p-6 border border-slate-200">
                <p className="text-xs font-mono text-slate-500 mb-4">
                  Sample Verification Chain · Demonstration Project
                </p>
                <div className="space-y-4">
                  {[
                    {
                      icon: Layers,
                      label: "1. Claimed Skill",
                      value: "Node.js & REST API Engineering",
                    },
                    {
                      icon: FolderGit2,
                      label: "2. Supporting Project Evidence",
                      value:
                        "ClinicColdChain Monitor — Telemetry sync API description & sample repository reference",
                    },
                    {
                      icon: FileCheck2,
                      label: "3. AI-Assisted Competency Interpretation",
                      value:
                        "Project narrative indicates REST endpoint design, payload validation, and telemetry storage.",
                    },
                    {
                      icon: ShieldAlert,
                      label: "4. Explicit Evidence Limitations",
                      value:
                        "Repository code not live-fetched; automated API integration test output not yet attached.",
                    },
                    {
                      icon: UserCheck,
                      label: "5. Recommended Assessment & Human Decision",
                      value:
                        "Pending Human Assessment — Complete Sample Assessment Q5 & submit endpoint test output.",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-start gap-3.5 pb-4 border-b border-slate-200 last:border-b-0 last:pb-0"
                    >
                      <row.icon
                        className="w-4 h-4 text-teal-700 shrink-0 mt-1"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-xs font-semibold text-navy-900">{row.label}</p>
                        <p className="text-sm text-slate-600 mt-0.5">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Digital Passport Preview */}
        <section id="passport-preview" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
                  Digital Passport Preview
                </p>
                <h2 className="font-display text-3xl font-bold text-navy-900 tracking-tight">
                  Clear, verifiable candidate summary for assessors and employers.
                </h2>
              </div>
              <p className="text-xs font-mono text-slate-600">
                Sample Output · Fictional Demonstration Data
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-navy-900 text-white px-6 py-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={demoCandidate.profile.avatarUrl}
                    alt={demoCandidate.profile.fullName}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover border border-navy-700"
                  />
                  <div>
                    <p className="text-xs font-mono text-teal-300">
                      {demoCandidate.passportId} · Fictional Demonstration Profile
                    </p>
                    <h3 className="font-display text-xl font-bold">
                      {demoCandidate.profile.fullName}
                    </h3>
                    <p className="text-sm text-slate-300">{demoCandidate.profile.headline}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onEnterDemo("passport")}
                  className="px-4 py-2 text-xs font-semibold bg-white text-navy-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Open Full Passport View
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                  <h4 className="text-sm font-semibold text-navy-900">
                    Tracked Competencies & Verification States
                  </h4>
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                    {demoCandidate.skills.map((skill) => (
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
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <h4 className="text-sm font-semibold text-navy-900">
                    Featured Evidence Project (Demo Sample)
                  </h4>
                  {demoCandidate.projects[0] && (
                    <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <p className="text-sm font-semibold text-navy-900">
                        {demoCandidate.projects[0].title}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {demoCandidate.projects[0].description}
                      </p>
                      <p className="text-xs text-slate-500 mt-3 font-mono">
                        Stack: {demoCandidate.projects[0].technologies.join(" · ")}
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-navy-800">
                        <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
                        <span>
                          Qualification recorded: {demoCandidate.qualifications[0]?.title} (
                          Documentation Incomplete)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-lg font-bold text-navy-900">SkillProof</p>
            <p className="text-sm text-slate-600">
              Your skills. Your evidence. Your opportunities.
            </p>
          </div>
          <div className="text-xs text-slate-500 max-w-md sm:text-right leading-relaxed">
            <p>
              Built for PLP–ILO Mini-Hackathon Track 1: Credential Recognition & Skills Validation
              (SDG 4 & SDG 8).
            </p>
            <p className="mt-1">
              Demonstration profiles and sample assessments use fictional data and do not
              constitute official qualification recognition.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
