import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import {
  Calendar,
  User,
  Dog,
  CheckCircle,
  XCircle,
  CheckCheck,
  Ban,
  Clock,
  Sparkles,
  Receipt
} from "lucide-react";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");

  // Modal confirmation state
  const [modal, setModal] = useState({ isOpen: false, bookingId: null, targetStatus: null, actionLabel: "" });

  const loadBookings = () => {
    api.bookings
      .list()
      .then(setBookings)
      .catch((err) => setToast({ type: "error", message: err.message || "Failed to load bookings." }))
      .finally(() => setLoading(false));
  };

  useEffect(loadBookings, []);

  const openStatusConfirm = (id, targetStatus, actionLabel) => {
    setModal({ isOpen: true, bookingId: id, targetStatus, actionLabel });
  };

  const handleExecuteStatus = async () => {
    const { bookingId, targetStatus } = modal;
    setActionLoading(bookingId);
    try {
      await api.bookings.updateStatus(bookingId, targetStatus);
      setToast({ type: "success", message: `Booking update: ${targetStatus}.` });
      setModal({ isOpen: false, bookingId: null, targetStatus: null, actionLabel: "" });
      loadBookings();
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to update booking status." });
    } finally {
      setActionLoading(null);
    }
  };

  const isOwner = user.role === "owner";

  const filteredBookings = bookings.filter((b) => {
    if (filter === "pending") return b.status === "pending";
    if (filter === "active") return ["accepted", "completed"].includes(b.status);
    if (filter === "cancelled") return ["declined", "cancelled"].includes(b.status);
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Toast alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modal.isOpen}
        title={`${modal.actionLabel} Booking`}
        message={`Are you sure you want to ${modal.actionLabel.toLowerCase()} this booking request?`}
        confirmText={`Yes, ${modal.actionLabel}`}
        cancelText="Cancel"
        isDanger={["Decline", "Cancel"].includes(modal.actionLabel)}
        loading={actionLoading === modal.bookingId}
        onConfirm={handleExecuteStatus}
        onCancel={() => setModal({ isOpen: false, bookingId: null, targetStatus: null, actionLabel: "" })}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isOwner ? "Track status of pet sitting requests" : "Manage client requests and schedule status"}
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === "all" ? "bg-white text-slate-900 shadow-2xs" : "hover:text-slate-900"}`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === "pending" ? "bg-white text-amber-700 shadow-2xs" : "hover:text-slate-900"}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === "active" ? "bg-white text-emerald-700 shadow-2xs" : "hover:text-slate-900"}`}
          >
            Active
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="card h-32 bg-slate-100"></div>
          <div className="card h-32 bg-slate-100"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="card text-center py-12 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No bookings found</h3>
          <p className="text-slate-500 text-sm">
            {filter === "all" ? "You have no booking records yet." : `No ${filter} bookings found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="card-hover space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{booking.serviceType}</span>
                    {booking.totalPrice > 0 && (
                      <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                        Est. ₹{booking.totalPrice}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Dog className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pet: <strong className="text-slate-800">{booking.petName}</strong> ({booking.petType})</span>
                  </div>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>
                    <strong className="text-slate-500">{isOwner ? "Sitter:" : "Owner:"}</strong>{" "}
                    <span className="font-bold text-slate-900">{isOwner ? booking.sitterName : booking.ownerName}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>
                    <strong className="text-slate-500">Schedule:</strong> {booking.startDate} → {booking.endDate}
                  </span>
                </div>
              </div>

              {booking.notes && (
                <div className="text-xs text-slate-600 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  <strong className="text-amber-900 block mb-0.5">Care Instructions / Notes:</strong>
                  "{booking.notes}"
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {!isOwner && booking.status === "pending" && (
                  <>
                    <button
                      onClick={() => openStatusConfirm(booking.id, "accepted", "Accept")}
                      disabled={actionLoading === booking.id}
                      className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Accept Request
                    </button>
                    <button
                      onClick={() => openStatusConfirm(booking.id, "declined", "Decline")}
                      disabled={actionLoading === booking.id}
                      className="btn-danger text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Decline Request
                    </button>
                  </>
                )}

                {!isOwner && booking.status === "accepted" && (
                  <button
                    onClick={() => openStatusConfirm(booking.id, "completed", "Complete")}
                    disabled={actionLoading === booking.id}
                    className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark Completed
                  </button>
                )}

                {isOwner && ["pending", "accepted"].includes(booking.status) && (
                  <button
                    onClick={() => openStatusConfirm(booking.id, "cancelled", "Cancel")}
                    disabled={actionLoading === booking.id}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 text-slate-700 border-slate-300 hover:bg-slate-100"
                  >
                    <Ban className="w-3.5 h-3.5 text-slate-500" />
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
