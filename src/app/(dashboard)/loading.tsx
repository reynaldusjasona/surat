export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-48 bg-surat-neutral-200 rounded-lg" />
          <div className="h-4 w-32 bg-surat-neutral-100 rounded-lg mt-2" />
        </div>
        <div className="h-10 w-32 bg-surat-neutral-200 rounded-lg" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-5 space-y-3">
            <div className="h-5 w-20 bg-surat-neutral-100 rounded-full" />
            <div className="h-5 w-full bg-surat-neutral-200 rounded-lg" />
            <div className="h-4 w-3/4 bg-surat-neutral-100 rounded-lg" />
            <div className="h-4 w-1/2 bg-surat-neutral-100 rounded-lg" />
            <div className="flex gap-2 pt-3 border-t border-surat-neutral-100">
              <div className="h-8 flex-1 bg-surat-neutral-200 rounded-lg" />
              <div className="h-8 w-10 bg-surat-neutral-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
