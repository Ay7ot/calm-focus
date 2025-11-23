'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useState, useTransition, useEffect } from 'react'

export default function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')

    // Update search value when URL changes
    useEffect(() => {
        setSearchValue(searchParams.get('search') || '')
    }, [searchParams])

    const handleSearch = (value: string) => {
        setSearchValue(value)

        // Debounce the URL update
        const params = new URLSearchParams(searchParams.toString())

        if (value.trim()) {
            params.set('search', value)
        } else {
            params.delete('search')
        }

        startTransition(() => {
            router.push(`/forum?${params.toString()}`)
        })
    }

    const clearSearch = () => {
        setSearchValue('')
        const params = new URLSearchParams(searchParams.toString())
        params.delete('search')

        startTransition(() => {
            router.push(`/forum?${params.toString()}`)
        })
    }

    return (
        <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-medium pointer-events-none" />
            <input
                type="text"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search discussions..."
                className="w-full h-12 pl-12 pr-12 rounded-lg border border-border bg-surface-elevated text-on-surface placeholder:text-neutral-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isPending && (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                )}
                {searchValue && (
                    <button
                        onClick={clearSearch}
                        className="p-1 rounded-lg hover:bg-backplate text-neutral-medium hover:text-on-surface transition-colors cursor-pointer"
                        aria-label="Clear search"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
    )
}

