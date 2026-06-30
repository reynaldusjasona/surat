"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ExternalLink, Copy, Users, Heart, Gift, Camera,
  Check, MapPin, Calendar, Loader2, Pencil, Trash2,
  Download, Plus, ChevronDown, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatCurrency } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────── */
interface EventData {
  id: string; title: string; slug: string; type: string; date: string;
  location: string | null; status: string; plan: string;
  enableRsvp: boolean; enableAngpao: boolean; enableRegistry: boolean; enablePhotos: boolean;
}
interface Rsvp {
  id: string; name: string; email: string; status: string;
  plusOnes: { name: string }[] | null; dietaryNotes: string | null; createdAt: string;
}
interface Angpao {
  id: string; senderName: string; amount: number; currency: string;
  message: string | null; isAnonymous: boolean; isThanked: boolean; createdAt: string;
}
interface RegistryItem {
  id: string; name: string; brand: string | null; price: number;
  imageUrl: string | null; productUrl: string | null; priority: number;
  status: string; claimedBy: string | null; claimedAnonymous: boolean; createdAt: string;
}
interface Photo {
  id: string; uploaderName: string; isPhotographer: boolean;
  thumbnailUrl: string; originalUrl: string; downloadCount: number; createdAt: string;
}

const TABS = ["guests", "angpao", "registry", "photos"] as const;
type Tab = (typeof TABS)[number];

const statusBadge = (s: string) =>
  s === "attending" ? "badge-green" :
  s === "not_attending" ? "badge-red" :
  s === "maybe" ? "badge-yellow" : "badge-gray";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });
}

/* ─── Main ────────────────────────────────────────────────────────── */
export default function EventDashboardPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("guests");

  const fetchEvent = useCallback(async () => {
    const res = await fetch(`/api/events/${slug}`);
    if (!res.ok) { setLoading(false); return; }
    const data = await res.json();
    setEvent(data);
    setLoading(false);
  }, [slug]);

  useEffect(() => { fetchEvent(); }, [fetchEvent]);

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
    toast.success("Event link copied!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-surat-red-500" size={24} />
      </div>
    );
  }
  if (!event) {
    return (
      <div className="card p-12 text-center">
        <AlertCircle size={32} className="text-surat-neutral-400 mx-auto mb-3" />
        <h2 className="font-serif text-xl text-surat-neutral-700">Event not found</h2>
        <Link href="/dashboard/host" className="btn-primary mt-4 inline-flex">Back to events</Link>
      </div>
    );
  }

  const tabs = [
    { id: "guests" as Tab, label: "Guests", icon: <Users size={15} />, enabled: event.enableRsvp },
    { id: "angpao" as Tab, label: "Angpao", icon: <Heart size={15} />, enabled: event.enableAngpao },
    { id: "registry" as Tab, label: "Registry", icon: <Gift size={15} />, enabled: event.enableRegistry },
    { id: "photos" as Tab, label: "Photos", icon: <Camera size={15} />, enabled: event.enablePhotos },
  ].filter((t) => t.enabled);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("badge", event.status === "active" ? "badge-green" : "badge-gray")}>
                {event.status}
              </span>
              <span className="badge badge-gray capitalize">{event.type}</span>
            </div>
            <h1 className="font-serif text-2xl text-surat-neutral-900">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-surat-neutral-500">
              <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(event.date)}</span>
              {event.location && <span className="flex items-center gap-1"><MapPin size={12} />{event.location}</span>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={copyLink} className="btn-secondary text-xs py-2">
              <Copy size={14} /> Copy Link
            </button>
            <Link href={`/${slug}`} target="_blank" className="btn-secondary text-xs py-2">
              <ExternalLink size={14} /> View Page
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surat-neutral-200">
        <div className="flex gap-0 overflow-x-auto scrollbar-hide -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-surat-red-500 text-surat-red-600"
                  : "border-transparent text-surat-neutral-500 hover:text-surat-neutral-700"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "guests" && <GuestsTab slug={slug} />}
      {activeTab === "angpao" && <AngpaoTab slug={slug} />}
      {activeTab === "registry" && <RegistryTab slug={slug} />}
      {activeTab === "photos" && <PhotosTab slug={slug} />}
    </div>
  );
}

