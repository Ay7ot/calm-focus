export default function SkeletonLoader({ type = 'card' }: { type?: 'card' | 'list' | 'table' | 'stat' }) {
  if (type === 'card') {
    return (
      <div className="card space-y-4">
        <div className="skeleton h-4 w-3/4"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-5/6"></div>
        <div className="skeleton h-10 w-32 mt-4"></div>
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-border border border-border rounded-lg">
            <div className="skeleton h-10 w-10 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4"></div>
              <div className="skeleton h-3 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'stat') {
    return (
      <div className="card">
        <div className="skeleton h-4 w-24 mb-4"></div>
        <div className="h-px bg-border mb-6"></div>
        <div className="skeleton h-12 w-20"></div>
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className="table-container">
        <div className="table-header">
          <div className="flex gap-4 p-4">
            <div className="skeleton h-3 w-32"></div>
            <div className="skeleton h-3 w-32"></div>
            <div className="skeleton h-3 w-32"></div>
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="table-row items-center gap-4">
            <div className="skeleton h-4 w-40"></div>
            <div className="skeleton h-4 w-32"></div>
            <div className="skeleton h-4 w-24"></div>
          </div>
        ))}
      </div>
    )
  }

  return null
}

