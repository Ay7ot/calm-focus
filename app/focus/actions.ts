'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

interface SaveSessionResult {
    success: boolean
    error?: string
    newMilestones?: Array<{
        id: number
        title: string
        description: string
        badge_icon: string
        badge_color: string
    }>
    totalSessions?: number
}

export async function saveFocusSession(
    durationSeconds: number,
    mode: 'focus' | 'break'
): Promise<SaveSessionResult> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    // Only save focus sessions, not breaks
    if (mode !== 'focus') {
        return { success: true }
    }

    // Insert focus session
    const now = new Date()
    const startTime = new Date(now.getTime() - (durationSeconds * 1000)) // Calculate when session started

    const { error: sessionError } = await supabase
        .from('focus_sessions')
        .insert({
            user_id: user.id,
            duration_minutes: Math.round(durationSeconds / 60),
            started_at: startTime.toISOString(),
            completed_at: now.toISOString(),
            session_type: 'focus',
            completed: true,
        })

    if (sessionError) {
        console.error('Error saving focus session:', sessionError)
        return { success: false, error: sessionError.message }
    }

    // Get total sessions for user
    const { count: totalSessions } = await supabase
        .from('focus_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    // Check for milestone unlocks
    const { data: milestones } = await supabase
        .from('milestones')
        .select('id, title, description, session_threshold, badge_icon, badge_color')
        .lte('session_threshold', totalSessions || 0)
        .eq('is_active', true)
        .order('session_threshold', { ascending: true })

    // Get user's existing achievements
    const { data: existingAchievements } = await supabase
        .from('user_achievements')
        .select('milestone_id')
        .eq('user_id', user.id)

    const existingIds = new Set(existingAchievements?.map(a => a.milestone_id) || [])

    // Find newly unlocked milestones
    const newMilestones = milestones?.filter(m => !existingIds.has(m.id)) || []

    // Insert new achievements
    if (newMilestones.length > 0) {
        const { error: achievementError } = await supabase
            .from('user_achievements')
            .insert(
                newMilestones.map(m => ({
                    user_id: user.id,
                    milestone_id: m.id,
                }))
            )

        if (achievementError) {
            console.error('Error saving achievements:', achievementError)
            // Don't fail the whole operation if achievement save fails
        }
    }

    // Revalidate pages to show updated data
    revalidatePath('/dashboard')
    revalidatePath('/focus')

    return {
        success: true,
        newMilestones: newMilestones.map(m => ({
            id: m.id,
            title: m.title,
            description: m.description || '',
            badge_icon: m.badge_icon || '🏆',
            badge_color: m.badge_color || '#10b981',
        })),
        totalSessions: totalSessions || 0,
    }
}

