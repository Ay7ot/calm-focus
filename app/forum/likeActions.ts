'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function togglePostLike(postId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if user already liked this post
  const { data: existingLike } = await supabase
    .from('post_reactions')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  if (existingLike) {
    // Unlike: Delete the reaction
    const { error } = await supabase
      .from('post_reactions')
      .delete()
      .eq('id', existingLike.id)

    if (error) {
      console.error('Error removing like:', error)
      return { error: error.message }
    }
  } else {
    // Like: Insert new reaction
    const { error } = await supabase
      .from('post_reactions')
      .insert({
        user_id: user.id,
        post_id: postId,
        reaction_type: 'like'
      })

    if (error) {
      console.error('Error adding like:', error)
      return { error: error.message }
    }
  }

  // Get updated like count
  const { count } = await supabase
    .from('post_reactions')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)

  revalidatePath('/forum')
  revalidatePath(`/forum/${postId}`)

  return { success: true, likeCount: count || 0, isLiked: !existingLike }
}


