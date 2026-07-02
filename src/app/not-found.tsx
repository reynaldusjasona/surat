import Link from "next/link";
import { CalendarX, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surat-beige-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-surat-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <CalendarX size={28} className="text-surat-red-500" />
        </div>
        <p className="text-5xl font-serif text-surat-red-500 mb-3">404</p>
        <h1 className="font-serif text-2xl text-surat-neutral-900 mb-2">Page not found</h1>
        <p className="text-sm text-surat-neutral-500 mb-2">
          The event or page you&apos;re looking for doesn&apos;t exist, may have been removed, or the link might be incorrect.
        </p>
        <p className="text-xs text-surat-neutral-400 mb-8">
          If you received this link from someone, ask them to double-check the URL.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            Go home <ArrowRight size={16} />
          </Link>
          <Link href="/login" className="btn-secondary">
            Sign in to your dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
