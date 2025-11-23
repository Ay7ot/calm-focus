'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import PostActions from '@/components/PostActions'
import EditPostModal from '@/components/EditPostModal'
import ConfirmModal from '@/components/ConfirmModal'
import Toast from '@/components/Toast'
import { updatePost, deletePost } from './actions'

interface PostDetailClientProps {
    postId: number
    title: string
    content: string
    category: string
    createdAt: string
    isAuthor: boolean
    isAdmin: boolean
}

export default function PostDetailClient({
    postId,
    title,
    content,
    category,
    createdAt,
    isAuthor,
    isAdmin,
}: PostDetailClientProps) {
    const router = useRouter()
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    const handleEditSuccess = () => {
        router.refresh() // Refresh the page to show updated data
    }

    const handleDelete = async () => {
        startTransition(async () => {
            const result = await deletePost(postId)

            if (result?.error) {
                setToast({ message: result.error, type: 'error' })
                setShowDeleteModal(false)
            } else {
                // Redirect immediately to avoid 404
                router.push('/forum')
                // Show toast after redirect starts
                setToast({ message: 'Post deleted successfully', type: 'success' })
            }
        })
    }

    return (
        <>
            <PostActions
                postId={postId}
                createdAt={createdAt}
                isAuthor={isAuthor}
                isAdmin={isAdmin}
                onEdit={() => setShowEditModal(true)}
                onDelete={() => setShowDeleteModal(true)}
            />

            <EditPostModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                postId={postId}
                initialTitle={title}
                initialContent={content}
                initialCategory={category}
                onUpdate={updatePost}
                onSuccess={handleEditSuccess}
            />

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Post?"
                message="Are you sure you want to delete this post? This will also delete all comments and reactions. This action cannot be undone."
                confirmText="Delete Post"
                variant="danger"
                isLoading={isPending}
            />

            {toast && (
                <Toast
                    isOpen={toast !== null}
                    message={toast.message}
                    variant={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    )
}

