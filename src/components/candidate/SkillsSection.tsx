import { Edit3, Plus, Search, Send, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { CandidateAccount, SkillItem, SkillStatus } from "../../types/skillproof";
import { SKILL_STATUS_META, SkillStatusBadge } from "../common/StatusIndicator";

interface SkillsSectionProps {
  candidate: CandidateAccount;
  onUpdateCandidate: (updated: CandidateAccount) => void;
}

export function SkillsSection({ candidate, onUpdateCandidate }: SkillsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SkillStatus | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Technical & Digital");
  const [proficiencyContext, setProficiencyContext] = useState("");
  const [evidenceSummary, setEvidenceSummary] = useState("");
  const [linkedProjectId, setLinkedProjectId] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const filteredSkills = useMemo(() => {
    return candidate.skills.filter((skill) => {
      const matchesStatus = statusFilter === "all" || skill.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        skill.name.toLowerCase().includes(q) ||
        skill.category.toLowerCase().includes(q) ||
        skill.evidenceSummary.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [candidate.skills, searchQuery, statusFilter]);

  function resetForm() {
    setEditingId(null);
    setName("");
    setCategory("Technical & Digital");
    setProficiencyContext("");
    setEvidenceSummary("");
    setLinkedProjectId("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setFeedback({ type: "error", text: "Skill name is required." });
      return;
    }

    const hasEvidence = Boolean(evidenceSummary.trim() || linkedProjectId);
    const derivedStatus: SkillStatus = hasEvidence ? "evidence-submitted" : "self-reported";

    if (editingId) {
      onUpdateCandidate({
        ...candidate,
        skills: candidate.skills.map((s) => {
          if (s.id !== editingId) return s;
          const preserveHumanOrVerified =
            s.status === "human-assessed" ||
            s.status === "verified-organisation" ||
            s.status === "pending-human-assessment";
          return {
            ...s,
            name: name.trim(),
            category: category.trim(),
            proficiencyContext: proficiencyContext.trim(),
            evidenceSummary: evidenceSummary.trim(),
            linkedProjectIds: linkedProjectId ? [linkedProjectId] : [],
            status: preserveHumanOrVerified ? s.status : derivedStatus,
            lastUpdated: new Date().toISOString().slice(0, 10),
          };
        }),
      });
      setFeedback({ type: "success", text: "Skill updated." });
      resetForm();
    } else {
      const created: SkillItem = {
        id: `skill-${Date.now()}`,
        name: name.trim(),
        category: category.trim() || "General Competency",
        proficiencyContext: proficiencyContext.trim(),
        status: derivedStatus,
        linkedProjectIds: linkedProjectId ? [linkedProjectId] : [],
        linkedQualificationIds: [],
        evidenceSummary:
          evidenceSummary.trim() || "Self-reported by candidate; attach project evidence for review.",
        lastUpdated: new Date().toISOString().slice(0, 10),
      };
      onUpdateCandidate({
        ...candidate,
        skills: [...candidate.skills, created],
      });
      setFeedback({ type: "success", text: "Skill added to your SkillProof profile." });
      resetForm();
    }
  }

  function handleEdit(skill: SkillItem) {
    setEditingId(skill.id);
    setName(skill.name);
    setCategory(skill.category);
    setProficiencyContext(skill.proficiencyContext);
    setEvidenceSummary(skill.evidenceSummary);
    setLinkedProjectId(skill.linkedProjectIds[0] || "");
  }

  function handleDelete(id: string) {
    onUpdateCandidate({
      ...candidate,
      skills: candidate.skills.filter((s) => s.id !== id),
    });
    if (editingId === id) resetForm();
    setFeedback({ type: "success", text: "Skill removed." });
  }

  function handleRequestAssessment(skillId: string) {
    onUpdateCandidate({
      ...candidate,
      skills: candidate.skills.map((s) =>
        s.id === skillId
          ? {
              ...s,
              status: "pending-human-assessment",
              lastUpdated: new Date().toISOString().slice(0, 10),
            }
          : s
      ),
    });
    setFeedback({
      type: "success",
      text: "Skill queued for human assessor review in the Assessor Console.",
    });
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

      {/* Status Legend */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h2 className="font-display text-sm font-bold text-navy-900 mb-3">
          Skill Verification States (Strict Evidence Separation)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {(Object.keys(SKILL_STATUS_META) as SkillStatus[]).map((key) => (
            <div key={key} className="flex flex-col gap-1 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="self-start">
                <SkillStatusBadge status={key} />
              </div>
              <p className="text-slate-600 mt-1">{SKILL_STATUS_META[key].shortDescription}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & List */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search skills or evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: "all", label: "All" },
                { id: "self-reported", label: "Self-Reported" },
                { id: "evidence-submitted", label: "Evidence Submitted" },
                { id: "ai-suggested", label: "AI-Suggested" },
                { id: "pending-human-assessment", label: "Pending Assessment" },
                { id: "human-assessed", label: "Human-Assessed" },
                { id: "verified-organisation", label: "Verified" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-navy-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredSkills.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-300 rounded-lg">
            <p className="text-sm text-slate-600">
              No skills match the current filter. Add a skill below or clear your filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-sm font-semibold text-navy-900">{skill.name}</h3>
                    <SkillStatusBadge status={skill.status} />
                  </div>
                  <p className="text-xs text-slate-500">
                    {skill.category} · Updated{" "}
                    <span className="font-mono tabular-nums">{skill.lastUpdated}</span>
                  </p>
                  {skill.proficiencyContext && (
                    <p className="text-xs text-slate-700">{skill.proficiencyContext}</p>
                  )}
                  <p className="text-xs text-slate-600">
                    <strong>Evidence:</strong> {skill.evidenceSummary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {(skill.status === "evidence-submitted" ||
                    skill.status === "ai-suggested" ||
                    skill.status === "self-reported") && (
                    <button
                      type="button"
                      onClick={() => handleRequestAssessment(skill.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Submit for Human Review</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEdit(skill)}
                    className="p-2 text-slate-600 hover:text-navy-900 border border-slate-200 rounded-lg cursor-pointer"
                    aria-label={`Edit ${skill.name}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(skill.id)}
                    className="p-2 text-slate-600 hover:text-red-700 border border-slate-200 rounded-lg cursor-pointer"
                    aria-label={`Delete ${skill.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Skill Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
      >
        <h3 className="font-display text-base font-bold text-navy-900">
          {editingId ? "Edit Skill Record" : "Add Professional Skill"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="skillName" className="block text-xs font-semibold text-navy-900 mb-1">
              Skill Name *
            </label>
            <input
              id="skillName"
              type="text"
              required
              placeholder="e.g., Structural CAD Drafting, Python ETL Pipelines"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="skillCat" className="block text-xs font-semibold text-navy-900 mb-1">
              Competency Category
            </label>
            <select
              id="skillCat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              <option value="Frontend Engineering">Frontend Engineering</option>
              <option value="Backend & Systems">Backend & Systems</option>
              <option value="Data & Persistence">Data & Persistence</option>
              <option value="Renewable Energy Systems">Renewable Energy Systems</option>
              <option value="Electrical Safety">Electrical Safety</option>
              <option value="Healthcare & Clinical Operations">Healthcare & Clinical Operations</option>
              <option value="Civil & Structural Engineering">Civil & Structural Engineering</option>
              <option value="Technical & Digital">Technical & Digital</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="skillContext" className="block text-xs font-semibold text-navy-900 mb-1">
              Experience Context
            </label>
            <input
              id="skillContext"
              type="text"
              placeholder="Years or setting where this skill was applied"
              value={proficiencyContext}
              onChange={(e) => setProficiencyContext(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="linkedProj" className="block text-xs font-semibold text-navy-900 mb-1">
              Link Supporting Project (Optional)
            </label>
            <select
              id="linkedProj"
              value={linkedProjectId}
              onChange={(e) => setLinkedProjectId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              <option value="">None linked yet</option>
              {candidate.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="skillEvidence" className="block text-xs font-semibold text-navy-900 mb-1">
            Supporting Evidence Summary
          </label>
          <textarea
            id="skillEvidence"
            rows={2}
            placeholder="Describe project deliverables, test logs, or employer verification supporting this skill"
            value={evidenceSummary}
            onChange={(e) => setEvidenceSummary(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
          />
        </div>

        <div className="flex justify-end gap-3">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>{editingId ? "Update Skill" : "Add Skill"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
