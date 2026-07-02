import Link from "next/link";
import {
  Heart,
  Gift,
  Camera,
  Moon,
  Briefcase,
  Users,
  Sparkles,
  CalendarCheck,
  Wallet,
  LayoutDashboard,
  Pencil,
  Link2,
  BarChart3,
  ArrowRight,
  Check,
} from "lucide-react";
import Hero from "@/components/landing/hero";

/* ─── Data ─────────────────────────────────────────────────────── */
const occasions = [
  { icon: <Heart size={22} />, title: "Weddings", desc: "RSVPs, angpao, a registry and a shared album for the big day." },
  { icon: <Gift size={22} />, title: "Birthdays", desc: "Gather RSVPs and let guests chip in a gift or a red packet." },
  { icon: <Moon size={22} />, title: "Baby full-moons", desc: "Share the news and gather wishes and angpao for the little one." },
  { icon: <Briefcase size={22} />, title: "Corporate galas", desc: "Manage hundreds of guests, name tags and wallet passes with ease." },
  { icon: <Users size={22} />, title: "Reunions", desc: "Round up the family, plan the potluck, relive the day in photos." },
  { icon: <Sparkles size={22} />, title: "Anniversaries", desc: "Celebrate the milestone and keep every memory in one place." },
];

const features = [
  { icon: <CalendarCheck size={22} />, title: "RSVP management", desc: "Names, plus-ones and dietary notes. Live counts and one-click CSV export.", highlight: false },
  { icon: <Heart size={22} />, title: "Digital angpao", desc: "Red packets in SGD or IDR, anonymous-friendly, with commission tracked automatically.", highlight: true },
  { icon: <Gift size={22} />, title: "Gift registry", desc: "Share a wishlist; guests claim what they'll buy so nothing's duplicated.", highlight: false },
  { icon: <Camera size={22} />, title: "Photo gallery", desc: "Guests and photographers upload to one album. 20 free downloads, then unlock the set.", highlight: false },
  { icon: <Wallet size={22} />, title: "Wallet & calendar", desc: "Add the event to Apple Wallet, Google Wallet or any calendar in a single tap.", highlight: false },
  { icon: <LayoutDashboard size={22} />, title: "Host dashboard", desc: "Every RSVP, angpao, gift and photo in one view. Preview, share and export anytime.", highlight: false },
];

const steps = [
  { num: "01", icon: <Pencil size={20} />, title: "Create your page", desc: "Pick your event type, add the details and a cover photo, toggle the features you want." },
  { num: "02", icon: <Link2 size={20} />, title: "Share one link", desc: "Send surat.app/your-event over WhatsApp, email or a QR code at the venue." },
  { num: "03", icon: <BarChart3 size={20} />, title: "Track it live", desc: "Watch RSVPs, angpao and photos roll in from your dashboard — export everything after." },
];

