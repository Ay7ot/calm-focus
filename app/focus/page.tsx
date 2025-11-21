import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Timer from '@/components/timer/Timer'
import UserMenu from '@/components/UserMenu'
import { MobileMenuButton } from '@/components/MobileSidebar'
import StatCard from '@/components/StatCard'
import { Calendar, TrendingUp, Award } from 'lucide-react'

export default async function FocusPage() {
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
              <Timer />
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
                    <span className="font-semibold text-on-surface">0 / 8</span>
                  </div>
                  <div className="h-2 bg-backplate rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-0 transition-all"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-on-surface-secondary">Total Time</span>
                    <span className="font-semibold text-on-surface">0m / 200m</span>
                  </div>
                  <div className="h-2 bg-backplate rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-0 transition-all"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Stats */}
            <StatCard
              label="Sessions This Week"
              value="0"
              change="Start your first session!"
              changeType="neutral"
            />

            {/* Achievements */}
            <div className="card bg-linear-to-br from-primary to-secondary text-white border-primary">
              <div className="flex items-center gap-2 mb-4">
                <Award size={20} className="text-on-surface" />
                <h3 className="font-semibold">Next Milestone</h3>
              </div>
              <p className="text-sm text-on-surface opacity-90">Complete 5 sessions to unlock your first achievement!</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
