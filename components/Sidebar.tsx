'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Brain, MessageSquare, Bell, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface SidebarProps {
  onNavigate?: () => void
}

export default function Sidebar({ onNavigate }: SidebarProps = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAdmin, loading } = useAuth()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname?.startsWith(path)
  }

  // No longer needed – logout handled by /logout route

  const handleNavClick = () => {
    onNavigate?.()
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/focus', label: 'Focus Timer', icon: Brain },
    { href: '/forum', label: 'Community', icon: MessageSquare },
    { href: '/reminders', label: 'Reminders', icon: Bell },
  ]

  if (!loading && isAdmin) {
    navItems.push({ href: '/admin', label: 'Admin', icon: ShieldCheck })
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-elevated border-r border-border flex flex-col">

      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <Brain size={20} className="text-on-primary" />
        </div>
        <span className="text-lg font-bold text-on-surface">
          Calm Focus
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${isActive(item.href)
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-secondary hover:bg-backplate hover:text-on-surface'
                }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          )
        })}

        {loading && (
          <div className="px-3 py-2.5">
            <div className="h-5 bg-backplate rounded animate-pulse w-24"></div>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <Link
          href="/logout"
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-secondary hover:bg-backplate hover:text-on-surface transition-all"
          onClick={onNavigate}
        >
          <LogOut size={20} />
          Logout
        </Link>
      </div>
    </aside>
  )
}
