import ProductCard from '@/components/Cards/ProductCard'
import type { NDKEvent } from '@nostr-dev-kit/ndk'
import StoreCard from '@/components/Cards/StoreCard'
import ArticleCard from '../Cards/ArticleCard'
import CollectionCard from '../Cards/CollectionCard'
import PromoCard from '../Cards/PromoCard'
import RankProductCard from '../Cards/RankProductCard'
import SkeletonCard from '../Cards/SkeletonCard'
import Carousel from '@/components/Carousel'
import { Card, CardContent } from '../Cards/CardComponents'
import { useMockProducts } from '@/hooks/useMockProducts'

interface Card<T = any> {
  name: string
  component?: React.ComponentType<T>
  variants?: T[]
}

const PLACEHOLDER_IMAGE = 'https://prd.place/600/400'

export function CardsGuide() {
  const { products, loading } = useMockProducts({ count: 1, modifyStock: true })

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
        variant: 'card'
      }))
    },
    {
      name: 'Product Card',
      component: ProductCard,
      variants: products.map((event) => ({
        event,
        variant: 'home'
      }))
    },
    {
      name: 'Product Card',
      component: ProductCard,
      variants: products.map((event) => ({
        event,
        variant: 'slide'
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
      variants: products.map((event, index) => ({
        event,
        variant: index % 2 === 0 ? '1item' : '4items'
      }))
    }
  ]

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h3 className="voice-2l">Cards</h3>
      <div className="grid gap-8">
        {cards.map(
          (card) =>
            card.component &&
            card.variants && (
              <div key={card.name}>
                <h4 className="voice-lg font-bold mt-4">{card.name}</h4>
                <ul className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
                  {card.variants.map((variant, index) => {
                    const Component = card.component!
                    return (
                      <li key={index}>
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
