import { ShieldCheck, Globe, DollarSign, Bell, Database } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Platform Settings</h1>
        <p className="page-subtitle">Configure platform behavior and policies</p>
      </div>

      {/* General */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Globe size={18} className="text-surat-red-500" />
          <h2 className="font-serif text-lg text-surat-neutral-900">General</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Platform Name</label>
            <input type="text" className="input" defaultValue="Surat" disabled />
          </div>
          <div>
            <label className="label">Support Email</label>
            <input type="email" className="input" defaultValue="hello@surat.app" disabled />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <DollarSign size={18} className="text-surat-red-500" />
          <h2 className="font-serif text-lg text-surat-neutral-900">Pricing Configuration</h2>
        </div>
        <div className="space-y-3">
          {[
            { plan: "Free", price: "SGD 0", commission: "3%", guests: "50", photos: "50" },
            { plan: "Standard", price: "SGD 19", commission: "2%", guests: "300", photos: "500" },
            { plan: "Premium", price: "SGD 49", commission: "1%", guests: "1,000", photos: "2,000" },
          ].map((p) => (
            <div key={p.plan} className="flex items-center justify-between p-4 bg-surat-neutral-50 rounded-xl">
              <div>
                <p className="font-medium text-surat-neutral-800">{p.plan}</p>
                <p className="text-xs text-surat-neutral-500">{p.price} · {p.commission} commission · {p.guests} guests · {p.photos} photos</p>
              </div>
              <button className="btn-secondary text-xs" disabled>Edit</button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <ShieldCheck size={18} className="text-surat-red-500" />
          <h2 className="font-serif text-lg text-surat-neutral-900">Security</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "Require email verification", desc: "New users must verify their email before creating events", checked: true },
            { label: "Rate limit API", desc: "Limit API requests to 100/min per IP", checked: true },
            { label: "Maintenance mode", desc: "Temporarily disable new signups and event creation", checked: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-surat-neutral-800">{item.label}</p>
                <p className="text-xs text-surat-neutral-500">{item.desc}</p>
              </div>
              <div className={`w-10 h-6 rounded-full relative cursor-not-allowed ${item.checked ? "bg-surat-red-500" : "bg-surat-neutral-200"}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${item.checked ? "right-1" : "left-1"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Database */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Database size={18} className="text-surat-red-500" />
          <h2 className="font-serif text-lg text-surat-neutral-900">Database</h2>
        </div>
        <div className="flex items-center justify-between p-4 bg-surat-neutral-50 rounded-xl">
          <div>
            <p className="font-medium text-surat-neutral-800">Supabase PostgreSQL</p>
            <p className="text-xs text-surat-neutral-500">Connection status depends on Supabase availability</p>
          </div>
          <span className="badge badge-yellow">Degraded</span>
        </div>
      </div>

      <p className="text-xs text-surat-neutral-400 text-center">
        Settings are read-only. Configuration changes will be available in a future update.
      </p>
    </div>
  );
}
