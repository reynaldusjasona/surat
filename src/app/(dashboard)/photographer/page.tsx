import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/auth";
import { getDevUser } from "@/lib/auth/dev-user";
import { prisma } from "@/lib/db";
import { Camera, Calendar, MapPin, ExternalLink, Image } from "lucide-react";
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

export default async function PhotographerDashboardPage() {
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

  let assignments: any[] = [];
  let totalPhotos = 0;
  try {
    const rawAssignments = await prisma.photographerAssignment.findMany({
      where: { photographerId: userId },
      include: {
        event: {
          include: { _count: { select: { photos: true } } },
        },
      },
      orderBy: { event: { date: "asc" } },
    });
    assignments = rawAssignments;
    totalPhotos = rawAssignments.reduce((sum, a) => sum + a.event._count.photos, 0);
  } catch (e) {
    console.error("[PhotographerDashboard] DB error:", (e as Error).message);
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">My Assignments</h1>
          <p className="page-subtitle">Events you&apos;re assigned to photograph</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Camera size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-surat-neutral-800">{assignments.length}</p>
              <p className="text-xs text-surat-neutral-500">Assigned Events</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Image size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-surat-neutral-800">{totalPhotos}</p>
              <p className="text-xs text-surat-neutral-500">Total Photos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {assignments.length === 0 && (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera size={24} className="text-purple-500" />
          </div>
          <h2 className="font-serif text-xl text-surat-neutral-800 mb-2">No assignments yet</h2>
          <p className="text-sm text-surat-neutral-500 mb-6 max-w-xs mx-auto">
            When an organizer assigns you to an event, it will appear here.
          </p>
        </div>
      )}

      {/* Assignment list */}
      {assignments.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment: any) => (
            <div key={assignment.id} className="card-hover p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className={cn("badge mb-2", typeBadgeColors[assignment.event.type] ?? "badge-gray")}>
                    {typeLabels[assignment.event.type] ?? assignment.event.type}
                  </span>
                  <h3 className="font-serif text-base text-surat-neutral-900 leading-snug truncate">
                    {assignment.event.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-surat-neutral-500">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  <span>{formatDate(new Date(assignment.event.date))}</span>
                </div>
                {assignment.event.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    <span className="truncate">{assignment.event.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Camera size={12} />
                  <span>{assignment.event._count.photos} photos uploaded</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-auto pt-3 border-t border-surat-neutral-100">
                <Link
                  href={`/${assignment.event.slug}`}
                  target="_blank"
                  className="btn-secondary text-xs flex-1 justify-center py-2"
                >
                  <ExternalLink size={14} />
                  View Event
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
