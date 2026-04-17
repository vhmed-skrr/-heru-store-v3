export default function ShopLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Filter and Title Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="h-10 w-40 bg-surface border border-border rounded-lg"></div>
        <div className="h-10 w-64 bg-surface border border-border rounded-full"></div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex flex-col bg-surface border border-border rounded-xl overflow-hidden">
            <div className="aspect-square bg-surface-hover w-full"></div>
            <div className="p-4 flex flex-col gap-3">
              <div className="h-5 w-full bg-border rounded"></div>
              <div className="h-4 w-2/3 bg-border rounded"></div>
              <div className="flex justify-between items-center mt-4">
                <div className="h-6 w-1/3 bg-border rounded"></div>
                <div className="h-8 w-8 bg-brand-50 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
