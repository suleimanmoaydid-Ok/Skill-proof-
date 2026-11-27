import { Download, RefreshCw, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { CandidateAccount } from "../../types/skillproof";

interface SettingsSectionProps {
  activeCandidate: CandidateAccount;
  allCandidates: CandidateAccount[];
  onSwitchCandidate: (candidateId: string) => void;
  onCreatePersonalCandidate: (fullName: string) => void;
  onResetDemoData: () => void;
}

export function SettingsSection({
  activeCandidate,
  allCandidates,
  onSwitchCandidate,
  onCreatePersonalCandidate,
  onResetDemoData,
}: SettingsSectionProps) {
  const [newCandidateName, setNewCandidateName] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleCreatePersonal(e: FormEvent) {
    e.preventDefault();
    if (!newCandidateName.trim()) {
      return;
    }
    onCreatePersonalCandidate(newCandidateName.trim());
    setNewCandidateName("");
    setFeedback("Created and switched to your new personal candidate profile.");
  }

  function handleExportJson() {
    const blob = new Blob([JSON.stringify(activeCandidate, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeCandidate.passportId.toLowerCase()}-skillproof.json`;
    link.click();
    URL.revokeObjectURL(url);
    setFeedback("Candidate SkillProof data exported as JSON.");
  }

  return (
    <div className="space-y-8">
      {feedback && (
        <div role="status" className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-900">
          {feedback}
        </div>
      )}

      {/* Account Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div>
          <h2 className="font-display text-lg font-bold text-navy-900">
            Active Candidate Account & Demonstration Profiles
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Switch between fictional demonstration accounts or create your own local candidate
            profile. All edits persist in your browser's local storage.
          </p>
        </div>

        <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
          {allCandidates.map((cand) => {
            const isActive = cand.id === activeCandidate.id;
            return (
              <div
                key={cand.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-semibold text-navy-900">
                    {cand.profile.fullName || "Unnamed Candidate"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {cand.isDemoAccount ? "Fictional Demonstration Account" : "Personal Profile"} ·{" "}
                    <span className="font-mono">{cand.passportId}</span>
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isActive}
                  onClick={() => onSwitchCandidate(cand.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                    isActive
                      ? "bg-teal-50 text-teal-900 border border-teal-200 cursor-default"
                      : "bg-navy-900 text-white hover:bg-navy-800"
                  }`}
                >
                  {isActive ? "Currently Active" : "Switch to Account"}
                </button>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleCreatePersonal} className="pt-4 border-t border-slate-200 space-y-3">
          <p className="text-xs font-semibold text-navy-900">Create New Personal Profile</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="Enter candidate full name"
              value={newCandidateName}
              onChange={(e) => setNewCandidateName(e.target.value)}
              className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 whitespace-nowrap cursor-pointer"
            >
              <UserPlus className="w-4 h-4" aria-hidden="true" />
              <span>Create & Activate Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Data Backup & Reset */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h3 className="font-display text-base font-bold text-navy-900">
          Data Portability & Reset
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Export your active SkillProof record as portable JSON, or restore the original
          demonstration dataset.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-navy-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200/70 cursor-pointer"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Export Active Profile (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onResetDemoData();
              setFeedback("Demonstration dataset restored cleanly.");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Reset Demonstration Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
