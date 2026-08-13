import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import StatusBadge from "../components/StatusBadge";

export default function SitterDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.sitters.getProfile(), api.bookings.list()])
      .then(([profileData, bookingsData]) => {
        setProfile(profileData);
        setBookings(bookingsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const activeBookings = bookings.filter((b) => b.status === "accepted");

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Sitter Dashboard 🐕</h1>
        <p className="text-gray-500 mt-1">Welcome, {user.name}! Manage your profile and bookings.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="text-3xl font-bold text-primary-600">₹{profile?.hourlyRate || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Hourly Rate</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</div>
          <div className="text-sm text-gray-500 mt-1">Pending Requests</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-green-600">{activeBookings.length}</div>
          <div className="text-sm text-gray-500 mt-1">Active Bookings</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Your Profile</h2>
            <Link to="/profile" className="text-primary-600 text-sm font-medium hover:underline">
              Edit →
            </Link>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Location:</span> {profile?.location || "Not set"}</p>
            <p><span className="text-gray-500">Services:</span> {(profile?.services || []).join(", ") || "None"}</p>
            <p className="text-gray-600 mt-2">{profile?.bio || "Add a bio to attract more clients."}</p>
          </div>
          {(!profile?.bio || !profile?.location) && (
            <Link to="/profile" className="btn-primary text-sm mt-4 inline-block">
              Complete Your Profile
            </Link>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Booking Requests</h2>
            <Link to="/bookings" className="text-primary-600 text-sm font-medium hover:underline">
              View all →
            </Link>
          </div>
          {pendingRequests.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No pending requests</p>
          ) : (
            <ul className="space-y-3">
              {pendingRequests.slice(0, 3).map((booking) => (
                <li key={booking.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{booking.petName} ({booking.petType})</span>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    from {booking.ownerName} • {booking.startDate} to {booking.endDate}
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
