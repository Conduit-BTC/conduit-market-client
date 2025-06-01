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
  'https://placehold.co/600x400?text=Article%20Card&font=poppins'

interface ArticleCardProps {
  event: NDKEvent
}

const ArticleCard: React.FC<ArticleCardProps> = ({ event }) => {
  // Placeholder values - these should be extracted from the event later
  const articleTitle = 'Article title in max 2 lines even if it’s short' // #fixme
  const articleAuthor = 'Article author' // #fixme
  const articleAuthorImage = null
  const articleImage = PLACEHOLDER_IMAGE
  const articleSlug = 'article-slug' // #fixme

  return (
    <Card className="w-full max-w-sm overflow-hidden relative">
      {/* Main content area with bright background */}
      <picture className="aspect-video">
        <img
          src={articleImage}
          alt={articleTitle}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </picture>

      {/* card header with usercounter and zap button */}
      <CardHeader className="flex items-center justify-between">
        <MultiUserPill className="border-none" showZap={true} size="md" />
        <ZapButton />
      </CardHeader>

      {/* card content */}
      <CardContent className="">
        <CardTitle className="voice-2l line-clamp-2">{articleTitle}</CardTitle>
      </CardContent>

      {/* Footer with article author avatar and read button */}
      <CardFooter className="flex justify-between items-center ">
        <UserPill
          name={articleAuthor}
          imageUrl={articleAuthorImage}
          className="border-none"
        />
        <Button
          variant="muted"
          rounded={false}
          size="lg"
          to={`/article/${articleSlug}`}
          isLink
        >
          Read
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ArticleCard
