import { Edit3, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { CandidateAccount, QualificationRecord, QualificationStatus } from "../../types/skillproof";
import { validateCompletionYear } from "../../utils/validation";
import { QualificationStatusBadge } from "../common/StatusIndicator";

interface QualificationsSectionProps {
  candidate: CandidateAccount;
  onUpdateCandidate: (updated: CandidateAccount) => void;
  onOpenMapper: () => void;
}

const EMPTY_QUAL: Omit<QualificationRecord, "id"> = {
  title: "",
  institution: "",
  countryOfAward: "",
  yearOfCompletion: "",
  qualificationLevel: "",
  supportingDocuments: "",
  missingDocumentsNote: "",
  verificationStatus: "unverified",
};

export function QualificationsSection({
  candidate,
  onUpdateCandidate,
  onOpenMapper,
}: QualificationsSectionProps) {
  const [form, setForm] = useState<Omit<QualificationRecord, "id">>(EMPTY_QUAL);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.institution.trim() || !form.countryOfAward.trim()) {
      setFeedback({
        type: "error",
        text: "Qualification title, institution, and country of award are required.",
      });
      return;
    }

    const yearCheck = validateCompletionYear(form.yearOfCompletion);
    if (!yearCheck.valid) {
      setFeedback({ type: "error", text: yearCheck.message || "Invalid completion year." });
      return;
    }

    if (editingId) {
      onUpdateCandidate({
        ...candidate,
        qualifications: candidate.qualifications.map((q) =>
          q.id === editingId ? { ...form, id: editingId, isDemoData: q.isDemoData } : q
        ),
      });
      setEditingId(null);
      setForm(EMPTY_QUAL);
      setFeedback({ type: "success", text: "Qualification record updated." });
    } else {
      const created: QualificationRecord = {
        ...form,
        id: `qual-${Date.now()}`,
      };
      onUpdateCandidate({
        ...candidate,
        qualifications: [...candidate.qualifications, created],
      });
      setForm(EMPTY_QUAL);
      setFeedback({ type: "success", text: "Qualification record added." });
    }
  }

  function handleEdit(q: QualificationRecord) {
    setEditingId(q.id);
    setForm({
      title: q.title,
      institution: q.institution,
      countryOfAward: q.countryOfAward,
      yearOfCompletion: q.yearOfCompletion,
      qualificationLevel: q.qualificationLevel,
      supportingDocuments: q.supportingDocuments,
      missingDocumentsNote: q.missingDocumentsNote,
      verificationStatus: q.verificationStatus,
    });
  }

  function handleDelete(id: string) {
    onUpdateCandidate({
      ...candidate,
      qualifications: candidate.qualifications.filter((q) => q.id !== id),
    });
    if (editingId === id) {
      setEditingId(null);
      setForm(EMPTY_QUAL);
    }
    setFeedback({ type: "success", text: "Qualification record deleted." });
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

      {/* Existing Qualifications */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-navy-900">
              Education & Qualification Records
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Record academic degrees, vocational diplomas, or trade certificates—even if paper
              transcripts are incomplete.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenMapper}
            className="px-3.5 py-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100/70 cursor-pointer"
          >
            Open Credential Mapper Guidance
          </button>
        </div>

        {candidate.qualifications.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-300 rounded-lg">
            <p className="text-sm text-slate-600">
              No qualifications added yet. Use the form below to record your first qualification.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {candidate.qualifications.map((q) => (
              <div
                key={q.id}
                className="border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-semibold text-navy-900">{q.title}</h3>
                    <QualificationStatusBadge status={q.verificationStatus} />
                  </div>
                  <p className="text-xs text-slate-600">
                    {q.institution} · {q.countryOfAward} · Completed{" "}
                    <span className="font-mono tabular-nums">{q.yearOfCompletion}</span>
                    {q.qualificationLevel ? ` · ${q.qualificationLevel}` : ""}
                  </p>
                  {q.supportingDocuments && (
                    <p className="text-xs text-slate-700 pt-1">
                      <strong>Supporting Documents:</strong> {q.supportingDocuments}
                    </p>
                  )}
                  {q.missingDocumentsNote && (
                    <p className="text-xs text-amber-800">
                      <strong>Missing / Limitation Note:</strong> {q.missingDocumentsNote}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(q)}
                    className="p-2 text-slate-600 hover:text-navy-900 border border-slate-200 rounded-lg cursor-pointer"
                    aria-label={`Edit ${q.title}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(q.id)}
                    className="p-2 text-slate-600 hover:text-red-700 border border-slate-200 rounded-lg cursor-pointer"
                    aria-label={`Delete ${q.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Qualification Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
      >
        <h3 className="font-display text-base font-bold text-navy-900">
          {editingId ? "Edit Qualification Record" : "Add Qualification"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="qualTitle" className="block text-xs font-semibold text-navy-900 mb-1">
              Qualification Title *
            </label>
            <input
              id="qualTitle"
              type="text"
              required
              placeholder="e.g., B.Sc. Civil Engineering or Diploma in Nursing"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="qualInst" className="block text-xs font-semibold text-navy-900 mb-1">
              Awarding Institution *
            </label>
            <input
              id="qualInst"
              type="text"
              required
              value={form.institution}
              onChange={(e) => setForm({ ...form, institution: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="qualCountry" className="block text-xs font-semibold text-navy-900 mb-1">
              Country of Award *
            </label>
            <input
              id="qualCountry"
              type="text"
              required
              value={form.countryOfAward}
              onChange={(e) => setForm({ ...form, countryOfAward: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="qualYear" className="block text-xs font-semibold text-navy-900 mb-1">
                Year Completed *
              </label>
              <input
                id="qualYear"
                type="text"
                required
                placeholder="2018"
                value={form.yearOfCompletion}
                onChange={(e) => setForm({ ...form, yearOfCompletion: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="qualLevel" className="block text-xs font-semibold text-navy-900 mb-1">
                Level (if known)
              </label>
              <input
                id="qualLevel"
                type="text"
                placeholder="EQF Level 6 / TVET 5"
                value={form.qualificationLevel}
                onChange={(e) => setForm({ ...form, qualificationLevel: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="qualDocs" className="block text-xs font-semibold text-navy-900 mb-1">
              Supporting Documents Available
            </label>
            <textarea
              id="qualDocs"
              rows={2}
              placeholder="Describe scans, reference letters, or partial transcripts available"
              value={form.supportingDocuments}
              onChange={(e) => setForm({ ...form, supportingDocuments: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="qualMissing" className="block text-xs font-semibold text-navy-900 mb-1">
              Missing Documents / Context Note
            </label>
            <textarea
              id="qualMissing"
              rows={2}
              placeholder="Note any records lost or pending translation"
              value={form.missingDocumentsNote}
              onChange={(e) => setForm({ ...form, missingDocumentsNote: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <label htmlFor="qualStatus" className="block text-xs font-semibold text-navy-900 mb-1">
              Current Documentation Status
            </label>
            <select
              id="qualStatus"
              value={form.verificationStatus}
              onChange={(e) =>
                setForm({ ...form, verificationStatus: e.target.value as QualificationStatus })
              }
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="unverified">Unverified Record</option>
              <option value="documentation-incomplete">Documentation Incomplete</option>
              <option value="submitted-for-review">Submitted for Advisory Review</option>
              <option value="assessment-recommended">Practical Assessment Recommended</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY_QUAL);
                }}
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
              <span>{editingId ? "Update Qualification" : "Add Qualification"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
