import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/auth";
import { getDevUser } from "@/lib/auth/dev-user";
import { prisma } from "@/lib/db";
import { CalendarPlus, MapPin, Calendar, ExternalLink, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const typeLabels: Record<string, string> = {
  wedding: "Wedding",
  birthday: "Birthday",
  gathering: "Gathering",
  custom: "Event",
};

const typeBadgeColors: Record<string, string> = {
  wedding: "badge-red",
  birthday: "badge-yellow",
  gathering: "badge-green",
  custom: "badge-gray",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function HostDashboardPage() {
  // Dev bypass
  let userId: string;
  const devAuth = await getDevUser();
  if (devAuth) {
    userId = devAuth.user.id;
  } else {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    userId = user.id;
  }

  let events: Awaited<ReturnType<typeof prisma.event.findMany>> = [];
  try {
    events = await prisma.event.findMany({
      where: { hostId: userId },
      include: {
        _count: { select: { rsvps: true, photos: true } },
      },
      orderBy: { date: "asc" },
    });
  } catch (e) {
    // DB unavailable — render with empty data
    console.error("[HostDashboard] DB error:", (e as Error).message);
  }

  const upcoming = events.filter((e) => new Date(e.date) >= new Date() && e.status !== "removed");
  const past = events.filter((e) => new Date(e.date) < new Date() && e.status !== "removed");

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">My Events</h1>
          <p className="page-subtitle">Manage and share your events</p>
        </div>
        <Link href="/host/events/new" className="btn-primary self-start sm:self-auto">
          <CalendarPlus size={16} />
          Create Event
        </Link>
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 bg-surat-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarPlus size={24} className="text-surat-red-500" />
          </div>
          <h2 className="font-serif text-xl text-surat-neutral-800 mb-2">No events yet</h2>
          <p className="text-sm text-surat-neutral-500 mb-6 max-w-xs mx-auto">
            Create your first event to start collecting RSVPs, angpao, and more.
          </p>
          <Link href="/host/events/new" className="btn-primary inline-flex">
            <CalendarPlus size={16} />
            Create your first event
          </Link>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-surat-neutral-500 uppercase tracking-wide">
            Upcoming ({upcoming.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-surat-neutral-500 uppercase tracking-wide">
            Past ({past.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 opacity-75">
            {past.map((event) => (
              <EventCard key={event.id} event={event} past />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EventCard({
  event,
  past,
}: {
  event: {
    id: string;
    title: string;
    slug: string;
    type: string;
    date: Date;
    location: string | null;
    status: string;
    _count: { rsvps: number; photos: number };
  };
  past?: boolean;
}) {
  return (
    <div className="card-hover p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className={cn("badge mb-2", typeBadgeColors[event.type] ?? "badge-gray")}>
            {typeLabels[event.type] ?? event.type}
          </span>
          <h3 className="font-serif text-base text-surat-neutral-900 leading-snug truncate">
            {event.title}
          </h3>
        </div>
        {past && (
          <span className="badge badge-gray shrink-0">Past</span>
        )}
      </div>

      <div className="space-y-1.5 text-xs text-surat-neutral-500">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} />
          <span>{formatDate(new Date(event.date))}</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-1.5">
            <MapPin size={12} />
            <span className="truncate">{event.location}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Users size={12} />
          <span>{event._count.rsvps} RSVPs</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-surat-neutral-100">
        <Link
          href={`/host/events/${event.slug}`}
          className="btn-secondary text-xs flex-1 justify-center py-2"
        >
          Manage
        </Link>
        <Link
          href={`/${event.slug}`}
          target="_blank"
          className="btn-ghost text-xs py-2 px-3"
          title="View public page"
        >
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
}
