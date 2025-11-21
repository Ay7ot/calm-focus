'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Award } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import UserMenu from '@/components/UserMenu'
import { MobileMenuButton } from '@/components/MobileSidebar'
import MilestonesClient from './MilestonesClient'

interface Milestone {
    id: number
    title: string
    description: string
    session_threshold: number
    badge_icon: string
    badge_color: string
    is_active: boolean
}

export default function MilestonesPage() {
    const router = useRouter()
    const [milestones, setMilestones] = useState<Milestone[]>([])
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const supabase = createClient()

        // Check auth
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)

            // Get profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('username, role')
                .eq('id', user.id)
                .single()

            if (profileData?.role !== 'admin') {
                router.push('/dashboard')
                return
            }

            setProfile(profileData)
        }

        // Fetch milestones
        const fetchMilestones = async () => {
            const { data, error } = await supabase
                .from('milestones')
                .select('*')
                .order('session_threshold', { ascending: true })

            if (error) {
                console.error('Error fetching milestones:', error)
            } else {
                setMilestones(data || [])
            }
            setLoading(false)
        }

        checkAuth()
        fetchMilestones()

        // Subscribe to real-time updates
        const channel = supabase
            .channel('milestones-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'milestones',
                },
                (payload) => {
                    console.log('Milestone change:', payload)
                    fetchMilestones() // Refetch on any change
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <header className="h-16 border-b border-border bg-surface-elevated sticky top-0 z-20">
                    <div className="h-full  mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-4">
                        <MobileMenuButton />
                        <div className="min-w-0 flex-1">
                            <h1 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                                <Award size={20} className="text-primary" />
                                Milestones
                            </h1>
                        </div>
                    </div>
                </header>
                <div className=" mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="h-20 bg-backplate rounded-lg mb-4"></div>
                                <div className="h-4 bg-backplate rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-backplate rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="h-16 border-b border-border bg-surface-elevated sticky top-0 z-20">
                <div className="h-full  mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-4">
                    <MobileMenuButton />
                    <div className="min-w-0 flex-1">
                        <h1 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                            <Award size={20} className="text-primary" />
                            Milestones
                        </h1>
                        <p className="text-on-surface-secondary text-xs hidden sm:block">
                            Manage achievement milestones • {milestones.length} total
                        </p>
                    </div>
                    <UserMenu email={user?.email} username={profile?.username} />
                </div>
            </header>

            <div className=" mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
                <MilestonesClient milestones={milestones} />
            </div>
        </div>
    )
}
