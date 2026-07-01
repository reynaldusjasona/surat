export default function EventPageLoading() {
  return (
    <div className="min-h-screen bg-surat-offwhite animate-pulse">
      {/* Hero skeleton */}
      <div className="w-full aspect-[21/9] max-h-[400px] bg-surat-neutral-200" />

      {/* Content skeleton */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Details card */}
        <div className="card p-6 space-y-4">
          <div className="h-5 w-3/4 bg-surat-neutral-200 rounded-lg" />
          <div className="h-4 w-1/2 bg-surat-neutral-100 rounded-lg" />
          <div className="h-4 w-2/3 bg-surat-neutral-100 rounded-lg" />
        </div>

        {/* RSVP form skeleton */}
        <div className="card p-6 space-y-4">
          <div className="h-6 w-16 bg-surat-neutral-200 rounded-lg" />
          <div className="h-10 w-full bg-surat-neutral-100 rounded-lg" />
          <div className="h-10 w-full bg-surat-neutral-100 rounded-lg" />
          <div className="h-10 w-full bg-surat-neutral-100 rounded-lg" />
          <div className="h-12 w-full bg-surat-neutral-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
