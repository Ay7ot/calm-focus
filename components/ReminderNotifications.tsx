'use client'

import { useEffect, useState } from 'react'
import { X, Clock } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

interface Reminder {
    id: number
    title: string
    message: string | null
    remind_at: string
    is_global: boolean
}

export default function ReminderNotifications({ userId }: { userId: string }) {
    const [dueReminders, setDueReminders] = useState<Reminder[]>([])
    const [dismissed, setDismissed] = useState<Set<number>>(new Set())

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return

        const checkReminders = async () => {
            const supabase = createClient()
            const now = new Date().toISOString()

            // Get reminders that are due (past remind_at time but within last 24 hours)
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

            const { data: reminders } = await supabase
                .from('reminders')
                .select('*')
                .or(`is_global.eq.true,created_by.eq.${userId}`)
                .lte('remind_at', now)
                .gte('remind_at', oneDayAgo)
                .order('remind_at', { ascending: false })

            if (reminders && reminders.length > 0) {
                // Load dismissed reminders from localStorage
                const dismissedStr = localStorage.getItem('dismissedReminders')
                const dismissedIds: Set<number> = dismissedStr ? new Set(JSON.parse(dismissedStr)) : new Set()

                // Filter out dismissed reminders
                const activeDue = reminders.filter(r => !dismissedIds.has(r.id))
                setDueReminders(activeDue)
                setDismissed(dismissedIds)
            }
        }

        checkReminders()

        // Check every 10 seconds for new reminders (more responsive)
        const interval = setInterval(checkReminders, 10000)

        return () => clearInterval(interval)
    }, [userId])

    const dismissReminder = (id: number) => {
        const newDismissed = new Set(dismissed)
        newDismissed.add(id)
        setDismissed(newDismissed)
        localStorage.setItem('dismissedReminders', JSON.stringify(Array.from(newDismissed)))
        setDueReminders(dueReminders.filter(r => r.id !== id))
    }

    const dismissAll = () => {
        const allIds = new Set([...dismissed, ...dueReminders.map(r => r.id)])
        setDismissed(allIds)
        localStorage.setItem('dismissedReminders', JSON.stringify(Array.from(allIds)))
        setDueReminders([])
    }

    // Don't render anything if no due reminders
    if (dueReminders.length === 0) {
        return null
    }

    return (
        <>
            {/* Due Reminders Banner */}
            {dueReminders.length > 0 && (
                <div className="card bg-linear-to-r from-warning/10 to-error/10 border-warning/50">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <Clock size={20} className="text-warning" />
                            <h3 className="font-semibold text-on-surface">
                                {dueReminders.length} Reminder{dueReminders.length > 1 ? 's' : ''} Due
                            </h3>
                        </div>
                        <button
                            onClick={dismissAll}
                            className="text-sm text-on-surface-secondary hover:text-on-surface transition-colors"
                        >
                            Dismiss All
                        </button>
                    </div>

                    <div className="space-y-3">
                        {dueReminders.map((reminder) => (
                            <div
                                key={reminder.id}
                                className="flex items-start justify-between gap-3 p-3 bg-surface-elevated rounded-lg border border-border"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        {reminder.is_global && (
                                            <span className="badge badge-neutral text-xs">Global</span>
                                        )}
                                        <h4 className="font-semibold text-on-surface text-sm">
                                            {reminder.title}
                                        </h4>
                                    </div>
                                    {reminder.message && (
                                        <p className="text-xs text-on-surface-secondary">
                                            {reminder.message}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => dismissReminder(reminder.id)}
                                    className="text-on-surface-secondary hover:text-on-surface transition-colors p-1 shrink-0"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/reminders"
                        className="block text-center text-sm text-primary hover:underline mt-3"
                    >
                        View All Reminders →
                    </Link>
                </div>
            )}
        </>
    )
}

