export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Hero Skeleton */}
      <div className="h-64 sm:h-96 bg-surface border border-border rounded-2xl mb-12"></div>
      
      {/* Category Links Skeleton */}
      <div className="flex gap-4 overflow-hidden mb-12 pb-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="min-w-[100px] h-12 rounded-full bg-surface border border-border flex-shrink-0"></div>
        ))}
      </div>

      {/* Featured Products Secton Title */}
      <div className="h-8 w-48 bg-surface border border-border rounded mb-6"></div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col bg-surface border border-border rounded-xl overflow-hidden h-80">
            <div className="h-48 bg-surface-hover w-full"></div>
            <div className="p-4 flex-1 flex flex-col gap-3">
              <div className="h-4 w-3/4 bg-border rounded"></div>
              <div className="h-4 w-1/2 bg-border rounded"></div>
              <div className="mt-auto h-8 w-1/3 bg-border rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
