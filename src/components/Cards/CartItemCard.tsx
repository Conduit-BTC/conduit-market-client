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

const PLACEHOLDER_IMAGE = 'https://prd.place/600/400'

interface CartItemCardProps {
  product?: CartItem | null
}

const CartItemCard: React.FC<CartItemCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false)

  if (!product) {
    return (
      <Card className="bg-muted/60 border border-ink border-dashed aspect-square w-[120px]">
        <CardContent className="h-full flex items-center justify-center">
          <div className="w-full h-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none max-w-[120px]">
      <CardContent className="p-0 relative overflow-hidden">
        <picture className="aspect-square bg-ink">
          <img
            className="w-full h-full object-cover"
            src={imageError ? PLACEHOLDER_IMAGE : product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </picture>
        <p className="absolute bottom-1 left-1/2 -translate-x-1/2 p-2 voice-2l">
          {product.price}
        </p>
      </CardContent>
      <CardFooter className="p-0">
        <UpdateCartItemQuantityButtons
          product={product}
          className="border-none"
        />
      </CardFooter>
    </Card>
  )
}

export default CartItemCard
