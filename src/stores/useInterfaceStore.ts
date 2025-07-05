import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface InterfaceState {
  // Viewport states
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean
  setViewPort: () => void

  // Cart states
  cartHudElement: HTMLDivElement | null
  setCartHudElement: (element: HTMLDivElement | null) => void
  isCartHUDOpen: boolean
  toggleCartHUD: (isOpen: boolean) => void

  // Loading state
  isAppLoading: boolean
  loadingMessage: string
  loadingStartTime: number | null
  setAppLoading: (isLoading: boolean, message?: string) => void
}

// Minimum time to show loading splash (in milliseconds)
const MIN_LOADING_TIME = 2000

// Create store with persistence
export const useInterfaceStore = create<InterfaceState>()(
  persist(
    (set, get) => ({
      // Viewport states - recalculated on load
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      isLargeDesktop: false,
      setViewPort: () => {
        if (typeof window === 'undefined') return

        set({
          isMobile: window.innerWidth < 768,
          isTablet: window.innerWidth < 1024 && window.innerWidth >= 768,
          isDesktop: window.innerWidth >= 1024,
          isLargeDesktop: window.innerWidth >= 1280
        })
      },

      // Cart states
      cartHudElement: null, // DOM element ref - not persisted
      setCartHudElement: (element: HTMLDivElement | null) => {
        set({ cartHudElement: element })
      },
      isCartHUDOpen: false, // Only this is persisted
      toggleCartHUD: (isOpen: boolean) => {
        set({ isCartHUDOpen: isOpen })
      },

      // Loading state - not persisted
      isAppLoading: false,
      loadingMessage: '',
      loadingStartTime: null,
      setAppLoading: (isLoading: boolean, message = 'Loading...') => {
        const state = get()

        if (isLoading) {
          // Start loading
          set({
            isAppLoading: true,
            loadingMessage: message,
            loadingStartTime: Date.now()
          })
        } else {
          // Only stop loading if minimum time has passed
          const startTime = state.loadingStartTime
          if (!startTime) {
            set({
              isAppLoading: false,
              loadingMessage: '',
              loadingStartTime: null
            })
            return
          }

          const elapsedTime = Date.now() - startTime
          if (elapsedTime >= MIN_LOADING_TIME) {
            // Enough time has passed, stop immediately
            set({
              isAppLoading: false,
              loadingMessage: '',
              loadingStartTime: null
            })
          } else {
            // Wait for remaining time
            const remainingTime = MIN_LOADING_TIME - elapsedTime
            setTimeout(() => {
              set({
                isAppLoading: false,
                loadingMessage: '',
                loadingStartTime: null
              })
            }, remainingTime)
          }
        }
      }
    }),
    {
      name: 'interface-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist cart open state
        isCartHUDOpen: state.isCartHUDOpen
      })
    }
  )
)

// Initialise viewport tracking once per application load
if (typeof window !== 'undefined') {
  // Prevent multiple listeners if the module is re-evaluated for any reason
  let listenerAttached = (window as any)
    .__interfaceStoreViewportListenerAttached__

  if (!listenerAttached) {
    const updateViewportSize = () => {
      // use getState to access the store outside of a React component
      useInterfaceStore.getState().setViewPort()
    }

    // Run once on initial load
    updateViewportSize()

    // Listen for resize events
    window.addEventListener('resize', updateViewportSize)

    // Flag so we don't attach multiple listeners
    ;(window as any).__interfaceStoreViewportListenerAttached__ = true
  }
}
