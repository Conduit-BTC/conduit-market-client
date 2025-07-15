import ProductCard from '@/components/Cards/ProductCard'
import PromoCard from '@/components/Cards/PromoCard'
import Carousel from '@/components/Carousel'
import PageSection from '@/layouts/PageSection'
import CollectionCard from '@/components/Cards/CollectionCard'
import StoreCard from '@/components/Cards/StoreCard'
import ArticleCard from '@/components/Cards/ArticleCard'
import Banner from '@/components/Banner'
import type { NDKFilter } from '@nostr-dev-kit/ndk'
import { useEffect, useState } from 'react'
import { useSubscribe } from '@nostr-dev-kit/ndk-hooks'
import { useRelayState } from '@/stores/useRelayState'
import ItemGrid from '@/layouts/ItemGrid'
import { isValidProductEvent } from '@/lib/utils/productValidation'

const HomePage: React.FC = () => {
  return (
    <>
      {/* <Hero /> */}
      <ItemGrid
        type="ProductCard"
        name="All Products"
        filters={[
          {
            kinds: [30402], // Product kind
            limit: 60
          }
        ]}
      />

      {/* <CarouselSection
        name="All Products"
        type={CardType.ProductCard}
        variant="card"
        filters={[
          {
            kinds: [30402],
            limit: 60
          }
        ]}
      /> */}

      <Banner />
    </>
  )
}

export default HomePage

const CardType = {
  ArticleCard: 'ArticleCard',
  CollectionCard: 'CollectionCard',
  ProductCard: 'ProductCard',
  PromoCard: 'PromoCard',
  StoreCard: 'StoreCard'
} as const

interface CarouselSectionProps {
  name: string
  type: string
  filters: NDKFilter[]
  variant?: string
  visibleItems?: number
  visibleItemsMobile?: number
}

function CarouselSection({
  name,
  type,
  filters,
  variant,
  visibleItems = 4,
  visibleItemsMobile = 1
}: CarouselSectionProps) {
  const { relayPoolVersion } = useRelayState()
  const { events } = useSubscribe(filters)
  const [localEvents, setLocalEvents] = useState(events)

  // Clear events when relayPoolVersion changes
  useEffect(() => {
    setLocalEvents([])
  }, [relayPoolVersion])

  // Keep localEvents in sync with events
  useEffect(() => {
    setLocalEvents(events)
  }, [events])

  // Filter events based on card type - only filter ProductCards
  const validEvents =
    type === 'ProductCard'
      ? localEvents.filter(isValidProductEvent)
      : localEvents

  return (
    <PageSection>
      <div className="mb-4">
        <h2 className="voice-3l">{name}</h2>
      </div>
      <Carousel
        visibleItems={visibleItems}
        visibleItemsMobile={visibleItemsMobile}
      >
        {!validEvents || validEvents.length === 0 ? (
          <div className="animate-pulse">No events received from relays</div>
        ) : (
          validEvents.map((e, index) => {
            switch (type) {
              case CardType.ArticleCard:
                return <ArticleCard key={index} event={e} />
              case CardType.CollectionCard:
                return <CollectionCard key={index} event={e} />
              case CardType.ProductCard:
                return (
                  <ProductCard
                    key={index}
                    event={e}
                    variant={variant as undefined}
                  />
                )
              case CardType.PromoCard:
                return (
                  <PromoCard
                    key={index}
                    variant={variant as undefined}
                    event={e}
                  />
                )
              case CardType.StoreCard:
              default:
                return <StoreCard key={index} event={e} />
            }
          })
        )}
      </Carousel>
    </PageSection>
  )
}
