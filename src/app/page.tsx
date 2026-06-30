import Link from "next/link";
import { CalendarCheck, Heart, Gift, Camera, Users, ArrowRight } from "lucide-react";

const features = [
  { icon: <CalendarCheck size={22} />, title: "RSVP Management", desc: "Collect RSVPs with dietary notes and plus-ones. Export to CSV anytime." },
  { icon: <Heart size={22} />, title: "Digital Angpao", desc: "Receive monetary gifts digitally in SGD or IDR. Anonymous-friendly." },
  { icon: <Gift size={22} />, title: "Gift Registry", desc: "Share your wishlist. Guests can claim items to avoid duplicates." },
  { icon: <Camera size={22} />, title: "Photo Gallery", desc: "Collect photos from guests and professional photographers in one place." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surat-beige-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-5 sm:px-10 py-5 bg-white border-b border-surat-beige-200">
        <span className="font-serif text-2xl text-surat-red-500 font-semibold tracking-tight">Surat</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost text-sm py-2">Sign in</Link>
          <Link href="/signup" className="btn-primary text-sm py-2">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-5 sm:px-10 py-20 text-center">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-surat-red-50 text-surat-red-600 border border-surat-red-100 mb-6">
          For weddings, birthdays & gatherings
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-surat-neutral-900 leading-tight mb-6">
          Beautiful event pages<br />
          <span className="text-surat-red-500">built for Southeast Asia</span>
        </h1>
        <p className="text-lg text-surat-neutral-500 max-w-xl mx-auto mb-10">
          Create a stunning event microsite in minutes. Collect RSVPs, digital angpao, gift wishes, and photos — all in one link.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup" className="btn-primary text-base px-6 py-3 w-full sm:w-auto">
            Create your event <ArrowRight size={18} />
          </Link>
          <Link href="/login" className="btn-secondary text-base px-6 py-3 w-full sm:w-auto">
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-5 sm:px-10 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl text-surat-neutral-900 mb-3">Everything you need</h2>
          <p className="text-surat-neutral-500">One link. Every feature your guests need.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="card p-6 hover:shadow-card-hover transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-surat-red-50 flex items-center justify-center text-surat-red-500 mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-surat-neutral-800 mb-1.5">{f.title}</h3>
              <p className="text-sm text-surat-neutral-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surat-red-500 py-16 px-5 text-center">
        <h2 className="font-serif text-3xl text-white mb-4">Ready to create your event?</h2>
        <p className="text-white/80 text-sm mb-8">Free plan available. No credit card required.</p>
        <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-surat-red-600 rounded-lg font-semibold hover:bg-surat-beige-50 transition-colors">
          Get started for free <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-surat-neutral-400 border-t border-surat-beige-200">
        <span className="font-serif text-surat-red-400">Surat</span> — Event Platform for Southeast Asia
      </footer>
    </div>
  );
}
