"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarPlus,
  Settings,
  Users,
  BarChart3,
  Camera,
  DollarSign,
  ShieldCheck,
  FileText,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import { useRouter } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

function getNavItems(role: string): NavItem[] {
  switch (role) {
    case "organizer":
      return [
        { label: "All Events", href: "/dashboard/organizer", icon: <LayoutDashboard size={18} /> },
        { label: "Create Event", href: "/dashboard/organizer/events/new", icon: <CalendarPlus size={18} /> },
        { label: "Team", href: "/dashboard/organizer/team", icon: <Users size={18} /> },
        { label: "Analytics", href: "/dashboard/organizer/analytics", icon: <BarChart3 size={18} /> },
        { label: "Settings", href: "/dashboard/organizer/settings", icon: <Settings size={18} /> },
      ];
    case "photographer":
      return [
        { label: "My Events", href: "/dashboard/photographer", icon: <Camera size={18} /> },
        { label: "Earnings", href: "/dashboard/photographer/earnings", icon: <DollarSign size={18} /> },
        { label: "Settings", href: "/dashboard/photographer/settings", icon: <Settings size={18} /> },
      ];
    case "admin":
      return [
        { label: "Overview", href: "/dashboard/admin", icon: <LayoutDashboard size={18} /> },
        { label: "Users", href: "/dashboard/admin/users", icon: <Users size={18} /> },
        { label: "Events", href: "/dashboard/admin/events", icon: <FileText size={18} /> },
        { label: "Analytics", href: "/dashboard/admin/analytics", icon: <BarChart3 size={18} /> },
        { label: "Settings", href: "/dashboard/admin/settings", icon: <ShieldCheck size={18} /> },
      ];
    default: // host
      return [
        { label: "My Events", href: "/dashboard/host", icon: <LayoutDashboard size={18} /> },
        { label: "Create Event", href: "/dashboard/host/events/new", icon: <CalendarPlus size={18} /> },
        { label: "Settings", href: "/dashboard/host/settings", icon: <Settings size={18} /> },
      ];
  }
}

interface SidebarProps {
  role: string;
  fullName: string | null;
  email: string;
}

export function Sidebar({ role, fullName, email }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = getNavItems(role);

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const isActive = (href: string) => {
    if (href === `/dashboard/${role}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen bg-surat-beige-50 border-r border-surat-beige-200 shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-surat-beige-200">
        <Link href="/" className="font-serif text-xl text-surat-red-500 font-semibold tracking-tight">
          Surat
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              isActive(item.href) ? "nav-item-active" : "nav-item"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User + Sign out */}
      <div className="px-3 py-4 border-t border-surat-beige-200 space-y-1">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-surat-neutral-800 truncate">
            {fullName ?? email}
          </p>
          <p className="text-xs text-surat-neutral-400 truncate capitalize">{role}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="nav-item w-full text-surat-neutral-500"
        >
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
