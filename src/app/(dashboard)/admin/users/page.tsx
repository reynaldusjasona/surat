import { Users, Search } from "lucide-react";

export default function AdminUsersPage() {
  // Mock user data for UI preview
  const users = [
    { name: "Jason Lim", email: "jason@example.com", role: "host", events: 3, joined: "12 May 2026" },
    { name: "Sarah Chen", email: "sarah@company.sg", role: "organizer", events: 12, joined: "3 Apr 2026" },
    { name: "Ahmad Rizal", email: "ahmad@photo.co", role: "photographer", events: 8, joined: "28 Mar 2026" },
    { name: "Mei Ling", email: "meiling@example.com", role: "host", events: 1, joined: "20 Jun 2026" },
    { name: "David Tan", email: "david@events.sg", role: "organizer", events: 24, joined: "15 Jan 2026" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Manage platform users and roles</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surat-neutral-400" />
          <input type="text" className="input pl-9 w-full sm:w-[240px]" placeholder="Search users..." disabled />
        </div>
      </div>

      {/* Users table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surat-neutral-100 text-left">
                <th className="px-5 py-3 font-medium text-surat-neutral-500">User</th>
                <th className="px-5 py-3 font-medium text-surat-neutral-500">Role</th>
                <th className="px-5 py-3 font-medium text-surat-neutral-500 text-right">Events</th>
                <th className="px-5 py-3 font-medium text-surat-neutral-500">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="border-b border-surat-neutral-50 last:border-0">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-surat-neutral-800">{u.name}</p>
                      <p className="text-xs text-surat-neutral-400">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge capitalize ${
                      u.role === "organizer" ? "badge-green" : u.role === "photographer" ? "badge-yellow" : "badge-gray"
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-surat-neutral-800">{u.events}</td>
                  <td className="px-5 py-4 text-surat-neutral-500">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-surat-neutral-400 text-center">
        Showing mock data. Real user management will be functional once the database is connected.
      </p>
    </div>
  );
}
