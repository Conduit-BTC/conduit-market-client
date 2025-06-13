import { create } from 'zustand'

interface InterfaceState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean
  setViewPort: () => void

  cartHudElement: HTMLDivElement | null
  setCartHudElement: (element: HTMLDivElement | null) => void
  isCartHUDOpen: boolean
  toggleCartHUD: (isOpen: boolean) => void
}

export const useInterfaceStore = create<InterfaceState>()((set) => ({
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

  //  cart hud
  cartHudElement: null,
  setCartHudElement: (element: HTMLDivElement | null) => {
    set({ cartHudElement: element })
  },
  isCartHUDOpen: false,
  toggleCartHUD: (isOpen: boolean) => {
    set({ isCartHUDOpen: isOpen })
  }
}))

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
