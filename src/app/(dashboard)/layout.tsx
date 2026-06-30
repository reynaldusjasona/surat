import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { id: true, fullName: true, email: true, role: true },
  });

  if (!profile) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-surat-offwhite">
      <Sidebar role={profile.role} fullName={profile.fullName} email={profile.email} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar role={profile.role} fullName={profile.fullName} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-dashboard mx-auto px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
