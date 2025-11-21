'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

export default function ConditionalSidebar() {
  const pathname = usePathname()
  
  // Don't show sidebar on auth pages
  const authPages = ['/login', '/signup']
  const isAuthPage = authPages.includes(pathname)

  if (isAuthPage) {
    return null
  }

  // Desktop sidebar (mobile is handled by MobileSidebarProvider)
  return (
    <div className="hidden lg:block">
      <Sidebar />
    </div>
  )
}

