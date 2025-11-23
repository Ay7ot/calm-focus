import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import FocusPageClient from './FocusPageClient'
import UserMenu from '@/components/UserMenu'
import { MobileMenuButton } from '@/components/MobileSidebar'
import StatCard from '@/components/StatCard'
import { Calendar, TrendingUp, Award } from 'lucide-react'
import { getNextMilestone } from '@/utils/milestones'

export default async function FocusPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile with preferences
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, daily_goal, default_focus_duration, default_break_duration')
    .eq('id', user.id)
    .single()

  // Get today's sessions
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const { data: todaySessions, count: todayCount } = await supabase
    .from('focus_sessions')
    .select('duration_minutes', { count: 'exact' })
    .eq('user_id', user.id)
    .gte('completed_at', startOfToday.toISOString())

  const todayTotalMinutes = Math.round(
    todaySessions?.reduce((sum, s) => sum + s.duration_minutes, 0) || 0
  )

  // Get this week's sessions
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const { count: weekCount } = await supabase
    .from('focus_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('completed_at', startOfWeek.toISOString())

  // Get next milestone
  const milestoneProgress = await getNextMilestone(user.id)

  // Daily goal from user preferences
  const dailyGoalSessions = profile?.daily_goal || 8
  const dailyGoalMinutes = dailyGoalSessions * (profile?.default_focus_duration || 25)

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="h-16 border-b border-border bg-surface-elevated sticky top-0 z-20">
        <div className="h-full  mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-4">
          <MobileMenuButton />
          <div className="flex-1">
            <h1 className="text-base sm:text-lg font-bold text-on-surface">Focus Timer</h1>
            <p className="text-on-surface-secondary text-xs hidden sm:block">Stay present. Work deeply.</p>
          </div>
          <UserMenu email={user.email} username={profile?.username} />
        </div>
      </header>

      <div className=" mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">

          {/* Main Timer Section */}
          <div className="xl:col-span-2 space-y-6">
            <div className="card text-center">
              <FocusPageClient
                defaultFocusDuration={profile?.default_focus_duration || 25}
                defaultBreakDuration={profile?.default_break_duration || 5}
              />
            </div>

            {/* Quick Tips */}
            <div className="card bg-backplate">
              <h3 className="font-semibold text-on-surface mb-4 flex items-center gap-2">
                <span className="text-lg">💡</span>
                Focus Tips
              </h3>
              <ul className="space-y-3 text-sm text-on-surface-secondary">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Use 25-minute intervals (Pomodoro) for optimal focus</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Take 5-minute breaks between sessions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5">•</span>
                  <span>After 4 sessions, take a longer 15-30 minute break</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">

            {/* Today's Progress */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={20} className="text-primary" />
                <h3 className="font-semibold text-on-surface">Today's Progress</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-on-surface-secondary">Focus Sessions</span>
                    <span className="font-semibold text-on-surface">
                      {todayCount || 0} / {dailyGoalSessions}
                    </span>
                  </div>
                  <div className="h-2 bg-backplate rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.min(100, ((todayCount || 0) / dailyGoalSessions) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-on-surface-secondary">Total Time</span>
                    <span className="font-semibold text-on-surface">
                      {todayTotalMinutes}m / {dailyGoalMinutes}m
                    </span>
                  </div>
                  <div className="h-2 bg-backplate rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all"
                      style={{ width: `${Math.min(100, (todayTotalMinutes / dailyGoalMinutes) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Stats */}
            <StatCard
              label="Sessions This Week"
              value={`${weekCount || 0}`}
              change={weekCount ? `Keep going!` : 'Start your first session!'}
              changeType={weekCount ? 'positive' : 'neutral'}
            />

            {/* Achievements */}
            {milestoneProgress.milestone ? (
              <div className="card bg-linear-to-br from-primary to-secondary border-primary">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{milestoneProgress.milestone.badge_icon || '🏆'}</span>
                  <h3 className="font-semibold">Next Milestone</h3>
                </div>
                <p className="text-sm font-semibold mb-1">{milestoneProgress.milestone.title}</p>
                <p className="text-sm text-neutral-medium">
                  {milestoneProgress.sessionsToGo} {milestoneProgress.sessionsToGo === 1 ? 'session' : 'sessions'} to go!
                </p>
              </div>
            ) : (
              <div className="card bg-linear-to-br from-primary to-secondary text-neutral-medium border-primary">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">👑</span>
                  <h3 className="font-semibold">All Complete!</h3>
                </div>
                <p className="text-sm text-neutral-medium">You've unlocked all achievements!</p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  )
}
