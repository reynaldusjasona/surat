import { DollarSign, TrendingUp, Download, Calendar } from "lucide-react";

export default function PhotographerEarningsPage() {
  // Mock earnings data for UI preview
  const earnings = [
    { event: "Jason & Sarah's Wedding", date: "15 Jun 2026", unlocks: 42, revenue: 251.58, share: 150.95 },
    { event: "Maya turns 30", date: "8 Jun 2026", unlocks: 18, revenue: 107.82, share: 64.69 },
    { event: "Acme Year-End Gala", date: "1 Jun 2026", unlocks: 56, revenue: 335.44, share: 201.26 },
  ];

  const totalEarnings = earnings.reduce((sum, e) => sum + e.share, 0);
  const totalUnlocks = earnings.reduce((sum, e) => sum + e.unlocks, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Earnings</h1>
        <p className="page-subtitle">Track your photo unlock revenue (60% share)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-surat-neutral-800">
                ${totalEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-surat-neutral-500">Total Earnings</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Download size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-surat-neutral-800">{totalUnlocks}</p>
              <p className="text-xs text-surat-neutral-500">Total Unlocks</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-surat-neutral-800">{earnings.length}</p>
              <p className="text-xs text-surat-neutral-500">Events</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surat-neutral-100 text-left">
                <th className="px-5 py-3 font-medium text-surat-neutral-500">Event</th>
                <th className="px-5 py-3 font-medium text-surat-neutral-500">Date</th>
                <th className="px-5 py-3 font-medium text-surat-neutral-500 text-right">Unlocks</th>
                <th className="px-5 py-3 font-medium text-surat-neutral-500 text-right">Your Share (60%)</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((e) => (
                <tr key={e.event} className="border-b border-surat-neutral-50 last:border-0">
                  <td className="px-5 py-4 font-medium text-surat-neutral-800">{e.event}</td>
                  <td className="px-5 py-4 text-surat-neutral-500">
                    <span className="flex items-center gap-1.5"><Calendar size={12} />{e.date}</span>
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-surat-neutral-800">{e.unlocks}</td>
                  <td className="px-5 py-4 text-right font-mono font-medium text-green-600">${e.share.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-surat-neutral-400 text-center">
        Showing mock data. Real earnings will populate once photo unlocks are processed.
      </p>
    </div>
  );
}
