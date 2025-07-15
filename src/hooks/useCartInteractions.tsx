import { useState, useEffect, useRef, useCallback } from 'react'
import { useCartStore } from '@/stores/useCartStore'
import type { Cart } from '@/stores/useCartStore'
import { useInterfaceStore } from '@/stores/useInterfaceStore'

// #region Utility Functions
// These are kept outside the hook to avoid being redefined on every render.

/**
 * Sets up a timer that automatically opens the HUD after a period of
 * user inactivity. The timer is reset on any user-interaction events supplied.
 *
 * Returns an object containing a `reset` function – useful if other logic
 * (e.g. scrolling) also needs to restart the inactivity timer – and a
 * `cleanup` function to remove listeners and clear timers.
 */

const INACTIVITY_DELAY = 4000
const USE_SHOW_ON_INACTIVITY_DELAY = false // Disable auto-show to prevent unexpected behavior
const USE_HIDE_ON_SCROLL = true
const USE_TOUCH_DRAG = true

const ShowOnInactivity = (
  isHUDOpen: boolean,
  toggleCartHUD: (isOpen: boolean) => void,
  inactivityDelay: number = INACTIVITY_DELAY
) => {
  if (!USE_SHOW_ON_INACTIVITY_DELAY) {
    return {
      reset: () => {},
      cleanup: () => {}
    } as { reset: () => void; cleanup: () => void }
  }

  let inactivityTimeout: NodeJS.Timeout

  const reset = () => {
    clearTimeout(inactivityTimeout)
    inactivityTimeout = setTimeout(() => {
      if (!isHUDOpen) {
        toggleCartHUD(true)
      }
    }, inactivityDelay)
  }

  const handleUserActivity = () => {
    reset()
  }

  // Events that count as user activity
  const activityEvents: (keyof WindowEventMap)[] = [
    'mousemove',
    'keydown',
    'touchstart'
  ]

  activityEvents.forEach((event) =>
    window.addEventListener(event, handleUserActivity)
  )

  // Kick-start the timer on mount
  reset()

  // Provide a cleanup method so callers can remove listeners
  const cleanup = () => {
    activityEvents.forEach((event) =>
      window.removeEventListener(event, handleUserActivity)
    )
    clearTimeout(inactivityTimeout)
  }

  return { reset, cleanup }
}

/**
 * Hides the HUD while the user scrolls and, optionally, resets any provided
 * inactivity timer when scrolling occurs.
 */
const HideOnScroll = (
  isHUDOpen: boolean,
  toggleCartHUD: (isOpen: boolean) => void,
  resetInactivityTimer?: () => void
) => {
  if (!USE_HIDE_ON_SCROLL) {
    return {
      cleanup: () => {}
    } as { cleanup: () => void }
  }

  let scrollTimeout: NodeJS.Timeout

  const handleScroll = () => {
    if (isHUDOpen) {
      toggleCartHUD(false)
    }

    // Debounce pattern should we need scroll-stop logic later
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {}, 1000)

    // If an inactivity timer reset function was supplied, call it
    if (resetInactivityTimer) {
      resetInactivityTimer()
    }
  }

  window.addEventListener('scroll', handleScroll)

  const cleanup = () => {
    window.removeEventListener('scroll', handleScroll)
    clearTimeout(scrollTimeout)
  }

  return { cleanup }
}
// #endregion

interface UseCartInteractionsOptions {
  dragCloseThreshold?: number
  dragOpenThreshold?: number
  swipeThreshold?: number
  displayDragFactor?: number
  inactivityDelay?: number
}

