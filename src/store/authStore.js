import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    user: null,
    profile: null,
    loading: true,

    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    setLoading: (loading) => set({ loading }),
    reset: () => set({ user: null, profile: null, loading: false }),

    // Getters de rol
    get isAdmin() { return this.profile?.role === 'admin' },
    get isTrainer() { return this.profile?.role === 'trainer' },
    get isUser() { return this.profile?.role === 'user' },
}))