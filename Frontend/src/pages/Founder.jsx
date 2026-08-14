import { Link } from "react-router-dom";

export default function Founder() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
         <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
         <img
           src={founderImage}
           alt="Varun Raj - Founder of PetNiva"
            className="w-full h-full object-cover"
         />
</div>

          <h1 className="text-4xl font-bold mb-2">Varun Raj</h1>
          <p className="text-primary-100 text-lg">
            Founder of PetNiva • 2026
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            The Story Behind PetNiva
          </h2>

          <p className="text-gray-600 leading-8 mb-6">
            <strong>PetNiva</strong> was founded in <strong>2026</strong> by{" "}
            <strong>Varun Raj</strong> as a dedicated pet-care platform under his
            growing business venture, <strong>Agro Exports & Hospitality</strong>.
            The vision was to combine technology with compassionate care, making
            pet services accessible to every family.
          </p>

          <p className="text-gray-600 leading-8 mb-6">
            Varun recognized that many pet owners struggle to find reliable,
            trustworthy, and affordable pet sitters whenever they travel or have
            busy schedules. PetNiva was created to provide a simple, secure, and
            convenient way for owners to connect with verified pet sitters in
            their community.
          </p>

          <p className="text-gray-600 leading-8">
            Beyond helping pet owners, PetNiva also creates meaningful employment
            opportunities for passionate animal lovers by enabling them to work as
            professional pet sitters, earn income, and build trusted careers in
            pet care.
          </p>
        </div>
      </section>

      {/* Mission Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Our Mission
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-5xl mb-4">🐾</div>
            <h3 className="font-semibold text-lg mb-2">Care for Every Pet</h3>
            <p className="text-gray-600 text-sm">
              Making trusted pet care simple, safe, and accessible for every pet
              owner.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="font-semibold text-lg mb-2">Trusted Connections</h3>
            <p className="text-gray-600 text-sm">
              Connecting loving pet owners with responsible and verified sitters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="font-semibold text-lg mb-2">Job Opportunities</h3>
            <p className="text-gray-600 text-sm">
              Creating flexible employment opportunities for people who genuinely
              love caring for animals.
            </p>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-white py-14 border-t">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-2xl italic text-gray-700 leading-relaxed">
            “Every pet deserves loving care, and every animal lover deserves an
            opportunity to make a difference.”
          </p>

          <p className="mt-6 font-semibold text-primary-600">
            — Varun Raj, Founder of PetNiva
          </p>

          <Link
            to="/signup"
            className="inline-block mt-8 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition"
          >
            Join PetNiva
          </Link>
        </div>
      </section>
    </div>
  );
}