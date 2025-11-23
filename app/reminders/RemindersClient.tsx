'use client'

import { useState, useTransition } from 'react'
import { Bell, Trash2, Calendar, Plus, Clock, X, Edit2 } from 'lucide-react'
import { createReminder, deleteReminder, updateReminder } from './actions'
import EmptyState from '@/components/EmptyState'
import Toast from '@/components/Toast'
import ConfirmModal from '@/components/ConfirmModal'

interface Reminder {
  id: number
  title: string
  message: string | null
  remind_at: string
  is_global: boolean
  created_by: string
}

interface RemindersClientProps {
  upcomingReminders: Reminder[]
  pastReminders: Reminder[]
  userId: string
  isAdmin: boolean
}

export default function RemindersClient({ 
  upcomingReminders, 
  pastReminders, 
  userId,
  isAdmin
}: RemindersClientProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)
  const [deletingReminder, setDeletingReminder] = useState<Reminder | null>(null)
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleCreateReminder = async (formData: FormData) => {
    startTransition(async () => {
      await createReminder(formData)
      setIsCreateOpen(false)
      setToast({ message: 'Reminder created successfully!', type: 'success' })
    })
  }

  const handleUpdateReminder = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateReminder(formData)
      if (result?.error) {
        setToast({ message: result.error, type: 'error' })
      } else {
        setEditingReminder(null)
        setToast({ message: 'Reminder updated successfully!', type: 'success' })
      }
    })
  }

  const handleDeleteReminder = async (id: number) => {
    startTransition(async () => {
      await deleteReminder(id)
      setDeletingReminder(null)
      setToast({ message: 'Reminder deleted', type: 'success' })
    })
  }

  const getTimeUntil = (remindAt: string) => {
    const now = new Date()
    const target = new Date(remindAt)
    const diff = target.getTime() - now.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 0) return { text: 'Overdue', urgency: 'overdue' }
    if (minutes < 60) return { text: `in ${minutes}m`, urgency: 'urgent' }
    if (hours < 24) return { text: `in ${hours}h`, urgency: 'soon' }
    if (days === 0) return { text: 'Today', urgency: 'today' }
    if (days === 1) return { text: 'Tomorrow', urgency: 'upcoming' }
    if (days < 7) return { text: `in ${days} days`, urgency: 'upcoming' }
    return { text: new Date(remindAt).toLocaleDateString(), urgency: 'future' }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'overdue': return 'text-error bg-error/10 border-error/30'
      case 'urgent': return 'text-error bg-error/10 border-error/20'
      case 'soon': return 'text-warning bg-warning/10 border-warning/20'
      case 'today': return 'text-primary bg-primary/10 border-primary/20'
      default: return 'text-on-surface-secondary bg-surface-elevated border-border'
    }
  }

  return (
    <>
      {/* Upcoming Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            <h2 className="text-xl font-semibold text-on-surface">Upcoming</h2>
            <span className="badge badge-neutral">
              {upcomingReminders.length}
            </span>
          </div>
          
          {/* Mobile Create Button */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="xl:hidden btn btn-primary text-sm px-3 py-2"
          >
            <Plus size={18} />
            New
          </button>
        </div>

        {upcomingReminders.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={Bell}
              title="No upcoming reminders"
              description="Create your first reminder to stay on track with your goals."
              action={
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="btn btn-primary"
                >
                  <Plus size={18} />
                  Create Reminder
                </button>
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingReminders.map((reminder) => {
              const { text: timeText, urgency } = getTimeUntil(reminder.remind_at)
              
              return (
                <div key={reminder.id} className="group card hover:border-primary transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {reminder.is_global && (
                          <span className="badge badge-neutral text-xs">
                            Global
                          </span>
                        )}
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${getUrgencyColor(urgency)}`}>
                          {timeText}
                        </span>
                      </div>
                      <h3 className="font-semibold text-on-surface mb-1">{reminder.title}</h3>
                      {reminder.message && (
                        <p className="text-sm text-on-surface-secondary mb-3">{reminder.message}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-on-surface-secondary">
                        <Calendar size={14} />
                        {new Date(reminder.remind_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    {userId && reminder.created_by === userId && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setEditingReminder(reminder)}
                          className="text-on-surface-secondary hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
                          aria-label="Edit reminder"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingReminder(reminder)}
                          className="text-on-surface-secondary hover:text-error transition-colors p-2 rounded-lg hover:bg-error/10"
                          aria-label="Delete reminder"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Past Reminders */}
      {pastReminders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-on-surface-secondary">Past</h2>
            <span className="text-xs text-on-surface-secondary">
              Showing last {Math.min(5, pastReminders.length)} of {pastReminders.length}
            </span>
          </div>
          <div className="space-y-2">
            {pastReminders.slice(0, 5).map((reminder) => (
              <div key={reminder.id} className="group card bg-backplate opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {reminder.is_global && (
                      <span className="badge badge-neutral text-xs mb-1">Global</span>
                    )}
                    <h3 className="font-medium text-on-surface text-sm">{reminder.title}</h3>
                    <p className="text-xs text-on-surface-secondary mt-1">
                      {new Date(reminder.remind_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {userId && reminder.created_by === userId && (
                    <button
                      onClick={() => setDeletingReminder(reminder)}
                      className="text-on-surface-secondary hover:text-error opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-error/10 shrink-0"
                      aria-label="Delete reminder"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingReminder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div className="relative bg-surface-elevated rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="sticky top-0 bg-surface-elevated border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Edit2 size={20} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-on-surface">Edit Reminder</h2>
              </div>
              <button
                onClick={() => setEditingReminder(null)}
                className="p-2 rounded-lg hover:bg-backplate transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form action={handleUpdateReminder} className="p-6 space-y-5">
              <input type="hidden" name="id" value={editingReminder.id} />
              
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">Title</label>
                <input
                  name="title"
                  required
                  defaultValue={editingReminder.title}
                  placeholder="e.g., Drink water"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">Message (Optional)</label>
                <textarea
                  name="message"
                  rows={3}
                  defaultValue={editingReminder.message || ''}
                  placeholder="Additional details..."
                  className="input w-full min-h-[80px] py-3 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">Date & Time</label>
                <input
                  name="date"
                  type="datetime-local"
                  required
                  defaultValue={new Date(editingReminder.remind_at).toISOString().slice(0, 16)}
                  className="input w-full"
                />
              </div>

              {isAdmin && (
                <div className="p-3 bg-backplate rounded-lg border border-border">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isGlobal"
                      id="editIsGlobal"
                      defaultChecked={editingReminder.is_global}
                      className="mt-0.5 rounded text-primary"
                    />
                    <div className="text-sm">
                      <span className="font-semibold text-on-surface block mb-1">Send to all users</span>
                      <span className="text-xs text-on-surface-secondary">Community-wide wellness reminder</span>
                    </div>
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit2 size={18} />
                    Update Reminder
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Modal (Mobile) */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
          <div className="relative bg-surface-elevated rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="sticky top-0 bg-surface-elevated border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell size={20} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-on-surface">Create Reminder</h2>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-2 rounded-lg hover:bg-backplate transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form action={handleCreateReminder} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">Title</label>
                <input
                  name="title"
                  required
                  placeholder="e.g., Drink water"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">Message (Optional)</label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Additional details..."
                  className="input w-full min-h-[80px] py-3 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">Date & Time</label>
                <input
                  name="date"
                  type="datetime-local"
                  required
                  className="input w-full"
                />
              </div>

              {isAdmin && (
                <div className="p-3 bg-backplate rounded-lg border border-border">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isGlobal"
                      id="isGlobal"
                      className="mt-0.5 rounded text-primary"
                    />
                    <div className="text-sm">
                      <span className="font-semibold text-on-surface block mb-1">Send to all users</span>
                      <span className="text-xs text-on-surface-secondary">Community-wide wellness reminder</span>
                    </div>
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create Reminder
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deletingReminder !== null}
        title="Delete Reminder?"
        message={`Are you sure you want to delete "${deletingReminder?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={() => deletingReminder && handleDeleteReminder(deletingReminder.id)}
        onClose={() => setDeletingReminder(null)}
        isLoading={isPending}
      />

      {/* Toast */}
      <Toast
        isOpen={toast !== null}
        message={toast?.message || ''}
        variant={toast?.type || 'success'}
        onClose={() => setToast(null)}
      />
    </>
  )
}

