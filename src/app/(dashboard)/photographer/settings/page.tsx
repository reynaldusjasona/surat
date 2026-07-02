import { getDevUser } from "@/lib/auth/dev-user";
import { Settings, User, Camera, DollarSign } from "lucide-react";

export default async function PhotographerSettingsPage() {
  const devAuth = await getDevUser();
  const profile = devAuth?.profile ?? { fullName: "User", email: "user@example.com", role: "photographer" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your photographer profile</p>
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

      {/* Portfolio */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Camera size={18} className="text-surat-red-500" />
          <h2 className="font-serif text-lg text-surat-neutral-900">Portfolio</h2>
        </div>
        <div>
          <label className="label">Portfolio / Website URL</label>
          <input type="url" className="input" placeholder="https://your-portfolio.com" disabled />
        </div>
        <p className="text-xs text-surat-neutral-400 mt-3">Your portfolio link will be shown to organizers who invite you.</p>
      </div>

      {/* Payout */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <DollarSign size={18} className="text-surat-red-500" />
          <h2 className="font-serif text-lg text-surat-neutral-900">Payout Settings</h2>
        </div>
        <div className="p-4 bg-surat-neutral-50 rounded-xl">
          <p className="text-sm text-surat-neutral-800 font-medium">Revenue share: 60%</p>
          <p className="text-xs text-surat-neutral-500 mt-1">You earn 60% of each photo unlock fee (SGD 5.99 per unlock).</p>
        </div>
        <div className="mt-4">
          <label className="label">Payout Method</label>
          <input type="text" className="input" placeholder="PayNow / Bank transfer" disabled />
        </div>
        <p className="text-xs text-surat-neutral-400 mt-3">Payout configuration coming soon via Stripe Connect.</p>
      </div>
    </div>
  );
}
