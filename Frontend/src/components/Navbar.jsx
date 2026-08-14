import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary-600 flex items-center gap-2">
          🐾 PetNiva
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              Hi, {user.name}
              <span className="ml-1 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full capitalize">
                {user.role}
              </span>
            </span>

            {user.role === "owner" && (
              <>
                <Link to="/pets" className="text-gray-600 hover:text-primary-600 text-sm font-medium">
                  My Pets
                </Link>
                <Link to="/sitters" className="text-gray-600 hover:text-primary-600 text-sm font-medium">
                  Find Sitters
                </Link>
              </>
            )}

            {user.role === "sitter" && (
              <Link to="/profile" className="text-gray-600 hover:text-primary-600 text-sm font-medium">
                My Profile
              </Link>
            )}

            <Link to="/bookings" className="text-gray-600 hover:text-primary-600 text-sm font-medium">
              Bookings
            </Link>

            <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/"
              className="text-gray-700 font-medium hover:text-primary-600 transition-colors text-sm"
            >
              Home
            </Link>
            <Link
              to="/founder"
              className="text-gray-700 font-medium hover:text-primary-600 transition-colors text-sm"
            >
              About Founder
            </Link>
            <Link
              to="/login"
              className="text-gray-700 font-medium hover:text-primary-600 transition-colors text-sm"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-primary-600 text-white font-semibold py-1.5 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
