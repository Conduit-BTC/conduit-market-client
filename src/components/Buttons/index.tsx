/*
- zap button
- login/signup button
- add to cart button




*/

import { useCartStore, type CartItem } from '@/stores/useCartStore.ts'
import Icon from '../Icon'
import Button from './Button'
import { cn } from '@/lib/utils'
import Field from '../Form/Field'
// Add to cart button
interface AddToCartButtonProps {
  product: CartItem
  disabled?: boolean
  variant?: 'default' | 'slide'
}
const AddToCartButton = ({
  product,
  disabled,
  variant = 'default'
}: AddToCartButtonProps) => {
  const { addItemToCart, getItemQuantity } = useCartStore()
  const itemQuantity = getItemQuantity(
    product.merchantPubkey,
    product.productId
  )

  if (itemQuantity > 0) {
    return <UpdateCartItemQuantityButtons product={product} />
  }

  if (variant === 'slide') {
    return (
      <Button
        onClick={() => addItemToCart(product)}
        disabled={disabled}
        rounded={false}
        variant="outline"
        className="border-primary"
      >
        <Icon icon="shoppingCart" className="size-4" />
        Add
      </Button>
    )
  }

  return (
    <Button
      onClick={() => addItemToCart(product)}
      disabled={disabled}
      rounded={false}
    >
      <Icon icon="shoppingCart" className="size-4" />
      Add to Cart
    </Button>
  )
}

interface UpdateCartItemQuantityButtonsProps {
  product: CartItem
  className?: string
}

// Update cart item quantity buttons
export const UpdateCartItemQuantityButtons = ({
  product,
  className
}: UpdateCartItemQuantityButtonsProps) => {
  const {
    increaseItemQuantity,
    decreaseItemQuantity,
    removeItemFromCart,
    getItemQuantity
  } = useCartStore()

  const quantity = getItemQuantity(product.merchantPubkey, product.productId)

  return (
    <div
      className={cn(
        'flex items-center gap-4 border border-muted  rounded-full px-2 py-1 justify-between',
        className
      )}
    >
      <div className="flex items-center rounded-full">
        <Button
          size="icon"
          rounded={false}
          onClick={() => removeItemFromCart(product)}
          variant="destructive"
          className={cn(
            'max-w-7 transition-all duration-200 ease-in-out',
            quantity === 1 ? 'rounded-full' : 'rounded-l-full border-r-0'
          )}
        >
          <Icon icon="trash" className="size-5" />
        </Button>
        <div
          className={cn(
            'transition-all duration-200 ease-in-out',
            quantity > 1 ? 'w-7 opacity-100' : 'w-0 opacity-0'
          )}
        >
          <Button
            size="icon"
            rounded={false}
            onClick={() => decreaseItemQuantity(product)}
            variant="primary"
            className="max-w-7 border-l-0 rounded-r-full"
          >
            <Icon icon="minus" className="size-5" />
          </Button>
        </div>
      </div>
      <Field
        inputWrapperClassName="voice-2l border-none bg-transparent max-w-5 p-0"
        inputClassName="text-center"
        value={quantity}
        name="cart-quantity"
      />
      <Button
        size="icon"
        onClick={() => increaseItemQuantity(product)}
        className="max-w-7"
      >
        <Icon icon="plus" className="size-5" />
      </Button>
    </div>
  )
}

export default AddToCartButton
