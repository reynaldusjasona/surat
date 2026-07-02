"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */
type AnimOpts = KeyframeAnimationOptions;

/* ─── Constants ──────────────────────────────────────────── */
const EASE = "cubic-bezier(.2,.8,.2,1)";
const REVEAL_DUR = 850;

const FEATURES = [
  { icon: "coins", lbl: "Digital angpao", val: "S$888", note: '"Sent with love & our very best wishes."' },
  { icon: "cal", lbl: "Guests RSVP'd", val: "214", note: "attending · 32 plus-ones counted" },
  { icon: "img", lbl: "Shared album", val: "1,240", note: "photos from guests & your photographer" },
  { icon: "gift", lbl: "Gift registry", val: "18 / 24", note: "wishlist items claimed by guests" },
  { icon: "wallet", lbl: "Wallet pass", val: "Added", note: "saved to Apple & Google Wallet" },
];

const EVENTS = [
  { badge: "Wedding", title: "Jason & Sarah" },
  { badge: "Birthday", title: "Maya turns 30" },
  { badge: "Full-Moon", title: "Baby Aria's Month" },
  { badge: "Corporate", title: "Acme Year-End Gala" },
  { badge: "Reunion", title: "The Tan Reunion" },
];

const SEAL_ICONS: Record<string, string> = {
  coins: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8E2017" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>`,
  cal: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8E2017" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>`,
  img: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8E2017" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/></svg>`,
  gift: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8E2017" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8"/></svg>`,
  wallet: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8E2017" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>`,
};

