import { Link } from "react-router-dom";
import petVideo from "../assets/pet-video.mp4";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">

      {/* ================= NAVIGATION BAR ================= */}
      <nav className="absolute top-0 left-0 right-0 z-[100] bg-black/20 backdrop-blur-md border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold text-white hover:text-primary-200 flex items-center gap-2 transition-colors"
            >
              PetNiva 🐾
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">

              <Link
                to="/"
                className="text-white/80 font-medium hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Home
              </Link>

              <Link
                to="/founder"
                className="text-white/80 font-medium hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                About Founder
              </Link>

              <Link
                to="/login"
                className="text-white/80 font-medium hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold py-2 px-5 rounded-lg shadow-sm hover:bg-white/20 hover:border-white/30 hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Sign Up
              </Link>

            </div>
          </div>
        </div>
      </nav>

      {/* ================= HERO VIDEO SECTION ================= */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">

        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={petVideo}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45"></div>


        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">

          <div className="text-center text-white max-w-4xl">

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              A Safe Place for
              <span className="text-primary-200"> Pets</span> 🐾
            </h1>

            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Connect with trusted pet sitters or offer your services.
              Book care for your furry friends with confidence.
            </p>

          </div>
        </div>
      </section>


      {/* ================= HOW PETPAL WORKS ================= */}
      <section className="max-w-6xl mx-auto py-16 px-4">

        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          How PetNiva Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Pet Owners */}
          <div className="card text-center hover:shadow-lg transition-shadow">

            <div className="text-5xl mb-4">
              🏠
            </div>

            <h3 className="font-semibold text-xl mb-2">
              For Pet Owners
            </h3>

            <p className="text-gray-600 text-sm">
              Register your pets, browse verified sitters, and book
              services that fit your schedule.
            </p>

          </div>


          {/* Pet Sitters */}
          <div className="card text-center hover:shadow-lg transition-shadow">

            <div className="text-5xl mb-4">
              🤝
            </div>

            <h3 className="font-semibold text-xl mb-2">
              For Pet Sitters
            </h3>

            <p className="text-gray-600 text-sm">
              Create your profile, set your availability, and manage
              booking requests from pet owners.
            </p>

          </div>


          {/* Easy Booking */}
          <div className="card text-center hover:shadow-lg transition-shadow">

            <div className="text-5xl mb-4">
              📅
            </div>

            <h3 className="font-semibold text-xl mb-2">
              Easy Booking
            </h3>

            <p className="text-gray-600 text-sm">
              Request, accept, and track bookings all in one place
              with real-time status updates.
            </p>

          </div>

        </div>
      </section>


      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-white py-8">

        <div className="max-w-6xl mx-auto px-4 text-center">

          <div className="text-2xl font-bold mb-2">
            PetNiva 🐾
          </div>

          <p className="text-gray-400 text-sm">
            Safe, trusted and loving care for your pets.
          </p>

          <p className="text-gray-500 text-xs mt-4">
            © 2026 PetNiva. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}