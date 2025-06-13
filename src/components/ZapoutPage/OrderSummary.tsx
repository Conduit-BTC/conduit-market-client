import { formatPrice } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../Cards/CardComponents'
import { OrderSummaryItemCard } from '../Cards/CartItemCard'
import { type CartItem, useCartStore } from '@/stores/useCartStore'
import { useSearch } from 'wouter'

interface OrderSummaryProps {
  merchantPubkey: string
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ merchantPubkey }) => {
  const { getCart, getCartTotal } = useCartStore()

  const cart = getCart(merchantPubkey)

  const products = cart?.items.filter(
    (item: CartItem) => item.selectedForZapout
  )

  const merchantName = 'Merchant Name'

  return (
    <div className="grid gap-4 p-4 border border-muted rounded-lg">
      <div className="flex items-center justify-between border-b border-ink pb-4">
        <h2 className="voice-2l whitespace-nowrap">Order Summary</h2>

        <p className="voice-base">{merchantName}</p>
      </div>

      <ul>
        {products?.map((product) => (
          <li key={product.productId} className="border-t border-muted py-4">
            <OrderSummaryItemCard product={product} />
          </li>
        ))}
      </ul>

      <div className="grid gap-4 border border-muted p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <p>
            Subtotal <span>({products?.length} items)</span>
          </p>
          <p className="font-bold">
            {formatPrice(getCartTotal(merchantPubkey), 'SAT')}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p>Shipping</p>
          <p className="font-bold">Free</p>
        </div>

        <div className="flex items-center justify-between">
          <p>Total</p>
          <p className="font-bold">
            {formatPrice(getCartTotal(merchantPubkey), 'SAT')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
