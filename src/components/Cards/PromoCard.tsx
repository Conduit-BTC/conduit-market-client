import type { NDKEvent } from '@nostr-dev-kit/ndk'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from './CardComponents.tsx'
import Button from '../Buttons/Button.tsx'
// import UserCounter from '../UserCounter.tsx'
import { ZapButton } from '../Buttons/ZapButton.tsx'
// import UserAvatar from '../UserAvatar.tsx'
import { cn } from '@/lib/utils/index.ts'

//
const PLACEHOLDER_IMAGE =
  'https://placehold.co/600x400?text=Promo%20Card&font=poppins'

interface PromoCardProps {
  event: NDKEvent
  variant?: '4items' | '1item'
}

const PromoCard: React.FC<PromoCardProps> = ({ event, variant = '4items' }) => {
  // Placeholder values - these should be extracted from the event later #todo
  const promoTitle = 'Promo title in max 2 lines even if it’s short'
  const categoryName = 'Category name'
  const promoImage = PLACEHOLDER_IMAGE

  const promoSlug = 'promo-slug'

  const titleClass = cn(
    'voice-2l line-clamp-1',
    variant === '1item' && 'line-clamp-2'
  )

  return (
    <Card className="w-full max-w-sm overflow-hidden relative">
      {/* card header with usercounter and zap button */}

      {variant === '1item' && (
        <picture className="aspect-video">
          <img
            src={promoImage}
            alt={promoTitle}
            className="w-full h-full object-cover"
          />
        </picture>
      )}

      <CardHeader className="grid gap-2">
        <CardTitle className={titleClass}>{promoTitle}</CardTitle>
      </CardHeader>

      {/* card content */}

      {variant === '4items' && (
        <CardContent className="">
          <ul className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index}>
                <picture className="aspect-video rounded-lg">
                  <img
                    src={promoImage}
                    alt={`${categoryName} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </picture>
                <p className="voice-sm text-muted-foreground">{categoryName}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      )}

      {/* Footer with article collection avatar and read button */}
      <CardFooter className="flex justify-between items-center ">
        <p className="voice-lg">{categoryName}</p>
        <Button
          variant="muted"
          rounded={false}
          size="lg"
          to={`/promo/${promoSlug}`}
          isLink
        >
          Shop
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PromoCard
