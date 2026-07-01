import { FileText } from "lucide-react";

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Events</h1>
        <p className="page-subtitle">View and manage all platform events</p>
      </div>
      <div className="card p-12 text-center">
        <div className="w-14 h-14 bg-surat-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText size={24} className="text-surat-neutral-400" />
        </div>
        <h2 className="font-serif text-xl text-surat-neutral-800 mb-2">Coming soon</h2>
        <p className="text-sm text-surat-neutral-500 max-w-xs mx-auto">
          Event listing, moderation tools, and event status management are being built.
        </p>
      </div>
    </div>
  );
}
