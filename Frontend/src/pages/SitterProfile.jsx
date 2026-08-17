import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import Toast from "../components/Toast";
import {
  UserCheck,
  MapPin,
  Clock,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  Loader2,
  CheckCircle2,
  IndianRupee
} from "lucide-react";

const ALL_SERVICES = ["Dog Walking", "Pet Sitting", "Overnight Care", "Drop-in Visit", "Grooming"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const INDIAN_CITIES = [
  "Mumbai, Maharashtra",
  "Delhi, Delhi",
  "Bengaluru, Karnataka",
  "Hyderabad, Telangana",
  "Ahmedabad, Gujarat",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Pune, Maharashtra",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
  "Kanpur, Uttar Pradesh",
  "Nagpur, Maharashtra",
  "Indore, Madhya Pradesh",
  "Thane, Maharashtra",
  "Bhopal, Madhya Pradesh",
  "Visakhapatnam, Andhra Pradesh",
  "Pimpri-Chinchwad, Maharashtra",
  "Patna, Bihar",
  "Vadodara, Gujarat",
  "Ghaziabad, Uttar Pradesh",
  "Ludhiana, Punjab",
  "Coimbatore, Tamil Nadu",
  "Agra, Uttar Pradesh",
  "Madurai, Tamil Nadu",
  "Nashik, Maharashtra",
  "Faridabad, Haryana",
  "Meerut, Uttar Pradesh",
  "Rajkot, Gujarat",
  "Noida, Uttar Pradesh",
  "Gurgaon, Haryana",
  "Chandigarh, Chandigarh",
  "Kochi, Kerala",
  "Thiruvananthapuram, Kerala"
];

export default function SitterProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    bio: "",
    hourlyRate: 25,
    services: [],
    location: "",
    availability: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCities = form.location.trim() === ""
    ? INDIAN_CITIES.slice(0, 8)
    : INDIAN_CITIES.filter((city) =>
        city.toLowerCase().includes(form.location.toLowerCase())
      ).slice(0, 8);

  useEffect(() => {
    api.sitters
      .getProfile()
      .then((data) => {
        setProfile(data);
        const rate = typeof data.hourlyRate === "number" ? data.hourlyRate : parseInt(String(data.hourlyRate).replace(/[^0-9]/g, ""), 10) || 25;
        setForm({
          bio: data.bio || "",
          hourlyRate: rate,
          services: data.services || ["Dog Walking", "Pet Sitting"],
          location: data.location || "",
          availability: data.availability || [],
        });
      })
      .catch((err) => setToast({ type: "error", message: err.message || "Failed to load profile." }))
      .finally(() => setLoading(false));
  }, []);

  const toggleService = (service) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(service)
        ? f.services.filter((s) => s !== service)
        : [...f.services, service],
    }));
  };

  const addAvailability = () => {
    setForm((f) => ({
      ...f,
      availability: [...f.availability, { day: "Monday", start: "09:00", end: "17:00" }],
    }));
  };

  const updateAvailability = (index, field, value) => {
    setForm((f) => {
      const updated = [...f.availability];
      updated[index] = { ...updated[index], [field]: value };
      return { ...f, availability: updated };
    });
  };

  const removeAvailability = (index) => {
    setForm((f) => ({
      ...f,
      availability: f.availability.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (form.hourlyRate <= 0) {
      setError("Hourly rate must be greater than 0.");
      return false;
    }

    for (let i = 0; i < form.availability.length; i++) {
      const slot = form.availability[i];
      if (slot.start >= slot.end) {
        setError(`Availability slot on ${slot.day} has invalid hours (End time must be after Start time).`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setSaving(true);
    try {
      await api.sitters.updateProfile(form);
      setToast({ type: "success", message: "Sitter profile saved successfully!" });
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
        <span>Loading sitter profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Sitter Profile Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure your bio, location, rate, services, and weekly schedule</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info */}
        <div className="card space-y-4">
          <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary-600" />
            General Information
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              About / Bio
            </label>
            <textarea
              className="input-field"
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Describe your pet sitting experience, animal passion, and special qualifications..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* City Autocomplete */}
            <div className="relative">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Location (City, State)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  className="input-field pl-10"
                  value={form.location}
                  onChange={(e) => {
                    setForm({ ...form, location: e.target.value });
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="City, State"
                  autoComplete="off"
                />
              </div>

              {showSuggestions && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg">
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setForm({ ...form, location: city });
                        setShowSuggestions(false);
                      }}
                      className="w-full px-4 py-2 hover:bg-primary-50 text-left text-xs font-medium text-slate-700 transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Hourly Rate (₹) *
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  min="1"
                  className="input-field pl-10"
                  value={form.hourlyRate}
                  onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services Offered */}
        <div className="card space-y-4">
          <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
            Services Offered
          </h2>
          <p className="text-xs text-slate-500">Toggle the care services you provide to pet owners:</p>

          <div className="flex flex-wrap gap-2">
            {ALL_SERVICES.map((service) => {
              const selected = form.services.includes(service);
              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => toggleService(service)}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all duration-150 flex items-center gap-1.5 ${
                    selected
                      ? "bg-primary-600 text-white border-primary-600 shadow-2xs"
                      : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                  }`}
                >
                  {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{service}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Availability Schedule */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              Weekly Availability Slots
            </h2>
            <button
              type="button"
              onClick={addAvailability}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Time Slot
            </button>
          </div>

          {form.availability.length === 0 ? (
            <p className="text-slate-500 text-xs italic py-2">
              No time slots configured yet. Click "Add Time Slot" to outline your weekly schedule.
            </p>
          ) : (
            <div className="space-y-3">
              {form.availability.map((slot, index) => (
                <div key={index} className="flex flex-wrap items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <select
                    className="input-field w-auto text-xs font-semibold"
                    value={slot.day}
                    onChange={(e) => updateAvailability(index, "day", e.target.value)}
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  <input
                    type="time"
                    className="input-field w-auto text-xs"
                    value={slot.start}
                    onChange={(e) => updateAvailability(index, "start", e.target.value)}
                  />

                  <span className="text-xs font-semibold text-slate-400">to</span>

                  <input
                    type="time"
                    className="input-field w-auto text-xs"
                    value={slot.end}
                    onChange={(e) => updateAvailability(index, "end", e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => removeAvailability(index)}
                    className="text-red-600 hover:text-red-700 text-xs font-bold p-1 rounded-lg hover:bg-red-50 ml-auto flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className="btn-primary w-full py-3" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span>Saving Profile...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              <span>Save Profile</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
