import { useCartStore } from '@/stores/useCartStore'
import { Minus, Plus, ShoppingCart, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import ZapoutButton from '@/components/Buttons/ZapoutButton.tsx'
import { cn, formatPrice } from '@/lib/utils'
import Button from '@/components/Buttons/Button'
import CartItemCard from '@/components/Cards/CartItemCard'

export const CartDrawer = () => {
  const {
    cart,
    decreaseQuantity,
    addToCart,
    isCartOpen,
    closeCart,
    toggleCart
  } = useCartStore()

  const [cartTotal, setCartTotal] = useState(0)

  // Calculate cart total whenever cart changes
  useEffect(() => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    setCartTotal(total)
  }, [cart])

  const cartItemsWithPlaceholders = Array(5)
    .fill(null)
    .map((_, index) => cart[index] || null)

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 w-full z-50 transition-all duration-600 ease-bounce',
        isCartOpen
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-100'
      )}
    >
      <div className="inner-column cart-drawer px-10 relative">
        {/* close */}
        {/* close */}
        <div className="absolute top-[-40px] right-10 z-[-1] pb-2 bg-accent rounded-t-full from-primary-800 to-accent/80 bg-gradient-to-t">
          <Button variant="ghost" size="icon" onClick={toggleCart}>
            <X />
          </Button>
        </div>

        {/* cart items */}
        <ul className="grid grid-cols-[repeat(5,120px)] gap-2">
          {cartItemsWithPlaceholders.map((product, index) => (
            <li
              className="max-w-[120px]"
              key={product?.productId || `placeholder-${index}`}
            >
              <CartItemCard product={product} />
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-4">
          {/* totals */}
          <div className="grid gap-2 items-center content-center text-center">
            <h3 className="calm-voice font-bold">Subtotal</h3>
            <p className="attention-voice">{formatPrice(cartTotal)}</p>
            <p className="whisper-voice text-primary-foreground">
              {formatPrice(cartTotal)}
            </p>
            {/* <p className="whisper-voice text-primary-foreground">
              {cart.length} items
            </p> */}
          </div>

          {/* actions */}
          <div className="grid gap-2 items-center content-center">
            <Button variant="outline">View Cart(s)</Button>
            <ZapoutButton>Zap out</ZapoutButton>
          </div>
        </div>
      </div>
    </div>
  )
}
