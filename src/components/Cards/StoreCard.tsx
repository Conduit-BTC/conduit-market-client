import type { NDKEvent } from '@nostr-dev-kit/ndk'
import { Card, CardContent, CardFooter } from './CardComponents.tsx'
import Button from '../Buttons/Button.tsx'

const PLACEHOLDER_IMAGE =
  'https://placehold.co/600x400/ccff00/5C2D91.png?text=O%24MO&font=poppins'

interface StoreCardProps {
  event: NDKEvent
}

const StoreCard: React.FC<StoreCardProps> = ({ event }) => {
  // Placeholder values - these should be extracted from the event later
  const storeName = 'Store name' // #fixme
  const storeImage = PLACEHOLDER_IMAGE
  const storeSlug = 'store-slug' // #fixme
  return (
    <Card className="w-full max-w-sm overflow-hidden relative">
      {/* Main content area with bright background */}
      <picture className="">
        <img
          src={storeImage}
          alt={storeName}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </picture>

      {/* Footer with store name and shop button */}
      <CardFooter className="flex justify-between items-center ">
        <div className="text-xl font-bold">{storeName}</div>
        <Button
          variant="muted"
          rounded={false}
          size="lg"
          to={`/store/${storeSlug}`}
          isLink
        >
          Shop
        </Button>
      </CardFooter>
    </Card>
  )
}

export default StoreCard
