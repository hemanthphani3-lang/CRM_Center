export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{ width: i === lines - 1 && lines > 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-4 space-y-3 ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded animate-pulse" />
      <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
    </div>
  )
}

export function SkeletonKPICard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-5 space-y-3 ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
        <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse" />
      </div>
      <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
      <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" aria-hidden="true">
      {/* Header */}
      <div className="flex gap-4 px-4 py-3 border-b border-gray-100 bg-gray-50">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1 h-3 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex gap-4 px-4 py-3 border-b border-gray-100 last:border-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="flex-1 h-3 bg-gray-200 rounded animate-pulse"
              style={{ opacity: 1 - r * 0.08 }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
