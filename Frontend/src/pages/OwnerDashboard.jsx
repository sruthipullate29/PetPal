import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import StatusBadge from "../components/StatusBadge";
import { SkeletonDashboard } from "../components/Skeleton";
import { Dog, Clock, CalendarCheck, Plus, Search, ArrowRight, Sparkles } from "lucide-react";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.pets.list(), api.bookings.list()])
      .then(([petsData, bookingsData]) => {
        setPets(petsData);
        setBookings(bookingsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const activeCount = bookings.filter((b) => b.status === "accepted").length;

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary-700 via-primary-600 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-primary-100 mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Pet Owner Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.name}!
          </h1>
          <p className="text-primary-100 text-sm mt-1 max-w-xl">
            Manage your registered pets, track active care requests, and browse verified local sitters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/sitters"
            className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20 text-sm py-2.5 px-4 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Find a Sitter
          </Link>
          <Link
            to="/pets"
            className="btn-primary bg-amber-500 hover:bg-amber-600 text-white text-sm py-2.5 px-4 flex items-center gap-2 border-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Pet
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid sm:grid-cols-3 gap-5">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
            <Dog className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">{pets.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Registered Pets</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">{pendingCount}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Pending Bookings</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">{activeCount}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Active Bookings</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Your Pets Section */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Dog className="w-5 h-5 text-primary-600" />
              <h2 className="font-bold text-slate-900 text-lg">Your Pets</h2>
            </div>
            <Link to="/pets" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pets.length === 0 ? (
            <div className="text-center py-8 text-slate-500 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <Dog className="w-6 h-6" />
              </div>
              <p className="text-sm">No pets registered yet</p>
              <Link to="/pets" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Add Your First Pet
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {pets.slice(0, 4).map((pet) => (
                <li key={pet.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                      {pet.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{pet.name}</div>
                      <div className="text-xs text-slate-500">{pet.type}{pet.breed ? ` • ${pet.breed}` : ""}</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                    {pet.age ? `${pet.age} yrs` : pet.type}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Bookings Section */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-primary-600" />
              <h2 className="font-bold text-slate-900 text-lg">Recent Bookings</h2>
            </div>
            <Link to="/bookings" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-8 text-slate-500 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <p className="text-sm">No bookings requested yet</p>
              <Link to="/sitters" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Find a Pet Sitter
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {bookings.slice(0, 4).map((booking) => (
                <li key={booking.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{booking.serviceType}</span>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="text-xs text-slate-600 flex items-center justify-between">
                    <span>Pet: <strong className="text-slate-800">{booking.petName}</strong></span>
                    <span>Sitter: <strong className="text-slate-800">{booking.sitterName}</strong></span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                    <span>Dates: {booking.startDate} → {booking.endDate}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
