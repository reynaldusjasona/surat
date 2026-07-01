import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/auth";
import { getDevUser } from "@/lib/auth/dev-user";
import { prisma } from "@/lib/db";
import { CalendarPlus, MapPin, Calendar, ExternalLink, Users, TrendingUp, DollarSign, Camera, Heart } from "lucide-react";
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
  return date.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });
}

export default async function OrganizerDashboardPage() {
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

  const events = await prisma.event.findMany({
    where: { hostId: userId },
    include: {
      _count: { select: { rsvps: true, photos: true, angpaos: true } },
    },
    orderBy: { date: "asc" },
  });

  const upcoming = events.filter((e) => new Date(e.date) >= new Date() && e.status !== "removed");
  const past = events.filter((e) => new Date(e.date) < new Date() && e.status !== "removed");

  // Cross-event analytics
  const totalGuests = events.reduce((sum, e) => sum + e._count.rsvps, 0);
  const totalPhotos = events.reduce((sum, e) => sum + e._count.photos, 0);
  const totalAngpaos = events.reduce((sum, e) => sum + e._count.angpaos, 0);

  // Get angpao revenue
  const angpaoRevenue = await prisma.angpao.aggregate({
    where: { event: { hostId: userId } },
    _sum: { amount: true },
  });
  const revenue = Number(angpaoRevenue._sum.amount ?? 0);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Organizer Dashboard</h1>
          <p className="page-subtitle">Manage all client events from one place</p>
        </div>
        <Link href="/organizer/events/new" className="btn-primary self-start sm:self-auto">
          <CalendarPlus size={16} />
          Create Event
        </Link>
      </div>

      {/* Cross-event analytics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-surat-neutral-800">{events.length}</p>
              <p className="text-xs text-surat-neutral-500">Total Events</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <Users size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-surat-neutral-800">{totalGuests}</p>
              <p className="text-xs text-surat-neutral-500">Total Guests</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-surat-red-500">
              <Heart size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-surat-neutral-800">
                {revenue > 0 ? `$${revenue.toLocaleString("en-SG")}` : "$0"}
              </p>
              <p className="text-xs text-surat-neutral-500">Angpao Revenue</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Camera size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-surat-neutral-800">{totalPhotos}</p>
              <p className="text-xs text-surat-neutral-500">Total Photos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 bg-surat-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarPlus size={24} className="text-surat-red-500" />
          </div>
          <h2 className="font-serif text-xl text-surat-neutral-800 mb-2">No events yet</h2>
          <p className="text-sm text-surat-neutral-500 mb-6 max-w-xs mx-auto">
            Create your first client event to start managing celebrations.
          </p>
          <Link href="/organizer/events/new" className="btn-primary inline-flex">
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
    plan: string;
    _count: { rsvps: number; photos: number; angpaos: number };
  };
  past?: boolean;
}) {
  return (
    <div className="card-hover p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className={cn("badge", typeBadgeColors[event.type] ?? "badge-gray")}>
              {typeLabels[event.type] ?? event.type}
            </span>
            <span className="badge badge-gray capitalize text-[10px]">{event.plan}</span>
          </div>
          <h3 className="font-serif text-base text-surat-neutral-900 leading-snug truncate">
            {event.title}
          </h3>
        </div>
        {past && <span className="badge badge-gray shrink-0">Past</span>}
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
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Users size={12} />{event._count.rsvps}</span>
          <span className="flex items-center gap-1"><Heart size={12} />{event._count.angpaos}</span>
          <span className="flex items-center gap-1"><Camera size={12} />{event._count.photos}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-surat-neutral-100">
        <Link
          href={`/organizer/events/${event.slug}`}
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