export const useCartInteractions = ({
  dragCloseThreshold = 80,
  dragOpenThreshold = 80,
  swipeThreshold = 60,
  displayDragFactor = 0.35,
  inactivityDelay = INACTIVITY_DELAY
}: UseCartInteractionsOptions = {}) => {
  const elementRef = useRef<HTMLDivElement>(null)

  const { isMobile, isCartHUDOpen, toggleCartHUD } = useInterfaceStore()
  const { carts, selectedHUDCart, setSelectedHUDCart } = useCartStore()

  // State used for touch-drag interaction
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [swipeDeltaX, setSwipeDeltaX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [verticalDeltaY, setVerticalDeltaY] = useState(0)
  const [draggingMode, setDraggingMode] = useState<
    'vertical' | 'horizontal' | null
  >(null)

  const onOpen = () => toggleCartHUD(true)
  const onClose = () => toggleCartHUD(false)

  const onSwipeLeft = useCallback(() => {
    const currentIndex = carts.findIndex(
      (c) => c.merchantPubkey === selectedHUDCart?.merchantPubkey
    )
    const nextIndex = currentIndex + 1
    if (nextIndex < carts.length) {
      setSelectedHUDCart(carts[nextIndex] as Cart)
    }
  }, [carts, selectedHUDCart, setSelectedHUDCart])

  const onSwipeRight = useCallback(() => {
    const currentIndex = carts.findIndex(
      (c) => c.merchantPubkey === selectedHUDCart?.merchantPubkey
    )
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      setSelectedHUDCart(carts[prevIndex] as Cart)
    }
  }, [carts, selectedHUDCart, setSelectedHUDCart])

  /**
   * Handle the start of a touch gesture. We only track gestures on mobile.
   */
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!isMobile) return
      setTouchStartY(e.touches[0].clientY)
      setTouchStartX(e.touches[0].clientX)
      setSwipeDeltaX(0)
      setDraggingMode(null)
    },
    [isMobile]
  )

  /**
   * Handle touch movement. The drawer is translated downwards according to the
   * drag distance. We distinguish between vertical and horizontal gestures to
   * allow both pull-to-close / open and swipe-to-switch-cart behaviours.
   */
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isMobile || touchStartY === null) return
      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY
      const deltaX = currentX - (touchStartX ?? 0)
      const deltaY = currentY - touchStartY

      // Apply a dampened translation so the drawer follows the finger slightly
      setTranslateX(deltaX * displayDragFactor)
      setTranslateY(deltaY * displayDragFactor)

      // Decide gesture orientation if we haven't yet
      if (!draggingMode) {
        if (Math.abs(deltaY) > 10 || Math.abs(deltaX) > 10) {
          setDraggingMode(
            Math.abs(deltaY) > Math.abs(deltaX) ? 'vertical' : 'horizontal'
          )
        }
      }

      // Still track deltas for threshold logic
      if (draggingMode === 'vertical') {
        setVerticalDeltaY(deltaY)
      } else if (draggingMode === 'horizontal') {
        setSwipeDeltaX(deltaX)
      }

      // Prevent page/carousel scroll while dragging the HUD
      e.preventDefault()
      e.stopPropagation()
    },
    [isMobile, touchStartY, touchStartX, draggingMode, displayDragFactor]
  )

  /**
   * When the touch ends, decide whether to close the HUD based on the drag
   * distance. If the threshold is not reached, the drawer smoothly snaps back
   * to its resting position.
   */
  const handleTouchEnd = useCallback(() => {
    if (!isMobile) return
    // Vertical gesture handling
    if (draggingMode === 'vertical') {
      if (isCartHUDOpen) {
        // Closing logic
        if (translateY > dragCloseThreshold) {
          onClose()
        }
      } else {
        // Opening logic: upward drag (deltaY negative)
        if (verticalDeltaY < -dragOpenThreshold) {
          onOpen()
        }
      }

      // Reset translation regardless – either we closed/opened or we snap back
      setTranslateX(0)
      setTranslateY(0)
      setVerticalDeltaY(0)
    } else if (draggingMode === 'horizontal') {
      if (swipeDeltaX > swipeThreshold && onSwipeRight) {
        onSwipeRight()
      } else if (swipeDeltaX < -swipeThreshold && onSwipeLeft) {
        onSwipeLeft()
      }

      // Reset horizontal translation and vertical for safety
      setTranslateX(0)
      setTranslateY(0)
    }

    // Reset gesture tracking variables
    setTouchStartX(null)
    setTouchStartY(null)
    setSwipeDeltaX(0)
    setTranslateX(0)
    setTranslateY(0)
    setVerticalDeltaY(0)
    setDraggingMode(null)
  }, [
    isMobile,
    draggingMode,
    isCartHUDOpen,
    translateY,
    dragCloseThreshold,
    onClose,
    verticalDeltaY,
    dragOpenThreshold,
    onOpen,
    swipeDeltaX,
    swipeThreshold,
    onSwipeRight,
    onSwipeLeft
  ])

  // Attach/detach touch event listeners
  useEffect(() => {
    if (!USE_TOUCH_DRAG) return
    const element = elementRef.current
    if (!element || !isMobile) return

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isMobile, handleTouchStart, handleTouchMove, handleTouchEnd])

  // Desktop: Inactivity and Scroll listeners
  useEffect(() => {
    if (isMobile) return

    const { reset, cleanup: cleanupInactivity } = ShowOnInactivity(
      isCartHUDOpen,
      toggleCartHUD,
      inactivityDelay
    )

    const { cleanup: cleanupScroll } = HideOnScroll(
      isCartHUDOpen,
      toggleCartHUD,
      reset
    )

    return () => {
      cleanupInactivity()
      cleanupScroll()
    }
  }, [isCartHUDOpen, toggleCartHUD, inactivityDelay])

  // Reset touch-drag state if HUD is closed programmatically
  useEffect(() => {
    if (isCartHUDOpen === false) {
      setTranslateY(0)
      setTouchStartY(null)
      setTouchStartX(null)
      setSwipeDeltaX(0)
      setTranslateX(0)
      setVerticalDeltaY(0)
      setDraggingMode(null)
    }
  }, [isCartHUDOpen])

  // Apply styles directly to the element for touch-drag
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    if (isMobile) {
      element.style.touchAction = 'none'
    } else {
      element.style.touchAction = ''
    }

    element.style.setProperty('--translateX', `${translateX}px`)
    element.style.setProperty('--translateY', `${translateY}px`)
  }, [isMobile, translateX, translateY])

  return {
    ref: elementRef
  }
}
