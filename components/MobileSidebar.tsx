'use client'

import { Menu, X } from 'lucide-react'
import { useState, createContext, useContext } from 'react'
import Sidebar from './Sidebar'

interface MobileSidebarContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const MobileSidebarContext = createContext<MobileSidebarContextType>({
  isOpen: false,
  setIsOpen: () => {},
})

export function useMobileSidebar() {
  return useContext(MobileSidebarContext)
}

export function MobileSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <MobileSidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
      
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-on-surface cursor-pointer"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            
            <Sidebar onNavigate={() => setIsOpen(false)} />
          </div>
        </>
      )}

      {/* Desktop Sidebar - Always visible */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
    </MobileSidebarContext.Provider>
  )
}

export function MobileMenuButton() {
  const { setIsOpen } = useMobileSidebar()

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="lg:hidden w-10 h-10 rounded-lg hover:bg-backplate flex items-center justify-center text-on-surface cursor-pointer transition-colors"
      aria-label="Open menu"
    >
      <Menu size={20} />
    </button>
  )
}

