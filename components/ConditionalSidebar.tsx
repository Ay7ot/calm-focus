'use client'

import { usePathname } from 'next/navigation'
import { MobileSidebarProvider } from './MobileSidebar'

export default function ConditionalSidebar() {
  const pathname = usePathname()
  
  // Don't show sidebar on auth pages
  const authPages = ['/login', '/signup']
  const isAuthPage = authPages.includes(pathname)

  if (isAuthPage) {
    return null
  }

  return <MobileSidebarProvider>{null}</MobileSidebarProvider>
}

