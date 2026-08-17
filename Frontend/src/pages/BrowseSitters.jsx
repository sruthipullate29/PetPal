import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { SkeletonGrid } from "../components/Skeleton";
import { Search, MapPin, ShieldCheck, ArrowRight, X, UserCheck } from "lucide-react";

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
      (s.services && s.services.some((svc) => svc.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Find a Trusted Pet Sitter</h1>
          <p className="text-slate-500 text-sm mt-1">Browse verified local sitters and book care for your pets</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by name, city, or service..."
            className="input-field pl-10 pr-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No sitters found</h3>
          <p className="text-slate-500 text-sm">No pet sitters match your current search query "{search}".</p>
          <button onClick={() => setSearch("")} className="btn-secondary text-sm py-2 px-4 inline-block mt-2">
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sitter) => (
            <div key={sitter.id} className="card-hover flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg shadow-2xs">
                    {sitter.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 text-base">{sitter.name}</h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" title="Verified Sitter" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{sitter.location || "Location available"}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 italic">
                  "{sitter.bio || "Experienced pet caregiver dedicated to providing loving attention."}"
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(sitter.services || []).map((svc) => (
                    <span key={svc} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Rate</span>
                  <span className="text-lg font-extrabold text-primary-700">₹{sitter.hourlyRate}/hr</span>
                </div>
                <Link
                  to={`/sitters/${sitter.id}/book`}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
