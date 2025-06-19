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
import Icon from '../Icon'
import { MultiUserPill } from '@/components/Pill'
import { Badge } from '@/components/Badge.tsx'
import { cn, formatPrice } from '@/lib/utils.ts'
import AddToCartButton from '../Buttons/index.tsx'

const PLACEHOLDER_IMAGE = 'https://prd.place/600/400'

interface ProductCardProps {
  event: NDKEvent
  variant?: 'card' | 'home' | 'slide'
}

const ProductCard: React.FC<ProductCardProps> = ({
  event,
  variant = 'card'
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

  const mainImage =
    images.length > 0 && !imageError ? images[0].url : PLACEHOLDER_IMAGE

  // #todo: remove this once we have a real event
  const hasUserInteractions = true

  // --- BADGE & PRICE LOGIC ---
  const isOutOfStock = stock !== null && stock === 0
  const isOnSale = stock !== null && stock > 5 && visibility === 'on-sale'
  const isLowStock = stock !== null && stock <= 5 && stock > 0
  const discountPercent = 10 // mock value
  const priceAmount = parseFloat(price.amount)
  const priceInSats = formatPrice(priceAmount, 'SAT')
  const priceInUSD = formatPrice(priceAmount, 'USD')
  const discountedPriceInSats = formatPrice(
    priceAmount * (1 - discountPercent / 100),
    'SAT'
  )
  const discountedPriceInUSD = formatPrice(
    priceAmount * (1 - discountPercent / 100),
    'USD'
  )

  let badge = null
  if (isOutOfStock) {
    badge = <Badge variant="destructive">Out of stock</Badge>
  } else if (isLowStock) {
    badge = <Badge variant="warning">Only {stock} left</Badge>
  } else if (isOnSale) {
    badge = <Badge variant="success">-{discountPercent}%</Badge>
  }

  switch (variant) {
    case 'home':
      return (
        <Card
          className={cn(
            'w-full overflow-hidden max-w-xs',
            isOutOfStock && 'grayscale'
          )}
        >
          <div className="relative">
            {/* floating indicators */}
            <div className="w-full absolute top-0 p-2 flex items-center justify-between">
              {/* left */}
              <div>{badge}</div>
            </div>

            {/* image */}
            <picture className="bg-ink aspect-square">
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
            <CardTitle className="line-clamp-2 voice-sm">{title}</CardTitle>

            {/* rating */}
            <div className="flex items-center gap-1">
              <Icon.Star
                className="size-4 text-transparent"
                fill="fill-primary-400"
              />
              <p className="voice-base font-bold">4.5</p>
            </div>
          </CardHeader>
          <CardContent className="relative pb-0">
            {/* in Satoshis */}
            <div className="flex items-center gap-1">
              <p className="voice-lg font-bold">{discountedPriceInSats}</p>
              {isOnSale && (
                <p className="line-through voice-sm text-muted-foreground">
                  {priceInSats}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-0">
            <div className="flex flex-col">
              {/* in Dollars */}
              <p className="voice-base">{discountedPriceInUSD}</p>
              {/* todo: add store name */}
              {storeName && false && (
                <p className="voice-sm text-muted-foreground font-bold">
                  {storeName}
                </p>
              )}
            </div>
          </CardFooter>
        </Card>
      )

    case 'slide':
      return (
        <Card
          className={cn(
            'w-full overflow-hidden max-w-sm border-none',
            isOutOfStock && 'grayscale'
          )}
        >
          <div className="relative grid grid-cols-3 items-center">
            {/* floating indicators */}
            <div className="w-full absolute top-0 p-2 flex items-center justify-between">
              {/* left */}
              {/* <div>{badge}</div> */}
            </div>

            {/* image */}
            <picture className="bg-ink aspect-square rounded-lg">
              <img
                src={mainImage}
                alt={title}
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </picture>
            <div className="col-span-2">
              <CardHeader className="flex gap-1 items-start justify-between">
                <CardTitle className="line-clamp-2 voice-sm font-medium">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative pb-0">
                {/* in Satoshis */}
                <div className="flex items-center gap-1">
                  <p className="voice-base font-bold">
                    {discountedPriceInSats}
                  </p>
                  {isOnSale && (
                    <p className="line-through voice-sm text-muted-foreground">
                      {priceInSats}
                    </p>
                  )}
                </div>

                {/* in Dollars */}
                <p className="voice-sm">{discountedPriceInUSD}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-0">
                {/* rating */}
                <div className="flex items-center gap-1">
                  <Icon.Star
                    className="size-4 text-transparent"
                    fill="fill-primary-400"
                  />
                  <p className="voice-base font-bold">4.5</p>
                </div>

                <AddToCartButton
                  variant="slide"
                  product={{
                    merchantPubkey: pubkey,
                    eventId: event.id,
                    productId,
                    tags: event.tags,
                    image: mainImage,
                    name: title,
                    price: parseFloat(price.amount),
                    currency: price.currency,
                    quantity: 1
                  }}
                  disabled={isOutOfStock}
                />
              </CardFooter>
            </div>
          </div>
        </Card>
      )

    default:
      return (
        <Card
          className={cn(
            'w-full overflow-hidden max-w-sm',
            isOutOfStock && 'grayscale'
          )}
        >
          <div className="relative">
            {/* floating indicators */}
            <div className="w-full absolute top-0 p-2 flex items-center justify-between">
              {/* left */}
              <div>{badge}</div>
              {/* right */}
              <div>
                {hasUserInteractions && (
                  <MultiUserPill className="border-none" />
                )}
              </div>
            </div>

            {/* image */}
            <picture className="bg-ink aspect-video">
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
            <CardTitle className="line-clamp-2 voice-base">{title}</CardTitle>

            {/* rating */}
            <div className="flex items-center gap-1">
              <Icon.Star
                className="size-4 text-transparent"
                fill="fill-primary-400"
              />
              <p className="voice-base font-bold">4.5</p>
            </div>
          </CardHeader>
          <CardContent className="relative pb-0">
            {/* pubkey */}
            {/* <p className="voice-sm text-muted-foreground">{pubkey}</p> */}

            {/* summary #todo*/}
            {summary && false && (
              <CardDescription className="line-clamp-2">
                {summary}
              </CardDescription>
            )}

            {/* in Satoshis */}
            <div className="flex items-center gap-1">
              <p className="voice-lg font-bold">{discountedPriceInSats}</p>
              {isOnSale && (
                <p className="line-through voice-sm text-muted-foreground">
                  {priceInSats}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-0">
            <div className="flex flex-col">
              {/* in Dollars */}
              <p className="voice-base">{discountedPriceInUSD}</p>
            </div>
            {/* add to cart - only show if not home card */}
            <AddToCartButton
              product={{
                merchantPubkey: pubkey,
                eventId: event.id,
                productId,
                tags: event.tags,
                image: mainImage,
                name: title,
                price: parseFloat(price.amount),
                currency: price.currency,
                quantity: 1
              }}
              disabled={isOutOfStock}
            />
          </CardFooter>
        </Card>
      )
  }
}

export default ProductCard
