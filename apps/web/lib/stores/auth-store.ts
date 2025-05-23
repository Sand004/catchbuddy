import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Auth methods
  signInWithEmail: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  
  // Session management
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  // Basic setters
  setUser: (user) => set({ user, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Email/Password sign in
  signInWithEmail: async (email, password) => {
    const supabase = createClient()
    set({ loading: true, error: null })
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      set({ user: data.user, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Google OAuth
  signInWithGoogle: async () => {
    const supabase = createClient()
    set({ loading: true, error: null })
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Apple OAuth
  signInWithApple: async () => {
    const supabase = createClient()
    set({ loading: true, error: null })
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Sign up
  signUp: async (email, password, fullName) => {
    const supabase = createClient()
    set({ loading: true, error: null })
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      
      if (error) throw error
      set({ user: data.user, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Sign out
  signOut: async () => {
    const supabase = createClient()
    set({ loading: true, error: null })
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Reset password
  resetPassword: async (email) => {
    const supabase = createClient()
    set({ loading: true, error: null })
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      
      if (error) throw error
      set({ loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Initialize auth state
  initializeAuth: async () => {
    const supabase = createClient()
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ user: session?.user || null, loading: false })
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          set({ user: session?.user || null })
        }
      )
      
      // Store subscription for cleanup if needed
      return () => subscription.unsubscribe()
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))
