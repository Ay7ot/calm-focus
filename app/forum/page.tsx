import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { MessageSquare, Plus, Users } from 'lucide-react'
import UserMenu from '@/components/UserMenu'
import EmptyState from '@/components/EmptyState'
import SkeletonLoader from '@/components/SkeletonLoader'
import { MobileMenuButton } from '@/components/MobileSidebar'
import SearchBar from '@/components/SearchBar'
import LikeButton from '@/components/LikeButton'
import { Suspense } from 'react'

async function ForumPosts({ category, search }: { category?: string; search?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch posts with optional category and search filters
  let query = supabase
    .from('forum_posts')
    .select('*, profiles(username, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(20)

  // Apply category filter if provided
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  // Apply search filter if provided
  if (search && search.trim()) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
  }

  const { data: posts, error } = await query

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

  const postIds = posts.map(p => p.id)

  // Fetch comment counts for all posts
  const { data: commentCounts } = await supabase
    .from('forum_comments')
    .select('post_id')
    .in('post_id', postIds)

  // Create a map of post_id to comment count
  const countsMap = commentCounts?.reduce((acc: Record<number, number>, curr) => {
    acc[curr.post_id] = (acc[curr.post_id] || 0) + 1
    return acc
  }, {}) || {}

  // Fetch like counts for all posts
  const { data: likeCounts } = await supabase
    .from('post_reactions')
    .select('post_id')
    .in('post_id', postIds)

  const likesMap = likeCounts?.reduce((acc: Record<number, number>, curr) => {
    acc[curr.post_id] = (acc[curr.post_id] || 0) + 1
    return acc
  }, {}) || {}

  // Fetch user's likes
  const { data: userLikes } = user ? await supabase
    .from('post_reactions')
    .select('post_id')
    .eq('user_id', user.id)
    .in('post_id', postIds) : { data: null }

  const userLikesSet = new Set(userLikes?.map(l => l.post_id) || [])

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

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                {post.profiles?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="text-sm font-medium text-on-surface-secondary">
                {post.profiles?.username || 'Anonymous'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LikeButton
                postId={post.id}
                initialLikeCount={likesMap[post.id] || 0}
                initialIsLiked={userLikesSet.has(post.id)}
              />
              <div className="flex items-center gap-1 text-on-surface-secondary px-3 py-1.5">
                <MessageSquare size={16} />
                <span className="text-sm font-medium">{countsMap[post.id] || 0}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const { category, search } = await searchParams
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

  // Fetch community stats
  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0)).toISOString()

  const [
    { count: totalMembers },
    { count: totalDiscussions },
    { data: postsToday },
    { data: commentsToday },
    { data: reactionsToday }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('forum_posts').select('*', { count: 'exact', head: true }),
    supabase.from('forum_posts').select('user_id').gte('created_at', startOfToday),
    supabase.from('forum_comments').select('user_id').gte('created_at', startOfToday),
    supabase.from('post_reactions').select('user_id').gte('created_at', startOfToday)
  ])

  // Count unique users who were active today (posted, commented, or reacted)
  const activeUserIds = new Set([
    ...(postsToday?.map(p => p.user_id) || []),
    ...(commentsToday?.map(c => c.user_id) || []),
    ...(reactionsToday?.map(r => r.user_id) || [])
  ])
  const activeToday = activeUserIds.size

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

          {/* Sidebar - Hidden on mobile, visible on desktop */}
          <aside className="space-y-6 hidden xl:block">

            {/* Stats Card */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Users size={20} className="text-primary" />
                <h3 className="font-semibold text-on-surface">Community Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface-secondary">Members</span>
                  <span className="font-semibold text-on-surface">{totalMembers?.toLocaleString() || 0}</span>
                </div>
                <div className="h-px bg-border"></div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface-secondary">Discussions</span>
                  <span className="font-semibold text-on-surface">{totalDiscussions?.toLocaleString() || 0}</span>
                </div>
                <div className="h-px bg-border"></div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface-secondary">Active Today</span>
                  <span className="font-semibold text-primary">{activeToday?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>

            {/* Categories - Desktop vertical list */}
            <div className="card">
              <h3 className="font-semibold text-on-surface mb-4">Categories</h3>
              <div className="space-y-2">
                <Link
                  href="/forum"
                  className={`w-full block text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${!category || category === 'all'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-on-surface-secondary hover:bg-backplate hover:text-on-surface'
                    }`}
                >
                  All Discussions
                </Link>
                {['general', 'strategies', 'wins', 'venting'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/forum?category=${cat}`}
                    className={`w-full block text-left px-3 py-2 rounded-lg text-sm transition-colors capitalize cursor-pointer ${category === cat
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-on-surface-secondary hover:bg-backplate hover:text-on-surface'
                      }`}
                  >
                    {cat === 'general' ? 'General Chat' : cat === 'strategies' ? 'Strategies & Tips' : cat === 'wins' ? 'Small Wins' : 'Safe Space'}
                  </Link>
                ))}
              </div>
            </div>

          </aside>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">

            {/* Mobile Categories - Horizontal scrollable */}
            <div className="xl:hidden overflow-x-auto -mx-4 px-4">
              <div className="flex gap-2 pb-2 min-w-max">
                <Link
                  href="/forum"
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${!category || category === 'all'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-elevated border border-border text-on-surface-secondary hover:border-primary'
                    }`}
                >
                  All
                </Link>
                {['general', 'strategies', 'wins', 'venting'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/forum?category=${cat}`}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize cursor-pointer whitespace-nowrap ${category === cat
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-elevated border border-border text-on-surface-secondary hover:border-primary'
                      }`}
                  >
                    {cat === 'general' ? '💬 General' : cat === 'strategies' ? '💡 Strategies' : cat === 'wins' ? '🎉 Wins' : '💭 Safe Space'}
                  </Link>
                ))}
              </div>
            </div>

            {/* Create Post CTA - Compact on mobile, full on desktop */}
            <Link
              href="/forum/new"
              className="block card bg-linear-to-br from-primary/5 via-surface-elevated to-accent/5 border-2 border-dashed border-primary/30 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/30 transition-colors">
                  <Plus size={20} className="text-primary sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-on-surface mb-0 sm:mb-1 group-hover:text-primary transition-colors">
                    Start a New Discussion
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-secondary hidden sm:block">
                    Share your thoughts, ask questions, or celebrate your wins with the community
                  </p>
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <SearchBar />

            {/* Active Filters */}
            {(category || search) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-on-surface-secondary">Active filters:</span>
                {category && (
                  <Link
                    href={search ? `/forum?search=${search}` : '/forum'}
                    className="badge badge-neutral text-xs capitalize flex items-center gap-1 cursor-pointer hover:bg-error/10 hover:text-error transition-colors"
                  >
                    {category}
                    <span>×</span>
                  </Link>
                )}
                {search && (
                  <Link
                    href={category ? `/forum?category=${category}` : '/forum'}
                    className="badge badge-neutral text-xs flex items-center gap-1 cursor-pointer hover:bg-error/10 hover:text-error transition-colors"
                  >
                    "{search}"
                    <span>x</span>
                  </Link>
                )}
                <Link
                  href="/forum"
                  className="text-xs text-primary hover:underline cursor-pointer"
                >
                  Clear all
                </Link>
              </div>
            )}

            {/* Posts List */}
            <Suspense fallback={<SkeletonLoader type="list" />}>
              <ForumPosts category={category} search={search} />
            </Suspense>

          </div>

        </div>
      </div>
    </div>
  )
}
