'use client'

import { useEffect } from 'react'
import { useTimerStore } from '@/stores/timerStore'
import Timer from '@/components/timer/Timer'

interface FocusPageClientProps {
    defaultFocusDuration: number
    defaultBreakDuration: number
}

export default function FocusPageClient({
    defaultFocusDuration,
    defaultBreakDuration
}: FocusPageClientProps) {
    const setUserPreferences = useTimerStore((state) => state.setUserPreferences)

    useEffect(() => {
        // Load user preferences into timer store
        setUserPreferences({
            defaultFocusDuration: defaultFocusDuration || 25,
            defaultBreakDuration: defaultBreakDuration || 5,
        })
    }, [defaultFocusDuration, defaultBreakDuration, setUserPreferences])

    return <Timer />
}

