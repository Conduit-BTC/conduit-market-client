import React, { useMemo, useState } from 'react'
import { NDKEvent } from '@nostr-dev-kit/ndk'
import {
  type ProductListing,
  ProductListingUtils,
  validateProductListing
} from 'nostr-commerce-schema'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './CardComponents.tsx'
import { ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '@/stores/useCartStore.ts'
import { MultiUserPill } from '@/components/Pill'
import { Badge } from '@/components/Badge.tsx'
import { cn, formatPrice } from '@/lib/utils.ts'
import AddToCartButton from '../Buttons/index.tsx'

const PLACEHOLDER_IMAGE = 'https://prd.place/600/400'

interface ProductCardProps {
  event: NDKEvent
  isHomeCard?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
  event,
  isHomeCard = false
}) => {
  // #todo: remove this once we have a real event

  // Memoize the validation check so it only runs when the event changes
  const validationMemo = useMemo(() => {
    const validationResult = validateProductListing(event)

    if (!validationResult.success) {
      console.warn('Invalid product event:', validationResult.error)
      return { valid: false, productEvent: null }
    }

    // Now we can safely treat it as a ProductListing
    return {
      valid: true,
      productEvent: event as unknown as ProductListing
    }
  }, [event.id, event.tags, event.content, event.pubkey]) // Dependencies that should trigger revalidation

  // Early return if validation failed
  if (!validationMemo.valid) {
    return null
  }

  const productEvent = validationMemo.productEvent!
  const { pubkey } = event
  const { addToCart } = useCartStore()

  const [imageError, setImageError] = useState(false)

  // Use schema functions to extract data
  const productId = ProductListingUtils.getProductId(productEvent)
  const title = ProductListingUtils.getProductTitle(productEvent)
  const price = ProductListingUtils.getProductPrice(productEvent)
  const images = ProductListingUtils.getProductImages(productEvent)
  const stock = ProductListingUtils.getProductStock(productEvent)
  const summary = ProductListingUtils.getProductSummary(productEvent)
  const visibility = ProductListingUtils.getProductVisibility(productEvent)

  //   const storeName = ProductListingUtils.getStoreName(productEvent) #fixme
  const storeName = 'Example Store'

  // If any required field is missing, don't render the card
  if (!productId || !title || !price) {
    console.warn('Product missing required fields:', {
      productId,
      title,
      price
    })
    return null
  }
  // if price is not set, return 'Price not set'
  if (!price) return 'Price not set'

  // Format price with currency

  const mainImage =
    images.length > 0 && !imageError ? images[0].url : PLACEHOLDER_IMAGE

  // #todo: remove this once we have a real event
  const hasUserInteractions = true

  // --- BADGE & PRICE LOGIC ---
  const isOutOfStock = stock !== null && stock === 0
  const isOnSale = stock !== null && stock > 5 && visibility === 'on-sale'
  const isLowStock = stock !== null && stock <= 5 && stock > 0
  const discountPercent = 10 // mock value
  const originalPrice = formatPrice(parseFloat(price.amount), price.currency)
  const discountedPrice = formatPrice(
    parseFloat(price.amount) * (1 - discountPercent / 100),
    price.currency
  )

  let badge = null
  if (isOutOfStock) {
    badge = <Badge variant="destructive">Out of stock</Badge>
  } else if (isLowStock) {
    badge = <Badge variant="warning">Only {stock} left</Badge>
  } else if (isOnSale) {
    badge = <Badge variant="success">-{discountPercent}%</Badge>
  }

  return (
    <Card
      className={cn(
        'w-full overflow-hidden max-w-sm',
        isOutOfStock && 'grayscale',
        isHomeCard && 'max-w-xs'
      )}
    >
      <div className="relative">
        {/* floating indicators */}
        <div className="w-full absolute top-0 p-2 flex items-center justify-between">
          {/* left */}
          <div>{badge}</div>
          {/* right */}
          <div>
            {!isHomeCard && hasUserInteractions && (
              <MultiUserPill className="border-none" />
            )}
          </div>
        </div>

        {/* image */}
        <picture
          className={cn(
            'bg-ink',
            isHomeCard ? 'aspect-square' : 'aspect-video'
          )}
        >
          <img
            src={mainImage}
            alt={title}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </picture>
      </div>
      <CardHeader className="flex gap-1 items-start justify-between">
        <CardTitle className={cn('line-clamp-2', isHomeCard && 'calm-voice')}>
          {title}
        </CardTitle>

        {/* rating */}
        <div className="flex items-center gap-1">
          <Star
            className="size-4 text-transparent"
            fill="var(--color-primary-400)"
          />
          <p className="calm-voice font-bold">4.5</p>
        </div>
      </CardHeader>
      <CardContent className="relative pb-0">
        {/* pubkey */}
        {/* <p className="whisper-voice">{pubkey}</p> */}

        {/* summary #todo*/}
        {summary && false && (
          <CardDescription className="line-clamp-2">{summary}</CardDescription>
        )}

        {/* in Satoshis */}
        <div className="flex items-center gap-1">
          <p className={cn('firm-voice font-bold', isHomeCard && 'calm-voice')}>
            {discountedPrice} SAT
          </p>
          {isOnSale && (
            <p
              className={cn(
                'text-base-600 line-through notice-voice',
                isHomeCard && 'calm-voice'
              )}
            >
              {originalPrice}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0">
        <div className="flex flex-col">
          {/* in Dollars */}
          <p className="whisper-voice">{discountedPrice}</p>
          {isHomeCard && storeName && (
            <p className="whisper-voice text-base-600">{storeName}</p>
          )}
        </div>
        {/* add to cart - only show if not home card */}
        {!isHomeCard && (
          <AddToCartButton
            product={{
              eventId: event.id,
              productId,
              tags: event.tags,
              image: mainImage,
              name: title,
              price: parseFloat(price.amount),
              currency: price.currency,
              quantity: 1,
              merchantPubkey: pubkey
            }}
            disabled={isOutOfStock}
          />
        )}
      </CardFooter>
    </Card>
  )
}

export default ProductCard
