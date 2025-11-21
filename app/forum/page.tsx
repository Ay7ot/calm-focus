import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { MessageSquare, Plus, Search, Users } from 'lucide-react'
import UserMenu from '@/components/UserMenu'
import EmptyState from '@/components/EmptyState'
import SkeletonLoader from '@/components/SkeletonLoader'
import { MobileMenuButton } from '@/components/MobileSidebar'
import { Suspense } from 'react'

async function ForumPosts() {
  const supabase = await createClient()
  const { data: posts, error } = await supabase
    .from('forum_posts')
    .select('*, profiles(username, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error || !posts || posts.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No discussions yet"
        description="Be the first to start a conversation and share your thoughts with the community."
        action={
          <Link href="/forum/new" className="btn btn-primary">
            <Plus size={18} />
            Start the conversation
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/forum/${post.id}`}
          className="block card hover:border-primary transition-all hover:shadow-sm group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="badge badge-neutral capitalize text-xs">
                  {post.category}
                </span>
                <span className="text-xs text-on-surface-secondary">
                  {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-on-surface group-hover:text-primary transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-on-surface-secondary line-clamp-2 text-sm leading-relaxed">
                {post.content}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-border">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
              {post.profiles?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="text-sm font-medium text-on-surface-secondary">
              {post.profiles?.username || 'Anonymous'}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default async function ForumPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="h-16 border-b border-border bg-surface-elevated sticky top-0 z-20">
        <div className="h-full  mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-4">
          <MobileMenuButton />
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-on-surface">Community</h1>
            <p className="text-on-surface-secondary text-xs hidden sm:block">Connect, share, and support each other</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/forum/new" className="btn btn-primary text-sm px-3 py-2 sm:px-4">
              <Plus size={18} className="sm:hidden" />
              <span className="hidden sm:inline">New Discussion</span>
            </Link>
            <UserMenu email={user.email} username={profile?.username} />
          </div>
        </div>
      </header>

      <div className=" mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Stats Card */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Users size={20} className="text-primary" />
                <h3 className="font-semibold text-on-surface">Community Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface-secondary">Members</span>
                  <span className="font-semibold text-on-surface">2,847</span>
                </div>
                <div className="h-px bg-border"></div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface-secondary">Discussions</span>
                  <span className="font-semibold text-on-surface">3,429</span>
                </div>
                <div className="h-px bg-border"></div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface-secondary">Active Today</span>
                  <span className="font-semibold text-primary">247</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="card">
              <h3 className="font-semibold text-on-surface mb-4">Categories</h3>
              <div className="space-y-2">
                {['general', 'strategies', 'wins', 'venting'].map((cat) => (
                  <button
                    key={cat}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-on-surface-secondary hover:bg-backplate hover:text-on-surface transition-colors capitalize"
                  >
                    {cat === 'general' ? 'General Chat' : cat === 'strategies' ? 'Strategies & Tips' : cat === 'wins' ? 'Small Wins' : 'Safe Space'}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">

            {/* Search Bar */}
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-medium" />
              <input
                type="text"
                placeholder="Search discussions..."
                className="input w-full pl-12"
              />
            </div>

            {/* Posts List */}
            <Suspense fallback={<SkeletonLoader type="list" />}>
              <ForumPosts />
            </Suspense>

          </div>

        </div>
      </div>
    </div>
  )
}
