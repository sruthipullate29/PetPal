import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

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
  "Kalyan-Dombivli, Maharashtra",
  "Vasai-Virar, Maharashtra",
  "Varanasi, Uttar Pradesh",
  "Srinagar, Jammu and Kashmir",
  "Aurangabad, Maharashtra",
  "Dhanbad, Jharkhand",
  "Amritsar, Punjab",
  "Navi Mumbai, Maharashtra",
  "Allahabad, Uttar Pradesh",
  "Howrah, West Bengal",
  "Ranchi, Jharkhand",
  "Gwalior, Madhya Pradesh",
  "Jabalpur, Madhya Pradesh",
  "Vijayawada, Andhra Pradesh",
  "Jodhpur, Rajasthan",
  "Raipur, Chhattisgarh",
  "Kota, Rajasthan",
  "Guwahati, Assam",
  "Chandigarh, Chandigarh",
  "Solapur, Maharashtra",
  "Hubli-Dharwad, Karnataka",
  "Bareilly, Uttar Pradesh",
  "Moradabad, Uttar Pradesh",
  "Mysore, Karnataka",
  "Gurgaon, Haryana",
  "Aligarh, Uttar Pradesh",
  "Jalandhar, Punjab",
  "Tiruchirappalli, Tamil Nadu",
  "Bhubaneswar, Odisha",
  "Salem, Tamil Nadu",
  "Warangal, Telangana",
  "Guntur, Andhra Pradesh",
  "Kochi, Kerala",
  "Noida, Uttar Pradesh",
  "Dehradun, Uttarakhand",
  "Shimla, Himachal Pradesh",
  "Panaji, Goa",
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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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
        setForm({
          bio: data.bio || "",
          hourlyRate: data.hourlyRate || 25,
          services: data.services || [],
          location: data.location || "",
          availability: data.availability || [],
        });
      })
      .catch(console.error)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await api.sitters.updateProfile(form);
      setMessage("Profile saved successfully!");
      setTimeout(() => {
        navigate("/");
      }, 500); // 500ms delay so the user can read the success message briefly
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sitter Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Set up your profile to attract pet owners</p>
      </div>

      {message && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4">{message}</div>}
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-semibold">Basic Info</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              className="input-field"
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell pet owners about your experience..."
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                className="input-field"
                value={form.location}
                onChange={(e) => {
                  setForm({ ...form, location: e.target.value });
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setShowSuggestions(false)}
                placeholder="City, State"
                autoComplete="off"
              />
              {showSuggestions && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                  {filteredCities.map((city) => (
                    <div
                      key={city}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setForm({ ...form, location: city });
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2 hover:bg-primary-50 cursor-pointer text-sm text-gray-700 text-left transition-colors"
                    >
                      {city}
                    </div>
                  ))}
                  {filteredCities.length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-500 italic">No cities found</div>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (₹)</label>
              <input
                type="number"
                min="1"
                className="input-field"
                value={form.hourlyRate}
                onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-3">Services Offered</h2>
          <div className="flex flex-wrap gap-2">
            {ALL_SERVICES.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  form.services.includes(service)
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-primary-400"
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Availability</h2>
            <button type="button" onClick={addAvailability} className="text-primary-600 text-sm font-medium hover:underline">
              + Add Slot
            </button>
          </div>
          {form.availability.length === 0 ? (
            <p className="text-gray-500 text-sm">No availability set. Add time slots when you're available.</p>
          ) : (
            <div className="space-y-3">
              {form.availability.map((slot, index) => (
                <div key={index} className="flex flex-wrap items-center gap-2">
                  <select
                    className="input-field w-auto"
                    value={slot.day}
                    onChange={(e) => updateAvailability(index, "day", e.target.value)}
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <input
                    type="time"
                    className="input-field w-auto"
                    value={slot.start}
                    onChange={(e) => updateAvailability(index, "start", e.target.value)}
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="time"
                    className="input-field w-auto"
                    value={slot.end}
                    onChange={(e) => updateAvailability(index, "end", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeAvailability(index)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn-primary w-full" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
