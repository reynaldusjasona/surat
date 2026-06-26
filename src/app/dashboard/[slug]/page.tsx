"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { StatusCards } from "@/components/dashboard/status-cards";
import { GuestTable } from "@/components/dashboard/guest-table";
import { ExportCsvButton } from "@/components/dashboard/export-csv-button";

interface Guest {
  id: string;
  name: string;
  email: string;
  rsvpStatus: string;
  plusOnes: { name: string }[] | null;
  dietaryNotes: string | null;
  rsvpAt: string | null;
}

interface Counts {
  attending: number;
  not_attending: number;
  maybe: number;
  pending: number;
  total: number;
}

interface EventData {
  id: string;
  title: string;
  slug: string;
  date: string;
  type: string;
}

export default function DashboardPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [counts, setCounts] = useState<Counts>({ attending: 0, not_attending: 0, maybe: 0, pending: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch event details
        const eventRes = await fetch(`/api/events/${slug}`);
        if (!eventRes.ok) throw new Error("Event not found");
        const eventData = await eventRes.json();
        setEvent(eventData);

        // Fetch RSVPs
        const rsvpRes = await fetch(`/api/events/${slug}/rsvp`);
        if (rsvpRes.status === 401) {
          setError("Please log in to view this dashboard.");
          return;
        }
        if (rsvpRes.status === 403) {
          setError("You don't have permission to view this dashboard.");
          return;
        }
        if (!rsvpRes.ok) throw new Error("Failed to load RSVPs");

        const rsvpData = await rsvpRes.json();
        setGuests(rsvpData.guests);
        setCounts(rsvpData.counts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      </main>
    );
  }

  if (!event) return null;

  const eventUrl = `${window.location.origin}/${event.slug}`;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(event.date).toLocaleDateString("en-SG", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(eventUrl);
                alert("Event link copied!");
              }}
            >
              🔗 Copy Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/${event.slug}`, "_blank")}
            >
              👁 View Event
            </Button>
          </div>
        </div>

        {/* Stats */}
        <StatusCards counts={counts} />

        {/* Guest List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Guest List ({counts.total})</CardTitle>
            <ExportCsvButton guests={guests} eventTitle={event.title} />
          </CardHeader>
          <CardContent>
            <GuestTable guests={guests} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
