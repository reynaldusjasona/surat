import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surat-beige-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-serif text-surat-red-500 mb-4">404</p>
        <h1 className="font-serif text-2xl text-surat-neutral-900 mb-2">Page not found</h1>
        <p className="text-sm text-surat-neutral-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Go home
          </Link>
          <Link href="/login" className="btn-secondary">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
