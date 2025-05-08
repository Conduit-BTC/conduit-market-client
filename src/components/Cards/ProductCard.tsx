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
import UserCounter from '@/components/UserCounter.tsx'
import { Badge } from '@/components/Badge.tsx'
import { cn, formatPrice } from '@/lib/utils.ts'
import AddToCartButton from '../Buttons/index.tsx'

const PLACEHOLDER_IMAGE = 'https://prd.place/600/400'

interface ProductCardProps {
  event: NDKEvent
}

const ProductCard: React.FC<ProductCardProps> = ({ event }) => {
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

  console.log(images)

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
    badge = <Badge variant="success">{discountPercent}% off</Badge>
  }

  return (
    <Card
      className={cn(
        'w-full max-w-sm overflow-hidden',
        isOutOfStock && 'grayscale'
      )}
    >
      <div className="relative">
        {/* floating indicators */}
        <div className="w-full absolute top-0 p-4 flex items-center justify-between">
          {/* left */}
          <div>{badge}</div>
          {/* right */}
          <div>{hasUserInteractions && <UserCounter />}</div>
        </div>

        {/* image */}
        <picture className="aspect-video bg-ink">
          <img
            src={mainImage}
            alt={title}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </picture>
      </div>
      <CardHeader className="grid gap-1">
        <CardTitle className="line-clamp-2">{title}</CardTitle>

        {/* rating */}
        <div className="flex items-center gap-1">
          <Star
            className="size-4 text-transparent"
            fill="var(--color-primary-400)"
          />
          <p className="calm-voice font-bold">4.5</p>
        </div>
      </CardHeader>
      <CardContent className="relative">
        {/* pubkey */}
        {/* <p className="whisper-voice">{pubkey}</p> */}

        {/* summary */}
        {summary && (
          <CardDescription className="line-clamp-2">{summary}</CardDescription>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {/* price */}
        <div>
          <div className="flex items-center gap-1">
            <p className="firm-voice font-bold">{discountedPrice}</p>
            {isOnSale && (
              <p className="text-base-600 line-through notice-voice">
                {originalPrice}
              </p>
            )}
          </div>
          <p className="whisper-voice">{discountedPrice}</p>
        </div>
        {/* add to cart */}
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
      </CardFooter>
    </Card>
  )
}

export default ProductCard
