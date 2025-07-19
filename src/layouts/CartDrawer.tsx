import { useCartStore } from '@/stores/useCartStore'
import Icon from '@/components/Icon'
import ZapoutButton from '@/components/Buttons/ZapoutButton.tsx'
import { cn, formatPrice } from '@/lib/utils'
import Button from '@/components/Buttons/Button'
import { CartHUDItem } from '@/components/Cards/CartItemCard'
import Carousel from '@/components/Carousel'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs'
import { useEffect, useMemo, useCallback } from 'react'
import Avatar from '@/components/Avatar'
import type { Cart } from '@/stores/useCartStore'
import { useInterfaceStore } from '@/stores/useInterfaceStore'
import { useCartInteractions } from '@/hooks/useCartInteractions'
import { useAutoAnimate } from '@formkit/auto-animate/react'

const PLACEHOLDER_IMAGE = 'https://avatar.iran.liara.run/public'

const getItemsWithPlaceholders = (items: any[] = []) => {
  if (items.length >= 5) {
    return items
  }
  return Array(5)
    .fill(null)
    .map((_, index) => items[index] || null)
}

const CartDrawer: React.FC = () => {
  const { ref } = useCartInteractions()
  const { isCartHUDOpen, toggleCartHUD } = useInterfaceStore()
  const { carts, getCartTotal, selectedHUDCart, setSelectedHUDCart } =
    useCartStore()

  const [animate] = useAutoAnimate()
  const [animateContent] = useAutoAnimate()

  useEffect(() => {
    if (carts.length === 0) {
      setSelectedHUDCart(null)
    } else if (
      !selectedHUDCart ||
      !carts.some(
        (cart) => cart.merchantPubkey === selectedHUDCart.merchantPubkey
      )
    ) {
      setSelectedHUDCart(carts[0] as Cart)
    }
  }, [carts, selectedHUDCart, setSelectedHUDCart])

  const handleTabChange = useCallback(
    (merchantPubkey: string) => {
      if (!isCartHUDOpen) {
        toggleCartHUD(true)
      }
      const cart = carts.find((cart) => cart.merchantPubkey === merchantPubkey)
      if (cart) {
        setSelectedHUDCart(cart)
      }
    },
    [isCartHUDOpen, toggleCartHUD, carts, setSelectedHUDCart]
  )

  const handleCartClick = useCallback(() => {
    if (!isCartHUDOpen) {
      toggleCartHUD(true)
    }
  }, [isCartHUDOpen, toggleCartHUD])

  const handleCloseClick = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      e?.stopPropagation()
      toggleCartHUD(false)
    },
    [toggleCartHUD]
  )

  const currentCartTotal = useMemo(() => {
    return getCartTotal(selectedHUDCart?.merchantPubkey || '')
  }, [getCartTotal, selectedHUDCart?.merchantPubkey])

  const currentCartTotalUSD = useMemo(() => {
    return formatPrice(currentCartTotal, 'USD')
  }, [currentCartTotal])

  const currentCartItems = useMemo(() => {
    return selectedHUDCart
      ? getItemsWithPlaceholders(selectedHUDCart.items)
      : getItemsWithPlaceholders()
  }, [selectedHUDCart])

  const tabTriggerClasses = useCallback(
    (merchantPubkey: string) =>
      cn(
        'pb-4 pt-2 bg-primary rounded-t-[999px] flex items-center gap-2 transition-all duration-300',
        {
          'rounded-t-lg': selectedHUDCart?.merchantPubkey === merchantPubkey
        }
      ),
    [selectedHUDCart?.merchantPubkey]
  )

  return (
    <div
      ref={ref}
      className={
        'scale-60 translate-y-[var(--translateY)] translate-x-[var(--translateX)] transition-all duration-200 ease-bounce'
      }
    >
      <div
        className={
          'relative grid md:grid-cols-3 justify-between gap-4 rounded-lg px-3 py-2  cursor-pointer after:absolute after:inset-[-1px] after:rounded-lg after:z-[-2] bg-primary-600 !bg-opacity-100'
        }
        onClick={handleCartClick}
      >
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
                    className={tabTriggerClasses(cart.merchantPubkey)}
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

            {/* Cart Content */}
            <div ref={animateContent}>
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
                      {currentCartItems.map((_, index) => (
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
          <div className="grid gap-2 items-center justify-center content-center text-center">
            <h3 className="voice-base font-bold">Subtotal</h3>
            <p className="voice-3l">{formatPrice(currentCartTotal)}</p>
            <p className="voice-sm text-muted-foreground">
              {currentCartTotalUSD}
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
