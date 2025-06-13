import CartDrawer from '@/layouts/CartDrawer'
import PageSection from './PageSection'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useInterfaceStore } from '@/stores/useInterfaceStore'

/*  #todo
// -  there should be a way to individually control each Hud element but also a way to control all of them at once. */
// - draging on the cart drawer ends up scrolling the page in the background

const HUDLayer: React.FC = () => {
  const { isCartHUDOpen, toggleCartHUD } = useInterfaceStore()
  const [isHealthBarOpen, setIsHealthBarOpen] = useState(false)

  const [anyHudOpen, setAnyHudOpen] = useState(false)

  // Update anyHudOpen whenever any HUD element state changes
  useEffect(() => {
    setAnyHudOpen(isCartHUDOpen || isHealthBarOpen)
  }, [isCartHUDOpen, isHealthBarOpen])

  // #fixme,
  const hideAllHud = () => {
    toggleCartHUD(false)
    setIsHealthBarOpen(false)
  }

  //   conditional classes

  // hud layer container
  const hudLayerContainerClassName = cn(
    'fixed inset-0 z-50 pointer-events-none grid transition-all duration-300',
    {
      'bg-paper/40 md:bg-transparent': anyHudOpen
    }
  )

  const cartSectionClassName = cn(
    'self-end pointer-events-auto transition-all duration-600 ease-bounce',
    {
      'translate-y-0 opacity-100': isCartHUDOpen,
      'translate-y-8/10  opacity-50 hover:translate-y-7/10': !isCartHUDOpen
    }
  )

  const healthBarClassName = cn(
    'fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-all duration-500',
    {
      'opacity-100 scale-100': isHealthBarOpen,
      'opacity-0 scale-95 pointer-events-none': !isHealthBarOpen
    }
  )

  const handleHudLayerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    //  if (anyHudOpen) {
    //    e.stopPropagation()
    //    hideAllHud()
    //  }
  }

  return (
    <div className={hudLayerContainerClassName} onClick={handleHudLayerClick}>
      <PageSection>
        <div
          className={healthBarClassName}
          style={{ minWidth: 240, maxWidth: 400 }}
        >
          <div className="bg-primary-900/90 border border-primary-700 rounded-full px-6 py-3 shadow-lg flex items-center gap-4">
            <span className="voice-base font-bold text-accent-400">Health</span>
            <div className="flex-1 h-4 bg-primary-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: '80%' }}
              />
            </div>
            <span className="voice-base font-mono text-green-400">80%</span>
          </div>
        </div>
      </PageSection>
      <PageSection sectionClassName={cartSectionClassName}>
        <CartDrawer />
      </PageSection>
    </div>
  )
}

export default HUDLayer
