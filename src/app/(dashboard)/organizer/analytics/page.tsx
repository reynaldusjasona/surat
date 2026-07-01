import { BarChart3 } from "lucide-react";

export default function OrganizerAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Track performance across all your events</p>
      </div>
      <div className="card p-12 text-center">
        <div className="w-14 h-14 bg-surat-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 size={24} className="text-surat-neutral-400" />
        </div>
        <h2 className="font-serif text-xl text-surat-neutral-800 mb-2">Coming soon</h2>
        <p className="text-sm text-surat-neutral-500 max-w-xs mx-auto">
          Event analytics, guest insights, and revenue reports are being built.
        </p>
      </div>
    </div>
  );
}
