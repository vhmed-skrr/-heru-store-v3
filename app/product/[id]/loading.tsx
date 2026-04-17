export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-64 bg-surface border border-border rounded mb-8"></div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Product Images Skeleton */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="aspect-square bg-surface border border-border rounded-2xl w-full"></div>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 w-24 bg-surface border border-border rounded-lg flex-shrink-0"></div>
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="h-10 w-3/4 bg-surface rounded"></div>
          <div className="h-6 w-1/4 bg-surface rounded"></div>
          
          <div className="space-y-3 mt-4 text-text-sec">
            <div className="h-4 w-full bg-surface rounded"></div>
            <div className="h-4 w-full bg-surface rounded"></div>
            <div className="h-4 w-4/5 bg-surface rounded"></div>
            <div className="h-4 w-5/6 bg-surface rounded"></div>
          </div>

          <div className="h-16 w-full bg-surface border border-border rounded-2xl mt-6"></div>
          
          <div className="flex gap-4 mt-4">
            <div className="h-12 w-32 bg-surface border border-border rounded-full"></div>
            <div className="h-12 flex-1 bg-surface border border-border rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
