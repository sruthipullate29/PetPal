import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  PawPrint,
  Heart,
  Dog,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Info,
  LogIn,
  UserPlus
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path) =>
    `flex items-center gap-2 text-sm font-semibold px-3.5 py-2 rounded-xl transition-all duration-150 ${
      isActive(path)
        ? "bg-primary-50 text-primary-700 font-bold"
        : "text-slate-600 hover:text-primary-600 hover:bg-slate-50"
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 text-xl font-extrabold text-slate-900 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm group-hover:bg-primary-700 transition-colors">
              <PawPrint className="w-6 h-6" />
            </div>
            <span className="tracking-tight">
              Pet<span className="text-primary-600">Niva</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          {user ? (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/" className={navLinkClass("/")}>
                <Compass className="w-4 h-4" />
                Dashboard
              </Link>

              {user.role === "owner" && (
                <>
                  <Link to="/pets" className={navLinkClass("/pets")}>
                    <Dog className="w-4 h-4" />
                    My Pets
                  </Link>
                  <Link to="/sitters" className={navLinkClass("/sitters")}>
                    <Heart className="w-4 h-4" />
                    Find Sitters
                  </Link>
                </>
              )}

              {user.role === "sitter" && (
                <Link to="/profile" className={navLinkClass("/profile")}>
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
              )}

              <Link to="/bookings" className={navLinkClass("/bookings")}>
                <Calendar className="w-4 h-4" />
                Bookings
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/" className={navLinkClass("/")}>
                Home
              </Link>
              <Link to="/founder" className={navLinkClass("/founder")}>
                <Info className="w-4 h-4" />
                About Us
              </Link>
              <Link
                to="/login"
                className="btn-secondary text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Log In
              </Link>
              <Link
                to="/signup"
                className="btn-primary text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Sign Up
              </Link>
            </div>
          )}

          {/* User Badge & Logout (Desktop) */}
          {user && (
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user.name}
                  </div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 shadow-lg animate-fadeIn">
          {user ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3 border border-slate-100">
                <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{user.name}</div>
                  <span className="text-xs text-primary-600 font-semibold capitalize">{user.role} Account</span>
                </div>
              </div>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass("/")}
              >
                <Compass className="w-4 h-4" />
                Dashboard
              </Link>

              {user.role === "owner" && (
                <>
                  <Link
                    to="/pets"
                    onClick={() => setMobileMenuOpen(false)}
                    className={navLinkClass("/pets")}
                  >
                    <Dog className="w-4 h-4" />
                    My Pets
                  </Link>
                  <Link
                    to="/sitters"
                    onClick={() => setMobileMenuOpen(false)}
                    className={navLinkClass("/sitters")}
                  >
                    <Heart className="w-4 h-4" />
                    Find Sitters
                  </Link>
                </>
              )}

              {user.role === "sitter" && (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass("/profile")}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
              )}

              <Link
                to="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass("/bookings")}
              >
                <Calendar className="w-4 h-4" />
                Bookings
              </Link>

              <button
                onClick={handleLogout}
                className="w-full mt-2 flex items-center justify-center gap-2 btn-secondary text-sm text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass("/")}
              >
                Home
              </Link>
              <Link
                to="/founder"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass("/founder")}
              >
                <Info className="w-4 h-4" />
                About Us
              </Link>
              <div className="pt-2 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary text-center text-xs py-2 px-3"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-center text-xs py-2 px-3"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
