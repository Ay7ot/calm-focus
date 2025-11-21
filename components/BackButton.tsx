'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-on-surface-secondary hover:text-on-surface transition-colors text-sm font-medium"
    >
      <ArrowLeft size={18} />
      <span>Back</span>
    </button>
  )
}

