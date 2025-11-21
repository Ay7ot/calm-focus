'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Plus, Trash2, MessageSquare, Lightbulb, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import UserMenu from '@/components/UserMenu'
import { MobileMenuButton } from '@/components/MobileSidebar'
import BackButton from '@/components/BackButton'
import Modal from '@/components/Modal'
import ConfirmModal from '@/components/ConfirmModal'
import Toast from '@/components/Toast'
import { deleteDailyTip, deleteForumPost } from './actions'

interface DailyTip {
  id: number
  title: string
  content: string
  category: string
  is_active: boolean
  created_at: string
}

interface ForumPost {
  id: number
  title: string
  content: string
  category: string
  created_at: string
  user_id: string
  profiles: {
    username: string
  } | null
}

export default function ContentPage() {
  const router = useRouter()
  const [tips, setTips] = useState<DailyTip[]>([])
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isCreateTipOpen, setIsCreateTipOpen] = useState(false)
  const [deletingTip, setDeletingTip] = useState<DailyTip | null>(null)
  const [deletingPost, setDeletingPost] = useState<ForumPost | null>(null)
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' | 'info' | 'warning' } | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, role')
        .eq('id', user.id)
        .single()

      if (profileData?.role !== 'admin') {
        router.push('/dashboard')
        return
      }

      setProfile(profileData)
    }

    const initialFetchData = async () => {
      // Fetch tips
      const { data: tipsData, error: tipsError } = await supabase
        .from('daily_tips')
        .select('*')
        .order('created_at', { ascending: false })

      if (tipsError) {
        console.error('Error fetching tips:', tipsError)
      } else {
        setTips(tipsData || [])
      }

    // Fetch recent posts (may not have proper relationships yet)
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('forum_posts')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false })
        .limit(20)

      if (postsError) {
        // Check if it's a relationship error (PGRST200)
        if (postsError.code === 'PGRST200') {
          console.warn('Forum posts table exists but missing foreign key relationship to profiles')
          // Fetch without the join as fallback
          const { data: postsOnly, error: postsOnlyError } = await supabase
            .from('forum_posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20)
          
          if (!postsOnlyError) {
            setPosts(postsOnly || [])
          } else {
            setPosts([])
          }
        } else {
          console.error('Error fetching posts:', postsError)
          setPosts([])
        }
      } else {
        setPosts(postsData || [])
      }
    } catch (err) {
      console.error('Forum posts error:', err)
      setPosts([])
    }

      setLoading(false)
    }

    checkAuth()
    initialFetchData()

    // Subscribe to tips changes
    const tipsChannel = supabase
      .channel('tips-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_tips',
        },
        () => {
          initialFetchData()
        }
      )
      .subscribe()

    // Subscribe to posts changes
    const postsChannel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_posts',
        },
        () => {
          initialFetchData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(tipsChannel)
      supabase.removeChannel(postsChannel)
    }
  }, [router])

  const fetchData = async () => {
    const supabase = createClient()
    
    // Fetch tips
    const { data: tipsData, error: tipsError } = await supabase
      .from('daily_tips')
      .select('*')
      .order('created_at', { ascending: false })

    if (tipsError) {
      console.error('Error fetching tips:', tipsError)
      console.error('Full tips error details:', JSON.stringify(tipsError, null, 2))
      setTips([])
    } else {
      setTips(tipsData || [])
    }

    // Fetch recent posts
    const { data: postsData, error: postsError } = await supabase
      .from('forum_posts')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })
      .limit(20)

    if (postsError) {
      console.error('Error fetching posts:', postsError)
    } else {
      setPosts(postsData || [])
    }
  }

  const handleCreateTip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const supabase = createClient()
    
    const { error } = await supabase.from('daily_tips').insert({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      is_active: (formData.get('is_active') as string) === 'on',
      created_by: user.id,
    })

    setIsSubmitting(false)
    
    if (error) {
      console.error('Error creating tip:', error)
      console.error('Full error details:', JSON.stringify(error, null, 2))
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Error details:', error.details)
      setToast({ message: `Failed to create tip: ${error.message || 'Unknown error'}`, variant: 'error' })
      setShowToast(true)
    } else {
      setIsCreateTipOpen(false)
      await fetchData() // Immediate refresh
      setToast({ message: 'Tip created successfully', variant: 'success' })
      setShowToast(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="h-16 border-b border-border bg-surface-elevated sticky top-0 z-20">
          <div className="h-full  mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-4">
            <MobileMenuButton />
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                Content Management
              </h1>
            </div>
          </div>
        </header>
        <div className=" mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card">
                <div className="h-6 bg-backplate rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-backplate rounded w-full mb-2"></div>
                <div className="h-4 bg-backplate rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border bg-surface-elevated sticky top-0 z-20">
        <div className="h-full  mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-4">
          <MobileMenuButton />
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              Content Management
            </h1>
            <p className="text-on-surface-secondary text-xs hidden sm:block">
              {tips.length} tips • {posts.length} recent posts
            </p>
          </div>
          <UserMenu email={user?.email} username={profile?.username} />
        </div>
      </header>

      <div className=" mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 space-y-8">
        <BackButton />

        {/* Daily Tips Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-on-surface flex items-center gap-2">
              <Lightbulb size={24} className="text-accent" />
              Daily Tips Library
            </h2>
            <button
              onClick={() => setIsCreateTipOpen(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">New Tip</span>
            </button>
          </div>

          {tips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {tips.map((tip) => (
                <div key={tip.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-on-surface">{tip.title}</h3>
                        {tip.is_active ? (
                          <CheckCircle size={16} className="text-success flex-shrink-0" />
                        ) : (
                          <XCircle size={16} className="text-neutral-medium flex-shrink-0" />
                        )}
                      </div>
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                        {tip.category}
                      </span>
                    </div>
                    <button
                      onClick={() => setDeletingTip(tip)}
                      className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-on-surface-secondary">{tip.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card">
              <Lightbulb size={48} className="mx-auto text-neutral-medium mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-on-surface mb-2">No tips yet</h3>
              <p className="text-on-surface-secondary mb-6">Create your first daily tip!</p>
              <button
                onClick={() => setIsCreateTipOpen(true)}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Create First Tip
              </button>
            </div>
          )}
        </div>

        {/* Forum Moderation Section */}
        <div>
          <h2 className="text-2xl font-bold text-on-surface flex items-center gap-2 mb-6">
            <MessageSquare size={24} className="text-secondary" />
            Forum Moderation
          </h2>

          {posts.length > 0 ? (
            <div className="card divide-y divide-border">
              {posts.map((post) => (
                <div key={post.id} className="p-4 hover:bg-backplate transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-semibold uppercase text-primary bg-primary/10 px-2 py-1 rounded-md">
                          {post.category}
                        </span>
                        <span className="text-xs text-on-surface-secondary">
                          by {post.profiles?.username || 'Anonymous'}
                        </span>
                        <span className="text-xs text-on-surface-secondary">
                          • {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-on-surface mb-1 truncate">
                        {post.title}
                      </h3>
                      <p className="text-sm text-on-surface-secondary line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                    <button
                      onClick={() => setDeletingPost(post)}
                      className="btn btn-ghost text-error hover:bg-error/10 flex items-center gap-2 flex-shrink-0"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card">
              <MessageSquare size={48} className="mx-auto text-neutral-medium mb-4 opacity-50" />
              <p className="text-on-surface-secondary">No forum posts to moderate</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Tip Modal */}
      <Modal isOpen={isCreateTipOpen} onClose={() => setIsCreateTipOpen(false)} title="Create Daily Tip">
        <form onSubmit={handleCreateTip} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-on-surface mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full h-10 px-3 py-2 rounded-lg border border-border bg-backplate text-on-surface placeholder:text-neutral-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="e.g., Focus Tip"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-on-surface mb-2">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              rows={4}
              required
              className="w-full px-3 py-2 rounded-lg border border-border bg-backplate text-on-surface placeholder:text-neutral-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
              placeholder="Write your tip here..."
            ></textarea>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-on-surface mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full h-10 px-3 py-2 rounded-lg border border-border bg-backplate text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
            >
              <option value="focus">Focus</option>
              <option value="wellness">Wellness</option>
              <option value="productivity">Productivity</option>
              <option value="mindfulness">Mindfulness</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              defaultChecked
              className="rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-on-surface">
              Active (show to users)
            </label>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Create Tip
                </>
              )}
            </button>
            <button 
              type="button" 
              onClick={() => setIsCreateTipOpen(false)} 
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Tip Confirmation Modal */}
      {deletingTip && (
        <ConfirmModal
          isOpen={!!deletingTip}
          onClose={() => setDeletingTip(null)}
          onConfirm={async () => {
            setIsSubmitting(true)
            const supabase = createClient()
            const { error } = await supabase
              .from('daily_tips')
              .delete()
              .eq('id', deletingTip.id)
            
            setIsSubmitting(false)
            setDeletingTip(null)
            
            if (error) {
              console.error('Error deleting tip:', error)
              setToast({ message: 'Failed to delete tip', variant: 'error' })
              setShowToast(true)
            } else {
              await fetchData() // Immediate refresh
              setToast({ message: 'Tip deleted successfully', variant: 'success' })
              setShowToast(true)
            }
          }}
          title="Delete Tip?"
          message={`Are you sure you want to delete "${deletingTip.title}"? This action cannot be undone.`}
          confirmText={isSubmitting ? 'Deleting...' : 'Delete'}
          cancelText="Cancel"
          variant="danger"
        />
      )}

      {/* Delete Post Confirmation Modal */}
      {deletingPost && (
        <ConfirmModal
          isOpen={!!deletingPost}
          onClose={() => setDeletingPost(null)}
          onConfirm={async () => {
            setIsSubmitting(true)
            const supabase = createClient()
            const { error } = await supabase
              .from('forum_posts')
              .delete()
              .eq('id', deletingPost.id)
            
            setIsSubmitting(false)
            setDeletingPost(null)
            
            if (error) {
              console.error('Error deleting post:', error)
              setToast({ message: 'Failed to delete post', variant: 'error' })
              setShowToast(true)
            } else {
              await fetchData() // Immediate refresh
              setToast({ message: 'Post deleted successfully', variant: 'success' })
              setShowToast(true)
            }
          }}
          title="Delete Forum Post?"
          message={`Are you sure you want to delete "${deletingPost.title}" by ${deletingPost.profiles?.username || 'Anonymous'}? This action cannot be undone.`}
          confirmText={isSubmitting ? 'Deleting...' : 'Delete Post'}
          cancelText="Cancel"
          variant="danger"
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          isOpen={showToast}
          message={toast.message}
          variant={toast.variant}
          onClose={() => {
            setShowToast(false)
            setToast(null)
          }}
        />
      )}
    </div>
  )
}
