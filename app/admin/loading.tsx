export default function AdminLoading() {
  return (
    <div className="p-6 md:p-8 animate-pulse flex-1 w-full bg-surface-50 min-h-screen">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <div className="h-8 w-48 bg-surface border border-border rounded mb-2"></div>
          <div className="h-4 w-64 bg-surface border border-border rounded"></div>
        </div>
        <div className="h-10 w-32 bg-surface border border-border rounded-full"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-background rounded-xl p-6 border border-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="h-4 w-24 bg-surface rounded"></div>
              <div className="h-10 w-10 bg-surface rounded-full"></div>
            </div>
            <div className="h-8 w-32 bg-surface rounded mb-2"></div>
            <div className="h-4 w-40 bg-surface rounded"></div>
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Table Area */}
        <div className="lg:col-span-2 bg-background rounded-xl p-6 border border-border shadow-sm">
          <div className="h-6 w-48 bg-surface rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 w-full bg-surface rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Side Panel Area */}
        <div className="bg-background rounded-xl p-6 border border-border shadow-sm">
          <div className="h-6 w-32 bg-surface rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="h-12 w-12 bg-surface rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full bg-surface rounded"></div>
                  <div className="h-3 w-2/3 bg-surface rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
