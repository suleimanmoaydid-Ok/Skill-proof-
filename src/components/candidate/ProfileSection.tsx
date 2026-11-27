import { Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { CandidateAccount, WorkExperienceRecord } from "../../types/skillproof";

interface ProfileSectionProps {
  candidate: CandidateAccount;
  onUpdateCandidate: (updated: CandidateAccount) => void;
}

export function ProfileSection({ candidate, onUpdateCandidate }: ProfileSectionProps) {
  const [profileForm, setProfileForm] = useState(candidate.profile);
  const [languagesInput, setLanguagesInput] = useState(candidate.profile.languages.join(", "));
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const [newExp, setNewExp] = useState<Omit<WorkExperienceRecord, "id">>({
    roleTitle: "",
    organisation: "",
    country: "",
    startYear: "",
    endYear: "",
    summary: "",
  });

  function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    if (!profileForm.fullName.trim() || !profileForm.headline.trim()) {
      setFeedback({
        type: "error",
        text: "Full name and professional headline are required.",
      });
      return;
    }

    const parsedLanguages = languagesInput
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);

    onUpdateCandidate({
      ...candidate,
      profile: {
        ...profileForm,
        fullName: profileForm.fullName.trim(),
        headline: profileForm.headline.trim(),
        bio: profileForm.bio.trim(),
        languages: parsedLanguages,
      },
    });
    setFeedback({
      type: "success",
      text: "Professional profile saved to local storage.",
    });
  }

  function handleAddExperience(e: FormEvent) {
    e.preventDefault();
    if (!newExp.roleTitle.trim() || !newExp.organisation.trim()) {
      setFeedback({
        type: "error",
        text: "Role title and organisation are required to add work experience.",
      });
      return;
    }

    const record: WorkExperienceRecord = {
      ...newExp,
      id: `exp-${Date.now()}`,
    };
    onUpdateCandidate({
      ...candidate,
      workExperience: [...candidate.workExperience, record],
    });
    setNewExp({
      roleTitle: "",
      organisation: "",
      country: "",
      startYear: "",
      endYear: "",
      summary: "",
    });
    setFeedback({ type: "success", text: "Work experience entry added." });
  }

  function handleDeleteExperience(id: string) {
    onUpdateCandidate({
      ...candidate,
      workExperience: candidate.workExperience.filter((item) => item.id !== id),
    });
    setFeedback({ type: "success", text: "Work experience entry removed." });
  }

  return (
    <div className="space-y-8">
      {feedback && (
        <div
          role="status"
          className={`p-4 rounded-lg border text-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <form
        onSubmit={handleSaveProfile}
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
      >
        <div>
          <h2 className="font-display text-lg font-bold text-navy-900">
            Personal & Professional Profile
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Origin and current country fields are optional and help Credential Mapper tailor
            recognition guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold text-navy-900 mb-1.5">
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={profileForm.fullName}
              onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label htmlFor="headline" className="block text-xs font-semibold text-navy-900 mb-1.5">
              Professional Headline *
            </label>
            <input
              id="headline"
              type="text"
              required
              value={profileForm.headline}
              onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
              placeholder="e.g., Civil Infrastructure Engineer · Water Systems"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label
              htmlFor="originCountry"
              className="block text-xs font-semibold text-navy-900 mb-1.5"
            >
              Country of Origin (Optional)
            </label>
            <input
              id="originCountry"
              type="text"
              value={profileForm.originCountry}
              onChange={(e) => setProfileForm({ ...profileForm, originCountry: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label
              htmlFor="currentCountry"
              className="block text-xs font-semibold text-navy-900 mb-1.5"
            >
              Current Host Country (Optional)
            </label>
            <input
              id="currentCountry"
              type="text"
              value={profileForm.currentCountry}
              onChange={(e) => setProfileForm({ ...profileForm, currentCountry: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label
              htmlFor="targetSector"
              className="block text-xs font-semibold text-navy-900 mb-1.5"
            >
              Target Sector
            </label>
            <input
              id="targetSector"
              type="text"
              value={profileForm.targetSector}
              onChange={(e) => setProfileForm({ ...profileForm, targetSector: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label htmlFor="languages" className="block text-xs font-semibold text-navy-900 mb-1.5">
              Languages (comma-separated)
            </label>
            <input
              id="languages"
              type="text"
              value={languagesInput}
              onChange={(e) => setLanguagesInput(e.target.value)}
              placeholder="Arabic (Native), English (B2)"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-xs font-semibold text-navy-900 mb-1.5">
            Short Professional Biography
          </label>
          <textarea
            id="bio"
            rows={4}
            value={profileForm.bio}
            onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors cursor-pointer"
          >
            Save Profile Changes
          </button>
        </div>
      </form>

      {/* Work Experience Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div>
          <h3 className="font-display text-lg font-bold text-navy-900">Work Experience</h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Document prior employment, community technical work, or field roles.
          </p>
        </div>

        {candidate.workExperience.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 border border-dashed border-slate-300 rounded-lg text-center">
            No work experience entries recorded yet.
          </p>
        ) : (
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
            {candidate.workExperience.map((exp) => (
              <div key={exp.id} className="p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-navy-900">{exp.roleTitle}</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {exp.organisation} · {exp.country || "Country not specified"} ·{" "}
                    <span className="font-mono tabular-nums">
                      {exp.startYear || "?"} – {exp.endYear || "Present"}
                    </span>
                  </p>
                  {exp.summary && (
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.summary}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteExperience(exp.id)}
                  className="p-1.5 text-slate-400 hover:text-red-700 cursor-pointer"
                  aria-label={`Delete ${exp.roleTitle}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddExperience} className="pt-4 border-t border-slate-200 space-y-4">
          <p className="text-xs font-semibold text-navy-900">Add Work Experience</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Role Title *"
              value={newExp.roleTitle}
              onChange={(e) => setNewExp({ ...newExp, roleTitle: e.target.value })}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Organisation *"
              value={newExp.organisation}
              onChange={(e) => setNewExp({ ...newExp, organisation: e.target.value })}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Country"
              value={newExp.country}
              onChange={(e) => setNewExp({ ...newExp, country: e.target.value })}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Start Year (e.g. 2019)"
              value={newExp.startYear}
              onChange={(e) => setNewExp({ ...newExp, startYear: e.target.value })}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="End Year (e.g. 2023)"
              value={newExp.endYear}
              onChange={(e) => setNewExp({ ...newExp, endYear: e.target.value })}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Key responsibilities & outcomes"
              value={newExp.summary}
              onChange={(e) => setNewExp({ ...newExp, summary: e.target.value })}
              className="md:col-span-2 px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-navy-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200/70 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add Work Experience</span>
          </button>
        </form>
      </div>
    </div>
  );
}
