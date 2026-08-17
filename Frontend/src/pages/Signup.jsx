import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  PawPrint,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Loader2,
  HeartHandshake,
  UserCheck
} from "lucide-react";

export default function Signup() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "sitter" ? "sitter" : "owner";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: initialRole,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const isLengthValid = form.password.length >= 8;
  const hasUpper = /[A-Z]/.test(form.password);
  const hasLower = /[a-z]/.test(form.password);
  const hasNumber = /[0-9]/.test(form.password);
  const hasSpecial = /[^A-Za-z0-9]/.test(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLengthValid || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setError("Please ensure your password meets all requirements below.");
      return;
    }

    setLoading(true);

    try {
      const user = await signup(form);
      if (user.role === "sitter") {
        navigate("/profile");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md">

        {/* Brand Icon */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-md group-hover:bg-primary-700 transition-colors">
              <PawPrint className="w-7 h-7" />
            </div>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Pet<span className="text-primary-600">Niva</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-4">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Join PetPal as a pet owner or sitter</p>
        </div>

        <div className="card shadow-sm border border-slate-200">
          {error && (
            <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3.5 rounded-xl mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Account Role Switcher */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Select Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "owner" })}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all duration-200 flex flex-col items-center gap-1.5 ${
                    form.role === "owner"
                      ? "border-primary-600 bg-primary-50/50 text-primary-900 shadow-2xs"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <UserCheck className={`w-6 h-6 ${form.role === "owner" ? "text-primary-600" : "text-slate-400"}`} />
                  <div className="font-bold text-sm">Pet Owner</div>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "sitter" })}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all duration-200 flex flex-col items-center gap-1.5 ${
                    form.role === "sitter"
                      ? "border-primary-600 bg-primary-50/50 text-primary-900 shadow-2xs"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <HeartHandshake className={`w-6 h-6 ${form.role === "sitter" ? "text-primary-600" : "text-slate-400"}`} />
                  <div className="font-bold text-sm">Pet Sitter</div>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  name="name"
                  className="input-field pl-10"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  name="email"
                  type="email"
                  className="input-field pl-10"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="input-field pl-10 pr-10"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Live Password Rules */}
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="font-semibold text-slate-700 mb-1">Password Requirements:</div>
                <div className={`flex items-center gap-1.5 ${isLengthValid ? "text-emerald-700 font-medium" : "text-slate-500"}`}>
                  {isLengthValid ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Circle className="w-3.5 h-3.5" />}
                  At least 8 characters
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper ? "text-emerald-700 font-medium" : "text-slate-500"}`}>
                  {hasUpper ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Circle className="w-3.5 h-3.5" />}
                  At least one uppercase letter
                </div>
                <div className={`flex items-center gap-1.5 ${hasLower ? "text-emerald-700 font-medium" : "text-slate-500"}`}>
                  {hasLower ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Circle className="w-3.5 h-3.5" />}
                  At least one lowercase letter
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-700 font-medium" : "text-slate-500"}`}>
                  {hasNumber ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Circle className="w-3.5 h-3.5" />}
                  At least one number
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-700 font-medium" : "text-slate-500"}`}>
                  {hasSpecial ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Circle className="w-3.5 h-3.5" />}
                  At least one special character (!@#$%^&*)
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-600 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}