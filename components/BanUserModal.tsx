'use client'

import { useState } from 'react'
import { X, Ban } from 'lucide-react'

interface BanUserModalProps {
  isOpen: boolean
  username: string
  onClose: () => void
  onConfirm: (reason: string, duration: 'permanent' | '7days' | '30days') => void
  isLoading?: boolean
}

export default function BanUserModal({ isOpen, username, onClose, onConfirm, isLoading }: BanUserModalProps) {
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState<'permanent' | '7days' | '30days'>('permanent')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (reason.trim()) {
      onConfirm(reason.trim(), duration)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
              <Ban size={20} className="text-error" />
            </div>
            <h2 className="text-xl font-bold text-on-surface">Ban User</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-backplate rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-on-surface-secondary">
            You are about to ban <span className="font-semibold text-on-surface">{username}</span>.
            They will lose access to the app immediately.
          </p>

          {/* Reason Input */}
          <div>
            <label htmlFor="ban-reason" className="block text-sm font-semibold text-on-surface mb-2">
              Reason for ban *
            </label>
            <textarea
              id="ban-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={3}
              placeholder="e.g., Violation of community guidelines, spam, harassment..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-backplate text-on-surface placeholder:text-neutral-medium focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent transition-all resize-y"
              disabled={isLoading}
            />
            <p className="text-xs text-on-surface-secondary mt-1">
              The user will see this reason when they try to log in.
            </p>
          </div>

          {/* Duration Select */}
          <div>
            <label htmlFor="ban-duration" className="block text-sm font-semibold text-on-surface mb-2">
              Ban Duration
            </label>
            <select
              id="ban-duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value as 'permanent' | '7days' | '30days')}
              className="w-full h-10 px-3 rounded-lg border border-border bg-backplate text-on-surface focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent transition-all"
              disabled={isLoading}
            >
              <option value="permanent">Permanent</option>
              <option value="7days">7 Days</option>
              <option value="30days">30 Days</option>
            </select>
            <p className="text-xs text-on-surface-secondary mt-1">
              {duration === 'permanent' 
                ? 'User will remain banned until manually unbanned by an admin'
                : duration === '7days'
                ? 'User will be automatically unbanned after 7 days'
                : 'User will be automatically unbanned after 30 days'
              }
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={isLoading || !reason.trim()}
              className="btn btn-primary bg-error hover:bg-error/90 flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Banning...
                </>
              ) : (
                <>
                  <Ban size={18} />
                  Ban User
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-ghost disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

