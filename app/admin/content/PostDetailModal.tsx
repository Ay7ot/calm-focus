'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, MessageSquare, Heart, Calendar, User, Ban, Eye } from 'lucide-react'
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
    profiles: {
        username: string | null
    } | null
}

interface PostDetailModalProps {
    postId: number
    onClose: () => void
    onPostDeleted: () => void
    onCommentDeleted: () => void
}

export default function PostDetailModal({ postId, onClose, onPostDeleted, onCommentDeleted }: PostDetailModalProps) {
    const [post, setPost] = useState<any>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingComment, setDeletingComment] = useState<Comment | null>(null)
    const [deletingPost, setDeletingPost] = useState(false)
    const [banningUser, setBanningUser] = useState<{ id: string; username: string } | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null)

    useEffect(() => {
        fetchPostDetails()
    }, [postId])

    const fetchPostDetails = async () => {
        const supabase = createClient()

        // Fetch post
        const { data: postData, error: postError } = await supabase
            .from('forum_posts')
            .select(`
        *,
        profiles:user_id (username, id),
        post_reactions (count)
      `)
            .eq('id', postId)
            .single()

        if (postError) {
            console.error('Error fetching post:', postError)
        } else {
            setPost(postData)
        }

        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
            .from('forum_comments')
            .select('*, profiles:user_id (username)')
            .eq('post_id', postId)
            .order('created_at', { ascending: true })

        if (commentsError) {
            console.error('Error fetching comments:', commentsError)
        } else {
            setComments(commentsData || [])
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
            await fetchPostDetails()
            onCommentDeleted()
        }
    }

    const handleDeletePost = async () => {
        setIsSubmitting(true)
        const supabase = createClient()

        const { error } = await supabase
            .from('forum_posts')
            .delete()
            .eq('id', postId)

        setIsSubmitting(false)

        if (error) {
            setToast({ message: 'Failed to delete post', variant: 'error' })
        } else {
            setToast({ message: 'Post deleted successfully', variant: 'success' })
            onPostDeleted()
            onClose()
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

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                        <MessageSquare size={24} className="text-primary" />
                        Post Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-backplate rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="p-6 space-y-6 animate-pulse">
                        {/* Post Header Skeleton */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-20 bg-neutral-medium/20 rounded"></div>
                                <div className="h-4 w-24 bg-neutral-medium/20 rounded"></div>
                                <div className="h-4 w-16 bg-neutral-medium/20 rounded"></div>
                            </div>
                            <div className="h-8 bg-neutral-medium/20 rounded w-3/4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-neutral-medium/20 rounded w-full"></div>
                                <div className="h-4 bg-neutral-medium/20 rounded w-full"></div>
                                <div className="h-4 bg-neutral-medium/20 rounded w-2/3"></div>
                            </div>
                        </div>

                        {/* Stats Skeleton */}
                        <div className="flex items-center gap-4">
                            <div className="h-4 w-24 bg-neutral-medium/20 rounded"></div>
                            <div className="h-4 w-32 bg-neutral-medium/20 rounded"></div>
                        </div>

                        {/* Actions Skeleton */}
                        <div className="flex items-center gap-2 pt-4 border-t border-border">
                            <div className="h-10 w-32 bg-neutral-medium/20 rounded"></div>
                            <div className="h-10 w-32 bg-neutral-medium/20 rounded"></div>
                        </div>

                        {/* Comments Skeleton */}
                        <div className="space-y-4">
                            <div className="h-6 bg-neutral-medium/20 rounded w-1/4"></div>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-4 bg-backplate rounded-lg border border-border">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-neutral-medium/20 rounded w-1/3"></div>
                                            <div className="h-4 bg-neutral-medium/20 rounded w-full"></div>
                                            <div className="h-4 bg-neutral-medium/20 rounded w-5/6"></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-8 w-8 bg-neutral-medium/20 rounded"></div>
                                            <div className="h-8 w-8 bg-neutral-medium/20 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : post ? (
                    <div className="p-6 space-y-6">
                        {/* Post Content */}
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                                            {post.category}
                                        </span>
                                        <span className="text-xs text-on-surface-secondary">
                                            by {post.profiles?.username || 'Anonymous'}
                                        </span>
                                        <span className="text-xs text-on-surface-secondary">
                                            • {formatRelativeTime(post.created_at)}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-on-surface mb-2">{post.title}</h3>
                                    <p className="text-on-surface-secondary whitespace-pre-wrap">{post.content}</p>
                                </div>
                            </div>

                            {/* Post Stats */}
                            <div className="flex items-center gap-4 text-sm text-on-surface-secondary">
                                <div className="flex items-center gap-1">
                                    <Heart size={16} />
                                    <span>{post.post_reactions?.[0]?.count || 0} likes</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageSquare size={16} />
                                    <span>{comments.length} comments</span>
                                </div>
                            </div>

                            {/* Post Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t border-border">
                                <Link
                                    href={`/forum/${post.id}`}
                                    target="_blank"
                                    className="btn btn-ghost flex items-center gap-2"
                                >
                                    <Eye size={16} />
                                    View in Forum
                                </Link>
                                <button
                                    onClick={() => setBanningUser({ id: post.user_id, username: post.profiles?.username || 'User' })}
                                    className="btn btn-ghost text-warning flex items-center gap-2"
                                >
                                    <Ban size={16} />
                                    Ban Author
                                </button>
                                <button
                                    onClick={() => setDeletingPost(true)}
                                    className="btn btn-ghost text-error flex items-center gap-2 ml-auto"
                                >
                                    <Trash2 size={16} />
                                    Delete Post
                                </button>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-on-surface flex items-center gap-2">
                                <MessageSquare size={20} className="text-secondary" />
                                Comments ({comments.length})
                            </h4>

                            {comments.length === 0 ? (
                                <p className="text-center py-8 text-on-surface-secondary">No comments yet</p>
                            ) : (
                                <div className="space-y-3">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="p-4 bg-backplate rounded-lg border border-border">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <User size={14} className="text-on-surface-secondary" />
                                                        <span className="text-sm font-medium text-on-surface">
                                                            {comment.profiles?.username || 'Anonymous'}
                                                        </span>
                                                        <span className="text-xs text-on-surface-secondary">
                                                            • {formatRelativeTime(comment.created_at)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-on-surface-secondary whitespace-pre-wrap">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setBanningUser({ id: comment.user_id, username: comment.profiles?.username || 'User' })}
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
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center text-on-surface-secondary">Post not found</div>
                )}
            </div>

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

            {/* Delete Post Modal */}
            {deletingPost && (
                <ConfirmModal
                    isOpen={deletingPost}
                    onClose={() => setDeletingPost(false)}
                    onConfirm={handleDeletePost}
                    title="Delete Post?"
                    message="Are you sure you want to delete this post? This will also delete all comments and reactions."
                    confirmText="Delete Post"
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
                                // Optionally refresh post details to show updated author status
                                await fetchPostDetails()
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