/* ─── Helpers ────────────────────────────────────────────── */
function anim(el: Element | null, kf: Keyframe[], opts: AnimOpts) {
  if (!el) return null;
  try { return el.animate(kf, opts); } catch { return null; }
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ─── Component ──────────────────────────────────────────── */
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const amountRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const featLblRef = useRef<HTMLParagraphElement>(null);
  const featValRef = useRef<HTMLDivElement>(null);
  const featNoteRef = useRef<HTMLParagraphElement>(null);
  const evtBadgeRef = useRef<HTMLSpanElement>(null);
  const evtTitleRef = useRef<HTMLDivElement>(null);

  /* ─ Count-up ─ */
  const countUp = useCallback((target: number) => {
    const el = amountRef.current;
    if (!el) return;
    const dur = 1500;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = "S$" + Math.round(target * e);
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = "S$0";
    requestAnimationFrame(tick);
  }, []);

  /* ─ Mount effect ─ */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const reduced = prefersReducedMotion();

    /* === Entrance reveals === */
    hero.querySelectorAll<HTMLElement>("[data-rise]").forEach((el) => {
      const delay = parseFloat(el.dataset.rise!) * 1000;
      anim(el, [{ opacity: 0, transform: "translateY(26px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: REVEAL_DUR, delay, easing: EASE, fill: "both" });
    });
    hero.querySelectorAll<HTMLElement>("[data-pop]").forEach((el) => {
      const delay = parseFloat(el.dataset.pop!) * 1000;
      anim(el, [{ opacity: 0, transform: "translateY(36px) scale(.9)" }, { opacity: 1, transform: "translateY(0) scale(1)" }], { duration: REVEAL_DUR, delay, easing: EASE, fill: "both" });
    });

    if (reduced) return; // skip everything below for prefers-reduced-motion

    /* === Continuous float === */
    hero.querySelectorAll<HTMLElement>("[data-float]").forEach((el) => {
      const dur = parseFloat(el.dataset.float!) * 1000;
      const amp = parseFloat(el.dataset.amp!) || 14;
      anim(el, [{ transform: "translateY(0)" }, { transform: `translateY(-${amp}px)` }, { transform: "translateY(0)" }], { duration: dur, iterations: Infinity, easing: "ease-in-out" });
    });

    /* === Continuous sway === */
    hero.querySelectorAll<HTMLElement>("[data-sway]").forEach((el) => {
      const r = parseFloat(el.dataset.sway!);
      anim(el, [{ transform: `rotate(${r}deg)` }, { transform: `rotate(${r + 2.4}deg)` }, { transform: `rotate(${r}deg)` }], { duration: 8500, iterations: Infinity, easing: "ease-in-out" });
    });

    /* === Rings + glow pulse === */
    hero.querySelectorAll<HTMLElement>("[data-ring]").forEach((el) => {
      const dur = parseFloat(el.dataset.ring!) * 1000;
      anim(el, [{ transform: "scale(1)", opacity: 0.5 }, { transform: "scale(1.05)", opacity: 0.85 }, { transform: "scale(1)", opacity: 0.5 }], { duration: dur, iterations: Infinity, easing: "ease-in-out" });
    });
    hero.querySelectorAll<HTMLElement>("[data-glow]").forEach((el) => {
      anim(el, [{ opacity: 0.5 }, { opacity: 0.9 }, { opacity: 0.5 }], { duration: 7000, iterations: Infinity, easing: "ease-in-out" });
    });

    /* === Gold shimmer === */
    hero.querySelectorAll<HTMLElement>("[data-shine]").forEach((el) => {
      anim(el, [{ backgroundPosition: "0% center" }, { backgroundPosition: "-200% center" }], { duration: 4500, iterations: Infinity, easing: "linear" });
    });

    /* === Confetti === */
    hero.querySelectorAll<HTMLElement>("[data-confetti]").forEach((el) => {
      const dur = 7000 + Math.random() * 4500;
      const rot = 320 + Math.random() * 220;
      anim(el, [
        { transform: "translateY(-40px) rotate(0deg)", opacity: 0 },
        { opacity: 0.9, offset: 0.12 },
        { opacity: 0.9, offset: 0.9 },
        { transform: `translateY(720px) rotate(${rot}deg)`, opacity: 0 },
      ], { duration: dur, delay: -Math.random() * dur, iterations: Infinity, easing: "linear" });
    });

    /* === Count-up === */
    setTimeout(() => countUp(888), 760);

    /* === Parallax === */
    const layers = hero.querySelectorAll<HTMLElement>("[data-parallax]");
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      const cx = e.clientX - r.left - r.width / 2;
      const cy = e.clientY - r.top - r.height / 2;
      layers.forEach((el) => {
        const d = parseFloat(el.dataset.parallax!) || 0;
        el.style.transform = `translate3d(${-cx * d}px, ${-cy * d}px, 0)`;
      });
    };
    const onLeave = () => layers.forEach((el) => { el.style.transform = "translate3d(0,0,0)"; });
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);

    /* === Feature card cycling (every 3.2s, first at 2s) === */
    let fi = 0;
    const featInterval = setInterval(() => {
      fi = (fi + 1) % FEATURES.length;
      const f = FEATURES[fi];
      const fadeOut = amountRef.current && anim(amountRef.current.parentElement, [{ opacity: 1 }, { opacity: 0 }], { duration: 280, easing: "ease", fill: "forwards" });
      const sealOut = anim(sealRef.current, [{ opacity: 1 }, { opacity: 0 }], { duration: 280, easing: "ease", fill: "forwards" });
      const done = () => {
        if (sealRef.current) sealRef.current.innerHTML = SEAL_ICONS[f.icon];
        if (featLblRef.current) featLblRef.current.textContent = f.lbl;
        if (amountRef.current) amountRef.current.textContent = f.val;
        if (featNoteRef.current) featNoteRef.current.textContent = f.note;
        anim(amountRef.current?.parentElement ?? null, [{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: "ease", fill: "forwards" });
        anim(sealRef.current, [{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: "ease", fill: "forwards" });
      };
      if (fadeOut) fadeOut.onfinish = done; else done();
    }, 3200);
    const featStart = setTimeout(() => { /* trigger first swap after 2s — interval already handles it */ }, 2000);

    /* === Event card cycling (every 3s) === */
    let ei = 0;
    const evtInterval = setInterval(() => {
      ei = (ei + 1) % EVENTS.length;
      const ev = EVENTS[ei];
      const card = evtBadgeRef.current?.parentElement;
      const out = anim(card ?? null, [{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: "ease", fill: "forwards" });
      const swap = () => {
        if (evtBadgeRef.current) evtBadgeRef.current.textContent = ev.badge;
        if (evtTitleRef.current) evtTitleRef.current.textContent = ev.title;
        anim(card ?? null, [{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: "ease", fill: "forwards" });
      };
      if (out) out.onfinish = swap; else swap();
    }, 3000);

    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      clearInterval(featInterval);
      clearInterval(evtInterval);
      clearTimeout(featStart);
    };
  }, [countUp]);

  /* ─── Render ───────────────────────────────────────────── */
  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden min-h-screen"
      style={{ background: "radial-gradient(125% 95% at 82% -5%, #B5392D, #7E1B12 68%)" }}
    >
      {/* === Background decorations === */}
      <div data-ring="9" className="absolute -top-28 right-36 w-[460px] h-[460px] rounded-full border border-[rgba(230,179,92,0.3)] opacity-60" />
      <div data-ring="11" className="absolute -bottom-20 -left-20 w-[360px] h-[360px] rounded-full border border-[rgba(230,179,92,0.22)] opacity-60" />
      <div data-glow="" className="absolute top-[18%] right-[24%] w-[520px] h-[520px] rounded-full opacity-70 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(230,179,92,0.16), transparent 62%)" }} />

      {/* === Confetti === */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            data-confetti=""
            className="absolute opacity-0"
            style={{
              left: `${6 + i * 6.5}%`,
              top: "-30px",
              width: `${7 + (i % 3) * 2}px`,
              height: `${7 + (i % 3) * 2}px`,
              background: i % 3 === 0 ? "#E6B35C" : i % 3 === 1 ? "#F8EFE0" : "#F2DBA6",
              borderRadius: i % 2 === 0 ? "2px" : "50%",
            }}
          />
        ))}
      </div>

      {/* === Nav === */}
      <nav data-rise="0" className="relative z-10 flex items-center justify-between px-5 sm:px-14 py-6">
        <div className="flex items-center gap-3">
          <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center font-serif text-[22px] font-semibold text-[#8E2017] shadow-lg" style={{ background: "linear-gradient(150deg, #F2DBA6, #C99A4E)" }}>S</div>
          <span className="font-serif text-[27px] font-semibold text-[#F8EFE0]">Surat</span>
        </div>
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[rgba(248,239,224,0.82)]">
          <a href="#occasions" className="hover:text-white transition-colors">Occasions</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
          <Link href="/login" className="px-4 py-2.5 border border-[rgba(248,239,224,0.5)] rounded-xl hover:bg-white/10 transition-colors">Sign in</Link>
          <Link href="/signup" className="px-5 py-2.5 rounded-xl bg-[#F8EFE0] text-[#8E2017] font-bold hover:bg-white transition-colors">Get started</Link>
        </div>
      </nav>

      {/* === Two-column layout === */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-14 pt-10 pb-24 grid lg:grid-cols-2 gap-8 items-center">
        {/* ── Left column ── */}
        <div>
          <span data-rise="0.05" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold tracking-widest uppercase text-[#F0D2A0] border border-[rgba(230,179,92,0.45)]" style={{ background: "rgba(230,179,92,0.16)" }}>
            Weddings · Birthdays · Full-moons · Corporate
          </span>
          <h1 className="font-serif font-medium text-[clamp(48px,6.4vw,82px)] leading-[1] tracking-tight mt-6 text-[#F8EFE0]">
            <span data-rise="0.15" className="block">The whole</span>
            <span data-rise="0.3" className="block">celebration, in</span>
            <span data-rise="0.45" className="block">
              one{" "}
              <span
                data-shine=""
                className="italic"
                style={{
                  background: "linear-gradient(100deg, #C99A4E, #F6E3B0 24%, #C99A4E 50%, #F6E3B0 76%, #C99A4E)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                golden link.
              </span>
            </span>
          </h1>
          <p data-rise="0.6" className="text-[19px] leading-relaxed text-[rgba(248,239,224,0.82)] max-w-[460px] mt-6">
            One page for any event you&apos;re throwing — RSVPs, digital angpao, a gift registry and every photo. The way South-East Asia celebrates, finally in one place.
          </p>
          <div data-rise="0.72" className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 mt-8">
            <Link href="/signup" className="inline-flex items-center gap-2.5 px-7 py-4 rounded-[13px] text-base font-bold bg-[#F8EFE0] text-[#8E2017] hover:bg-white transition-colors shadow-xl">
              Create your event <ArrowRight size={18} />
            </Link>
            <a href="#features" className="px-6 py-4 rounded-[13px] text-base font-semibold text-[#F8EFE0] border border-[rgba(248,239,224,0.5)] hover:bg-white/10 transition-colors">
              See a live example
            </a>
          </div>
          <p data-rise="0.82" className="mt-7 text-[12px] tracking-[0.18em] uppercase text-[rgba(242,219,166,0.7)]">
            No app download · 50–1,000 guests · SGD &amp; IDR
          </p>
        </div>

        {/* ── Right column: floating composition ── */}
        <div className="relative hidden lg:block h-[520px]">
          {/* Angpao packet card */}
          <div data-parallax="0.022" className="absolute right-24 top-7 transition-transform duration-[400ms]" style={{ transitionTimingFunction: EASE }}>
            <div data-pop="0.5">
              <div data-sway="-6">
                <div data-float="6" data-amp="14">
                  <div className="w-[246px] h-[348px] rounded-2xl overflow-hidden border border-[rgba(230,179,92,0.5)] shadow-2xl relative" style={{ background: "linear-gradient(160deg, #A82A1E, #76140C)" }}>
                    <div className="h-[78px]" style={{ background: "linear-gradient(90deg, #C99A4E, #F2DBA6, #C99A4E)" }} />
                    {/* Seal */}
                    <div ref={sealRef} className="absolute top-[46px] left-1/2 -translate-x-1/2 w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-lg" style={{ background: "radial-gradient(circle at 35% 30%, #F2DBA6, #C99A4E)" }} dangerouslySetInnerHTML={{ __html: SEAL_ICONS.coins }} />
                    {/* Content */}
                    <div className="text-center pt-14 px-4">
                      <div>
                        <p ref={featLblRef} className="text-[10px] tracking-[0.22em] uppercase text-[rgba(242,219,166,0.85)] m-0">Digital angpao</p>
                        <div ref={amountRef} className="font-serif text-[46px] font-semibold text-[#F2DBA6] mt-2">S$888</div>
                        <p ref={featNoteRef} className="text-[12.5px] text-[rgba(248,239,224,0.8)] mt-1 m-0">&quot;Sent with love &amp; our very best wishes.&quot;</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event card */}
          <div data-parallax="0.05" className="absolute left-1 bottom-6 transition-transform duration-[400ms]" style={{ transitionTimingFunction: EASE }}>
            <div data-pop="0.68">
              <div data-sway="5">
                <div data-float="7" data-amp="22">
                  <div className="w-[256px] bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="h-[70px]" style={{ backgroundImage: "repeating-linear-gradient(135deg, #E7D6C4 0 12px, #F0E3D3 12px 24px)" }} />
                    <div className="p-4 text-[#2A211B]">
                      <div>
                        <span ref={evtBadgeRef} className="inline-block px-2.5 py-0.5 rounded-full bg-[#B23A2E] text-white text-[9px] font-bold tracking-wide uppercase mb-2">Wedding</span>
                        <div ref={evtTitleRef} className="font-serif text-[21px] font-semibold leading-tight">Jason &amp; Sarah</div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11.5px] text-[#6E6358] mt-2">
                        <CalendarCheck size={13} className="text-[#B23A2E] flex-none" />
                        Sat, 14 Dec 2026 · 4:00 PM
                      </div>
                      <div className="mt-3 text-center py-2.5 rounded-lg bg-[#B23A2E] text-white text-[12.5px] font-semibold">RSVP now</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gold coins */}
          <div data-parallax="0.085" className="absolute right-11 bottom-14 transition-transform duration-[400ms]" style={{ transitionTimingFunction: EASE }}>
            <div data-pop="0.9">
              <div data-float="5" data-amp="16">
                <div className="w-[58px] h-[58px] rounded-full shadow-lg flex items-center justify-center font-serif text-[17px] font-semibold text-[#8E2017]" style={{ background: "radial-gradient(circle at 35% 30%, #F6E3B0, #C99A4E)", boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.35), 0 12px 20px -8px rgba(20,4,2,0.5)" }}>$</div>
              </div>
            </div>
          </div>
          <div data-parallax="0.1" className="absolute right-0 top-[90px] transition-transform duration-[400ms]" style={{ transitionTimingFunction: EASE }}>
            <div data-pop="1">
              <div data-float="6.5" data-amp="24">
                <div className="w-[42px] h-[42px] rounded-full" style={{ background: "radial-gradient(circle at 35% 30%, #F6E3B0, #C99A4E)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.35), 0 8px 16px -6px rgba(20,4,2,0.5)" }} />
              </div>
            </div>
          </div>
          <div data-parallax="0.07" className="absolute left-[118px] top-1 transition-transform duration-[400ms]" style={{ transitionTimingFunction: EASE }}>
            <div data-pop="1.1">
              <div data-float="5.6" data-amp="14">
                <div className="w-[30px] h-[30px] rounded-full" style={{ background: "radial-gradient(circle at 35% 30%, #F6E3B0, #C99A4E)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.35)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
