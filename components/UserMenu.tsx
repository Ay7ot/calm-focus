'use client'

import UserAvatar from './UserAvatar'
import { LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserMenuProps {
  email?: string
  username?: string
}

export default function UserMenu({ email, username }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    console.log('Logout clicked')
    try {
      const supabase = createClient()
      console.log('Signing out...')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('SignOut error:', error)
      } else {
        console.log('SignOut successful')
      }
      console.log('Clearing local storage and redirecting...')
      // Clear all Supabase related items from storage
      localStorage.clear()
      sessionStorage.clear()
      setIsOpen(false)
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect anyway
      window.location.href = '/login'
    }
  }

  const displayName = username || email?.split('@')[0] || 'User'

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-backplate transition-colors cursor-pointer"
      >
        <UserAvatar email={email} username={username} size="sm" />
        <div className="text-left hidden lg:block">
          <p className="text-sm font-medium text-on-surface">{displayName}</p>
          {email && <p className="text-xs text-on-surface-secondary">{email}</p>}
        </div>
        <ChevronDown size={16} className={`text-on-surface-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-surface-elevated border border-border rounded-lg shadow-lg z-50">
            <div className="p-3 border-b border-border">
              <p className="text-sm font-medium text-on-surface">{displayName}</p>
              {email && <p className="text-xs text-on-surface-secondary">{email}</p>}
            </div>
            <div className="p-2">
              <Link
                href="/logout"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface-secondary hover:bg-backplate hover:text-on-surface rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Logout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

