import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import Toast from "../components/Toast";
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Calendar,
  Dog,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Receipt
} from "lucide-react";

const SERVICE_TYPES = ["Dog Walking", "Pet Sitting", "Overnight Care", "Drop-in Visit", "Grooming"];

export default function BookSitter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sitter, setSitter] = useState(null);
  const [pets, setPets] = useState([]);
  
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    petId: "",
    startDate: today,
    endDate: today,
    serviceType: "Pet Sitting",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    Promise.all([api.sitters.get(id), api.pets.list()])
      .then(([sitterData, petsData]) => {
        setSitter(sitterData);
        setPets(petsData);
        if (petsData.length > 0) {
          setForm((f) => ({ ...f, petId: petsData[0].id }));
        }
      })
      .catch((err) => setError(err.message || "Failed to load sitter details."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "startDate" && new Date(updated.endDate) < new Date(value)) {
        updated.endDate = value;
      }
      return updated;
    });
  };

  // Price Calculation Logic: Days = Max(1, difference in days + 1)
  const calculateEstimate = () => {
    if (!sitter || !form.startDate || !form.endDate) return { days: 1, rate: 25, total: 25 };
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diffTime = Math.abs(end - start);
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
    const rate = typeof sitter.hourlyRate === "number" ? sitter.hourlyRate : Number(sitter.hourlyRate) || 25;
    return {
      days,
      rate,
      total: days * rate,
    };
  };

  const estimate = calculateEstimate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.petId) {
      setError("Please select a registered pet for this booking.");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    setSubmitting(true);
    try {
      await api.bookings.create({ sitterId: id, ...form });
      setToast({ type: "success", message: "Booking request submitted successfully!" });
      setTimeout(() => {
        navigate("/bookings");
      }, 600);
    } catch (err) {
      setError(err.message || "Failed to submit booking request.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
        <span>Loading sitter details...</span>
      </div>
    );
  }

  if (!sitter) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center card space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <p className="text-slate-600">Sitter not found or no longer available.</p>
        <Link to="/sitters" className="btn-primary text-sm inline-flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Sitters
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Toast Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Navigation Back Link */}
      <Link to="/sitters" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Sitters List
      </Link>

      {/* Sitter Profile Overview Header Card */}
      <div className="card bg-white border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xl shadow-2xs">
            {sitter.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold text-slate-900">{sitter.name}</h1>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {sitter.location || "Location set"}
              </span>
              <span>•</span>
              <span className="font-bold text-primary-700">₹{sitter.hourlyRate}/hr</span>
            </div>
          </div>
        </div>
      </div>

      {pets.length === 0 ? (
        <div className="card text-center py-10 space-y-4">
          <Dog className="w-12 h-12 text-slate-400 mx-auto" />
          <div>
            <h3 className="font-bold text-slate-900 text-lg">No pets registered</h3>
            <p className="text-slate-500 text-sm mt-1">You must register at least one pet before requesting a booking.</p>
          </div>
          <Link to="/pets" className="btn-primary text-sm py-2.5 px-5 inline-block">
            Register a Pet Now
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Booking Form Card */}
          <div className="md:col-span-2 card space-y-5">
            <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Schedule Booking Details
            </h2>

            {error && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Pet *
                </label>
                <select name="petId" className="input-field" value={form.petId} onChange={handleChange} required>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.type} {pet.breed ? `- ${pet.breed}` : ""})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Service Required *
                </label>
                <select name="serviceType" className="input-field" value={form.serviceType} onChange={handleChange} required>
                  {SERVICE_TYPES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Start Date *
                  </label>
                  <input
                    name="startDate"
                    type="date"
                    min={today}
                    className="input-field"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    End Date *
                  </label>
                  <input
                    name="endDate"
                    type="date"
                    min={form.startDate || today}
                    className="input-field"
                    value={form.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Special Notes & Care Instructions
                </label>
                <textarea
                  name="notes"
                  className="input-field"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Drop-off timing, feeding times, medicine details..."
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Submitting Booking...</span>
                  </>
                ) : (
                  "Submit Booking Request"
                )}
              </button>
            </form>
          </div>

          {/* Dynamic Financial Estimation Widget */}
          <div className="card bg-slate-900 text-white p-6 space-y-5 h-fit">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2 text-white">
                <Receipt className="w-4 h-4 text-primary-400" />
                Price Breakdown
              </h3>
              <span className="text-[10px] font-extrabold uppercase bg-primary-900/60 text-primary-300 px-2 py-0.5 rounded">
                Estimated
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Base Rate</span>
                <span>₹{estimate.rate} / day</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Duration</span>
                <span>{estimate.days} {estimate.days === 1 ? "day" : "days"}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Service Fee</span>
                <span className="text-emerald-400">Waived (Promo)</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="font-bold text-white">Total Estimate</span>
                <span className="text-xl font-extrabold text-primary-400">₹{estimate.total}</span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-primary-300 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                No advance charge
              </div>
              <p>Payment is finalized upon sitter acceptance.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
