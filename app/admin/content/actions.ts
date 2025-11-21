'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { requireAdmin } from '@/utils/admin'

export async function createGlobalReminder(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const title = formData.get('title') as string
  const message = formData.get('message') as string
  const category = formData.get('category') as string
  const remind_at = formData.get('remind_at') as string
  const recurrence_pattern = formData.get('recurrence_pattern') as string || null

  const { error } = await supabase.from('reminders').insert({
    title,
    message,
    category,
    remind_at,
    recurrence_pattern,
    is_global: true,
    created_by: user!.id,
  })

  if (error) {
    console.error('Error creating global reminder:', error)
    redirect('/admin/reminders?error=' + encodeURIComponent(error.message))
  }

  // Log admin action
  await supabase.from('admin_audit_log').insert({
    admin_id: user!.id,
    action: `Created global reminder: ${title}`,
    target_table: 'reminders',
  })

  revalidatePath('/admin/reminders')
  redirect('/admin/reminders?success=created')
}

export async function deleteGlobalReminder(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const id = parseInt(formData.get('id') as string)

  const { error } = await supabase.from('reminders').delete().eq('id', id)

  if (error) {
    console.error('Error deleting reminder:', error)
    redirect('/admin/reminders?error=' + encodeURIComponent(error.message))
  }

  // Log admin action
  await supabase.from('admin_audit_log').insert({
    admin_id: user!.id,
    action: `Deleted global reminder ID: ${id}`,
    target_table: 'reminders',
    target_id: id,
  })

  revalidatePath('/admin/reminders')
  redirect('/admin/reminders?success=deleted')
}

export async function createDailyTip(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const category = formData.get('category') as string
  const is_active = formData.get('is_active') === 'on'

  const { error } = await supabase.from('daily_tips').insert({
    title,
    content,
    category,
    is_active,
    created_by: user!.id,
  })

  if (error) {
    console.error('Error creating daily tip:', error)
    redirect('/admin/content?error=' + encodeURIComponent(error.message))
  }

  // Log admin action
  await supabase.from('admin_audit_log').insert({
    admin_id: user!.id,
    action: `Created daily tip: ${title}`,
    target_table: 'daily_tips',
  })

  revalidatePath('/admin/content')
  redirect('/admin/content?success=tip-created')
}

export async function deleteDailyTip(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const id = parseInt(formData.get('id') as string)

  const { error } = await supabase.from('daily_tips').delete().eq('id', id)

  if (error) {
    console.error('Error deleting daily tip:', error)
    redirect('/admin/content?error=' + encodeURIComponent(error.message))
  }

  // Log admin action
  await supabase.from('admin_audit_log').insert({
    admin_id: user!.id,
    action: `Deleted daily tip ID: ${id}`,
    target_table: 'daily_tips',
    target_id: id,
  })

  revalidatePath('/admin/content')
  redirect('/admin/content?success=tip-deleted')
}

export async function deleteForumPost(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const id = parseInt(formData.get('id') as string)

  const { error } = await supabase.from('forum_posts').delete().eq('id', id)

  if (error) {
    console.error('Error deleting forum post:', error)
    redirect('/admin/content?error=' + encodeURIComponent(error.message))
  }

  // Log admin action
  await supabase.from('admin_audit_log').insert({
    admin_id: user!.id,
    action: `Deleted forum post ID: ${id}`,
    target_table: 'forum_posts',
    target_id: id,
  })

  revalidatePath('/admin/content')
  redirect('/admin/content?success=post-deleted')
}

