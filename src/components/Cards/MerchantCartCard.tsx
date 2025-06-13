// Import UI components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from './CardComponents'

// Import state management and utilities
import { useCartStore } from '@/stores/useCartStore'
import Avatar from '../Avatar'
import Button from '../Buttons/Button'
import ZapoutButton from '../Buttons/ZapoutButton'
import { formatPrice } from '@/lib/utils'
import Icon from '../Icon'

// Component props interface
interface MerchantCartCardProps {
  merchantPubkey: string
}

const MerchantCartCard: React.FC<MerchantCartCardProps> = ({
  merchantPubkey
}) => {
  // Get cart-related functions from store
  const { getCart, getCartTotal, getCartItemsCount } = useCartStore()

  // Get cart data for specific merchant
  const cart = getCart(merchantPubkey)
  if (!cart) return null

  // Calculate cart metrics
  const itemCount = getCartItemsCount(merchantPubkey)
  const total = getCartTotal(merchantPubkey)
  // TODO: Replace with actual merchant data
  const merchantName = 'Merchant Name'
  const merchantLogo = 'https://avatar.iran.liara.run/public'

  return (
    <Card className=" lg:flex items-center justify-between px-4 py-2 gap-20 flex-wrap">
      {/* Merchant Information Section */}
      <CardHeader className="flex items-center gap-4">
        <Avatar imageUrl={merchantLogo} alt={merchantName} size="2xl" />

        <div className="flex flex-col gap-2">
          {/* Merchant Name */}
          <CardTitle className="voice-3l">{merchantName}</CardTitle>
          {/* Cart Summary - Items and Total */}
          <div className="flex flex-wrap items-center gap-2 gap-y-4 whitespace-nowrap">
            <p className="voice-base font-bold">{itemCount} items</p>
            <span className="font-bold hidden md:inline">|</span>
            <div className="flex items-end gap-2">
              <p className="voice-2l">{formatPrice(total)}</p>
              <p className="voice-base font-medium text-muted-foreground">
                {formatPrice(total)}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Action Buttons Section */}
      <CardFooter className="flex flex-wrap items-center justify-end gap-4 flex-1">
        {/* Primary Zapout Button */}
        <ZapoutButton
          size="md"
          rounded={false}
          className="flex-1"
          merchantPubkey={merchantPubkey}
        >
          Zapout
        </ZapoutButton>
        {/* View Cart Button */}
        <Button
          variant="muted"
          size="md"
          rounded={false}
          className="flex-1"
          isLink={true}
          to={`/carts/${merchantPubkey}`}
        >
          <picture className="shrink-0">
            <Icon icon="shoppingBag" />
          </picture>
          View Cart
        </Button>

        {/* More Options Button */}
        <Button variant="outline" size="icon" className="">
          <picture className="">
            <Icon icon="ellipsis" className="size-4 md:size-6" />
          </picture>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default MerchantCartCard
