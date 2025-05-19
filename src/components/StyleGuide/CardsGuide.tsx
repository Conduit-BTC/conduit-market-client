import ProductCard from '@/components/Cards/ProductCard'
import { ProductListingMocks } from 'nostr-commerce-schema'
import type { NDKEvent } from '@nostr-dev-kit/ndk'
import CartItemCard from '@/components/Cards/CartItemCard'
import StoreCard from '@/components/Cards/StoreCard'
import ArticleCard from '../Cards/ArticleCard'
import CollectionCard from '../Cards/CollectionCard'
import PromoCard from '../Cards/PromoCard'
import RankProductCard from '../Cards/RankProductCard'
import SkeletonCard from '../Cards/SkeletonCard'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/Carousel'

interface Card<T = any> {
  name: string
  component?: React.ComponentType<T>
  variants?: T[]
}

const PLACEHOLDER_IMAGE = 'https://prd.place/600/400'

// Mock NDK events for products
const products = ProductListingMocks.getEventsArray() as unknown as NDKEvent[]

products[1].tags = products[1].tags.map((tag) =>
  tag[0] === 'stock' ? ['stock', '0'] : tag
)

products[2].tags = products[2].tags.map((tag) =>
  tag[0] === 'stock' ? ['stock', '4'] : tag
)

const cards: Card[] = [
  {
    name: 'Skeleton Card',
    component: SkeletonCard,
    variants: [1, 2, 3]
  },
  {
    name: 'Product Card',
    component: ProductCard,
    variants: products.map((event) => ({
      event,
      isHomeCard: false
    }))
  },

  {
    name: 'Store Card',
    component: StoreCard,
    variants: products
  },
  {
    name: 'Article Card',
    component: ArticleCard,
    variants: products
  },
  {
    name: 'Collection Card',
    component: CollectionCard,
    variants: products
  },
  {
    name: 'Promo Card',
    component: PromoCard,
    variants: products
  },
  {
    name: 'Cart Item',
    component: CartItemCard,
    variants: [
      {
        product: {
          productId: 123,
          name: 'Cart Item 1',
          price: 59,
          image: PLACEHOLDER_IMAGE,
          quantity: 3,
          eventId: 'mock-event-id',
          tags: [],
          currency: 'SAT',
          merchantPubkey: 'mock-pubkey'
        }
      },
      { product: null }
    ]
  }
]

export function CardsGuide() {
  return (
    <div>
      <h3 className="firm-voice">Cards</h3>
      <div className="grid gap-8">
        {cards.map(
          (card) =>
            card.component &&
            card.variants && (
              <div key={card.name}>
                <h4 className="notice-voice font-bold mt-4">{card.name}</h4>
                <div className="relative">
                  <Carousel
                    opts={{
                      align: 'start',
                      loop: true
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4">
                      {card.variants.map((variant, index) => {
                        const Component = card.component!
                        return (
                          <CarouselItem key={index} className="">
                            <Component {...variant} />
                          </CarouselItem>
                        )
                      })}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  )
}
