import React, { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Button from './Buttons/Button'
import Icon from './Icon'
import { cn } from '@/lib/utils'

export interface SlideDrawerProps {
  /**
   * Content to render inside the drawer. If a render function is provided it will receive a `close` helper that can be used to programmatically close the drawer.
   */
  children: ReactNode | ((close: () => void) => ReactNode)
  /**
   * An optional custom trigger element. By default a hamburger icon button is rendered.
   */
  trigger?: ReactNode
  /**
   * Which side the drawer should appear from.
   * @default 'right'
   */
  side?: 'left' | 'right'
  /**
   * Tailwind width utility for the drawer panel.
   * @default 'w-64'
   */
  widthClassName?: string
}

const SlideDrawer: React.FC<SlideDrawerProps> = ({
  children,
  trigger,
  side = 'right',
  widthClassName = 'w-64'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  const close = (): void => setIsOpen(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Decide translation classes based on side
  const translateClass =
    side === 'right' ? 'translate-x-full' : '-translate-x-full'
  const alignmentClass = side === 'right' ? 'right-0' : 'left-0'

  // Compute class names outside JSX for clarity
  const overlayClasses = cn(
    // Base overlay styling
    'fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300',
    {
      // Visible when drawer is open
      'opacity-100': isOpen,
      // Hidden & non-interactive when closed
      'opacity-0 pointer-events-none': !isOpen
    }
  )

  const panelClasses = cn(
    // Base panel styling
    'fixed top-0 h-full bg-base-900 z-50 transform transition-transform duration-300 ease-in-out',
    // Dynamic width provided via prop
    widthClassName,
    // Align left or right based on side
    alignmentClass,
    {
      // Slide into view when open
      'translate-x-0': isOpen,
      // Slide out based on chosen side when closed
      [translateClass]: !isOpen
    }
  )

  return (
    <div className="lg:hidden">
      {/* Trigger */}
      {trigger ?? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <Icon icon="menu" />
        </Button>
      )}

      {/* Overlay */}
      <div className={overlayClasses} onClick={close} />

      {/* Drawer Panel */}
      <div ref={drawerRef} className={panelClasses}>
        <div className="p-4 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={close}
            aria-label="Close menu"
          >
            <Icon icon="x" />
          </Button>
        </div>

        {/* Drawer Content */}
        <div className="p-4">
          {typeof children === 'function' ? children(close) : children}
        </div>
      </div>
    </div>
  )
}

export default SlideDrawer
