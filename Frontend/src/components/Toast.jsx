import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />,
  };

  const bgStyles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
    error: "bg-red-50 border-red-200 text-red-900",
    info: "bg-sky-50 border-sky-200 text-sky-900",
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full px-4 animate-slideUp">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bgStyles[toast.type || "info"]}`}>
        {icons[toast.type || "info"]}
        <div className="flex-1 text-sm font-medium pr-2 leading-snug">
          {toast.message}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
