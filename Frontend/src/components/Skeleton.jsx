export function SkeletonCard() {
  return (
    <div className="card animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-3 bg-slate-200 rounded w-1/4"></div>
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-4/5"></div>
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-slate-200 rounded w-16"></div>
        <div className="h-9 bg-slate-200 rounded-xl w-24"></div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-1/3"></div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card h-24 bg-slate-100"></div>
        <div className="card h-24 bg-slate-100"></div>
        <div className="card h-24 bg-slate-100"></div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card h-64 bg-slate-100"></div>
        <div className="card h-64 bg-slate-100"></div>
      </div>
    </div>
  );
}
