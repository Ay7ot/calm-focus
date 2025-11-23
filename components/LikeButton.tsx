'use client'

import { Heart } from 'lucide-react'
import { useState, useTransition } from 'react'
import { togglePostLike } from '@/app/forum/likeActions'

interface LikeButtonProps {
    postId: number
    initialLikeCount: number
    initialIsLiked: boolean
}

export default function LikeButton({ postId, initialLikeCount, initialIsLiked }: LikeButtonProps) {
    const [likeCount, setLikeCount] = useState(initialLikeCount)
    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [isPending, startTransition] = useTransition()

    const handleLike = (e: React.MouseEvent) => {
        // Prevent the click from bubbling up to the Link wrapper
        e.preventDefault()
        e.stopPropagation()

        // Optimistic update
        setIsLiked(!isLiked)
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)

        startTransition(async () => {
            const result = await togglePostLike(postId)

            if (result.error) {
                // Revert on error
                setIsLiked(isLiked)
                setLikeCount(initialLikeCount)
            } else if (result.likeCount !== undefined) {
                // Update with server response
                setLikeCount(result.likeCount)
                setIsLiked(result.isLiked || false)
            }
        })
    }

    return (
        <button
            onClick={handleLike}
            disabled={isPending}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${isLiked
                    ? 'bg-error/10 text-error hover:bg-error/20'
                    : 'text-on-surface-secondary hover:bg-backplate hover:text-error'
                } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <Heart
                size={16}
                className={`transition-all ${isLiked ? 'fill-current' : ''}`}
            />
            <span className="text-sm font-medium">{likeCount}</span>
        </button>
    )
}

