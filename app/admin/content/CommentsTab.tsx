'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Trash2, Ban, Eye, Filter, Search, Calendar, User } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import ConfirmModal from '@/components/ConfirmModal'
import BanUserModal from '@/components/BanUserModal'
import Toast from '@/components/Toast'
import Link from 'next/link'
import { banUser } from '@/app/admin/users/actions'

interface Comment {
    id: number
    content: string
    created_at: string
    user_id: string
    post_id: number
    profiles: {
        username: string | null
        id: string
    } | null
    forum_posts: {
        title: string
        id: number
    } | null
}

export default function CommentsTab() {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterUser, setFilterUser] = useState('')
    const [deletingComment, setDeletingComment] = useState<Comment | null>(null)
    const [banningUser, setBanningUser] = useState<{ id: string; username: string } | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null)

    useEffect(() => {
        fetchComments()
    }, [])

    const fetchComments = async () => {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('forum_comments')
            .select(`
        *,
        profiles:user_id (username, id),
        forum_posts:post_id (title, id)
      `)
            .order('created_at', { ascending: false })
            .limit(100)

        if (error) {
            console.error('Error fetching comments:', error)
        } else {
            setComments(data || [])
        }

        setLoading(false)
    }

    const handleDeleteComment = async () => {
        if (!deletingComment) return

        setIsSubmitting(true)
        const supabase = createClient()

        const { error } = await supabase
            .from('forum_comments')
            .delete()
            .eq('id', deletingComment.id)

        setIsSubmitting(false)
        setDeletingComment(null)

        if (error) {
            setToast({ message: 'Failed to delete comment', variant: 'error' })
        } else {
            setToast({ message: 'Comment deleted successfully', variant: 'success' })
            await fetchComments()
        }
    }

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return 'Just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
        return date.toLocaleDateString()
    }

    // Filter comments
    const filteredComments = comments.filter(comment => {
        const matchesSearch = searchQuery === '' ||
            comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.forum_posts?.title?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesUser = filterUser === '' ||
            comment.profiles?.username?.toLowerCase().includes(filterUser.toLowerCase())

        return matchesSearch && matchesUser
    })

    if (loading) {
        return (
            <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-secondary" />
                    <input
                        type="text"
                        placeholder="Search comments, users, or posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-backplate text-on-surface placeholder:text-neutral-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                </div>
                <div className="relative sm:w-64">
                    <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-secondary" />
                    <input
                        type="text"
                        placeholder="Filter by user..."
                        value={filterUser}
                        onChange={(e) => setFilterUser(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-backplate text-on-surface placeholder:text-neutral-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2 text-sm text-on-surface-secondary">
                <MessageSquare size={16} />
                <span>Showing {filteredComments.length} of {comments.length} comments</span>
            </div>

            {/* Comments List */}
            {filteredComments.length === 0 ? (
                <div className="text-center py-12 card">
                    <MessageSquare size={48} className="mx-auto text-neutral-medium mb-4 opacity-50" />
                    <p className="text-on-surface-secondary">
                        {searchQuery || filterUser ? 'No comments found matching your filters' : 'No comments yet'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredComments.map((comment) => (
                        <div key={comment.id} className="card hover:border-primary/30 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    {/* Comment Meta */}
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className="inline-flex items-center gap-1 text-sm font-medium text-on-surface">
                                            <User size={14} />
                                            {comment.profiles?.username || 'Anonymous'}
                                        </span>
                                        <span className="text-xs text-on-surface-secondary">
                                            • {formatRelativeTime(comment.created_at)}
                                        </span>
                                        {comment.forum_posts && (
                                            <>
                                                <span className="text-xs text-on-surface-secondary">on</span>
                                                <Link
                                                    href={`/forum/${comment.forum_posts.id}`}
                                                    target="_blank"
                                                    className="text-xs text-primary hover:underline truncate max-w-xs"
                                                >
                                                    {comment.forum_posts.title}
                                                </Link>
                                            </>
                                        )}
                                    </div>

                                    {/* Comment Content */}
                                    <p className="text-sm text-on-surface-secondary whitespace-pre-wrap line-clamp-3">
                                        {comment.content}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-0">
                                    {comment.forum_posts && (
                                        <Link
                                            href={`/forum/${comment.forum_posts.id}`}
                                            target="_blank"
                                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                            title="View post"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => setBanningUser({
                                            id: comment.user_id,
                                            username: comment.profiles?.username || 'User'
                                        })}
                                        className="p-2 text-warning hover:bg-warning/10 rounded-lg transition-colors"
                                        title="Ban user"
                                    >
                                        <Ban size={16} />
                                    </button>
                                    <button
                                        onClick={() => setDeletingComment(comment)}
                                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                                        title="Delete comment"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Comment Modal */}
            {deletingComment && (
                <ConfirmModal
                    isOpen={!!deletingComment}
                    onClose={() => setDeletingComment(null)}
                    onConfirm={handleDeleteComment}
                    title="Delete Comment?"
                    message={`Are you sure you want to delete this comment by ${deletingComment.profiles?.username || 'Anonymous'}?`}
                    confirmText="Delete"
                    variant="danger"
                    isLoading={isSubmitting}
                />
            )}

            {/* Ban User Modal */}
            {banningUser && (
                <BanUserModal
                    isOpen={!!banningUser}
                    username={banningUser.username}
                    onClose={() => {
                        if (!isSubmitting) {
                            setBanningUser(null)
                        }
                    }}
                    onConfirm={async (reason, duration) => {
                        setIsSubmitting(true)
                        try {
                            const result = await banUser(banningUser.id, reason, duration)
                            if (result?.success) {
                                setToast({ message: 'User banned successfully', variant: 'success' })
                                setBanningUser(null)
                                // Optionally refresh comments
                                await fetchComments()
                            } else {
                                setToast({ message: result?.error || 'Failed to ban user', variant: 'error' })
                            }
                        } catch (error) {
                            console.error('Error banning user:', error)
                            setToast({ message: 'An unexpected error occurred', variant: 'error' })
                        } finally {
                            setIsSubmitting(false)
                        }
                    }}
                    isLoading={isSubmitting}
                />
            )}

            {/* Toast */}
            <Toast
                isOpen={toast !== null}
                message={toast?.message || ''}
                variant={toast?.variant || 'success'}
                onClose={() => setToast(null)}
            />
        </div>
    )
}

