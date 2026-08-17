import { Clock, CheckCircle, XCircle, CheckCheck, Ban } from "lucide-react";

const statusConfigs = {
  pending: {
    style: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
    label: "Pending",
  },
  accepted: {
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
    label: "Accepted",
  },
  declined: {
    style: "bg-rose-50 text-rose-700 border-rose-200",
    icon: XCircle,
    label: "Declined",
  },
  completed: {
    style: "bg-sky-50 text-sky-700 border-sky-200",
    icon: CheckCheck,
    label: "Completed",
  },
  cancelled: {
    style: "bg-slate-100 text-slate-600 border-slate-200",
    icon: Ban,
    label: "Cancelled",
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfigs[status] || statusConfigs.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border shadow-2xs capitalize ${config.style}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}
