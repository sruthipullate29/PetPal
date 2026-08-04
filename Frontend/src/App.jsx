import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
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

function DashboardRouter() {
  const { user } = useAuth();
  if (user.role === "sitter") return <SitterDashboard />;
  return <OwnerDashboard />;
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-primary-600 text-lg font-medium">Loading PetPal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <DashboardRouter /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />

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
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="sitter">
              <SitterProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
