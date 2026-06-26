import { Badge } from "@/components/ui";

interface Guest {
  id: string;
  name: string;
  email: string;
  rsvpStatus: string;
  plusOnes: { name: string }[] | null;
  dietaryNotes: string | null;
  rsvpAt: string | null;
}

interface GuestTableProps {
  guests: Guest[];
}

const statusVariant: Record<string, "success" | "warning" | "error" | "default"> = {
  attending: "success",
  maybe: "warning",
  not_attending: "error",
  pending: "default",
};

const statusLabel: Record<string, string> = {
  attending: "Attending",
  maybe: "Maybe",
  not_attending: "Not Attending",
  pending: "Pending",
};

export function GuestTable({ guests }: GuestTableProps) {
  if (guests.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No RSVPs yet</p>
        <p className="text-sm mt-1">Share your event link to start receiving responses</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">Email</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Plus Ones</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 hidden lg:table-cell">Dietary</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">RSVP Date</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <p className="font-medium text-gray-900">{guest.name}</p>
                <p className="text-xs text-gray-500 sm:hidden">{guest.email}</p>
              </td>
              <td className="py-3 px-4 hidden sm:table-cell text-gray-600">{guest.email}</td>
              <td className="py-3 px-4">
                <Badge variant={statusVariant[guest.rsvpStatus] || "default"}>
                  {statusLabel[guest.rsvpStatus] || guest.rsvpStatus}
                </Badge>
              </td>
              <td className="py-3 px-4 hidden md:table-cell text-gray-600">
                {guest.plusOnes && guest.plusOnes.length > 0 ? `+${guest.plusOnes.length}` : "—"}
              </td>
              <td className="py-3 px-4 hidden lg:table-cell text-gray-600 max-w-[200px] truncate">
                {guest.dietaryNotes || "—"}
              </td>
              <td className="py-3 px-4 hidden md:table-cell text-gray-600">
                {guest.rsvpAt
                  ? new Date(guest.rsvpAt).toLocaleDateString("en-SG", {
                      day: "numeric",
                      month: "short",
                    })
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
