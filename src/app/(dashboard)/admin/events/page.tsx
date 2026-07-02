import { FileText, Search, Calendar, Users } from "lucide-react";

export default function AdminEventsPage() {
  // Mock event data for UI preview
  const events = [
    { title: "Jason & Sarah's Wedding", host: "Jason Lim", type: "wedding", plan: "premium", guests: 342, date: "28 Jun 2026", status: "active" },
    { title: "Maya turns 30", host: "Maya Tan", type: "birthday", plan: "standard", guests: 56, date: "15 Jul 2026", status: "active" },
    { title: "Acme Year-End Gala", host: "David Tan", type: "gathering", plan: "premium", guests: 480, date: "20 Dec 2026", status: "active" },
    { title: "Baby Aria's Month", host: "Mei Ling", type: "custom", plan: "free", guests: 34, date: "5 Jun 2026", status: "past" },
    { title: "The Tan Reunion", host: "Uncle Robert", type: "gathering", plan: "standard", guests: 88, date: "1 May 2026", status: "past" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Events</h1>
          <p className="page-subtitle">View and manage all platform events</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surat-neutral-400" />
          <input type="text" className="input pl-9 w-full sm:w-[240px]" placeholder="Search events..." disabled />
        </div>
      </div>

      {/* Events table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surat-neutral-100 text-left">
                <th className="px-5 py-3 font-medium text-surat-neutral-500">Event</th>
                <th className="px-5 py-3 font-medium text-surat-neutral-500">Host</th>
                <th className="px-5 py-3 font-medium text-surat-neutral-500">Plan</th>
                <th className="px-5 py-3 font-medium text-surat-neutral-500 text-right">Guests</th>
                <th className="px-5 py-3 font-medium text-surat-neutral-500">Date</th>
                <th className="px-5 py-3 font-medium text-surat-neutral-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.title} className="border-b border-surat-neutral-50 last:border-0">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-surat-neutral-800">{e.title}</p>
                      <span className={`badge text-[10px] capitalize ${
                        e.type === "wedding" ? "badge-red" : e.type === "birthday" ? "badge-yellow" : "badge-gray"
                      }`}>{e.type}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-surat-neutral-600">{e.host}</td>
                  <td className="px-5 py-4">
                    <span className="badge badge-gray capitalize text-[10px]">{e.plan}</span>
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-surat-neutral-800">
                    <span className="flex items-center justify-end gap-1"><Users size={12} />{e.guests}</span>
                  </td>
                  <td className="px-5 py-4 text-surat-neutral-500">
                    <span className="flex items-center gap-1"><Calendar size={12} />{e.date}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge capitalize ${e.status === "active" ? "badge-green" : "badge-gray"}`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-surat-neutral-400 text-center">
        Showing mock data. Real event management will be functional once the database is connected.
      </p>
    </div>
  );
}
