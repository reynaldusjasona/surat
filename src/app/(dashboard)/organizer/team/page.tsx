import { Users, UserPlus, Mail, MoreHorizontal } from "lucide-react";

export default function OrganizerTeamPage() {
  // Mock team data for UI preview
  const members = [
    { name: "You (Owner)", email: "organizer@surat.local", role: "owner", status: "active" },
    { name: "Sarah Tan", email: "sarah@company.com", role: "member", status: "active" },
    { name: "Pending invite", email: "invite@example.com", role: "member", status: "pending" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Team</h1>
          <p className="page-subtitle">Manage your team members (up to 5)</p>
        </div>
        <button className="btn-primary self-start sm:self-auto" disabled>
          <UserPlus size={16} />
          Invite Member
        </button>
      </div>

      {/* Team list */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surat-neutral-100 text-left">
                <th className="px-5 py-3 font-medium text-surat-neutral-500">Member</th>
                <th className="px-5 py-3 font-medium text-surat-neutral-500">Role</th>
                <th className="px-5 py-3 font-medium text-surat-neutral-500">Status</th>
                <th className="px-5 py-3 font-medium text-surat-neutral-500 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.email} className="border-b border-surat-neutral-50 last:border-0">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-surat-neutral-800">{m.name}</p>
                      <p className="text-xs text-surat-neutral-400">{m.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="badge badge-gray capitalize">{m.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${m.status === "active" ? "badge-green" : "badge-yellow"} capitalize`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="p-1 text-surat-neutral-400 hover:text-surat-neutral-600" disabled>
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-surat-neutral-400 text-center">
        Team invitations and role management will be functional once the backend is connected.
      </p>
    </div>
  );
}
