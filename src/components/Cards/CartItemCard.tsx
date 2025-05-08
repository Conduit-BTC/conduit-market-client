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

interface CartItemCardProps {
  product?: CartItem | null
}

export const CartItemCard = ({ product }: CartItemCardProps) => {
  if (!product) {
    return (
      <Card className="bg-muted/60 border border-ink border-dashed aspect-square"></Card>
    )
  }

  return (
    <Card className="border-none">
      <CardContent className="p-0 relative overflow-hidden">
        <picture className="aspect-square">
          <img
            className="w-full h-full object-cover"
            src={product.image}
            alt={product.name}
          />
        </picture>
        <p className="absolute bottom-1 left-1/2 -translate-x-1/2 p-2   firm-voice">
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
