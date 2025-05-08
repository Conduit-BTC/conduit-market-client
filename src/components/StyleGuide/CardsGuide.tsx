import ProductCard from '@/components/Cards/ProductCard'
import { ProductListingMocks } from 'nostr-commerce-schema'
import type { NDKEvent } from '@nostr-dev-kit/ndk'

const products = ProductListingMocks.getEventsArray() as unknown as NDKEvent[]

products[1].tags = products[1].tags.map((tag) =>
  tag[0] === 'stock' ? ['stock', '0'] : tag
)

products[2].tags = products[2].tags.map((tag) =>
  tag[0] === 'stock' ? ['stock', '4'] : tag
)

interface Card {
  name: string
  component?: React.ComponentType<{ event: NDKEvent }>
  demoVariants?: NDKEvent[]
}

const cards: Card[] = [
  {
    name: 'Product Card',
    component: ProductCard,
    demoVariants: products
  },
  {
    name: 'Article Card'
    // component: ArticleCard,
  },
  {
    name: 'Store Card'
    // component: StoreCard,
  },
  {
    name: 'Collection Card'
    // component: CollectionCard,
  },
  {
    name: 'Category Card'
    // component: CategoryCard,
  },
  {
    name: 'Promotion Card'
    // component: PromotionCard,
  },
  {
    name: 'Cart Item'
    //  component: CartItem
  }
]

export function CardsGuide() {
  return (
    <div>
      <h3 className="firm-voice">Cards</h3>
      <div className="flex flex-wrap items-center gap-4">
        {cards.map(
          (card) =>
            card.component &&
            card.demoVariants && (
              <div key={card.name}>
                <h4 className="notice-voice font-bold mt-4">{card.name}</h4>
                <ul className="flex flex-wrap gap-4">
                  {card.demoVariants.map((variant, index) => {
                    const Component = card.component!
                    return (
                      <li key={index}>
                        <Component event={variant} />
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
