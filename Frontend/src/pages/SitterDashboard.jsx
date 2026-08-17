import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import StatusBadge from "../components/StatusBadge";
import { SkeletonDashboard } from "../components/Skeleton";
import Toast from "../components/Toast";
import {
  IndianRupee,
  Clock,
  CalendarCheck,
  UserCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function SitterDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const loadData = () => {
    Promise.all([api.sitters.getProfile(), api.bookings.list()])
      .then(([profileData, bookingsData]) => {
        setProfile(profileData);
        setBookings(bookingsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(id);
    try {
      await api.bookings.updateStatus(id, status);
      setToast({ type: "success", message: `Booking status updated to ${status}.` });
      loadData();
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to update booking status." });
    } finally {
      setActionLoading(null);
    }
  };

  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const activeBookings = bookings.filter((b) => b.status === "accepted");

  if (loading) {
    return <SkeletonDashboard />;
  }

  const isProfileIncomplete = !profile?.bio || !profile?.location;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Toast feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-primary-200 mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Pet Sitter Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user.name}!
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Manage your service offerings, set availability slots, and handle client booking requests.
          </p>
        </div>

        <div>
          <Link
            to="/profile"
            className="btn-primary bg-primary-600 hover:bg-primary-500 text-white text-sm py-2.5 px-5 flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            {isProfileIncomplete ? "Complete Profile" : "Edit Profile"}
          </Link>
        </div>
      </div>

      {/* Profile Incomplete Warning Banner */}
      {isProfileIncomplete && (
        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Your sitter profile is incomplete.</span> Add your location and bio to appear in search results.
            </div>
          </div>
          <Link to="/profile" className="btn-secondary text-xs py-1.5 px-3 whitespace-nowrap bg-white border-amber-300 text-amber-900 hover:bg-amber-100">
            Setup Now
          </Link>
        </div>
      )}

      {/* KPI Metrics */}
      <div className="grid sm:grid-cols-3 gap-5">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">₹{profile?.hourlyRate || 25}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Hourly Rate</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">{pendingRequests.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Pending Requests</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">{activeBookings.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Active Bookings</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Profile Summary Card */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary-600" />
              <h2 className="font-bold text-slate-900 text-lg">Your Profile Summary</h2>
            </div>
            <Link to="/profile" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              Edit <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Location:</span>
              <strong className="text-slate-900">{profile?.location || "Not configured"}</strong>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Offered Services:</span>
              <div className="flex flex-wrap gap-1.5">
                {(profile?.services || []).map((svc) => (
                  <span key={svc} className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg">
                    {svc}
                  </span>
                ))}
                {(!profile?.services || profile.services.length === 0) && (
                  <span className="text-xs text-slate-400 italic">No services added</span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Bio Overview:</span>
              <p className="text-slate-600 text-sm italic leading-relaxed">
                "{profile?.bio || "Add a biography to help pet owners get to know your experience."}"
              </p>
            </div>
          </div>
        </div>

        {/* Pending Booking Requests */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              <h2 className="font-bold text-slate-900 text-lg">Incoming Booking Requests</h2>
            </div>
            <Link to="/bookings" className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-slate-500 space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-sm">No pending booking requests</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {pendingRequests.slice(0, 3).map((booking) => (
                <li key={booking.id} className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{booking.petName} ({booking.petType})</div>
                      <div className="text-xs text-slate-600">Owner: {booking.ownerName}</div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="text-xs text-slate-500">
                    Service: <strong>{booking.serviceType}</strong> • {booking.startDate} → {booking.endDate}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleStatusUpdate(booking.id, "accepted")}
                      disabled={actionLoading === booking.id}
                      className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Accept
                    </button>

                    <button
                      onClick={() => handleStatusUpdate(booking.id, "declined")}
                      disabled={actionLoading === booking.id}
                      className="btn-danger text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Decline
                    </button>
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
