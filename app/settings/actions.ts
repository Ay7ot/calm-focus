'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?message=You must be logged in')
  }

  const username = formData.get('username') as string | null
  const fullName = formData.get('full_name') as string | null
  const dailyGoal = formData.get('daily_goal') as string | null
  const defaultFocusDuration = formData.get('default_focus_duration') as string | null
  const defaultBreakDuration = formData.get('default_break_duration') as string | null

  // Build update object dynamically based on what fields are present
  const updates: any = {
    updated_at: new Date().toISOString(),
  }

  // Handle profile fields (username, full_name)
  if (username !== null) {
    if (username.trim().length < 3) {
      return { error: 'Username must be at least 3 characters long' }
    }

    // Check if username is already taken (by someone else)
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', user.id)
      .single()

    if (existingUser) {
      return { error: 'Username is already taken' }
    }

    updates.username = username
  }

  // If full_name is present in form (even if empty), update it
  if (fullName !== null) {
    updates.full_name = fullName.trim() || null
  }

  // Handle preference fields
  if (dailyGoal) {
    const goal = parseInt(dailyGoal)
    if (isNaN(goal) || goal < 1 || goal > 20) {
      return { error: 'Daily goal must be between 1 and 20 sessions' }
    }
    updates.daily_goal = goal
  }

  if (defaultFocusDuration) {
    const duration = parseInt(defaultFocusDuration)
    if (isNaN(duration) || duration < 5 || duration > 60) {
      return { error: 'Focus duration must be between 5 and 60 minutes' }
    }
    updates.default_focus_duration = duration
  }

  if (defaultBreakDuration) {
    const duration = parseInt(defaultBreakDuration)
    if (isNaN(duration) || duration < 1 || duration > 30) {
      return { error: 'Break duration must be between 1 and 30 minutes' }
    }
    updates.default_break_duration = duration
  }

  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    return { error: error.message || 'Failed to update profile' }
  }

  revalidatePath('/settings')
  revalidatePath('/dashboard')
  revalidatePath('/focus')
  return { success: true }
}


