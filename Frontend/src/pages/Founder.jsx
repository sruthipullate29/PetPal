import { Link } from "react-router-dom";
import founderImage from "../assets/founderImage.jpg";
import {
  PawPrint,
  ShieldCheck,
  HeartHandshake,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UserPlus
} from "lucide-react";

export default function Founder() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-primary-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            About PetNiva Technology
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Empowering Loving Pet Care Through Seamless Technology
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            PetNiva connects pet owners with verified local sitters, making quality pet care accessible, transparent, and trustworthy.
          </p>
        </div>
      </section>

      {/* Corporate Mission & Values */}
      <section className="max-w-5xl mx-auto px-4 py-16 space-y-12">
        
        {/* Story Card */}
        <div className="card border border-slate-200 p-8 sm:p-12 bg-white space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary-100 shadow-md flex-shrink-0">
              <img
                src={founderImage}
                alt="Varun Raj - Founder"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">Varun Raj</h2>
              <p className="text-primary-600 font-semibold text-sm">Founder & Chief Visionary</p>
              <p className="text-slate-500 text-xs pt-1">Agro Exports & Hospitality Venture</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4 text-slate-600 leading-relaxed text-sm">
            <p>
              <strong>PetNiva</strong> was founded with a simple yet powerful mission: to solve the everyday challenges pet parents face when seeking reliable, compassionate care for their companions while away.
            </p>
            <p>
              By pairing modern web architecture with verified local pet caregivers, PetNiva bridges the gap between pet owners looking for peace of mind and passionate animal lovers seeking flexible work opportunities.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            Our Core Platform Pillars
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center p-6 bg-white border border-slate-200 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Uncompromised Safety</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verification protocols for pet sitters and structured care guidelines for every pet.
              </p>
            </div>

            <div className="card text-center p-6 bg-white border border-slate-200 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Community Trust</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transparent schedules, service expectations, and status tracking for complete confidence.
              </p>
            </div>

            <div className="card text-center p-6 bg-white border border-slate-200 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Empowering Caregivers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Creating flexible economic opportunities for passionate animal caregivers.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="card bg-slate-900 text-white p-8 text-center space-y-4">
          <h2 className="text-2xl font-extrabold text-white">
            Join the PetNiva Network Today
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Whether you are looking for exceptional pet sitting or interested in becoming a caregiver, PetNiva welcomes you.
          </p>
          <div className="pt-2">
            <Link
              to="/signup"
              className="btn-primary py-3 px-8 text-sm inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Get Started with PetNiva
            </Link>
          </div>
        </div>

      </section>
    </div>
  );
}