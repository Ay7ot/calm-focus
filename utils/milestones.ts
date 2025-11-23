import { createClient } from '@/utils/supabase/server'

interface Milestone {
  id: number
  title: string
  description: string | null
  session_threshold: number
  badge_icon: string | null
  badge_color: string | null
  is_active: boolean
}

interface MilestoneProgress {
  milestone: Milestone | null
  progress: number
  progressPercentage: number
  totalSessions: number
  sessionsToGo: number
}

export async function getNextMilestone(userId: string): Promise<MilestoneProgress> {
  const supabase = await createClient()

  // Get user's total sessions
  const { count: totalSessions } = await supabase
    .from('focus_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const sessionCount = totalSessions || 0

  // Get user's unlocked achievements
  const { data: unlockedAchievements } = await supabase
    .from('user_achievements')
    .select('milestone_id')
    .eq('user_id', userId)

  const unlockedIds = new Set(unlockedAchievements?.map(a => a.milestone_id) || [])

  // Get next milestone (lowest threshold not yet achieved)
  const { data: milestones } = await supabase
    .from('milestones')
    .select('*')
    .eq('is_active', true)
    .order('session_threshold', { ascending: true })

  // Find first milestone not yet unlocked
  const nextMilestone = milestones?.find(m => !unlockedIds.has(m.id)) || null

  if (!nextMilestone) {
    // User has completed all milestones
    return {
      milestone: null,
      progress: 0,
      progressPercentage: 100,
      totalSessions: sessionCount,
      sessionsToGo: 0,
    }
  }

  // Calculate progress toward next milestone
  // Find the previous milestone threshold (if any)
  const previousMilestone = milestones
    ?.filter(m => m.session_threshold < nextMilestone.session_threshold)
    ?.sort((a, b) => b.session_threshold - a.session_threshold)[0]

  const startingPoint = previousMilestone?.session_threshold || 0
  const progressRange = nextMilestone.session_threshold - startingPoint
  const currentProgress = sessionCount - startingPoint
  const progressPercentage = Math.min(100, Math.max(0, (currentProgress / progressRange) * 100))
  const sessionsToGo = Math.max(0, nextMilestone.session_threshold - sessionCount)

  return {
    milestone: nextMilestone,
    progress: currentProgress,
    progressPercentage,
    totalSessions: sessionCount,
    sessionsToGo,
  }
}

export async function getUserAchievements(userId: string) {
  const supabase = await createClient()

  const { data: achievements } = await supabase
    .from('user_achievements')
    .select(`
      id,
      unlocked_at,
      milestones (
        id,
        title,
        description,
        badge_icon,
        badge_color,
        session_threshold
      )
    `)
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false })

  return achievements || []
}


