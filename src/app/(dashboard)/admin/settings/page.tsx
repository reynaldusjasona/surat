import { ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Platform configuration and security</p>
      </div>
      <div className="card p-12 text-center">
        <div className="w-14 h-14 bg-surat-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={24} className="text-surat-neutral-400" />
        </div>
        <h2 className="font-serif text-xl text-surat-neutral-800 mb-2">Coming soon</h2>
        <p className="text-sm text-surat-neutral-500 max-w-xs mx-auto">
          Platform settings, security configuration, and system preferences are being built.
        </p>
      </div>
    </div>
  );
}
