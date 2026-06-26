"use client";

import { Button } from "@/components/ui";

interface Guest {
  name: string;
  email: string;
  rsvpStatus: string;
  plusOnes: { name: string }[] | null;
  dietaryNotes: string | null;
  rsvpAt: string | null;
}

interface ExportCsvButtonProps {
  guests: Guest[];
  eventTitle: string;
}

export function ExportCsvButton({ guests, eventTitle }: ExportCsvButtonProps) {
  const exportToCsv = () => {
    const headers = ["Name", "Email", "Status", "Plus Ones", "Dietary Notes", "RSVP Date"];
    const rows = guests.map((guest) => [
      guest.name,
      guest.email,
      guest.rsvpStatus,
      guest.plusOnes ? guest.plusOnes.map((p) => p.name).join("; ") : "",
      guest.dietaryNotes || "",
      guest.rsvpAt ? new Date(guest.rsvpAt).toISOString().split("T")[0] : "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${eventTitle.replace(/\s+/g, "-").toLowerCase()}-guests.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={exportToCsv} disabled={guests.length === 0}>
      📥 Export CSV
    </Button>
  );
}
