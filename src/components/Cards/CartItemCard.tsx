import { useCartStore, type CartItem } from '@/stores/useCartStore.ts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/Cards/CardComponents.tsx'
import { UpdateCartItemQuantityButtons } from '../Buttons/index.tsx'
import { useState } from 'react'
import { Pill } from '../Pill.tsx'
import { cn, formatPrice } from '@/lib/utils/index.ts'
import Icon from '../Icon.tsx'
import { useSats } from '@/hooks/useSats'

const PLACEHOLDER_IMAGE = '/images/placeholders/cart-item.svg'

interface CartItemProps {
  product?: CartItem | null
}

export const CartHUDItem: React.FC<CartItemProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false)

  return (
    <Card className={cn('border-none', !product && 'bg-transparent')}>
      <CardContent className="p-0 relative overflow-hidden">
        <picture
          className={cn('aspect-square bg-ink', !product && 'bg-transparent')}
        >
          <img
            className="w-full h-full object-cover"
            src={imageError || !product ? PLACEHOLDER_IMAGE : product.image}
            alt={product?.name || 'placeholder'}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </picture>
        {product && (
          <div className="absolute inset-0 from-transparent to-black/50 bg-gradient-to-b grid items-end p-2">
            <p className="voice-2l text-center">{product.price}</p>
          </div>
        )}
      </CardContent>
      {product && (
        <CardFooter className="p-0">
          <UpdateCartItemQuantityButtons
            product={product}
            className="border-none"
          />
        </CardFooter>
      )}
    </Card>
  )
}

export const CartItemCard: React.FC<CartItemProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false)
  const { toggleItemSelectionForZapout } = useCartStore()
  const { convertToSats } = useSats()

  return (
    <Card className="border-none flex flex-wrap items-center gap-4">
      <CardHeader className="flex items-center gap-4  min-w-[120px] max-w-[250px] flex-1">
        <input
          type="checkbox"
          checked={product?.selectedForZapout}
          onChange={() => toggleItemSelectionForZapout(product as CartItem)}
        />
        <div className=" w-full">
          <picture className="aspect-square block bg-ink rounded-lg overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={imageError ? PLACEHOLDER_IMAGE : product?.image}
              alt={product?.name}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </picture>
        </div>
      </CardHeader>
      <CardContent className="col-span-2  flex-2  grid justify-items-start gap-4">
        <CardTitle className="voice-lg font-normal">{product?.name}</CardTitle>

        <p className="voice-sm font-bold">in stock</p>

        {/* variant pills */}
        <ul className="flex items-center gap-2">
          {[1, 2, 3].map((variant) => (
            <li>
              <Pill className="bg-muted border-none">
                <span className="voice-base font-medium">
                  Variant {variant}
                </span>
              </Pill>
            </li>
          ))}
        </ul>

        <UpdateCartItemQuantityButtons product={product as CartItem} />
      </CardContent>
      <CardFooter className="col-span-2 grid justify-items-end">
        <div className="flex items-center gap-2">
          {/* Price in Satoshis */}
          <p className="voice-2l ">
            {formatPrice(product?.price ?? 0, 'USD', convertToSats)}
          </p>

          {/* price in USD */}
          <p className="voice-base ">
            {formatPrice(product?.price ?? 0, 'USD')}
          </p>
        </div>

        {/* discount */}
        <div className="flex items-center gap-2">
          {/* old price */}
          <p className="line-through voice-sm text-muted-foreground">
            {formatPrice(product?.price ?? 0, 'USD', convertToSats)}
          </p>
          {/* percentage off */}
          <p className="voice-sm text-muted-foreground">-20%</p>
        </div>
      </CardFooter>
    </Card>
  )
}

export const OrderSummaryItemCard: React.FC<CartItemProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false)
  const { toggleItemSelectionForZapout } = useCartStore()
  const { convertToSats } = useSats()

  return (
    <Card className="border-none flex flex-wrap items-center gap-4">
      <CardHeader className="flex items-center gap-4  min-w-[120px] max-w-[250px] flex-1">
        <div className=" w-full">
          <picture className="aspect-square block bg-ink rounded-lg overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={imageError ? PLACEHOLDER_IMAGE : product?.image}
              alt={product?.name}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </picture>
        </div>
      </CardHeader>
      <CardContent className="flex-2  grid justify-items-start gap-4">
        <CardTitle className="voice-base font-normal">
          {product?.name}
        </CardTitle>
      </CardContent>
      <CardFooter className="grid gap-4 justify-items-end">
        <div className="grid gap-2 justify-items-end">
          {/* Price in Satoshis */}
          <p className="voice-lg font-bold ">
            {formatPrice(product?.price ?? 0, 'USD', convertToSats)}
          </p>

          {/* price in USD */}
          <p className="voice-sm ">{formatPrice(product?.price ?? 0, 'USD')}</p>
        </div>

        <div className="flex items-center gap-2">
          <p className="voice-base text-muted-foreground">Qty:</p>
          <p className="voice-base text-muted-foreground font-bold">
            {product?.quantity}
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
