'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Edit2, Trash2, Clock } from 'lucide-react'

interface PostActionsProps {
  postId: number
  createdAt: string
  isAuthor: boolean
  isAdmin: boolean
  onEdit: () => void
  onDelete: () => void
}

export default function PostActions({
  postId,
  createdAt,
  isAuthor,
  isAdmin,
  onEdit,
  onDelete,
}: PostActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Calculate if within 1-hour edit window
  const postTime = new Date(createdAt).getTime()
  const now = Date.now()
  const hourInMs = 60 * 60 * 1000
  const timeSincePost = now - postTime
  const canEdit = timeSincePost < hourInMs
  const timeRemaining = Math.max(0, hourInMs - timeSincePost)
  const minutesRemaining = Math.floor(timeRemaining / (60 * 1000))

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Don't show menu if user is neither author nor admin
  if (!isAuthor && !isAdmin) {
    return null
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-backplate text-neutral-medium hover:text-on-surface transition-colors cursor-pointer"
        aria-label="Post actions"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-surface-elevated border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-dropdown">
          {/* Only show edit option if user is the author (not admin) */}
          {isAuthor && canEdit && (
            <>
              <button
                onClick={() => {
                  onEdit()
                  setIsOpen(false)
                }}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-backplate transition-colors cursor-pointer"
              >
                <Edit2 size={16} className="text-primary" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-on-surface">Edit Post</div>
                  <div className="text-xs text-on-surface-secondary flex items-center gap-1 mt-0.5">
                    <Clock size={12} />
                    {minutesRemaining}m left to edit
                  </div>
                </div>
              </button>
              <div className="h-px bg-border"></div>
            </>
          )}

          {isAuthor && !canEdit && (
            <>
              <div className="px-4 py-3 text-xs text-on-surface-secondary">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={12} />
                  <span className="font-medium">Edit window expired</span>
                </div>
                <span>Posts can only be edited within 1 hour of creation</span>
              </div>
              <div className="h-px bg-border"></div>
            </>
          )}

          {/* Show admin notice if admin is viewing but not author */}
          {isAdmin && !isAuthor && (
            <>
              <div className="px-4 py-3 text-xs text-on-surface-secondary">
                <span className="font-medium">Admin View</span>
                <br />
                <span>Admins can only delete posts, not edit them</span>
              </div>
              <div className="h-px bg-border"></div>
            </>
          )}

          <button
            onClick={() => {
              onDelete()
              setIsOpen(false)
            }}
            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-error/10 transition-colors cursor-pointer group"
          >
            <Trash2 size={16} className="text-error" />
            <div>
              <div className="text-sm font-medium text-error">Delete Post</div>
              <div className="text-xs text-on-surface-secondary group-hover:text-error/80 mt-0.5">
                This will delete all comments & reactions
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

