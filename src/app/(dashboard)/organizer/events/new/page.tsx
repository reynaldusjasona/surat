"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const eventTypes = [
  { value: "wedding", label: "Wedding", emoji: "💍" },
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "gathering", label: "Gathering", emoji: "🎉" },
  { value: "custom", label: "Custom", emoji: "✨" },
] as const;

const plans = [
  { value: "free", label: "Free", price: "Free", features: ["50 guests", "50 photos", "Basic features"] },
  { value: "standard", label: "Standard", price: "SGD 19", features: ["200 guests", "500 photos", "All features", "CSV export"] },
  { value: "premium", label: "Premium", price: "SGD 49", features: ["Unlimited guests", "Unlimited photos", "All features", "Priority support", "Analytics"], highlight: true },
];

const features = [
  { key: "enableRsvp", label: "RSVP", description: "Let guests confirm attendance" },
  { key: "enableAngpao", label: "Digital Angpao", description: "Receive monetary gifts digitally" },
  { key: "enableRegistry", label: "Gift Registry", description: "Share your gift wishlist" },
  { key: "enablePhotos", label: "Photo Gallery", description: "Collect and share event photos" },
] as const;

export default function OrganizerCreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    type: "wedding" as string,
    date: "",
    time: "",
    location: "",
    mapsUrl: "",
    description: "",
    coverImage: "",
    plan: "free" as string,
    enableRsvp: true,
    enableAngpao: true,
    enableRegistry: true,
    enablePhotos: true,
    guestLimit: 50,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, date: new Date(form.date).toISOString() }),
      });

      if (!res.ok) {
        const body = await res.json();
        toast.error(body.error ?? "Failed to create event");
        return;
      }

      const { slug } = await res.json();
      toast.success("Event created!");
      router.push(`/organizer/events/${slug}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="page-title">Create Event</h1>
        <p className="page-subtitle">Set up your event page in minutes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-surat-neutral-800">Event details</h2>

          <div>
            <label className="label">Event name *</label>
            <input className="input" placeholder="Sarah & John's Wedding" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>

          <div>
            <label className="label">Event type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {eventTypes.map((t) => (
                <button key={t.value} type="button" onClick={() => set("type", t.value)} className={cn("flex flex-col items-center gap-1 py-3 rounded-lg border text-sm transition-all", form.type === t.value ? "border-surat-red-400 bg-surat-red-50 text-surat-red-700" : "border-surat-neutral-200 bg-white text-surat-neutral-600 hover:border-surat-beige-400")}>
                  <span className="text-xl">{t.emoji}</span>
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Date *</label>
              <input type="date" className="input" value={form.date} onChange={(e) => set("date", e.target.value)} required />
            </div>
            <div>
              <label className="label">Time</label>
              <input type="time" className="input" value={form.time} onChange={(e) => set("time", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">Venue / Location *</label>
            <input className="input" placeholder="The Ritz-Carlton, Millenia Singapore" value={form.location} onChange={(e) => set("location", e.target.value)} required />
          </div>

          <div>
            <label className="label">Google Maps URL</label>
            <input className="input" placeholder="https://maps.google.com/…" value={form.mapsUrl} onChange={(e) => set("mapsUrl", e.target.value)} />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-[100px] resize-none" placeholder="Write a warm welcome message for your guests…" value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} />
          </div>

          <div>
            <label className="label">Cover image URL</label>
            <input className="input" placeholder="https://…" value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} />
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-surat-neutral-800">Plan</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {plans.map((p) => (
              <button key={p.value} type="button" onClick={() => set("plan", p.value)} className={cn("text-left p-4 rounded-xl border-2 transition-all", form.plan === p.value ? "border-surat-red-400 bg-surat-red-50" : "border-surat-neutral-200 bg-white hover:border-surat-beige-400")}>
                <span className="font-semibold text-sm text-surat-neutral-800">{p.label}</span>
                <p className="font-bold text-surat-red-600 text-lg mb-3">{p.price}</p>
                <ul className="space-y-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-surat-neutral-500">
                      <Check size={11} className="text-surat-success shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-surat-neutral-800">Features</h2>
          <div className="space-y-3">
            {features.map((f) => (
              <div key={f.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-surat-neutral-800">{f.label}</p>
                  <p className="text-xs text-surat-neutral-400">{f.description}</p>
                </div>
                <button type="button" role="switch" aria-checked={form[f.key]} onClick={() => set(f.key, !form[f.key])} className={cn("relative inline-flex w-10 rounded-full transition-colors shrink-0 h-[22px]", form[f.key] ? "bg-surat-red-500" : "bg-surat-neutral-200")}>
                  <span className={cn("absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform", form[f.key] ? "translate-x-[18px]" : "translate-x-0")} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {loading ? "Creating…" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
