import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/auth";
import { getDevUser } from "@/lib/auth/dev-user";
import { prisma } from "@/lib/db";
import { Users, Calendar, Heart, Camera, DollarSign, TrendingUp } from "lucide-react";

export default async function AdminDashboardPage() {
  // Dev bypass
  const devAuth = await getDevUser();
  if (!devAuth) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
  }

  let stats = {
    totalUsers: 0,
    totalEvents: 0,
    totalAngpaos: 0,
    totalPhotos: 0,
    totalRevenue: 0,
  };

  try {
    const [userCount, eventCount, photoCount, angpaoAgg] = await Promise.all([
      prisma.profile.count(),
      prisma.event.count(),
      prisma.photo.count(),
      prisma.angpao.aggregate({ _sum: { amount: true }, _count: true }),
    ]);
    stats = {
      totalUsers: userCount,
      totalEvents: eventCount,
      totalPhotos: photoCount,
      totalAngpaos: angpaoAgg._count,
      totalRevenue: Number(angpaoAgg._sum.amount ?? 0),
    };
  } catch (e) {
    console.error("[AdminDashboard] DB error:", (e as Error).message);
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="page-title">Platform Overview</h1>
        <p className="page-subtitle">Admin dashboard — platform-wide metrics</p>
      </div>

      {/* Platform stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-surat-neutral-800">{stats.totalUsers}</p>
              <p className="text-xs text-surat-neutral-500">Total Users</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-surat-neutral-800">{stats.totalEvents}</p>
              <p className="text-xs text-surat-neutral-500">Total Events</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-surat-red-500">
              <Heart size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-surat-neutral-800">{stats.totalAngpaos}</p>
              <p className="text-xs text-surat-neutral-500">Total Angpaos</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Camera size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-surat-neutral-800">{stats.totalPhotos}</p>
              <p className="text-xs text-surat-neutral-500">Total Photos</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-surat-neutral-800">
                {stats.totalRevenue > 0 ? `$${stats.totalRevenue.toLocaleString("en-SG")}` : "$0"}
              </p>
              <p className="text-xs text-surat-neutral-500">Angpao Revenue</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-surat-neutral-800">—</p>
              <p className="text-xs text-surat-neutral-500">Growth (coming soon)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder sections */}
      {stats.totalUsers === 0 && (
        <div className="card p-12 text-center">
          <p className="text-sm text-surat-neutral-400">
            No data available. Connect a database to see platform metrics.
          </p>
        </div>
      )}
    </div>
  );
}
