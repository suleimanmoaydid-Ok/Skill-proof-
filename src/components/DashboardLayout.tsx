import {
  Award,
  BookOpen,
  ClipboardCheck,
  Compass,
  FileSearch,
  FolderGit2,
  GraduationCap,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  ShieldCheck,
  User,
  Wrench,
  X,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { CandidateAccount, DashboardSection } from "../types/skillproof";
import { calculateCandidateJourney } from "../utils/storage";

interface DashboardLayoutProps {
  candidate: CandidateAccount;
  activeRole: "candidate" | "assessor";
  activeSection: DashboardSection;
  onSelectSection: (section: DashboardSection) => void;
  onSwitchRole: (role: "candidate" | "assessor") => void;
  onBackToLanding: () => void;
  children: ReactNode;
}

const CANDIDATE_NAV: {
  id: DashboardSection;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "My Profile", icon: User },
  { id: "qualifications", label: "Qualifications", icon: GraduationCap },
  { id: "skills", label: "My Skills", icon: Wrench },
  { id: "projects", label: "My Projects", icon: FolderGit2 },
  { id: "evidence", label: "Evidence Analysis", icon: FileSearch },
  { id: "assessment", label: "Skills Assessment", icon: ClipboardCheck },
  { id: "credential-mapper", label: "Credential Mapper", icon: Compass },
  { id: "bridging", label: "Bridging Pathways", icon: BookOpen },
  { id: "passport", label: "Digital Passport", icon: Award },
  { id: "settings", label: "Settings", icon: Settings },
];

export function DashboardLayout({
  candidate,
  activeRole,
  activeSection,
  onSelectSection,
  onSwitchRole,
  onBackToLanding,
  children,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const journey = calculateCandidateJourney(candidate);

  const activeLabel =
    activeRole === "assessor"
      ? "Assessor & Verification Console"
      : CANDIDATE_NAV.find((item) => item.id === activeSection)?.label || "Overview";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside
        className={`no-print fixed inset-y-0 left-0 z-40 w-68 bg-navy-900 text-white flex flex-col border-r border-navy-800 transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-navy-800 shrink-0">
          <button
            type="button"
            onClick={onBackToLanding}
            className="font-display text-lg font-bold tracking-tight text-white hover:text-teal-300 transition-colors cursor-pointer"
          >
            SkillProof
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Role Switcher */}
        <div className="p-4 border-b border-navy-800">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
            Workspace Mode
          </p>
          <div className="grid grid-cols-2 gap-1 p-1 bg-navy-950 rounded-lg">
            <button
              type="button"
              onClick={() => {
                onSwitchRole("candidate");
                setMobileMenuOpen(false);
              }}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeRole === "candidate"
                  ? "bg-teal-600 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => {
                onSwitchRole("assessor");
                setMobileMenuOpen(false);
              }}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeRole === "assessor"
                  ? "bg-teal-600 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Assessor
            </button>
          </div>
        </div>

        {activeRole === "candidate" ? (
          <>
            <nav aria-label="Candidate dashboard sections" className="flex-1 overflow-y-auto p-3 space-y-1">
              {CANDIDATE_NAV.map((item) => {
                const isActive = activeSection === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-left cursor-pointer ${
                      isActive
                        ? "bg-navy-800 text-white border border-navy-700"
                        : "text-slate-300 hover:bg-navy-800/60 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-teal-400" : "text-slate-400"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-navy-800 bg-navy-950/40">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Journey Progress</span>
                <span className="font-mono tabular-nums text-teal-300">
                  {journey.completedCount}/12 ({journey.percentage}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-navy-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 transition-all duration-300"
                  style={{ width: `${journey.percentage}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 p-4 space-y-4">
            <div className="p-3.5 rounded-lg bg-navy-950/60 border border-navy-800">
              <div className="flex items-center gap-2 text-teal-300 mb-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="text-xs font-semibold">Authorised Review Mode</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Human assessors review candidate evidence independently of AI-suggested
                interpretations and record formal review notes.
              </p>
            </div>
          </div>
        )}

        <div className="p-3 border-t border-navy-800">
          <button
            type="button"
            onClick={onBackToLanding}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-navy-800 rounded-lg transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Back to Public Overview</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Workspace Top Bar */}
        <header className="no-print h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-navy-900 rounded-lg border border-slate-200 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 truncate">
                {activeRole === "assessor" ? "Assessor Console" : "Candidate Workspace"} ·{" "}
                {activeLabel}
              </p>
              <h1 className="font-display text-base sm:text-lg font-bold text-navy-900 truncate">
                {activeLabel}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activeRole === "candidate" && (
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-navy-900 truncate max-w-[200px]">
                  {candidate.profile.fullName || "Unnamed Candidate"}
                </p>
                <p className="text-[11px] font-mono text-slate-500">
                  {candidate.isDemoAccount ? "Fictional Demo Account" : candidate.passportId}
                </p>
              </div>
            )}
            {activeRole === "candidate" && (
              <button
                type="button"
                onClick={() => onSelectSection("passport")}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                View Passport
              </button>
            )}
          </div>
        </header>

        {/* Demo Account Banner */}
        {activeRole === "candidate" && candidate.isDemoAccount && (
          <div className="no-print bg-teal-50 border-b border-teal-200 px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-teal-900">
            <p>
              <strong>Demonstration Account Active:</strong> Viewing fictional candidate data (
              {candidate.profile.fullName}). Sample assessments and simulated analyses do not
              represent official verification.
            </p>
            <button
              type="button"
              onClick={() => onSelectSection("settings")}
              className="font-semibold underline underline-offset-2 hover:text-teal-950 whitespace-nowrap cursor-pointer"
            >
              Switch or Create Personal Profile
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