/* ─── Guests Tab ─────────────────────────────────────────────────── */
function GuestsTab({ slug }: { slug: string }) {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`/api/events/${slug}/rsvp`)
      .then((r) => r.json())
      .then((d) => { setRsvps(d.rsvps ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const filtered = rsvps.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) ||
           r.email.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    attending: rsvps.filter((r) => r.status === "attending").length,
    maybe: rsvps.filter((r) => r.status === "maybe").length,
    not_attending: rsvps.filter((r) => r.status === "not_attending").length,
  };

  const exportCsv = () => {
    const rows = [
      ["Name", "Email", "Status", "Plus Ones", "Dietary Notes", "Date"].join(","),
      ...rsvps.map((r) =>
        [
          `"${r.name}"`, `"${r.email}"`, r.status,
          (r.plusOnes?.length ?? 0).toString(),
          `"${r.dietaryNotes ?? ""}"`,
          formatDate(r.createdAt),
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `rsvps-${slug}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Attending", value: counts.attending, color: "text-green-600", bg: "bg-green-50" },
          { label: "Maybe", value: counts.maybe, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Not Attending", value: counts.not_attending, color: "text-red-500", bg: "bg-red-50" },
          { label: "Total RSVPs", value: rsvps.length, color: "text-surat-neutral-700", bg: "bg-surat-beige-100" },
        ].map((s) => (
          <div key={s.label} className={cn("stat-card", s.bg, "border-none")}>
            <p className={cn("text-2xl font-bold font-mono", s.color)}>{s.value}</p>
            <p className="text-xs text-surat-neutral-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-surat-neutral-100">
          <input
            className="input max-w-xs text-sm"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {rsvps.length > 0 && (
            <button onClick={exportCsv} className="btn-secondary text-xs self-start sm:self-auto">
              <Download size={14} /> Export CSV
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState message="No RSVPs yet. Share your event link to get started." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  {["Name", "Email", "Status", "Plus Ones", "Dietary Notes", "Date"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surat-neutral-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-surat-beige-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-surat-neutral-800">{r.name}</td>
                    <td className="px-4 py-3 text-surat-neutral-500">{r.email}</td>
                    <td className="px-4 py-3">
                      <span className={cn("badge capitalize", statusBadge(r.status))}>
                        {r.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-surat-neutral-600">
                      {r.plusOnes?.length ?? 0}
                    </td>
                    <td className="px-4 py-3 text-surat-neutral-500 max-w-[200px] truncate">
                      {r.dietaryNotes ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-surat-neutral-400 text-xs">{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Angpao Tab ─────────────────────────────────────────────────── */
function AngpaoTab({ slug }: { slug: string }) {
  const [data, setData] = useState<{ totalAmount: number; count: number; angpao: Angpao[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/events/${slug}/angpao`);
    const json = await res.json();
    setData(json.data);
    setLoading(false);
  }, [slug]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function toggleThanked(id: string, current: boolean) {
    await fetch(`/api/events/${slug}/angpao/${id}/thank`, { method: "PATCH" });
    setData((d) =>
      d
        ? { ...d, angpao: d.angpao.map((a) => a.id === id ? { ...a, isThanked: !current } : a) }
        : d
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="stat-card bg-red-50 border-none">
          <p className="text-2xl font-bold font-mono text-surat-red-600">
            {data ? formatCurrency(data.totalAmount, data.angpao[0]?.currency ?? "SGD") : "—"}
          </p>
          <p className="text-xs text-surat-neutral-500 mt-0.5">Total Received</p>
        </div>
        <div className="stat-card bg-surat-beige-100 border-none">
          <p className="text-2xl font-bold font-mono text-surat-neutral-700">{data?.count ?? 0}</p>
          <p className="text-xs text-surat-neutral-500 mt-0.5">Angpao Count</p>
        </div>
      </div>

      {(!data || data.angpao.length === 0) ? (
        <div className="card p-10 text-center">
          <EmptyState message="No angpao received yet." />
        </div>
      ) : (
        <div className="space-y-3">
          {data.angpao.map((a) => (
            <div key={a.id} className="card p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-serif text-xl text-surat-red-600 font-semibold">
                    {formatCurrency(a.amount, a.currency)}
                  </span>
                  {a.isAnonymous && <span className="badge badge-gray text-xs">Anonymous</span>}
                </div>
                <p className="text-sm font-medium text-surat-neutral-800">{a.senderName}</p>
                {a.message && <p className="text-sm text-surat-neutral-500 mt-1 italic">&ldquo;{a.message}&rdquo;</p>}
                <p className="text-xs text-surat-neutral-400 mt-1.5">{formatDate(a.createdAt)}</p>
              </div>
              <button
                onClick={() => toggleThanked(a.id, a.isThanked)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  a.isThanked
                    ? "bg-red-50 text-surat-red-500 hover:bg-red-100"
                    : "bg-surat-neutral-50 text-surat-neutral-300 hover:text-surat-red-400 hover:bg-red-50"
                )}
                title={a.isThanked ? "Thanked" : "Mark as thanked"}
              >
                <Heart size={18} fill={a.isThanked ? "currentColor" : "none"} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Registry Tab ───────────────────────────────────────────────── */
function RegistryTab({ slug }: { slug: string }) {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", brand: "", price: "", imageUrl: "", productUrl: "", priority: "5" });
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    const res = await fetch(`/api/events/${slug}/registry`);
    const json = await res.json();
    setItems(json.data ?? []);
    setLoading(false);
  }, [slug]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/events/${slug}/registry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: parseFloat(form.price), priority: parseInt(form.priority) }),
    });
    if (res.ok) {
      toast.success("Item added!");
      setForm({ name: "", brand: "", price: "", imageUrl: "", productUrl: "", priority: "5" });
      setShowForm(false);
      fetchItems();
    } else {
      toast.error("Failed to add item");
    }
    setSaving(false);
  }

  async function deleteItem(id: string) {
    await fetch(`/api/events/${slug}/registry/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Item removed");
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          <Plus size={16} /> Add Item
        </button>
      </div>

      {showForm && (
        <div className="card p-5">
          <h3 className="font-medium text-surat-neutral-800 mb-4">New registry item</h3>
          <form onSubmit={addItem} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Item name *</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Brand</label>
              <input className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            </div>
            <div>
              <label className="label">Price (SGD) *</label>
              <input type="number" step="0.01" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className="label">Priority (1–10)</label>
              <input type="number" min="1" max="10" className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Image URL</label>
              <input className="input" placeholder="https://…" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Product URL</label>
              <input className="input" placeholder="https://…" value={form.productUrl} onChange={(e) => setForm({ ...form, productUrl: e.target.value })} />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
              <button type="submit" className="btn-primary text-sm" disabled={saving}>
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                Add Item
              </button>
            </div>
          </form>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState message="No items in your registry. Add some gifts you'd love." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="card overflow-hidden">
              {item.imageUrl && (
                <div className="aspect-video bg-surat-beige-100">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-medium text-surat-neutral-800 text-sm">{item.name}</h4>
                    {item.brand && <p className="text-xs text-surat-neutral-400">{item.brand}</p>}
                  </div>
                  <span className={cn("badge shrink-0 text-xs", item.status === "available" ? "badge-green" : "badge-gray")}>
                    {item.status === "available" ? "Available" : item.claimedAnonymous ? "Taken" : `Taken by ${item.claimedBy}`}
                  </span>
                </div>
                <p className="font-semibold text-surat-red-600 text-sm mb-3">{formatCurrency(item.price)}</p>
                <div className="flex items-center gap-2">
                  {item.productUrl && (
                    <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs py-1.5 px-3">
                      <ExternalLink size={12} /> View
                    </a>
                  )}
                  <button onClick={() => deleteItem(item.id)} className="btn-danger text-xs py-1.5 px-3 ml-auto">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Photos Tab ─────────────────────────────────────────────────── */
function PhotosTab({ slug }: { slug: string }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events/${slug}/photos`)
      .then((r) => r.json())
      .then((d) => { setPhotos(d.data ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const photographerLink = `${typeof window !== "undefined" ? window.location.origin : ""}/${slug}/upload?role=photographer`;

  const copyPhotographerLink = () => {
    navigator.clipboard.writeText(photographerLink);
    toast.success("Photographer link copied!");
  };

  const photographerPhotos = photos.filter((p) => p.isPhotographer);
  const guestPhotos = photos.filter((p) => !p.isPhotographer);

  if (loading) return <Loader />;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Uploads", value: photos.length, color: "text-surat-neutral-700" },
          { label: "Photographer", value: photographerPhotos.length, color: "text-surat-info" },
          { label: "Guest Uploads", value: guestPhotos.length, color: "text-surat-neutral-500" },
          { label: "Total Downloads", value: photos.reduce((s, p) => s + p.downloadCount, 0), color: "text-surat-success" },
        ].map((s) => (
          <div key={s.label} className="stat-card bg-surat-beige-50 border-none">
            <p className={cn("text-2xl font-bold font-mono", s.color)}>{s.value}</p>
            <p className="text-xs text-surat-neutral-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Photographer link */}
      <div className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-surat-neutral-800">Photographer upload link</p>
          <p className="text-xs text-surat-neutral-400 mt-0.5 truncate">{photographerLink}</p>
        </div>
        <button onClick={copyPhotographerLink} className="btn-secondary text-xs self-start sm:self-auto">
          <Copy size={14} /> Copy Link
        </button>
      </div>

      {photos.length === 0 ? (
        <EmptyState message="No photos yet. Share the upload link with guests and your photographer." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-surat-beige-100 group">
              <img src={photo.thumbnailUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-2">
                <span className={cn(
                  "badge text-xs opacity-0 group-hover:opacity-100 transition-opacity",
                  photo.isPhotographer ? "bg-blue-500 text-white" : "bg-white/90 text-surat-neutral-700"
                )}>
                  {photo.isPhotographer ? <Camera size={10} /> : <Users size={10} />}
                  {photo.isPhotographer ? "Pro" : photo.uploaderName}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Shared ─────────────────────────────────────────────────────── */
function Loader() {
  return (
    <div className="flex items-center justify-center h-40">
      <Loader2 className="animate-spin text-surat-red-400" size={24} />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-10 text-center text-surat-neutral-400 text-sm">{message}</div>
  );
}
