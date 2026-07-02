import { getDevUser } from "@/lib/auth/dev-user";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";

export default async function HostSettingsPage() {
  const devAuth = await getDevUser();
  const profile = devAuth?.profile ?? { fullName: "User", email: "user@example.com", role: "host" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      {/* Profile section */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <User size={18} className="text-surat-red-500" />
          <h2 className="font-serif text-lg text-surat-neutral-900">Profile</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input type="text" className="input" defaultValue={profile.fullName ?? ""} disabled />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" defaultValue={profile.email} disabled />
          </div>
        </div>
        <p className="text-xs text-surat-neutral-400 mt-3">Profile editing will be available once Supabase is connected.</p>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Bell size={18} className="text-surat-red-500" />
          <h2 className="font-serif text-lg text-surat-neutral-900">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "New RSVP received", desc: "Get notified when a guest responds", checked: true },
            { label: "Angpao received", desc: "Get notified for each red packet", checked: true },
            { label: "Photo uploaded", desc: "Get notified when guests upload photos", checked: false },
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
        <p className="text-xs text-surat-neutral-400 mt-3">Notification preferences coming soon.</p>
      </div>

      {/* Security */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Shield size={18} className="text-surat-red-500" />
          <h2 className="font-serif text-lg text-surat-neutral-900">Security</h2>
        </div>
        <button className="btn-secondary text-sm" disabled>
          Change Password
        </button>
        <p className="text-xs text-surat-neutral-400 mt-3">Password management via Supabase Auth.</p>
      </div>
    </div>
  );
}
