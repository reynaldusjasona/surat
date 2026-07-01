"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setSent(true);
      toast.success("Reset link sent!");
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
        <div className="w-full max-w-[400px]">
          <div className="card p-8">
            {!sent ? (
              <>
                <div className="mb-8">
                  <h1 className="font-serif text-2xl text-surat-neutral-900">Forgot password?</h1>
                  <p className="text-sm text-surat-neutral-500 mt-1.5">
                    Enter your email and we&apos;ll send you a reset link
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                      autoComplete="email"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-surat-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-surat-red-500" />
                </div>
                <h2 className="font-serif text-xl text-surat-neutral-900 mb-2">Check your email</h2>
                <p className="text-sm text-surat-neutral-500 mb-6">
                  We sent a password reset link to<br />
                  <span className="font-medium text-surat-neutral-700">{email}</span>
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-sm text-surat-red-500 hover:text-surat-red-600 font-medium"
                >
                  Didn&apos;t receive it? Try again
                </button>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-surat-neutral-500 hover:text-surat-neutral-700"
              >
                <ArrowLeft size={14} />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
