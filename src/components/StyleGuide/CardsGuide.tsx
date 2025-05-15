import ProductCard from '@/components/Cards/ProductCard'
import { ProductListingMocks } from 'nostr-commerce-schema'
import type { NDKEvent } from '@nostr-dev-kit/ndk'
import CartItemCard from '@/components/Cards/CartItemCard'
import { type CartItem } from '@/stores/useCartStore'
import StoreCard from '@/components/Cards/StoreCard'
import ArticleCard from '../Cards/ArticleCard'
import CollectionCard from '../Cards/CollectionCard'
import PromoCard from '../Cards/PromoCard'
import RankProductCard from '../Cards/RankProductCard'
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

products.pop()
products.pop()

const cards: Card[] = [
  {
    name: 'Product Card',
    component: ProductCard,
    variants: products.map((event) => ({
      event,
      isHomeCard: false
    }))
  },
  {
    name: 'Rank Product Card',
    component: RankProductCard,
    variants: [
      {
        event: products[0] // Using first product event as mock rank product event
      }
    ]
  },
  {
    name: 'Store Card',
    component: StoreCard,
    variants: [
      {
        event: products[0] // Using first product event as mock store event
      }
    ]
  },
  {
    name: 'Article Card',
    component: ArticleCard,
    variants: [
      {
        event: products[0] // Using first product event as mock article event
      }
    ]
  },
  {
    name: 'Collection Card',
    component: CollectionCard,
    variants: [
      {
        event: products[0] // Using first product event as mock collection event
      }
    ]
  },
  {
    name: 'Promo Card',
    component: PromoCard,
    variants: [
      { event: products[0] }, // Default variant
      { event: products[0], variant: '1item' } // 1-item variant
    ]
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
      <div className="grid gap-4">
        {cards.map(
          (card) =>
            card.component &&
            card.variants && (
              <div key={card.name}>
                <h4 className="notice-voice font-bold mt-4">{card.name}</h4>
                <ul className="flex flex-wrap gap-4">
                  {card.variants.map((variant, index) => {
                    const Component = card.component!
                    return (
                      <li key={index} className="">
                        <Component {...variant} />
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
        )}
      </div>
    </div>
  )
}
