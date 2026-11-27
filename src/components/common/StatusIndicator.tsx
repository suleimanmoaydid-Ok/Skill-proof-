import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { QualificationStatus, SkillStatus } from "../../types/skillproof";

export const SKILL_STATUS_META: Record<
  SkillStatus,
  {
    label: string;
    shortDescription: string;
    textClass: string;
    bgClass: string;
    borderClass: string;
  }
> = {
  "self-reported": {
    label: "Self-Reported",
    shortDescription: "Claimed by candidate; no supporting evidence linked yet.",
    textClass: "text-slate-700",
    bgClass: "bg-slate-100",
    borderClass: "border-slate-300",
  },
  "evidence-submitted": {
    label: "Evidence Submitted",
    shortDescription: "Supporting project or qualification record attached.",
    textClass: "text-navy-800",
    bgClass: "bg-navy-50",
    borderClass: "border-navy-100",
  },
  "ai-suggested": {
    label: "AI-Suggested (Unverified)",
    shortDescription: "Advisory suggestion from submitted text; requires human review.",
    textClass: "text-teal-800",
    bgClass: "bg-teal-50",
    borderClass: "border-teal-200",
  },
  "pending-human-assessment": {
    label: "Pending Human Assessment",
    shortDescription: "Queued for review by a human technical assessor.",
    textClass: "text-amber-800",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
  },
  "human-assessed": {
    label: "Human-Assessed",
    shortDescription: "Reviewed by a human assessor against submitted evidence.",
    textClass: "text-navy-900",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
  },
  "verified-organisation": {
    label: "Verified by Authorised Organisation",
    shortDescription: "Confirmed by an authorised assessment or partner body.",
    textClass: "text-emerald-800",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
  },
};

export const QUALIFICATION_STATUS_META: Record<
  QualificationStatus,
  {
    label: string;
    textClass: string;
    bgClass: string;
    borderClass: string;
  }
> = {
  unverified: {
    label: "Unverified Record",
    textClass: "text-slate-700",
    bgClass: "bg-slate-100",
    borderClass: "border-slate-300",
  },
  "documentation-incomplete": {
    label: "Documentation Incomplete",
    textClass: "text-amber-800",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
  },
  "submitted-for-review": {
    label: "Submitted for Advisory Review",
    textClass: "text-navy-800",
    bgClass: "bg-navy-50",
    borderClass: "border-navy-100",
  },
  "assessment-recommended": {
    label: "Practical Assessment Recommended",
    textClass: "text-teal-800",
    bgClass: "bg-teal-50",
    borderClass: "border-teal-200",
  },
  "verified-by-authority": {
    label: "Verified by Authorised Body",
    textClass: "text-emerald-800",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
  },
};

export function SkillStatusBadge({ status }: { status: SkillStatus }) {
  const meta = SKILL_STATUS_META[status];
  const Icon =
    status === "verified-organisation"
      ? ShieldCheck
      : status === "human-assessed"
      ? UserCheck
      : status === "pending-human-assessment"
      ? Clock
      : status === "ai-suggested"
      ? Sparkles
      : status === "evidence-submitted"
      ? FileText
      : AlertCircle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border whitespace-nowrap ${meta.bgClass} ${meta.textClass} ${meta.borderClass}`}
      title={meta.shortDescription}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{meta.label}</span>
    </span>
  );
}

export function QualificationStatusBadge({ status }: { status: QualificationStatus }) {
  const meta = QUALIFICATION_STATUS_META[status];
  const Icon =
    status === "verified-by-authority"
      ? CheckCircle2
      : status === "documentation-incomplete"
      ? AlertCircle
      : status === "submitted-for-review"
      ? Clock
      : FileText;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border whitespace-nowrap ${meta.bgClass} ${meta.textClass} ${meta.borderClass}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{meta.label}</span>
    </span>
  );
}