/* ─── Page ─────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans text-surat-neutral-900">
      {/* ══════════════ HERO ══════════════ */}
      <Hero />

      {/* ══════════════ OCCASIONS ══════════════ */}
      <section id="occasions" className="bg-[#FBF5EA] py-24 px-5 sm:px-14">
        <div className="max-w-[1180px] mx-auto">
          <p className="text-[12px] font-bold tracking-[0.16em] uppercase text-[#B23A2E]">One app · every occasion</p>
          <h2 className="font-serif font-medium text-[clamp(32px,4.4vw,50px)] leading-[1.04] tracking-tight text-[#231C18] mt-3.5">Not just weddings.</h2>
          <p className="text-lg leading-relaxed text-[#6E6358] mt-4 max-w-[560px]">
            From an intimate birthday to a thousand-guest corporate gala, Surat shapes itself around whatever you&apos;re celebrating — same single link, same effortless setup.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {occasions.map((o) => (
              <div key={o.title} className="bg-white border border-[#EEE3D0] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-[46px] h-[46px] rounded-[13px] bg-[#F6E9D2] text-[#B23A2E] flex items-center justify-center mb-4">{o.icon}</div>
                <h3 className="text-lg font-bold text-[#2A211B] mb-1.5">{o.title}</h3>
                <p className="text-sm leading-relaxed text-[#6E6358]">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section id="features" className="bg-white py-24 px-5 sm:px-14 border-t border-[#F0E6D4]">
        <div className="max-w-[1180px] mx-auto">
          <p className="text-[12px] font-bold tracking-[0.16em] uppercase text-[#B23A2E]">Everything in one link</p>
          <h2 className="font-serif font-medium text-[clamp(32px,4.4vw,50px)] leading-[1.04] tracking-tight text-[#231C18] mt-3.5">Five tools, one shareable page.</h2>
          <p className="text-lg leading-relaxed text-[#6E6358] mt-4 max-w-[560px]">
            No more stitching together forms, chats, bank transfers and photo apps. Surat does it all — and you watch it happen from a single dashboard.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {features.map((f) => (
              <div key={f.title} className={`rounded-2xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all ${f.highlight ? "border-[1.5px] border-[#DDB874] relative" : "bg-[#FBF5EA] border border-[#EEE3D0]"}`} style={f.highlight ? { background: "linear-gradient(160deg, #fff, #FBEFDA)" } : undefined}>
                {f.highlight && <span className="absolute top-4 right-4 text-[10px] font-bold tracking-wide uppercase text-[#9A6E1E] bg-[#F6E4BE] rounded-full px-2.5 py-0.5">Most loved</span>}
                <div className={`w-[46px] h-[46px] rounded-[13px] flex items-center justify-center mb-4 ${f.highlight ? "bg-[#B23A2E] text-[#F2DBA6]" : "bg-[#F6E9D2] text-[#B23A2E]"}`}>{f.icon}</div>
                <h3 className="text-lg font-bold text-[#2A211B] mb-1.5">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[#6E6358]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ ANGPAO SPOTLIGHT ══════════════ */}
      <section className="relative overflow-hidden py-24 px-5 sm:px-14 text-[#F8EFE0]" style={{ background: "radial-gradient(120% 110% at 15% 0%, #B5392D, #7E1B12 70%)" }}>
        <div className="absolute -top-24 left-[18%] w-[380px] h-[380px] rounded-full border border-[rgba(230,179,92,0.25)] opacity-60" />
        <div className="max-w-[1180px] mx-auto grid lg:grid-cols-2 gap-14 items-center relative">
          <div>
            <p className="text-[12px] font-bold tracking-[0.16em] uppercase text-[#F0D2A0]">The feature everyone asks for</p>
            <h2 className="font-serif font-medium text-[clamp(32px,4.4vw,50px)] leading-[1.04] tracking-tight text-[#F8EFE0] mt-3.5">Digital angpao, built right in.</h2>
            <p className="text-lg leading-[1.62] text-[rgba(248,239,224,0.8)] mt-4 max-w-[480px]">
              No more untracked bank transfers. Guests send a red packet straight from your event page — and it works the same whether it&apos;s a wedding, a birthday or a full-moon.
            </p>
            <div className="flex flex-col gap-3.5 mt-7">
              {[
                { label: "SGD & IDR native", desc: "with suggested amounts that guide first-time gifters." },
                { label: "Anonymous-friendly", desc: "you see the amount and message, never the sender's identity." },
                { label: "Tracked & thankable", desc: "a running total, full list and a thank-you toggle per gift." },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 items-start">
                  <span className="flex-none w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ background: "rgba(242,219,166,0.18)" }}>
                    <Check size={14} className="text-[#F2DBA6]" />
                  </span>
                  <span className="text-[15.5px] leading-snug text-[rgba(248,239,224,0.92)]"><b className="text-[#F8EFE0]">{item.label}</b> — {item.desc}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Angpao mini card */}
          <div className="justify-self-center relative hidden lg:block">
            <div className="w-[280px] rounded-[22px] p-7 border border-[rgba(230,179,92,0.5)] shadow-2xl overflow-hidden" style={{ background: "linear-gradient(155deg, #A82A1E, #76140C)" }}>
              <div className="h-2 -mx-7 -mt-7 mb-5" style={{ background: "linear-gradient(90deg, #C99A4E, #F2DBA6, #C99A4E)" }} />
              <div className="flex justify-center mt-2">
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-serif text-[26px] text-[#8E2017]" style={{ background: "radial-gradient(circle at 35% 30%, #F2DBA6, #C99A4E)" }}>S</div>
              </div>
              <p className="text-center mt-3.5 text-[10px] tracking-[0.22em] uppercase text-[rgba(242,219,166,0.85)]">Digital angpao</p>
              <div className="text-center font-serif text-[44px] font-semibold text-[#F2DBA6] my-2">S$150</div>
              <div className="bg-white/10 border border-white/20 rounded-xl p-3 text-center text-[13px] text-[rgba(248,239,224,0.92)]">&quot;So happy for you — congratulations!&quot;</div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[12.5px] text-[rgba(248,239,224,0.78)]">Sent anonymously</span>
                <span className="bg-[#F8EFE0] text-[#8E2017] font-bold text-[13px] px-4 py-2 rounded-lg">Send</span>
              </div>
            </div>
            <div className="absolute -right-3.5 top-3.5 w-[46px] h-[46px] rounded-full shadow-lg" style={{ background: "radial-gradient(circle at 35% 30%, #F6E3B0, #C99A4E)" }} />
            <div className="absolute -left-4 bottom-8 w-[34px] h-[34px] rounded-full" style={{ background: "radial-gradient(circle at 35% 30%, #F6E3B0, #C99A4E)" }} />
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section id="how" className="bg-[#FBF5EA] py-24 px-5 sm:px-14">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center max-w-[580px] mx-auto">
            <p className="text-[12px] font-bold tracking-[0.16em] uppercase text-[#B23A2E]">How it works</p>
            <h2 className="font-serif font-medium text-[clamp(32px,4.4vw,50px)] leading-[1.04] tracking-tight text-[#231C18] mt-3.5">Live in minutes, not weekends.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 mt-12">
            {steps.map((s) => (
              <div key={s.num} className="bg-white border border-[#EEE3D0] rounded-2xl p-7">
                <div className="flex items-center gap-3.5 mb-4">
                  <span className="font-serif text-4xl font-semibold text-[#DCC08A]">{s.num}</span>
                  <div className="w-[42px] h-[42px] rounded-xl bg-[#F6E9D2] text-[#B23A2E] flex items-center justify-center">{s.icon}</div>
                </div>
                <h3 className="text-[19px] font-bold text-[#2A211B] mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed text-[#6E6358]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section className="relative overflow-hidden py-24 px-5 sm:px-14 text-[#F8EFE0]" style={{ background: "linear-gradient(160deg, #B5392D, #7E1B12)" }}>
        <div className="max-w-[740px] mx-auto text-center relative">
          <h2 className="font-serif font-medium text-[clamp(34px,4.8vw,54px)] leading-[1.03] tracking-tight text-[#F8EFE0]">Bring your next event together.</h2>
          <p className="text-lg leading-relaxed text-[rgba(248,239,224,0.82)] mt-4 max-w-[460px] mx-auto">
            Free to start. No credit card, no app download — just one link your guests will actually use.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2.5 mt-8 px-7 py-4 rounded-[13px] text-[17px] font-bold bg-[#F8EFE0] text-[#8E2017] hover:bg-white transition-colors shadow-xl">
            Create your event <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="bg-[#2A0E09] text-[rgba(248,239,224,0.7)] py-14 px-5 sm:px-14">
        <div className="max-w-[1180px] mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-9">
          <div className="min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center font-serif text-[18px] font-semibold text-[#8E2017]" style={{ background: "linear-gradient(150deg, #F2DBA6, #C99A4E)" }}>S</div>
              <span className="font-serif text-[23px] font-semibold text-[#F8EFE0]">Surat</span>
            </div>
            <p className="text-sm leading-relaxed mt-3.5 max-w-[240px]">One link for every celebration. Built for South-East Asian events.</p>
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#F8EFE0] mb-3.5">Product</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="#occasions" className="hover:text-white transition-colors">Occasions</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="/signup" className="hover:text-white transition-colors">Pricing</a>
              <a href="/signup" className="hover:text-white transition-colors">For organizers</a>
            </div>
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#F8EFE0] mb-3.5">Company</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="#how" className="hover:text-white transition-colors">About</a>
              <a href="#how" className="hover:text-white transition-colors">Blog</a>
              <a href="#how" className="hover:text-white transition-colors">Careers</a>
            </div>
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#F8EFE0] mb-3.5">Support</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="mailto:hello@surat.app" className="hover:text-white transition-colors">Help centre</a>
              <a href="mailto:hello@surat.app" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Privacy (PDPA)</a>
            </div>
          </div>
        </div>
        <div className="max-w-[1180px] mx-auto mt-9 pt-5 border-t border-[rgba(248,239,224,0.14)] flex flex-wrap gap-2 justify-between text-[13px] text-[rgba(248,239,224,0.5)]">
          <span>© 2026 Surat. All rights reserved.</span>
          <span>Built for South-East Asia · Singapore · Jakarta</span>
        </div>
      </footer>
    </div>
  );
}
