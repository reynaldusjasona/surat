"use client";

import { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard, CalendarPlus, Settings, Users, BarChart3, Camera, DollarSign, ShieldCheck, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

function getNavItems(role: string): NavItem[] {
  switch (role) {
    case "organizer":
      return [
        { label: "All Events", href: "/organizer", icon: <LayoutDashboard size={18} /> },
        { label: "Create Event", href: "/organizer/events/new", icon: <CalendarPlus size={18} /> },
        { label: "Team", href: "/organizer/team", icon: <Users size={18} /> },
        { label: "Analytics", href: "/organizer/analytics", icon: <BarChart3 size={18} /> },
        { label: "Settings", href: "/organizer/settings", icon: <Settings size={18} /> },
      ];
    case "photographer":
      return [
        { label: "My Events", href: "/photographer", icon: <Camera size={18} /> },
        { label: "Earnings", href: "/photographer/earnings", icon: <DollarSign size={18} /> },
        { label: "Settings", href: "/photographer/settings", icon: <Settings size={18} /> },
      ];
    case "admin":
      return [
        { label: "Overview", href: "/admin", icon: <LayoutDashboard size={18} /> },
        { label: "Users", href: "/admin/users", icon: <Users size={18} /> },
        { label: "Events", href: "/admin/events", icon: <FileText size={18} /> },
        { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 size={18} /> },
        { label: "Settings", href: "/admin/settings", icon: <ShieldCheck size={18} /> },
      ];
    default:
      return [
        { label: "My Events", href: "/host", icon: <LayoutDashboard size={18} /> },
        { label: "Create Event", href: "/host/events/new", icon: <CalendarPlus size={18} /> },
        { label: "Settings", href: "/host/settings", icon: <Settings size={18} /> },
      ];
  }
}

interface TopbarProps {
  role: string;
  fullName: string | null;
}

export function Topbar({ role, fullName }: TopbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const navItems = getNavItems(role);

  async function handleSignOut() {
    document.cookie = "dev-bypass-role=; path=/; max-age=0";
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // ignore — dev mode without Supabase
    }
    setOpen(false);
    router.push("/login");
    router.refresh();
  }

  const isActive = (href: string) => {
    if (href === `/${role}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile topbar */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-surat-neutral-200 sticky top-0 z-30">
        <Link href="/" className="font-serif text-lg text-surat-red-500 font-semibold">
          Surat
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-surat-neutral-500 capitalize">{role}</span>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-surat-neutral-100 text-surat-neutral-600"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-surat-beige-50 border-r border-surat-beige-200",
          "transform transition-transform duration-200 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-surat-beige-200">
          <Link
            href="/"
            className="font-serif text-xl text-surat-red-500 font-semibold"
            onClick={() => setOpen(false)}
          >
            Surat
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-surat-beige-200 text-surat-neutral-500"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(isActive(item.href) ? "nav-item-active" : "nav-item")}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-surat-beige-200">
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-medium text-surat-neutral-800">{fullName ?? "Account"}</p>
            <p className="text-xs text-surat-neutral-400 capitalize">{role}</p>
          </div>
          <button onClick={handleSignOut} className="nav-item w-full text-surat-neutral-500">
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
}
