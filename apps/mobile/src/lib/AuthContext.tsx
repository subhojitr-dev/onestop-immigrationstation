import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { registerForPushNotifications, unregisterPushToken } from './notifications'

type UserRole = 'beneficiary' | 'sponsor' | 'contact' | 'admin' | 'lawyer'

interface Profile {
  id: string
  full_name: string
  role: UserRole
  phone?: string
  avatar_url?: string
}

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, role, phone, avatar_url')
      .eq('id', userId)
      .single()
    if (data) setProfile(data as Profile)
  }

  async function refreshProfile() {
    if (session?.user) await fetchProfile(session.user.id)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchProfile(session.user.id)
        // Register push token silently in background
        registerForPushNotifications(session.user.id).catch(() => {})
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (session?.user) {
        fetchProfile(session.user.id)
        // Register on new sign-in
        if (event === 'SIGNED_IN') {
          registerForPushNotifications(session.user.id).catch(() => {})
        }
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    // Remove push token before signing out
    if (session?.user) {
      await unregisterPushToken(session.user.id)
    }
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
