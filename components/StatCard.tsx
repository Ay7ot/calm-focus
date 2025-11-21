export default function StatCard({
  label,
  value,
  change,
  changeType,
}: {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
}) {
  return (
    <div className="card">
      <div className="text-sm text-on-surface-secondary mb-3">{label}</div>
      <div className="h-px bg-border mb-6"></div>
      <div className="text-4xl font-bold text-on-surface leading-none mb-2">
        {value}
      </div>
      {change && (
        <div
          className={`text-sm ${
            changeType === 'positive'
              ? 'text-success'
              : changeType === 'negative'
              ? 'text-error'
              : 'text-neutral-medium'
          }`}
        >
          {change}
        </div>
      )}
    </div>
  )
}

