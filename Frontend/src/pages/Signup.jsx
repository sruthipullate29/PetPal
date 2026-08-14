import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "owner",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    setLoading(true);

    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-57px)] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md">

        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Create your account
        </h1>

        <p className="text-gray-500 mb-6">
          Join PetPal as a pet owner or sitter
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>

            <input
              name="name"
              className="input-field"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Jane Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              name="email"
              type="email"
              className="input-field"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              name="password"
              type="password"
              className="input-field"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              placeholder="Enter a strong password"
            />

            {/* Password Requirements */}
            <div className="mt-2 text-sm space-y-1">

              {/* Minimum 8 Characters */}
              <p
                className={
                  form.password.length >= 8
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                {form.password.length >= 8 ? "✓" : "○"} At least 8 characters
              </p>

              {/* Uppercase */}
              <p
                className={
                  /[A-Z]/.test(form.password)
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                {/[A-Z]/.test(form.password) ? "✓" : "○"} At least one uppercase
                letter
              </p>

              {/* Lowercase */}
              <p
                className={
                  /[a-z]/.test(form.password)
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                {/[a-z]/.test(form.password) ? "✓" : "○"} At least one lowercase
                letter
              </p>

              {/* Number */}
              <p
                className={
                  /[0-9]/.test(form.password)
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                {/[0-9]/.test(form.password) ? "✓" : "○"} At least one number
              </p>

              {/* Special Character */}
              <p
                className={
                  /[^A-Za-z0-9]/.test(form.password)
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                {/[^A-Za-z0-9]/.test(form.password) ? "✓" : "○"} At least one
                special character
              </p>

            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a...
            </label>

            <div className="grid grid-cols-2 gap-3">

              {/* Pet Owner */}
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    role: "owner",
                  })
                }
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  form.role === "owner"
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-medium text-sm">
                  Pet Owner
                </div>
              </button>

              {/* Pet Sitter */}
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    role: "sitter",
                  })
                }
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  form.role === "sitter"
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-1">🐕</div>
                <div className="font-medium text-sm">
                  Pet Sitter
                </div>
              </button>

            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}