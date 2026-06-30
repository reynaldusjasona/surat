"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Camera, Calendar, Users } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Role = "host" | "organizer" | "photographer";

const roles: { value: Role; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "host",
    label: "Event Host",
    description: "Create and manage your own events",
    icon: <Calendar size={18} />,
  },
  {
    value: "organizer",
    label: "Organizer",
    description: "Manage events for multiple clients",
    icon: <Users size={18} />,
  },
  {
    value: "photographer",
    label: "Photographer",
    description: "Upload and monetize event photos",
    icon: <Camera size={18} />,
  },
];

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("host");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        // Create profile via API
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data.user.id, email, fullName, role }),
        });

        if (!res.ok) {
          const body = await res.json();
          toast.error(body.error ?? "Failed to create profile");
          return;
        }
      }

      toast.success("Account created! Welcome to Surat.");
      router.push(`/${role}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surat-beige-50 flex flex-col">
      <header className="px-6 py-5">
        <Link href="/" className="font-serif text-xl text-surat-red-500 font-semibold tracking-tight">
          Surat
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px]">
          <div className="card p-8">
            <div className="mb-8">
              <h1 className="font-serif text-2xl text-surat-neutral-900">Create your account</h1>
              <p className="text-sm text-surat-neutral-500 mt-1.5">
                Start managing beautiful events today
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              {/* Name */}
              <div>
                <label className="label" htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  type="text"
                  className="input"
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="label" htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="label" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="input pr-10"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surat-neutral-400 hover:text-surat-neutral-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="label">I am a…</label>
                <div className="space-y-2">
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={cn(
                        "w-full flex items-start gap-3 p-3.5 rounded-lg border text-left transition-all duration-150",
                        role === r.value
                          ? "border-surat-red-400 bg-surat-red-50 ring-1 ring-surat-red-200"
                          : "border-surat-neutral-200 bg-white hover:border-surat-beige-400 hover:bg-surat-beige-50"
                      )}
                    >
                      <span className={cn("mt-0.5", role === r.value ? "text-surat-red-500" : "text-surat-neutral-400")}>
                        {r.icon}
                      </span>
                      <div>
                        <p className={cn("text-sm font-medium", role === r.value ? "text-surat-red-700" : "text-surat-neutral-800")}>
                          {r.label}
                        </p>
                        <p className="text-xs text-surat-neutral-500 mt-0.5">{r.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating account…
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-surat-neutral-500">
              Already have an account?{" "}
              <Link href="/login" className="text-surat-red-500 hover:text-surat-red-600 font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
