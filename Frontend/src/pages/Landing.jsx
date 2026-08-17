import { Link } from "react-router-dom";
import petVideo from "../assets/pet-video.mp4";
import {
  PawPrint,
  ShieldCheck,
  CalendarCheck,
  Heart,
  ArrowRight,
  UserPlus,
  LogIn,
  Info,
  CheckCircle2,
  Sparkles,
  Check
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">

      {/* ================= NAVIGATION BAR (Public) ================= */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-slate-900/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-extrabold text-white hover:text-primary-200 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm">
                <PawPrint className="w-5 h-5" />
              </div>
              <span>
                Pet<span className="text-primary-400">Niva</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/founder"
                className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl px-4 py-2 text-xs font-semibold transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                About Us
              </Link>

              <Link
                to="/login"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl px-4 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Log In
              </Link>

              <Link
                to="/signup"
                className="bg-primary-600 hover:bg-primary-500 text-white rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= HERO VIDEO SECTION ================= */}
      <section className="relative h-screen min-h-[620px] flex items-center justify-center overflow-hidden">

        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={petVideo}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/40"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white space-y-6 pt-12">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-primary-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary-400" />
            Trusted Pet Care & Sitting Marketplace
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            A Safe Place for <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-primary-400 to-amber-300">
              your loving pets 🐾
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Connect with verified local pet sitters or earn doing what you love. Book trusted sitting, walking, and overnight care in minutes.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/signup?role=owner"
              className="w-full sm:w-auto btn-primary text-base py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-900/40"
            >
              <span>Find a Pet Sitter</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/signup?role=sitter"
              className="w-full sm:w-auto btn-secondary text-base py-3.5 px-8 rounded-xl border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 text-amber-400" />
              <span>Become a Sitter</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HOW PETNIVA WORKS (Dark Theme) ================= */}
      <section className="relative bg-slate-900 text-white py-24 border-t border-slate-800 overflow-hidden">
        {/* Background Ambient Lighting Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[400px] h-[250px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-semibold text-primary-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Easy 3-Step Process
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-300 to-amber-300">PetNiva</span> Works
            </h2>

            <p className="text-slate-400 text-base sm:text-lg">
              Simple, secure, and stress-free care management for pet parents and caregivers.
            </p>
          </div>

          {/* 3-Step Grid Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Step 1: Pet Owners */}
            <div className="relative bg-slate-800/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700/80 hover:border-primary-500/50 hover:bg-slate-800/90 transition-all duration-300 group shadow-xl flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/30 text-primary-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PawPrint className="w-7 h-7" />
                  </div>
                  <span className="text-4xl font-extrabold text-slate-700 group-hover:text-primary-400 transition-colors">
                    01
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  For Pet Owners
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Register your pets with special instructions, browse verified local sitters in your city, and compare hourly rates transparently.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-400 pt-4 border-t border-slate-700/60">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span>Register pet care profiles & notes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span>Browse verified local sitters</span>
                </li>
              </ul>
            </div>

            {/* Step 2: Pet Sitters */}
            <div className="relative bg-slate-800/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700/80 hover:border-amber-500/50 hover:bg-slate-800/90 transition-all duration-300 group shadow-xl flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <span className="text-4xl font-extrabold text-slate-700 group-hover:text-amber-400 transition-colors">
                    02
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  For Pet Sitters
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Build your professional sitter profile, set custom hourly rates, list your services, set weekly availability slots, and handle requests.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-400 pt-4 border-t border-slate-700/60">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Set hourly rate & service offerings</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Configure custom weekly schedule</span>
                </li>
              </ul>
            </div>

            {/* Step 3: Seamless Booking */}
            <div className="relative bg-slate-800/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700/80 hover:border-sky-500/50 hover:bg-slate-800/90 transition-all duration-300 group shadow-xl flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CalendarCheck className="w-7 h-7" />
                  </div>
                  <span className="text-4xl font-extrabold text-slate-700 group-hover:text-sky-400 transition-colors">
                    03
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  Seamless Booking
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Enjoy real-time cost calculation breakdowns, status tracking (Pending → Accepted → Completed), and hassle-free scheduling.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-400 pt-4 border-t border-slate-700/60">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Transparent cost estimation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Real-time status updates</span>
                </li>
              </ul>
            </div>

          </div>

          {/* CTA Conversion Card */}
          <div className="mt-16 bg-gradient-to-r from-primary-950 via-slate-800 to-amber-950/60 rounded-3xl p-8 sm:p-12 border border-slate-700/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white">
                Ready to experience safe & loving pet care?
              </h3>
              <p className="text-slate-300 text-sm">
                Join PetNiva today and connect with trusted pet caregivers in your area.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/signup"
                className="btn-primary text-sm py-3 px-6 rounded-xl flex items-center gap-2 shadow-md"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 text-white mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                <PawPrint className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Pet<span className="text-primary-400">Niva</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link to="/founder" className="hover:text-white transition-colors">About Us</Link>
              <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
              <Link to="/signup" className="hover:text-white transition-colors">Get Started</Link>
            </div>
          </div>

          <div className="pt-8 text-center text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 PetNiva Inc. All rights reserved.</p>
            <p>Professional Pet Care & Sitting Platform</p>
          </div>
        </div>
      </footer>

    </div>
  );
}