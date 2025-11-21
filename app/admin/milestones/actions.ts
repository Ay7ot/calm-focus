'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { requireAdmin } from '@/utils/admin'

export async function createMilestone(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const session_threshold = parseInt(formData.get('session_threshold') as string)
  const badge_icon = formData.get('badge_icon') as string
  const badge_color = formData.get('badge_color') as string
  const is_active = formData.get('is_active') === 'on'

  const { error } = await supabase.from('milestones').insert({
    title,
    description,
    session_threshold,
    badge_icon,
    badge_color,
    is_active,
  })

  if (error) {
    console.error('Error creating milestone:', error)
    redirect('/admin/milestones?error=' + encodeURIComponent(error.message))
  }

  // Log admin action
  await supabase.from('admin_audit_log').insert({
    admin_id: user!.id,
    action: `Created milestone: ${title}`,
    target_table: 'milestones',
  })

  revalidatePath('/admin/milestones')
  redirect('/admin/milestones')
}

export async function updateMilestone(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const id = parseInt(formData.get('id') as string)
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const session_threshold = parseInt(formData.get('session_threshold') as string)
  const badge_icon = formData.get('badge_icon') as string
  const badge_color = formData.get('badge_color') as string
  const is_active = formData.get('is_active') === 'on'

  const { error } = await supabase
    .from('milestones')
    .update({
      title,
      description,
      session_threshold,
      badge_icon,
      badge_color,
      is_active,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating milestone:', error)
    redirect('/admin/milestones?error=' + encodeURIComponent(error.message))
  }

  // Log admin action
  await supabase.from('admin_audit_log').insert({
    admin_id: user!.id,
    action: `Updated milestone: ${title}`,
    target_table: 'milestones',
    target_id: id,
  })

  revalidatePath('/admin/milestones')
  redirect('/admin/milestones')
}

export async function deleteMilestone(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const id = parseInt(formData.get('id') as string)

  const { error } = await supabase.from('milestones').delete().eq('id', id)

  if (error) {
    console.error('Error deleting milestone:', error)
    redirect('/admin/milestones?error=' + encodeURIComponent(error.message))
  }

  // Log admin action
  await supabase.from('admin_audit_log').insert({
    admin_id: user!.id,
    action: `Deleted milestone ID: ${id}`,
    target_table: 'milestones',
    target_id: id,
  })

  revalidatePath('/admin/milestones')
  redirect('/admin/milestones')
}

