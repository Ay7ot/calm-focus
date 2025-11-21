'use client'

import { usePathname } from 'next/navigation'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Don't add margin on auth pages
  const authPages = ['/login', '/signup']
  const isAuthPage = authPages.includes(pathname)

  if (isAuthPage) {
    return <main className="min-h-screen">{children}</main>
  }

  // On mobile: no margin, On desktop: margin for sidebar
  return <main className="min-h-screen lg:ml-64">{children}</main>
}

