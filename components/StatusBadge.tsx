export default function StatusBadge({
  status,
  showDot = true,
}: {
  status: 'active' | 'pending' | 'completed' | 'cancelled' | 'onboarding' | 'deactivated'
  showDot?: boolean
}) {
  const variants = {
    active: 'badge-success',
    completed: 'badge-success',
    pending: 'badge-warning',
    onboarding: 'badge-neutral',
    cancelled: 'badge-neutral',
    deactivated: 'badge-error',
  }

  const labels = {
    active: 'Active',
    completed: 'Completed',
    pending: 'Pending',
    onboarding: 'Onboarding',
    cancelled: 'Cancelled',
    deactivated: 'Deactivated',
  }

  return (
    <span className={`badge ${variants[status]}`}>
      {showDot && <span className="badge-dot"></span>}
      {labels[status]}
    </span>
  )
}

