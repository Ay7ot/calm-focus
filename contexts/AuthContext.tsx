'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Profile {
    id: string
    username: string | null
    role: 'user' | 'admin'
}

interface AuthContextType {
    user: User | null
    profile: Profile | null
    isAdmin: boolean
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    isAdmin: false,
    loading: true,
})

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                // Fetch profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('id, username, role')
                    .eq('id', user.id)
                    .single()

                setProfile(profileData)
            }

            setLoading(false)
        }

        getInitialSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null)

            if (session?.user) {
                // Fetch profile on auth change
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('id, username, role')
                    .eq('id', session.user.id)
                    .single()

                setProfile(profileData)
            } else {
                setProfile(null)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    // Separate effect for profile real-time subscription
    useEffect(() => {
        if (!user?.id) return

        // Subscribe to profile changes (for real-time role updates)
        const profileSubscription = supabase
            .channel(`profile-changes-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`,
                },
                async (payload) => {
                    // Refetch profile when it changes
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('id, username, role')
                        .eq('id', user.id)
                        .single()

                    setProfile(profileData)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(profileSubscription)
        }
    }, [user?.id])

    const isAdmin = profile?.role === 'admin'

    return (
        <AuthContext.Provider value={{ user, profile, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

