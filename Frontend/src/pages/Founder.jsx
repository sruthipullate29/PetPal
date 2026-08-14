import { Link } from "react-router-dom";
import founderImage from "../assets/founderImage.jpg";

export default function Founder() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">

          {/* Founder Image */}
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
            <img
              src={founderImage}
              alt="Varun Raj - Founder of PetNiva"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-4xl font-bold mb-2">
            Varun Raj
          </h1>

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
            <strong>PetNiva</strong> was founded in{" "}
            <strong>2026</strong> by <strong>Varun Raj</strong>
            as part of his Agro Exports & Hospitality venture.
          </p>

          <p className="text-gray-600 leading-8 mb-6">
            PetNiva was created with a simple vision — to make it easier
            for pet owners to find reliable and trustworthy pet care
            whenever they need it.
          </p>

          <p className="text-gray-600 leading-8">
            At the same time, PetNiva aims to create job opportunities
            for people who love animals by allowing them to work as
            pet sitters and provide professional care to pets.
          </p>

        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-4 pb-16">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Our Mission
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-5xl mb-4">🐾</div>
            <h3 className="font-semibold text-lg mb-2">
              Better Pet Care
            </h3>
            <p className="text-gray-600 text-sm">
              Making quality pet care simple and accessible for pet owners.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="font-semibold text-lg mb-2">
              Trusted Connections
            </h3>
            <p className="text-gray-600 text-sm">
              Connecting pet owners with reliable and caring pet sitters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="font-semibold text-lg mb-2">
              Job Opportunities
            </h3>
            <p className="text-gray-600 text-sm">
              Creating flexible work opportunities for passionate pet lovers.
            </p>
          </div>

        </div>

      </section>

      {/* Founder Quote */}
      <section className="bg-white py-14 border-t">

        <div className="max-w-3xl mx-auto px-4 text-center">

          <p className="text-2xl italic text-gray-700 leading-relaxed">
            "Every pet deserves loving care, and every animal lover
            deserves an opportunity to make a difference."
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