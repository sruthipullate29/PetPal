import { useEffect, useState } from "react";
import { api } from "../api/client";

const ALL_SERVICES = ["Dog Walking", "Pet Sitting", "Overnight Care", "Drop-in Visit", "Grooming"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SitterProfile() {
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                className="input-field"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="City, State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
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
