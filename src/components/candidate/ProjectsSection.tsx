import {
  ArrowLeft,
  Edit3,
  ExternalLink,
  FileSearch,
  FolderGit2,
  Globe,
  Plus,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { CandidateAccount, ProjectShowcase } from "../../types/skillproof";
import { validateGithubRepositoryUrl, validateSafeHttpUrl } from "../../utils/validation";
import { SkillStatusBadge } from "../common/StatusIndicator";

interface ProjectsSectionProps {
  candidate: CandidateAccount;
  onUpdateCandidate: (updated: CandidateAccount) => void;
  onAnalyzeProject: (projectId: string) => void;
}

const EMPTY_PROJECT: {
  title: string;
  description: string;
  problemAddressed: string;
  solutionDeveloped: string;
  technologiesText: string;
  roleAndContributions: string;
  githubUrl: string;
  liveDemoUrl: string;
  coverImageUrl: string;
  skillsText: string;
  completionDate: string;
  supportingEvidence: string;
} = {
  title: "",
  description: "",
  problemAddressed: "",
  solutionDeveloped: "",
  technologiesText: "",
  roleAndContributions: "",
  githubUrl: "",
  liveDemoUrl: "",
  coverImageUrl: "",
  skillsText: "",
  completionDate: "",
  supportingEvidence: "",
};

export function ProjectsSection({
  candidate,
  onUpdateCandidate,
  onAnalyzeProject,
}: ProjectsSectionProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const selectedProject = candidate.projects.find((p) => p.id === selectedProjectId) || null;

  function openNewForm() {
    setEditingId(null);
    setForm(EMPTY_PROJECT);
    setShowForm(true);
    setSelectedProjectId(null);
  }

  function openEditForm(p: ProjectShowcase) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      problemAddressed: p.problemAddressed,
      solutionDeveloped: p.solutionDeveloped,
      technologiesText: p.technologies.join(", "),
      roleAndContributions: p.roleAndContributions,
      githubUrl: p.githubUrl,
      liveDemoUrl: p.liveDemoUrl,
      coverImageUrl: p.coverImageUrl,
      skillsText: p.skillsDemonstrated.join(", "),
      completionDate: p.completionDate,
      supportingEvidence: p.supportingEvidence,
    });
    setShowForm(true);
    setSelectedProjectId(null);
  }

  function handleSaveProject(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.problemAddressed.trim()) {
      setFeedback({
        type: "error",
        text: "Project title, description, and problem addressed are required.",
      });
      return;
    }

    if (form.githubUrl.trim()) {
      const ghCheck = validateGithubRepositoryUrl(form.githubUrl);
      if (!ghCheck.valid) {
        setFeedback({ type: "error", text: ghCheck.message || "Invalid GitHub URL." });
        return;
      }
    }

    if (form.liveDemoUrl.trim()) {
      const demoCheck = validateSafeHttpUrl(form.liveDemoUrl);
      if (!demoCheck.valid) {
        setFeedback({ type: "error", text: demoCheck.message || "Invalid Live Demo URL." });
        return;
      }
    }

    if (form.coverImageUrl.trim() && !form.coverImageUrl.startsWith("/src/")) {
      const imgCheck = validateSafeHttpUrl(form.coverImageUrl);
      if (!imgCheck.valid) {
        setFeedback({ type: "error", text: "Cover image URL must be a valid https:// URL." });
        return;
      }
    }

    const technologies = form.technologiesText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const skillsDemonstrated = form.skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingId) {
      onUpdateCandidate({
        ...candidate,
        projects: candidate.projects.map((p) =>
          p.id === editingId
            ? {
                ...p,
                title: form.title.trim(),
                description: form.description.trim(),
                problemAddressed: form.problemAddressed.trim(),
                solutionDeveloped: form.solutionDeveloped.trim(),
                technologies,
                roleAndContributions: form.roleAndContributions.trim(),
                githubUrl: form.githubUrl.trim(),
                liveDemoUrl: form.liveDemoUrl.trim(),
                coverImageUrl: form.coverImageUrl.trim(),
                skillsDemonstrated,
                completionDate: form.completionDate.trim(),
                supportingEvidence: form.supportingEvidence.trim(),
              }
            : p
        ),
      });
      setFeedback({ type: "success", text: "Project updated in My Project Showcase." });
    } else {
      const created: ProjectShowcase = {
        id: `proj-${Date.now()}`,
        title: form.title.trim(),
        description: form.description.trim(),
        problemAddressed: form.problemAddressed.trim(),
        solutionDeveloped: form.solutionDeveloped.trim(),
        technologies,
        roleAndContributions: form.roleAndContributions.trim(),
        githubUrl: form.githubUrl.trim(),
        liveDemoUrl: form.liveDemoUrl.trim(),
        coverImageUrl: form.coverImageUrl.trim(),
        skillsDemonstrated,
        completionDate: form.completionDate.trim() || new Date().toISOString().slice(0, 7),
        supportingEvidence: form.supportingEvidence.trim(),
        analysisStatus: "not-analyzed",
        humanAssessmentStatus: "not-submitted",
      };
      onUpdateCandidate({
        ...candidate,
        projects: [...candidate.projects, created],
      });
      setFeedback({
        type: "success",
        text: "Project added! Run Evidence Analysis to map competencies from your submission.",
      });
    }

    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_PROJECT);
  }

  function handleDelete(id: string) {
    onUpdateCandidate({
      ...candidate,
      projects: candidate.projects.filter((p) => p.id !== id),
      evidenceAnalyses: candidate.evidenceAnalyses.filter((e) => e.projectId !== id),
    });
    if (selectedProjectId === id) setSelectedProjectId(null);
    setFeedback({ type: "success", text: "Project removed from showcase." });
  }

  // Project Detail View
  if (selectedProject) {
    const linkedAnalyses = candidate.evidenceAnalyses.filter(
      (e) => e.projectId === selectedProject.id
    );
    const githubCheck = validateGithubRepositoryUrl(selectedProject.githubUrl);

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setSelectedProjectId(null)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-navy-900 hover:text-teal-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to My Project Showcase</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {selectedProject.coverImageUrl ? (
            <div className="h-64 bg-slate-100 border-b border-slate-200">
              <img
                src={selectedProject.coverImageUrl}
                alt={selectedProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-32 bg-navy-900 text-white px-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-teal-300">Project Evidence Portfolio</p>
                <p className="font-display text-lg font-bold">{selectedProject.title}</p>
              </div>
              <FolderGit2 className="w-8 h-8 text-teal-400" aria-hidden="true" />
            </div>
          )}

          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-slate-500">
                  Completed {selectedProject.completionDate || "Date not specified"}
                  {selectedProject.isDemoData ? " · Fictional Demonstration Project" : ""}
                </p>
                <h2 className="font-display text-2xl font-bold text-navy-900 mt-1">
                  {selectedProject.title}
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onAnalyzeProject(selectedProject.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 cursor-pointer"
                >
                  <FileSearch className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Analyse Evidence</span>
                </button>
                <button
                  type="button"
                  onClick={() => openEditForm(selectedProject)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-navy-900 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Edit</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Problem Addressed
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedProject.problemAddressed}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Solution Developed
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedProject.solutionDeveloped || "Not detailed yet."}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Candidate Role & Contributions
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedProject.roleAndContributions || "Not detailed yet."}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Technologies & Skills Demonstrated
                </h3>
                <p className="text-sm text-navy-900 font-medium">
                  {selectedProject.technologies.join(" · ") || "None listed"}
                </p>
                {selectedProject.skillsDemonstrated.length > 0 && (
                  <p className="text-xs text-slate-600 mt-1">
                    Skills: {selectedProject.skillsDemonstrated.join(" · ")}
                  </p>
                )}
              </div>
            </div>

            {/* Project Evidence & Links */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-navy-900">
                  Project Evidence & External References
                </h3>
                <span className="text-xs font-mono text-slate-600">
                  Human Assessment:{" "}
                  {selectedProject.humanAssessmentStatus.replace(/-/g, " ")}
                </span>
              </div>

              <p className="text-sm text-slate-700">
                {selectedProject.supportingEvidence ||
                  "No additional supporting evidence notes provided."}
              </p>

              <div className="flex flex-wrap gap-3">
                {selectedProject.githubUrl && githubCheck.valid && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-navy-900 bg-white border border-slate-300 rounded-lg hover:border-navy-900"
                  >
                    <FolderGit2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {selectedProject.isDemoData
                        ? "Sample GitHub URL (Demo Data)"
                        : "View GitHub Repository"}
                    </span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                )}
                {selectedProject.liveDemoUrl && (
                  <a
                    href={selectedProject.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-navy-900 bg-white border border-slate-300 rounded-lg hover:border-navy-900"
                  >
                    <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {selectedProject.isDemoData
                        ? "Sample Demo URL (Placeholder)"
                        : "Open Live Demonstration"}
                    </span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                )}
              </div>

              <div className="flex items-start gap-2.5 pt-3 border-t border-slate-200 text-xs text-slate-600">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                <p>
                  <strong>Evidence Transparency Notice:</strong> SkillProof does not automatically
                  fetch or execute external GitHub repository code in this environment. AI-assisted
                  competency suggestions are generated strictly from submitted project information.
                </p>
              </div>
            </div>

            {/* Linked Suggested Competencies */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-navy-900">
                Suggested & Assessed Competencies from This Project
              </h3>
              {linkedAnalyses.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No competency analysis generated yet. Click "Analyse Evidence" above to inspect
                  suggested skills and evidence gaps.
                </p>
              ) : (
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                  {linkedAnalyses.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-navy-900">{item.skillName}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{item.explanation}</p>
                      </div>
                      <SkillStatusBadge status={item.assessmentStatus} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
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

      {/* Header + Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6">
        <div>
          <h2 className="font-display text-lg font-bold text-navy-900">My Project Showcase</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Present real technical, engineering, or field projects as concrete proof of applied
            skills.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewForm}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Showcase Project</span>
        </button>
      </div>

      {/* Add / Edit Project Form */}
      {showForm && (
        <form
          onSubmit={handleSaveProject}
          className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-navy-900">
              {editingId ? "Edit Showcase Project" : "Submit New Showcase Project"}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-500 hover:text-navy-900 cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="projTitle" className="block text-xs font-semibold text-navy-900 mb-1">
                Project Title *
              </label>
              <input
                id="projTitle"
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="projDate" className="block text-xs font-semibold text-navy-900 mb-1">
                Completion Date (YYYY-MM)
              </label>
              <input
                id="projDate"
                type="text"
                placeholder="2025-11"
                value={form.completionDate}
                onChange={(e) => setForm({ ...form, completionDate: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label htmlFor="projDesc" className="block text-xs font-semibold text-navy-900 mb-1">
              Project Summary / Description *
            </label>
            <textarea
              id="projDesc"
              rows={2}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="projProb" className="block text-xs font-semibold text-navy-900 mb-1">
                Problem Addressed *
              </label>
              <textarea
                id="projProb"
                rows={3}
                required
                value={form.problemAddressed}
                onChange={(e) => setForm({ ...form, problemAddressed: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="projSol" className="block text-xs font-semibold text-navy-900 mb-1">
                Solution Developed
              </label>
              <textarea
                id="projSol"
                rows={3}
                value={form.solutionDeveloped}
                onChange={(e) => setForm({ ...form, solutionDeveloped: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="projTech" className="block text-xs font-semibold text-navy-900 mb-1">
                Technologies / Tools Used (comma-separated)
              </label>
              <input
                id="projTech"
                type="text"
                placeholder="React, TypeScript, PostgreSQL, Docker"
                value={form.technologiesText}
                onChange={(e) => setForm({ ...form, technologiesText: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="projSkills" className="block text-xs font-semibold text-navy-900 mb-1">
                Skills Demonstrated (comma-separated)
              </label>
              <input
                id="projSkills"
                type="text"
                placeholder="REST API Design, State Management"
                value={form.skillsText}
                onChange={(e) => setForm({ ...form, skillsText: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label htmlFor="projRole" className="block text-xs font-semibold text-navy-900 mb-1">
              Your Role & Specific Contributions
            </label>
            <input
              id="projRole"
              type="text"
              value={form.roleAndContributions}
              onChange={(e) => setForm({ ...form, roleAndContributions: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="projGit" className="block text-xs font-semibold text-navy-900 mb-1">
                GitHub Repository URL (Optional, validated)
              </label>
              <input
                id="projGit"
                type="url"
                placeholder="https://github.com/username/repository"
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="projDemo" className="block text-xs font-semibold text-navy-900 mb-1">
                Live Demonstration URL (Optional)
              </label>
              <input
                id="projDemo"
                type="url"
                placeholder="https://example.org/demo"
                value={form.liveDemoUrl}
                onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="projImg" className="block text-xs font-semibold text-navy-900 mb-1">
                Screenshot / Cover Image URL (Optional)
              </label>
              <input
                id="projImg"
                type="text"
                placeholder="https://..."
                value={form.coverImageUrl}
                onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="projEv" className="block text-xs font-semibold text-navy-900 mb-1">
                Supporting Evidence Notes
              </label>
              <input
                id="projEv"
                type="text"
                placeholder="Test logs, commissioning reports, deployment notes"
                value={form.supportingEvidence}
                onChange={(e) => setForm({ ...form, supportingEvidence: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 cursor-pointer"
            >
              {editingId ? "Save Project Changes" : "Publish to Showcase"}
            </button>
          </div>
        </form>
      )}

      {/* Portfolio Cards */}
      {candidate.projects.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center">
          <p className="text-sm text-slate-600 mb-4">
            No projects submitted yet. Add at least one featured project to power the
            Evidence-to-Skills Verification Engine.
          </p>
          <button
            type="button"
            onClick={openNewForm}
            className="px-4 py-2 text-xs font-semibold text-white bg-navy-900 rounded-lg cursor-pointer"
          >
            Submit First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {candidate.projects.map((project) => (
            <article
              key={project.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                {project.coverImageUrl ? (
                  <div className="h-48 bg-slate-100 border-b border-slate-200">
                    <img
                      src={project.coverImageUrl}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-28 bg-navy-900 px-5 flex items-center justify-between text-white">
                    <span className="text-xs font-mono text-teal-300">
                      Applied Evidence Portfolio
                    </span>
                    <FolderGit2 className="w-5 h-5 text-teal-400" aria-hidden="true" />
                  </div>
                )}

                <div className="p-6 space-y-3">
                  <p className="text-xs font-mono text-slate-500">
                    {project.completionDate || "Recent"} ·{" "}
                    {project.isDemoData ? "Demonstration Sample" : "Candidate Submission"}
                  </p>
                  <h3 className="font-display text-lg font-bold text-navy-900 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  <p className="text-xs text-slate-700 font-mono">
                    {project.technologies.join(" · ")}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProjectId(project.id)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 cursor-pointer"
                  >
                    Project Details
                  </button>
                  <button
                    type="button"
                    onClick={() => onAnalyzeProject(project.id)}
                    className="px-3 py-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 cursor-pointer"
                  >
                    Analyse Evidence
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditForm(project)}
                    className="p-2 text-slate-600 hover:text-navy-900 border border-slate-200 bg-white rounded-lg cursor-pointer"
                    aria-label={`Edit ${project.title}`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-slate-600 hover:text-red-700 border border-slate-200 bg-white rounded-lg cursor-pointer"
                    aria-label={`Delete ${project.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
