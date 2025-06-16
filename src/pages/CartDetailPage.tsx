import React from 'react'
import { useParams } from 'wouter'
import { useCartStore } from '@/stores/useCartStore'
import PageSection from '@/layouts/PageSection'
import { CartItemCard } from '@/components/Cards/CartItemCard'
import Button from '@/components/Buttons/Button'
import { formatPrice } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/Cards/CardComponents'
import ZapoutButton from '@/components/Buttons/ZapoutButton'
import RelatedProducts from '@/components/RelatedProducts'

const CartDetailPage: React.FC = () => {
  const { merchantId } = useParams()

  const { getCart, getCartTotal, getCartItemsCount } = useCartStore()
  const cart = getCart(merchantId as string)
  const cartItemsCount = getCartItemsCount(merchantId as string)
  const cartTotal = getCartTotal(merchantId as string)

  const merchantName = 'Merchant Name'

  return (
    <PageSection>
      <div className="border-muted p-8 rounded-lg grid gap-8 lg:flex lg:justify-between">
        {/* Cart Card */}
        <Card className="flex-1">
          {/* Cart Header */}
          <CardHeader className="flex items-start justify-between">
            <h1 className="voice-4l">{merchantName}</h1>
            <div>
              <h2 className="voice-2l">{merchantName}</h2>
              <Button
                rounded={false}
                variant="muted"
                isLink
                to={`/merchants/${merchantId}`}
              >
                Visit Store
              </Button>
            </div>
          </CardHeader>

          {/* Cart Items */}
          <CardContent className="mt-8">
            <div className="flex items-center gap-2 ">
              <input type="checkbox" />
              <label>Select all</label>
            </div>
            <ul className="mt-8 grid gap-4">
              {cart?.items.map((item) => (
                <li
                  key={item.productId}
                  className="border-t-1 border-muted pt-2"
                >
                  <CartItemCard product={item} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="">
          {/* Cart Total */}
          <Card className="">
            <CardHeader className="voice-lg font-medium">
              SubTotal <span>({cartItemsCount} items)</span>
            </CardHeader>
            <CardContent className="flex gap-2 items-center">
              <p className="voice-2l text-primary-400">
                {formatPrice(cartTotal, 'SAT')}
              </p>
              <p className="voice-base text-muted-foreground">
                {formatPrice(cartTotal, 'USD')}
              </p>
            </CardContent>
            <CardFooter>
              <ZapoutButton rounded={false}>Zapout</ZapoutButton>
            </CardFooter>
          </Card>

          {/* related products */}
          <div className="mt-8">
            <RelatedProducts />
          </div>
        </div>
      </div>
    </PageSection>
  )
}

export default CartDetailPage
