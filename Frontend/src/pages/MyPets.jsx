import { useEffect, useState } from "react";
import { api } from "../api/client";

const PET_TYPES = ["Dog", "Cat", "Bird", "Rabbit", "Other"];

const emptyForm = { name: "", type: "Dog", breed: "", age: "", notes: "" };

export default function MyPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadPets = () => {
    api.pets
      .list()
      .then(setPets)
      .catch(console.error)
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
      } else {
        await api.pets.create(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      loadPets();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (pet) => {
    setForm({ name: pet.name, type: pet.type, breed: pet.breed, age: pet.age, notes: pet.notes });
    setEditingId(pet.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this pet?")) return;
    try {
      await api.pets.delete(id);
      loadPets();
    } catch (err) {
      alert(err.message);
    }
  };

  const petEmoji = (type) => {
    const map = { Dog: "🐕", Cat: "🐈", Bird: "🐦", Rabbit: "🐰" };
    return map[type] || "🐾";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Pets</h1>
          <p className="text-gray-500 text-sm mt-1">Register and manage your pets</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "+ Add Pet"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="font-semibold mb-4">{editingId ? "Edit Pet" : "Add New Pet"}</h2>
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input name="name" className="input-field" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select name="type" className="input-field" value={form.type} onChange={handleChange}>
                {PET_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
              <input name="breed" className="input-field" value={form.breed} onChange={handleChange} placeholder="Golden Retriever" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input name="age" className="input-field" value={form.age} onChange={handleChange} placeholder="3 years" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea name="notes" className="input-field" rows={2} value={form.notes} onChange={handleChange} placeholder="Special care instructions..." />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary">
                {editingId ? "Save Changes" : "Add Pet"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading pets...</p>
      ) : pets.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-5xl mb-3">🐾</div>
          <p className="text-gray-500 mb-4">No pets registered yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Add Your First Pet
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {pets.map((pet) => (
            <div key={pet.id} className="card">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{petEmoji(pet.type)}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{pet.name}</h3>
                  <p className="text-sm text-gray-500">{pet.type}{pet.breed ? ` • ${pet.breed}` : ""}</p>
                  {pet.age && <p className="text-sm text-gray-500">Age: {pet.age}</p>}
                  {pet.notes && <p className="text-sm text-gray-600 mt-2">{pet.notes}</p>}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEdit(pet)} className="btn-secondary text-sm flex-1">
                  Edit
                </button>
                <button onClick={() => handleDelete(pet.id)} className="btn-danger text-sm flex-1">
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
