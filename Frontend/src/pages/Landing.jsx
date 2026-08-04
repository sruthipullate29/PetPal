import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-[calc(100vh-57px)]">
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pet Sitting Made Simple 🐾
          </h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Connect with trusted pet sitters or offer your services. Book care for your furry friends with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors">
              Get Started
            </Link>
            <Link to="/login" className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">How PetPal Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-3">🏠</div>
            <h3 className="font-semibold text-lg mb-2">For Pet Owners</h3>
            <p className="text-gray-600 text-sm">
              Register your pets, browse verified sitters, and book services that fit your schedule.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="font-semibold text-lg mb-2">For Pet Sitters</h3>
            <p className="text-gray-600 text-sm">
              Create your profile, set your availability, and manage booking requests from pet owners.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="font-semibold text-lg mb-2">Easy Booking</h3>
            <p className="text-gray-600 text-sm">
              Request, accept, and track bookings all in one place with real-time status updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
