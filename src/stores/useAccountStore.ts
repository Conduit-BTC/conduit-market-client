import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getNdk } from '@/services/ndkService'
import { NDKNip07Signer, NDKUser } from '@nostr-dev-kit/ndk'

interface AccountState {
  user: NDKUser | null
  isLoggedIn: boolean
  error: unknown | null
  logout: () => Promise<void>
  login: () => Promise<void>
  fetchUser: () => Promise<void>
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      error: null,

      // Fetch user data from NDK
      fetchUser: async () => {
        try {
          if (!get().isLoggedIn) return

          const ndk = await getNdk()
          const user = await ndk.signer?.user()

          if (user) {
            set({ user })
          } else {
            // If can't get user, reset login state
            ndk.signer = new NDKNip07Signer()
            set({ isLoggedIn: false })
          }
        } catch (error) {
          console.error('Error fetching user:', error)
          set({ error })
        }
      },

      logout: async () => {
        try {
          set({ user: null, isLoggedIn: false })
          window.location.reload()
        } catch (error) {
          console.error('Error during logout:', error)
          window.location.reload()
        }
      },

      login: async () => {
        try {
          const ndk = await getNdk()
          const user = await ndk.signer?.user()

          if (user) {
            set({ user, isLoggedIn: true })
          } else {
            throw new Error('Failed to get user from signer')
          }
        } catch (error) {
          console.error('Error during login:', error)
          set({ error })
        }
      }
    }),
    {
      name: 'nostr-merchant-auth', // name of the item in storage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist the login state, not the complex NDKUser object
        isLoggedIn: state.isLoggedIn
      })
    }
  )
)
