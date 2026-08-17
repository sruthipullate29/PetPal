import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OwnerDashboard from "./pages/OwnerDashboard";
import SitterDashboard from "./pages/SitterDashboard";
import MyPets from "./pages/MyPets";
import BrowseSitters from "./pages/BrowseSitters";
import BookSitter from "./pages/BookSitter";
import MyBookings from "./pages/MyBookings";
import SitterProfile from "./pages/SitterProfile";
import Founder from "./pages/Founder";
import { PawPrint } from "lucide-react";

function DashboardRouter() {
  const { user } = useAuth();

  if (user.role === "sitter") {
    return <SitterDashboard />;
  }

  return <OwnerDashboard />;
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-md animate-bounce mb-4">
          <PawPrint className="w-7 h-7" />
        </div>
        <div className="text-slate-700 text-base font-bold tracking-tight">
          Loading <span className="text-primary-600">PetNiva</span>...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Show Global Navbar when logged in or on authenticated pages */}
      {user && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Home / Dashboard */}
          <Route
            path="/"
            element={user ? <DashboardRouter /> : <Landing />}
          />

          {/* Login */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />

          {/* Signup */}
          <Route
            path="/signup"
            element={user ? <Navigate to="/" replace /> : <Signup />}
          />

          {/* Owner Routes */}
          <Route
            path="/pets"
            element={
              <ProtectedRoute role="owner">
                <MyPets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sitters"
            element={
              <ProtectedRoute role="owner">
                <BrowseSitters />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sitters/:id/book"
            element={
              <ProtectedRoute role="owner">
                <BookSitter />
              </ProtectedRoute>
            }
          />

          {/* Sitter Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute role="sitter">
                <SitterProfile />
              </ProtectedRoute>
            }
          />

          {/* Booking Routes */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* Founder / About */}
          <Route
            path="/founder"
            element={<Founder />}
          />

          {/* Fallback Catch-all */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;