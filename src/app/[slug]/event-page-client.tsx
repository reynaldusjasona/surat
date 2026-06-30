"use client";

import { useState } from "react";
import {
  MapPin, Calendar, Clock, ChevronDown, ChevronUp, Loader2,
  Heart, Gift, Camera, CalendarCheck, Check, X, Download,
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatCurrency } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────────── */
interface EventData {
  id: string; title: string; slug: string; type: string;
  date: Date; time: string | null; location: string | null; mapsUrl: string | null;
  description: string | null; coverImage: string | null;
  enableRsvp: boolean; enableAngpao: boolean; enableRegistry: boolean; enablePhotos: boolean;
  host: { fullName: string | null };
  _count: { rsvps: number };
  guestLimit: number;
}

const typeLabels: Record<string, string> = {
  wedding: "Wedding", birthday: "Birthday", gathering: "Gathering", custom: "Event",
};

function formatEventDate(date: Date) {
  return new Date(date).toLocaleDateString("en-SG", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatTime(time: string | null) {
  if (!time) return null;
  const [h, m] = time.split(":");
  const d = new Date(); d.setHours(parseInt(h), parseInt(m));
  return d.toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" });
}

/* ─── Main ───────────────────────────────────────────────────────── */
export default function EventPageClient({ event }: { event: EventData }) {
  const [rsvpDone, setRsvpDone] = useState<string | null>(null); // guest name

  const isFull = event._count.rsvps >= event.guestLimit;

  return (
    <div className="min-h-screen bg-surat-beige-50">
      {/* Hero */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 280, maxHeight: 480 }}>
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full object-cover"
            style={{ maxHeight: 480, minHeight: 280, objectPosition: "center" }}
          />
        ) : (
          <div className="w-full bg-gradient-to-br from-surat-red-700 via-surat-red-500 to-surat-red-900" style={{ height: 320 }} />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
          <div className="max-w-2xl mx-auto">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30 backdrop-blur-sm mb-3">
              {typeLabels[event.type] ?? event.type}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-white font-semibold leading-tight drop-shadow-sm">
              {event.title}
            </h1>
            {event.host.fullName && (
              <p className="text-white/80 text-sm mt-2">Hosted by {event.host.fullName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Event info card */}
        <div className="card p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-surat-red-50 flex items-center justify-center shrink-0 mt-0.5">
              <Calendar size={16} className="text-surat-red-500" />
            </div>
            <div>
              <p className="font-medium text-surat-neutral-900">{formatEventDate(event.date)}</p>
              {event.time && (
                <p className="text-sm text-surat-neutral-500 flex items-center gap-1 mt-0.5">
                  <Clock size={12} />{formatTime(event.time)}
                </p>
              )}
            </div>
          </div>

          {event.location && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-surat-red-50 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={16} className="text-surat-red-500" />
              </div>
              <div>
                <p className="font-medium text-surat-neutral-900">{event.location}</p>
                {event.mapsUrl && (
                  <a
                    href={event.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-surat-red-500 hover:text-surat-red-600 mt-0.5 inline-block"
                  >
                    Open in Maps →
                  </a>
                )}
              </div>
            </div>
          )}

          {event.description && (
            <div className="pt-3 border-t border-surat-neutral-100">
              <p className="text-sm text-surat-neutral-600 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}
        </div>

        {/* RSVP */}
        {event.enableRsvp && (
          rsvpDone ? (
            <div className="card p-6 text-center border-green-200 bg-green-50">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <Check size={22} className="text-green-600" />
              </div>
              <h2 className="font-serif text-xl text-surat-neutral-900 mb-1">You&apos;re on the list!</h2>
              <p className="text-sm text-surat-neutral-500">
                Thanks, {rsvpDone}. We&apos;ll see you there.
              </p>
              <CalendarDownloadButton slug={event.slug} />
            </div>
          ) : isFull ? (
            <div className="card p-6 text-center bg-surat-beige-100">
              <p className="font-semibold text-surat-neutral-700">This event is at capacity</p>
              <p className="text-sm text-surat-neutral-400 mt-1">The RSVP list is full.</p>
            </div>
          ) : (
            <RsvpSection slug={event.slug} onSuccess={setRsvpDone} />
          )
        )}

        {/* Angpao */}
        {event.enableAngpao && <AngpaoSection slug={event.slug} />}

        {/* Registry */}
        {event.enableRegistry && <RegistrySection slug={event.slug} />}

        {/* Photos */}
        {event.enablePhotos && <PhotoSection slug={event.slug} />}

        {/* Calendar */}
        <CalendarDownloadButton slug={event.slug} />

      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-surat-neutral-300">
        Powered by <span className="font-serif text-surat-red-400">Surat</span>
      </footer>
    </div>
  );
}

/* ─── RSVP Section ───────────────────────────────────────────────── */
function RsvpSection({ slug, onSuccess }: { slug: string; onSuccess: (name: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"attending" | "maybe" | "not_attending">("attending");
  const [plusOnes, setPlusOnes] = useState<string[]>([]);
  const [dietary, setDietary] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDietary, setShowDietary] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, status,
          plusOnes: plusOnes.filter(Boolean).map((n) => ({ name: n })),
          dietaryNotes: dietary || undefined,
        }),
      });
      if (!res.ok) { toast.error("Failed to RSVP. Please try again."); return; }
      onSuccess(name);
    } catch { toast.error("Something went wrong."); }
    finally { setLoading(false); }
  }

  return (
    <SectionCard icon={<CalendarCheck size={18} />} title="RSVP">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Your name *</label>
            <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Email *</label>
            <input type="email" className="input" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="label">Will you attend?</label>
          <div className="flex gap-2 flex-wrap">
            {([
              { v: "attending", label: "Attending" },
              { v: "maybe", label: "Maybe" },
              { v: "not_attending", label: "Can't make it" },
            ] as const).map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => setStatus(o.v)}
                className={cn(
                  "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                  status === o.v
                    ? "bg-surat-red-500 border-surat-red-500 text-white"
                    : "border-surat-neutral-200 bg-white text-surat-neutral-600 hover:border-surat-neutral-300"
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plus ones */}
        {status === "attending" && (
          <div>
            <label className="label">Bringing guests?</label>
            <div className="space-y-2">
              {plusOnes.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder={`Guest ${i + 1} name`}
                    value={p}
                    onChange={(e) => {
                      const updated = [...plusOnes]; updated[i] = e.target.value;
                      setPlusOnes(updated);
                    }}
                  />
                  <button type="button" onClick={() => setPlusOnes(plusOnes.filter((_, j) => j !== i))}
                    className="p-2.5 rounded-lg border border-surat-neutral-200 text-surat-neutral-400 hover:text-red-500 hover:border-red-200">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setPlusOnes([...plusOnes, ""])}
                className="text-sm text-surat-red-500 hover:text-surat-red-600 flex items-center gap-1">
                + Add guest
              </button>
            </div>
          </div>
        )}

        {/* Dietary */}
        <button
          type="button"
          onClick={() => setShowDietary(!showDietary)}
          className="text-sm text-surat-neutral-500 flex items-center gap-1 hover:text-surat-neutral-700"
        >
          {showDietary ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Dietary requirements
        </button>
        {showDietary && (
          <textarea
            className="input resize-none"
            placeholder="E.g. vegetarian, halal, nut allergy…"
            rows={2}
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
          />
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          {loading ? "Submitting…" : "Confirm RSVP"}
        </button>
      </form>
    </SectionCard>
  );
}

/* ─── Angpao Section ─────────────────────────────────────────────── */
function AngpaoSection({ slug }: { slug: string }) {
  const [amount, setAmount] = useState<number | "">("");
  const [currency, setCurrency] = useState("SGD");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isAnon, setIsAnon] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const quickAmounts = currency === "SGD" ? [20, 50, 100, 200] : [100000, 200000, 500000, 1000000];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount) { toast.error("Please enter an amount"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${slug}/angpao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderName: name, senderEmail: email, amount, currency, message, isAnonymous: isAnon }),
      });
      if (!res.ok) { toast.error("Failed to send angpao"); return; }
      setDone(true);
    } catch { toast.error("Something went wrong."); }
    finally { setLoading(false); }
  }

  if (done) {
    return (
      <SectionCard icon={<Heart size={18} />} title="Digital Angpao">
        <div className="text-center py-6">
          <div className="text-5xl mb-3">🧧</div>
          <p className="font-serif text-xl text-surat-neutral-800">Thank you for your gift!</p>
          <p className="text-sm text-surat-neutral-400 mt-1">Your angpao has been sent with love.</p>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard icon={<Heart size={18} />} title="Digital Angpao">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Currency</label>
          <div className="flex gap-2">
            {["SGD", "IDR"].map((c) => (
              <button key={c} type="button" onClick={() => { setCurrency(c); setAmount(""); }}
                className={cn("px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                  currency === c ? "bg-surat-red-500 border-surat-red-500 text-white" : "border-surat-neutral-200 bg-white text-surat-neutral-600")}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Amount</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {quickAmounts.map((a) => (
              <button key={a} type="button" onClick={() => setAmount(a)}
                className={cn("px-3 py-1.5 rounded-lg border text-sm transition-all",
                  amount === a ? "bg-surat-red-500 border-surat-red-500 text-white" : "border-surat-neutral-200 bg-white text-surat-neutral-500")}>
                {formatCurrency(a, currency)}
              </button>
            ))}
          </div>
          <input type="number" className="input" placeholder="Or enter custom amount"
            value={amount} onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : "")} min="1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Your name *</label>
            <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Email *</label>
            <input type="email" className="input" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="label">Message (optional)</label>
          <textarea className="input resize-none" rows={2} placeholder="Wishing you joy and happiness…"
            value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <div
            onClick={() => setIsAnon(!isAnon)}
            className={cn("w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
              isAnon ? "bg-surat-red-500 border-surat-red-500" : "border-surat-neutral-300")}
          >
            {isAnon && <Check size={10} className="text-white" />}
          </div>
          <span className="text-sm text-surat-neutral-600">Send anonymously</span>
        </label>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? <><Loader2 size={16} className="animate-spin" />Sending…</> : <>🧧 Send Angpao</>}
        </button>
      </form>
    </SectionCard>
  );
}

