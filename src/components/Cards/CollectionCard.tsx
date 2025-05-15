import type { NDKEvent } from '@nostr-dev-kit/ndk'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from './CardComponents.tsx'
import Button from '../Buttons/Button.tsx'
import { UserPill, MultiUserPill } from '../Pill'
import { ZapButton } from '../Buttons/ZapButton.tsx'

const PLACEHOLDER_IMAGE =
  'https://placehold.co/600x400?text=Collection%20Card&font=poppins'

interface CollectionCardProps {
  event: NDKEvent
}

const CollectionCard: React.FC<CollectionCardProps> = ({ event }) => {
  // Placeholder values - these should be extracted from the event later #todo
  const collectionTitle = 'Collection title in max 2 lines even if it’s short'
  const collectionAuthor = 'Collection author'
  const collectionAuthorImage = null
  const collectionImages = [
    PLACEHOLDER_IMAGE,
    PLACEHOLDER_IMAGE,
    PLACEHOLDER_IMAGE,
    PLACEHOLDER_IMAGE
  ]
  const collectionSlug = 'collection-slug'

  return (
    <Card className="w-full max-w-sm overflow-hidden relative">
      {/* card header with usercounter and zap button */}
      <CardHeader className="grid gap-2">
        <div className="flex items-center justify-between">
          <MultiUserPill className="border-none" showZap={true} size="md" />
          <ZapButton />
        </div>
        <CardTitle className="firm-voice line-clamp-1">
          {collectionTitle}
        </CardTitle>
      </CardHeader>

      {/* card content */}
      <CardContent className="">
        <ul className="grid grid-cols-2 gap-2">
          {collectionImages.map((image, index) => (
            <li key={index}>
              <picture className="aspect-video rounded-lg">
                <img
                  src={image}
                  alt={`Collection image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </picture>
            </li>
          ))}
        </ul>
      </CardContent>

      {/* Footer with article collection avatar and read button */}
      <CardFooter className="flex justify-between items-center ">
        <UserPill
          name={collectionAuthor}
          imageUrl={collectionAuthorImage}
          className="border-none"
        />
        <Button
          variant="secondary"
          rounded={false}
          size="lg"
          to={`/collection/${collectionSlug}`}
          isLink
        >
          Shop
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CollectionCard
