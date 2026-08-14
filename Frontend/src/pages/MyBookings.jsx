import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import StatusBadge from "../components/StatusBadge";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const loadBookings = () => {
    api.bookings
      .list()
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(loadBookings, []);

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(id);
    try {
      await api.bookings.updateStatus(id, status);
      loadBookings();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const isOwner = user.role === "owner";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">
          {isOwner ? "Track your pet sitting requests" : "Manage incoming booking requests"}
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-5xl mb-3">📅</div>
          <p className="text-gray-500">No bookings yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-semibold">{booking.serviceType}</h3>
                  <p className="text-sm text-gray-500">
                    {booking.petName} ({booking.petType})
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <p>
                  <span className="text-gray-400">{isOwner ? "Sitter:" : "Owner:"}</span>{" "}
                  {isOwner ? booking.sitterName : booking.ownerName}
                </p>
                <p>
                  <span className="text-gray-400">Dates:</span> {booking.startDate} → {booking.endDate}
                </p>
              </div>

              {booking.notes && (
                <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded mb-3">{booking.notes}</p>
              )}

              <div className="flex flex-wrap gap-2">
                {!isOwner && booking.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, "accepted")}
                      disabled={actionLoading === booking.id}
                      className="btn-primary text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, "declined")}
                      disabled={actionLoading === booking.id}
                      className="btn-danger text-sm"
                    >
                      Decline
                    </button>
                  </>
                )}

                {!isOwner && booking.status === "accepted" && (
                  <button
                    onClick={() => handleStatusUpdate(booking.id, "completed")}
                    disabled={actionLoading === booking.id}
                    className="btn-primary text-sm"
                  >
                    Mark Completed
                  </button>
                )}

                {isOwner && ["pending", "accepted"].includes(booking.status) && (
                  <button
                    onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                    disabled={actionLoading === booking.id}
                    className="btn-secondary text-sm"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
