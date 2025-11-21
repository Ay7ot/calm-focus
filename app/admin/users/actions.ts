'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { requireAdmin } from '@/utils/admin'

export async function toggleUserRole(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userId = formData.get('userId') as string
  const currentRole = formData.get('currentRole') as string
  const newRole = currentRole === 'admin' ? 'user' : 'admin'

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user role:', error)
    redirect('/admin/users?error=' + encodeURIComponent(error.message))
  }

  // Log admin action
  await supabase.from('admin_audit_log').insert({
    admin_id: user!.id,
    action: `Changed user role to ${newRole}`,
    target_table: 'profiles',
    target_id: userId,
  })

  revalidatePath('/admin/users')
  redirect('/admin/users?success=role-updated')
}

export async function banUser(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userId = formData.get('userId') as string

  const { error } = await supabase
    .from('profiles')
    .update({ is_banned: true })
    .eq('id', userId)

  if (error) {
    console.error('Error banning user:', error)
    redirect('/admin/users?error=' + encodeURIComponent(error.message))
  }

  // Log admin action
  await supabase.from('admin_audit_log').insert({
    admin_id: user!.id,
    action: `Banned user`,
    target_table: 'profiles',
    target_id: userId,
  })

  revalidatePath('/admin/users')
  redirect('/admin/users?success=user-banned')
}

export async function unbanUser(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userId = formData.get('userId') as string

  const { error } = await supabase
    .from('profiles')
    .update({ is_banned: false })
    .eq('id', userId)

  if (error) {
    console.error('Error unbanning user:', error)
    redirect('/admin/users?error=' + encodeURIComponent(error.message))
  }

  // Log admin action
  await supabase.from('admin_audit_log').insert({
    admin_id: user!.id,
    action: `Unbanned user`,
    target_table: 'profiles',
    target_id: userId,
  })

  revalidatePath('/admin/users')
  redirect('/admin/users?success=user-unbanned')
}

