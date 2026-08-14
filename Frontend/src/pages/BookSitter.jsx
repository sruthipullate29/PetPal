import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";

const SERVICE_TYPES = ["Dog Walking", "Pet Sitting", "Overnight Care", "Drop-in Visit"];

export default function BookSitter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sitter, setSitter] = useState(null);
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({
    petId: "",
    startDate: "",
    endDate: "",
    serviceType: "Pet Sitting",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.sitters.get(id), api.pets.list()])
      .then(([sitterData, petsData]) => {
        setSitter(sitterData);
        setPets(petsData);
        if (petsData.length > 0) {
          setForm((f) => ({ ...f, petId: petsData[0].id }));
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.bookings.create({ sitterId: id, ...form });
      navigate("/bookings");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  if (!sitter) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Sitter not found</p>
        <Link to="/sitters" className="btn-primary">Back to Sitters</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/sitters" className="text-primary-600 text-sm hover:underline mb-4 inline-block">
        ← Back to Sitters
      </Link>

      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
            🐕
          </div>
          <div>
            <h1 className="text-xl font-bold">{sitter.name}</h1>
            <p className="text-sm text-gray-500">{sitter.location || "Location not set"} • {sitter.hourlyRate}/hr</p>
          </div>
        </div>
        {sitter.bio && <p className="text-sm text-gray-600 mt-3">{sitter.bio}</p>}
      </div>

      {pets.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-500 mb-4">You need to register a pet before booking</p>
          <Link to="/pets" className="btn-primary">Add a Pet</Link>
        </div>
      ) : (
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Book a Service</h2>
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Pet *</label>
              <select name="petId" className="input-field" value={form.petId} onChange={handleChange} required>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>{pet.name} ({pet.type})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
              <select name="serviceType" className="input-field" value={form.serviceType} onChange={handleChange} required>
                {SERVICE_TYPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input name="startDate" type="date" className="input-field" value={form.startDate} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input name="endDate" type="date" className="input-field" value={form.endDate} onChange={handleChange} required min={form.startDate} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea name="notes" className="input-field" rows={3} value={form.notes} onChange={handleChange} placeholder="Any special instructions for the sitter..." />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Booking Request"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
