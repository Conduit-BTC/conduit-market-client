import { useCartStore } from '@/stores/useCartStore'
import Icon from '@/components/Icon'
import ZapoutButton from '@/components/Buttons/ZapoutButton.tsx'
import { cn, formatPrice } from '@/lib/utils'
import Button from '@/components/Buttons/Button'
import { CartHUDItem } from '@/components/Cards/CartItemCard'
import Carousel from '@/components/Carousel'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs'
import { useEffect } from 'react'
import Avatar from '@/components/Avatar'
import type { Cart } from '@/stores/useCartStore'
import { useInterfaceStore } from '@/stores/useInterfaceStore'
import { useCartInteractions } from '@/hooks/useCartInteractions'
import { useAutoAnimate } from '@formkit/auto-animate/react'

// when touch drag down on the cart drawer, it should close
// #todo place hlder icon is smaller than main image.
//find  a wa yo to fix caroself on phone

const CartDrawer: React.FC = () => {
  // ===========================================================================
  // State & Hooks
  // ===========================================================================
  const { carts, getCartTotal, selectedHUDCart, setSelectedHUDCart } =
    useCartStore()

  const { isCartHUDOpen, toggleCartHUD } = useInterfaceStore()

  const { ref } = useCartInteractions()

  // Keep `selectedHUDCart` in sync with the actual list of carts. If the
  // currently selected cart disappears (or nothing is selected yet), switch to
  // the first available one. When no carts remain, clear the selection so the
  // drawer shows placeholders.
  useEffect(() => {
    if (carts.length === 0) {
      if (selectedHUDCart !== null) {
        setSelectedHUDCart(null as unknown as Cart) // explicit null to clear
      }
      return
    }

    // If nothing is selected yet OR the selected cart no longer exists,
    // default to the first cart in the array.
    const stillExists = selectedHUDCart
      ? carts.some((c) => c.merchantPubkey === selectedHUDCart.merchantPubkey)
      : false

    if (!selectedHUDCart || !stillExists) {
      setSelectedHUDCart(carts[0] as Cart)
    }
  }, [carts, selectedHUDCart, setSelectedHUDCart])

  // ===========================================================================
  // Constants
  // ===========================================================================
  const PLACEHOLDER_IMAGE = 'https://avatar.iran.liara.run/public'

  // ===========================================================================
  // Handlers & Helpers
  // ===========================================================================
  const getItemsWithPlaceholders = (items: any[] = []) => {
    if (items.length >= 5) {
      // If we have 5 or more items, show all of them
      return items
    }
    // If we have less than 5 items, fill with placeholders up to 5
    return Array(5)
      .fill(null)
      .map((_, index) => items[index] || null)
  }

  const handleTabChange = (merchantPubkey: string) => {
    if (!isCartHUDOpen) {
      toggleCartHUD(true)
    }
    const cart = carts.find((cart) => cart.merchantPubkey === merchantPubkey)
    if (cart) {
      setSelectedHUDCart(cart)
    }
  }

  const handleCartClick = () => {
    if (!isCartHUDOpen) {
      toggleCartHUD(true)
    }
  }

  const handleCloseClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation()
    toggleCartHUD(false)
  }

  // ===========================================================================
  // Styles
  // ===========================================================================
  const TabsTriggerClasses = (merchantPubkey: string) =>
    cn(
      'pb-4 pt-2 bg-primary rounded-t-[999px] flex items-center gap-2 transition-all duration-300',
      {
        'rounded-t-lg': selectedHUDCart?.merchantPubkey === merchantPubkey
      }
    )

  const cartDrawerDragWrapperClassName = cn(
    'scale-80 translate-y-[var(--translateY)] translate-x-[var(--translateX)] transition-all duration-200 ease-bounce'
  )

  const cartDrawerClassName = cn(
    'bg-primary grid md:grid-cols-3 justify-between gap-4 from-primary-800 to-primary/80 bg-gradient-to-b rounded-lg px-3 py-2 relative cursor-pointer',
    // Force background if needed
    'bg-primary-600 !bg-opacity-100',
    //  after
    'after:absolute after:inset-[-1px] after:bg-gradient-to-b after:from-ink after:to-transparent after:rounded-lg after:z-[-2]'
  )

  const [animate] = useAutoAnimate()

  const [animateContent] = useAutoAnimate()

  // ===========================================================================
  // Render
  // ===========================================================================
  return (
    <div ref={ref} className={cartDrawerDragWrapperClassName}>
      <div className={cartDrawerClassName} onClick={handleCartClick}>
        {/* Close Button */}
        {isCartHUDOpen && (
          <div className="absolute top-[-30px] right-10 z-1 pb-2 bg-primary rounded-t-full">
            <Button variant="ghost" size="icon" onClick={handleCloseClick}>
              <Icon.XIcon />
            </Button>
          </div>
        )}

        {/* Cart Tabs */}
        <div className="md:col-span-2">
          <Tabs
            defaultValue={selectedHUDCart?.merchantPubkey || 'empty'}
            className="w-full"
            onValueChange={handleTabChange}
            value={selectedHUDCart?.merchantPubkey || 'empty'}
          >
            {carts.length > 0 && (
              <TabsList className="absolute -top-[30px] left-3 z-1">
                {carts.map((cart) => (
                  <TabsTrigger
                    key={cart.merchantPubkey}
                    value={cart.merchantPubkey}
                    className={TabsTriggerClasses(cart.merchantPubkey)}
                  >
                    <div className="flex items-center gap-2" ref={animate}>
                      <Avatar imageUrl={PLACEHOLDER_IMAGE} size="md" />
                      {selectedHUDCart?.merchantPubkey ===
                        cart.merchantPubkey && (
                        <span>{`...${cart.merchantPubkey.slice(-8)}`}</span>
                      )}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            )}
            <div ref={animateContent}>
              {/* Cart Content */}
              {carts.length > 0 ? (
                carts.map((cart) => (
                  <TabsContent
                    key={cart.merchantPubkey}
                    value={cart.merchantPubkey}
                  >
                    <div className="flex items-center gap-4">
                      <Carousel
                        variant="hud"
                        visibleItems={5}
                        visibleItemsMobile={2}
                        indicatorVariant="lines"
                      >
                        {getItemsWithPlaceholders(cart.items).map(
                          (product, index) => (
                            <CartHUDItem
                              product={product}
                              key={product?.productId || `placeholder-${index}`}
                            />
                          )
                        )}
                      </Carousel>

                      {cart.items.length > 5 && (
                        <div
                          className="flex items-center gap-2 bg-muted/60 border border-ink 
          border-dashed aspect-square rounded-full"
                        >
                          <div
                            className="size-20 rounded-full bg-primary-800 grid 
            place-items-center"
                          >
                            <p className="voice-2l">+{cart.items.length - 5}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))
              ) : (
                <TabsContent value="empty">
                  <div className="flex items-center gap-4">
                    <Carousel
                      variant="hud"
                      visibleItems={5}
                      visibleItemsMobile={2}
                      indicatorVariant="lines"
                    >
                      {getItemsWithPlaceholders().map((_, index) => (
                        <CartHUDItem
                          product={null}
                          key={`placeholder-${index}`}
                        />
                      ))}
                    </Carousel>
                  </div>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>

        {/* Cart Summary & Actions */}
        <div className="grid sm:place-content-center sm:grid-cols-2 gap-6">
          {/* Totals */}
          <div className="grid gap-2 items-center content-center text-center">
            <h3 className="voice-base font-bold">Subtotal</h3>
            <p className="voice-3l">
              {formatPrice(getCartTotal(selectedHUDCart?.merchantPubkey || ''))}
            </p>
            <p className="voice-sm text-muted-foreground">
              {formatPrice(
                getCartTotal(selectedHUDCart?.merchantPubkey || ''),
                'USD'
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="grid gap-2 items-center content-center">
            <Button variant="outline" rounded={false} isLink to="/carts">
              <Icon.ShoppingBag />
              View Cart(s)
            </Button>
            <ZapoutButton
              rounded={false}
              merchantPubkey={selectedHUDCart?.merchantPubkey || ''}
            >
              Zap out
            </ZapoutButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartDrawer
