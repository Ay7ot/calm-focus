'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?message=You must be logged in to post')
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const category = formData.get('category') as string

  if (!title || !content || !category) {
    return { error: 'Please fill in all required fields.' }
  }

  const { error } = await supabase.from('forum_posts').insert({
    title,
    content,
    category,
    user_id: user.id
  })

  if (error) {
    console.error('Error creating post:', error)
    return { error: error.message || 'Failed to create post. Please try again.' }
  }

  revalidatePath('/forum')
  return { success: true }
}

