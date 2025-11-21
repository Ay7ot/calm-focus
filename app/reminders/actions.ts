'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createReminder(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  const title = formData.get('title') as string
  const message = formData.get('message') as string
  const isGlobal = formData.get('isGlobal') === 'on'
  const date = formData.get('date') as string // YYYY-MM-DDTHH:mm

  await supabase.from('reminders').insert({
    created_by: user.id,
    title,
    message,
    is_global: isGlobal,
    remind_at: new Date(date).toISOString()
  })

  revalidatePath('/reminders')
}

export async function deleteReminder(id: number) {
  const supabase = await createClient()
  await supabase.from('reminders').delete().eq('id', id)
  revalidatePath('/reminders')
}

