import CartDrawer from '@/layouts/CartDrawer'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { useInterfaceStore } from '@/stores/useInterfaceStore'

const HUDLayer: React.FC = () => {
  const { isCartHUDOpen, toggleCartHUD } = useInterfaceStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleCartHUD(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const cartSectionClassName = cn(
    'self-end pointer-events-auto transition-all duration-600 ease-bounce',
    {
      'translate-y-0 opacity-100': isCartHUDOpen,
      'translate-y-4/5 md:translate-y-3/4 opacity-100 hover:translate-y-3/5 md:hover:translate-y-2/3':
        !isCartHUDOpen
    }
  )

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCartHUDOpen && e.target === e.currentTarget) {
      e.preventDefault()
      toggleCartHUD(false)
    }
  }

  return (
    <div
      className={
        'fixed inset-0 z-50 pointer-events-none grid transition-all duration-300'
      }
      onClick={handleOutsideClick}
    >
      <section className={cartSectionClassName}>
        <CartDrawer />
      </section>
    </div>
  )
}

export default HUDLayer
