import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createReminder, deleteReminder } from './actions'
import { Bell, Trash2, Calendar, Plus, Clock } from 'lucide-react'
import EmptyState from '@/components/EmptyState'
import UserMenu from '@/components/UserMenu'
import { MobileMenuButton } from '@/components/MobileSidebar'

export default async function RemindersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile for username
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  const { data: reminders } = await supabase
    .from('reminders')
    .select('*')
    .or(`is_global.eq.true,created_by.eq.${user?.id}`)
    .order('remind_at', { ascending: true })

  const upcomingReminders = reminders?.filter(r => new Date(r.remind_at) > new Date()) || []
  const pastReminders = reminders?.filter(r => new Date(r.remind_at) <= new Date()) || []

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="h-16 border-b border-border bg-surface-elevated sticky top-0 z-20">
        <div className="h-full  mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-4">
          <MobileMenuButton />
          <div className="flex-1">
            <h1 className="text-base sm:text-lg font-bold text-on-surface">Reminders</h1>
            <p className="text-on-surface-secondary text-xs hidden sm:block">Stay on track with your goals and habits</p>
          </div>
          <UserMenu email={user.email} username={profile?.username} />
        </div>
      </header>

      <div className=" mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">

          {/* Reminders List */}
          <div className="xl:col-span-2 space-y-6">

            {/* Upcoming Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={20} className="text-primary" />
                <h2 className="text-xl font-semibold text-on-surface">Upcoming</h2>
                <span className="badge badge-neutral">
                  {upcomingReminders.length}
                </span>
              </div>

              {upcomingReminders.length === 0 ? (
                <div className="card">
                  <EmptyState
                    icon={Bell}
                    title="No upcoming reminders"
                    description="Create your first reminder to stay on track with your goals."
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingReminders.map((reminder) => (
                    <div key={reminder.id} className="group card hover:border-primary transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {reminder.is_global && (
                              <span className="badge badge-neutral text-xs">
                                Global
                              </span>
                            )}
                            <h3 className="font-semibold text-on-surface">{reminder.title}</h3>
                          </div>
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

                        {user && reminder.created_by === user.id && (
                          <form action={deleteReminder.bind(null, reminder.id)}>
                            <button className="text-on-surface-secondary hover:text-error opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-error-bg">
                              <Trash2 size={16} />
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Reminders */}
            {pastReminders.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-on-surface-secondary mb-4">Past</h2>
                <div className="space-y-2">
                  {pastReminders.slice(0, 5).map((reminder) => (
                    <div key={reminder.id} className="card bg-backplate opacity-60">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-on-surface text-sm">{reminder.title}</h3>
                          <p className="text-xs text-on-surface-secondary mt-1">
                            {new Date(reminder.remind_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Create Reminder Sidebar */}
          <div className="card h-fit sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell size={20} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-on-surface">Create Reminder</h2>
            </div>

            <form action={createReminder} className="space-y-5">

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

              <button className="btn btn-primary w-full">
                <Plus size={18} />
                Create Reminder
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