/* ─── Registry Section ───────────────────────────────────────────── */
interface RegItem { id: string; name: string; brand: string | null; price: number; imageUrl: string | null; productUrl: string | null; status: string; claimedAnonymous: boolean; claimedBy: string | null; }

function RegistrySection({ slug }: { slug: string }) {
  const [items, setItems] = useState<RegItem[] | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [claimForm, setClaimForm] = useState<{ id: string; name: string; email: string; anon: boolean } | null>(null);
  const [claiming2, setClaiming2] = useState(false);

  async function load() {
    if (items !== null) { setExpanded(!expanded); return; }
    const res = await fetch(`/api/events/${slug}/registry`);
    const json = await res.json();
    setItems(json.data ?? []);
    setExpanded(true);
  }

  async function claim(e: React.FormEvent) {
    e.preventDefault();
    if (!claimForm) return;
    setClaiming2(true);
    const res = await fetch(`/api/events/${slug}/registry/${claimForm.id}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimedBy: claimForm.name, claimedByEmail: claimForm.email, claimedAnonymous: claimForm.anon }),
    });
    if (res.ok) {
      toast.success("Gift claimed!");
      setItems((prev) => prev?.map((i) => i.id === claimForm.id ? { ...i, status: "claimed", claimedBy: claimForm.name, claimedAnonymous: claimForm.anon } : i) ?? null);
      setClaimForm(null);
      setClaiming(null);
    } else { toast.error("Already taken or failed"); }
    setClaiming2(false);
  }

  return (
    <SectionCard icon={<Gift size={18} />} title="Gift Registry">
      <button onClick={load} className="btn-secondary w-full text-sm mb-4">
        {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        {expanded ? "Hide Registry" : "View Wishlist"}
      </button>

      {expanded && items && (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-sm text-center text-surat-neutral-400 py-4">No registry items yet.</p>}
          {items.map((item) => (
            <div key={item.id} className={cn("rounded-xl border p-4 flex gap-3 items-start",
              item.status === "claimed" ? "bg-surat-neutral-50 border-surat-neutral-200" : "bg-white border-surat-neutral-200")}>
              {item.imageUrl && (
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-surat-beige-100 shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-surat-neutral-800">{item.name}</p>
                {item.brand && <p className="text-xs text-surat-neutral-400">{item.brand}</p>}
                <p className="text-surat-red-600 font-semibold text-sm mt-0.5">{formatCurrency(item.price)}</p>
                {item.status === "claimed" && (
                  <p className="text-xs text-surat-neutral-400 mt-1">
                    {item.claimedAnonymous ? "Someone is getting this" : `Getting this: ${item.claimedBy}`}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                {item.status === "claimed" ? (
                  <span className="badge badge-gray text-xs">Taken</span>
                ) : claiming === item.id ? (
                  <button onClick={() => { setClaiming(null); setClaimForm(null); }} className="badge badge-gray text-xs">Cancel</button>
                ) : (
                  <button
                    onClick={() => { setClaiming(item.id); setClaimForm({ id: item.id, name: "", email: "", anon: false }); }}
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    I&apos;ll get this
                  </button>
                )}
              </div>
            </div>
          ))}

          {claimForm && (
            <form onSubmit={claim} className="card p-4 space-y-3 border-surat-red-200">
              <p className="text-sm font-medium text-surat-neutral-800">Claim this gift</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="input text-sm" placeholder="Your name" value={claimForm.name} onChange={(e) => setClaimForm({ ...claimForm, name: e.target.value })} required />
                <input type="email" className="input text-sm" placeholder="Email" value={claimForm.email} onChange={(e) => setClaimForm({ ...claimForm, email: e.target.value })} required />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setClaimForm({ ...claimForm, anon: !claimForm.anon })}
                  className={cn("w-4 h-4 rounded border-2 flex items-center justify-center",
                    claimForm.anon ? "bg-surat-red-500 border-surat-red-500" : "border-surat-neutral-300")}>
                  {claimForm.anon && <Check size={10} className="text-white" />}
                </div>
                <span className="text-xs text-surat-neutral-500">Stay anonymous</span>
              </label>
              <button type="submit" className="btn-primary w-full text-sm" disabled={claiming2}>
                {claiming2 ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Confirm
              </button>
            </form>
          )}
        </div>
      )}
    </SectionCard>
  );
}

/* ─── Photo Section ──────────────────────────────────────────────── */
interface PublicPhoto { id: string; thumbnailUrl: string; originalUrl: string; isPhotographer: boolean; }

function PhotoSection({ slug }: { slug: string }) {
  const [photos, setPhotos] = useState<PublicPhoto[] | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<PublicPhoto | null>(null);
  const [downloading, setDownloading] = useState(false);

  async function load() {
    if (photos !== null) { setExpanded(!expanded); return; }
    const res = await fetch(`/api/events/${slug}/photos`);
    const json = await res.json();
    setPhotos(json.data ?? []);
    setExpanded(true);
  }

  async function download(photo: PublicPhoto) {
    setDownloading(true);
    try {
      const res = await fetch(photo.originalUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `photo-${photo.id}.jpg`; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error("Download failed"); }
    setDownloading(false);
  }

  return (
    <>
      <SectionCard icon={<Camera size={18} />} title="Photo Gallery">
        <button onClick={load} className="btn-secondary w-full text-sm mb-4">
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          {expanded ? "Hide Photos" : "View Photos"}
        </button>

        {expanded && photos && (
          photos.length === 0 ? (
            <p className="text-sm text-center text-surat-neutral-400 py-4">No photos yet. Be the first to upload!</p>
          ) : (
            <div className="grid grid-cols-3 gap-1.5">
              {photos.map((p) => (
                <button key={p.id} onClick={() => setLightbox(p)}
                  className="aspect-square rounded-lg overflow-hidden bg-surat-beige-100 hover:opacity-90 transition-opacity">
                  <img src={p.thumbnailUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )
        )}

        <div className="mt-4 text-center">
          <a href={`/${slug}/upload`}
            className="text-sm text-surat-red-500 hover:text-surat-red-600 font-medium">
            Upload your photos →
          </a>
        </div>
      </SectionCard>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.originalUrl} alt="" className="w-full rounded-xl max-h-[80vh] object-contain" />
            <div className="flex justify-between items-center mt-3 px-1">
              <span className="text-white/60 text-xs">
                {lightbox.isPhotographer ? "📷 Professional photo" : "👤 Guest photo"}
              </span>
              <div className="flex gap-2">
                <button onClick={() => download(lightbox)} disabled={downloading}
                  className="btn-secondary text-xs py-1.5">
                  <Download size={12} /> {downloading ? "…" : "Download"}
                </button>
                <button onClick={() => setLightbox(null)} className="btn-ghost text-white text-xs py-1.5">
                  <X size={12} /> Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Calendar Button ────────────────────────────────────────────── */
function CalendarDownloadButton({ slug }: { slug: string }) {
  return (
    <div className="card p-4 flex flex-col sm:flex-row gap-2">
      <a href={`/api/events/${slug}/calendar`} download
        className="btn-secondary flex-1 justify-center text-sm">
        📅 Add to Calendar (.ics)
      </a>
      <p className="text-xs text-surat-neutral-400 self-center sm:text-left text-center hidden sm:block">
        Apple · Google · Outlook
      </p>
    </div>
  );
}

/* ─── Section Card ───────────────────────────────────────────────── */
function SectionCard({
  icon, title, children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-surat-neutral-100">
        <span className="text-surat-red-500">{icon}</span>
        <h2 className="font-serif text-lg text-surat-neutral-900">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
