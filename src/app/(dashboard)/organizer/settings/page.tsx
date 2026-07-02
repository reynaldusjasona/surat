import { getDevUser } from "@/lib/auth/dev-user";
import { Settings, User, Bell, Palette, CreditCard } from "lucide-react";

export default async function OrganizerSettingsPage() {
  const devAuth = await getDevUser();
  const profile = devAuth?.profile ?? { fullName: "User", email: "user@example.com", role: "organizer" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and organization</p>
      </div>

      {/* Profile */}
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
      </div>

      {/* Branding */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Palette size={18} className="text-surat-red-500" />
          <h2 className="font-serif text-lg text-surat-neutral-900">Branding</h2>
          <span className="badge badge-yellow text-[10px]">Premium</span>
        </div>
        <p className="text-sm text-surat-neutral-500 mb-4">
          Customize your event pages with your own logo and brand colors.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Company Name</label>
            <input type="text" className="input" placeholder="Your company" disabled />
          </div>
          <div>
            <label className="label">Logo URL</label>
            <input type="url" className="input" placeholder="https://..." disabled />
          </div>
        </div>
        <p className="text-xs text-surat-neutral-400 mt-3">White-label branding available on Organizer subscription.</p>
      </div>

      {/* Subscription */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <CreditCard size={18} className="text-surat-red-500" />
          <h2 className="font-serif text-lg text-surat-neutral-900">Subscription</h2>
        </div>
        <div className="flex items-center justify-between p-4 bg-surat-neutral-50 rounded-xl">
          <div>
            <p className="font-medium text-surat-neutral-800">Organizer Plan</p>
            <p className="text-xs text-surat-neutral-500">SGD 79/month · Unlimited events · 5 team members</p>
          </div>
          <button className="btn-secondary text-xs" disabled>Manage</button>
        </div>
        <p className="text-xs text-surat-neutral-400 mt-3">Subscription management via Stripe coming soon.</p>
      </div>
    </div>
  );
}
