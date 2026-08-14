import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export default function BrowseSitters() {
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.sitters
      .list()
      .then(setSitters)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = sitters.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.services.some((svc) => svc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Find a Pet Sitter</h1>
        <p className="text-gray-500 text-sm mt-1">Browse trusted sitters and book care for your pets</p>
      </div>

      <input
        type="text"
        placeholder="Search by name, location, or service..."
        className="input-field max-w-md mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading sitters...</p>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-gray-500">No sitters found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((sitter) => (
            <div key={sitter.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-xl">
                  🐕
                </div>
                <div>
                  <h3 className="font-semibold">{sitter.name}</h3>
                  <p className="text-xs text-gray-500">{sitter.location || "Location not set"}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {sitter.bio || "Experienced pet sitter ready to help!"}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {sitter.services.map((svc) => (
                  <span key={svc} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {svc}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-primary-600">{sitter.hourlyRate}/hr</span>
                <Link to={`/sitters/${sitter.id}/book`} className="btn-primary text-sm">
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
