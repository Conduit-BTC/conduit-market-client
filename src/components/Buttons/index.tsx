/*
- zap button
- login/signup button
- add to cart button




*/

import { useCartStore, type CartItem } from '@/stores/useCartStore.ts'
import { Minus, Plus, Trash, ShoppingCart } from 'lucide-react'
import Button from './Button'
import { cn } from '@/lib/utils'
// Add to cart button
interface AddToCartButtonProps {
  product: CartItem
  disabled?: boolean
}
const AddToCartButton = ({ product, disabled }: AddToCartButtonProps) => {
  const { addToCart, getItemCount } = useCartStore()
  const handleAddToCart = () => {
    addToCart(product)
  }

  const cartQuantity = getItemCount(product)

  if (cartQuantity > 0) {
    return <UpdateCartItemQuantityButtons product={product} />
  }

  return (
    <Button onClick={handleAddToCart} disabled={disabled} rounded={false}>
      <ShoppingCart className="size-4" />
      Add to Cart
    </Button>
  )
}

// Update cart item quantity buttons
export const UpdateCartItemQuantityButtons = ({
  product,
  className
}: {
  product: CartItem
  className?: string
}) => {
  const { addToCart, getItemCount, decreaseQuantity } = useCartStore()
  const cartQuantity = getItemCount(product)

  const handleDecreaseQuantity = () => {
    decreaseQuantity(product)
  }

  const handleIncreaseQuantity = () => {
    addToCart(product)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-4 border border-muted  rounded-full p-2',
        className
      )}
    >
      <Button
        size="icon"
        onClick={handleDecreaseQuantity}
        variant={cartQuantity === 1 ? 'destructive' : 'primary'}
      >
        {cartQuantity === 1 ? <Trash /> : <Minus />}
      </Button>
      <p className="firm-voice">{cartQuantity}</p>
      <Button size="icon" onClick={handleIncreaseQuantity}>
        <Plus />
      </Button>
    </div>
  )
}

export default AddToCartButton
