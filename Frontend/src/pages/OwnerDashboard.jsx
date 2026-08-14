import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import StatusBadge from "../components/StatusBadge";

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
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}! 👋</h1>
        <p className="text-gray-500 mt-1">Manage your pets and bookings from here.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="text-3xl font-bold text-primary-600">{pets.length}</div>
          <div className="text-sm text-gray-500 mt-1">Registered Pets</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
          <div className="text-sm text-gray-500 mt-1">Pending Bookings</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-green-600">{activeCount}</div>
          <div className="text-sm text-gray-500 mt-1">Active Bookings</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Your Pets</h2>
            <Link to="/pets" className="text-primary-600 text-sm font-medium hover:underline">
              Manage →
            </Link>
          </div>
          {pets.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p className="mb-3">No pets registered yet</p>
              <Link to="/pets" className="btn-primary text-sm inline-block">
                Add Your First Pet
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {pets.slice(0, 3).map((pet) => (
                <li key={pet.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{pet.type === "Dog" ? "🐕" : pet.type === "Cat" ? "🐈" : "🐾"}</span>
                  <div>
                    <div className="font-medium">{pet.name}</div>
                    <div className="text-xs text-gray-500">{pet.type}{pet.breed ? ` • ${pet.breed}` : ""}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent Bookings</h2>
            <Link to="/bookings" className="text-primary-600 text-sm font-medium hover:underline">
              View all →
            </Link>
          </div>
          {bookings.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p className="mb-3">No bookings yet</p>
              <Link to="/sitters" className="btn-primary text-sm inline-block">
                Find a Sitter
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {bookings.slice(0, 3).map((booking) => (
                <li key={booking.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{booking.petName}</span>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    with {booking.sitterName} • {booking.startDate}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Link to="/sitters" className="btn-primary inline-block">
          Find a Pet Sitter
        </Link>
      </div>
    </div>
  );
}
