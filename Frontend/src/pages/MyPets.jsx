import { useEffect, useState } from "react";
import { api } from "../api/client";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import { Dog, Cat, Bird, Rabbit, PawPrint, Plus, Edit3, Trash2, X, AlertCircle } from "lucide-react";

const PET_TYPES = ["Dog", "Cat", "Bird", "Rabbit", "Other"];
const emptyForm = { name: "", type: "Dog", breed: "", age: "", notes: "" };

export default function MyPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // Deletion modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, petId: null, petName: "" });
  const [deleting, setDeleting] = useState(false);

  const loadPets = () => {
    api.pets
      .list()
      .then(setPets)
      .catch((err) => setToast({ type: "error", message: err.message || "Failed to load pets." }))
      .finally(() => setLoading(false));
  };

  useEffect(loadPets, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.pets.update(editingId, form);
        setToast({ type: "success", message: `${form.name} updated successfully.` });
      } else {
        await api.pets.create(form);
        setToast({ type: "success", message: `${form.name} added to your pets.` });
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      loadPets();
    } catch (err) {
      setError(err.message || "Failed to save pet details.");
    }
  };

  const handleEdit = (pet) => {
    setForm({ name: pet.name, type: pet.type, breed: pet.breed || "", age: pet.age || "", notes: pet.notes || "" });
    setEditingId(pet.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = (pet) => {
    setDeleteModal({ isOpen: true, petId: pet.id, petName: pet.name });
  };

  const handleDeleteExecute = async () => {
    setDeleting(true);
    try {
      await api.pets.delete(deleteModal.petId);
      setToast({ type: "success", message: `${deleteModal.petName} was removed.` });
      setDeleteModal({ isOpen: false, petId: null, petName: "" });
      loadPets();
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to delete pet." });
    } finally {
      setDeleting(false);
    }
  };

  const getPetIcon = (type) => {
    switch (type) {
      case "Dog":
        return <Dog className="w-6 h-6 text-amber-600" />;
      case "Cat":
        return <Cat className="w-6 h-6 text-sky-600" />;
      case "Bird":
        return <Bird className="w-6 h-6 text-emerald-600" />;
      case "Rabbit":
        return <Rabbit className="w-6 h-6 text-purple-600" />;
      default:
        return <PawPrint className="w-6 h-6 text-primary-600" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Pet"
        message={`Are you sure you want to remove ${deleteModal.petName}? This action cannot be undone.`}
        confirmText="Delete Pet"
        cancelText="Keep Pet"
        isDanger={true}
        loading={deleting}
        onConfirm={handleDeleteExecute}
        onCancel={() => setDeleteModal({ isOpen: false, petId: null, petName: "" })}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Registered Pets</h1>
          <p className="text-slate-500 text-sm mt-1">Register and manage care profiles for your animals</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="btn-primary text-sm py-2.5 px-4 flex items-center justify-center gap-1.5"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add New Pet</span>
            </>
          )}
        </button>
      </div>

      {/* Add / Edit Form Modal Card */}
      {showForm && (
        <div className="card border-2 border-primary-200 bg-white p-6 shadow-md animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-lg">
              {editingId ? "Edit Pet Profile" : "Register a New Pet"}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Pet Name *
              </label>
              <input
                name="name"
                className="input-field"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Bruno"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Pet Type *
              </label>
              <select name="type" className="input-field" value={form.type} onChange={handleChange}>
                {PET_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Breed
              </label>
              <input
                name="breed"
                className="input-field"
                value={form.breed}
                onChange={handleChange}
                placeholder="e.g. Golden Retriever"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Age
              </label>
              <input
                name="age"
                className="input-field"
                value={form.age}
                onChange={handleChange}
                placeholder="e.g. 2 years"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Care Notes & Instructions
              </label>
              <textarea
                name="notes"
                className="input-field"
                rows={3}
                value={form.notes}
                onChange={handleChange}
                placeholder="Feeding schedule, allergies, behavior notes..."
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">
                Cancel
              </button>
              <button type="submit" className="btn-primary text-sm">
                {editingId ? "Save Changes" : "Register Pet"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content State */}
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4 animate-pulse">
          <div className="card h-40 bg-slate-100"></div>
          <div className="card h-40 bg-slate-100"></div>
        </div>
      ) : pets.length === 0 ? (
        <div className="card text-center py-12 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <PawPrint className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">No pets registered yet</h3>
            <p className="text-slate-500 text-sm mt-1">Add your pet's profile to start booking care with verified sitters.</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm py-2.5 px-5 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Your First Pet
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {pets.map((pet) => (
            <div key={pet.id} className="card-hover flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  {getPetIcon(pet.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-lg truncate">{pet.name}</h3>
                  <div className="text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                    {pet.type} {pet.breed ? `• ${pet.breed}` : ""}
                  </div>
                  {pet.age && <div className="text-xs text-slate-500 mt-1">Age: {pet.age}</div>}
                  {pet.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mt-2.5 border border-slate-100 line-clamp-2">
                      "{pet.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleEdit(pet)}
                  className="btn-secondary text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(pet)}
                  className="btn-secondary text-xs py-2 px-3 flex-1 text-red-600 border-red-200 hover:bg-red-50 flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
