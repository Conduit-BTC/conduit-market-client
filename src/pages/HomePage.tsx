import ProductCard from '@/components/Cards/ProductCard'
import PromoCard from '@/components/Cards/PromoCard'
import Carousel from '@/components/Carousel'
import Hero from '@/components/HomePage/Hero'
import PageSection from '@/layouts/PageSection'
import CollectionCard from '@/components/Cards/CollectionCard'
import StoreCard from '@/components/Cards/StoreCard'
import ArticleCard from '@/components/Cards/ArticleCard'
import Banner from '@/components/Banner'
import { RelayPoolSelector } from '@/components/Filters/RelayPoolSelector'
import type { NDKFilter } from '@nostr-dev-kit/ndk'
import { useEffect, useState } from 'react'
import { useSubscribe } from '@nostr-dev-kit/ndk-hooks'
import { useRelayState } from '@/stores/useRelayState'

const HomePage: React.FC = () => {
  return (
    <>
      {/* <Hero /> */}

      <CarouselSection
        name="All Products"
        type={CardType.ProductCard}
        variant="card"
        filters={[
          {
            kinds: [30402],
            limit: 60
          }
        ]}
      />

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
  visibleItems = undefined,
  visibleItemsMobile = undefined
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

  return (
    <PageSection>
      <div className="flex items-center justify-between mb-4">
        <h2 className="voice-3l">{name}</h2>
        <RelayPoolSelector
          className="w-64"
          label=""
          placeholder="Select relays..."
        />
      </div>
      <Carousel
        visibleItems={visibleItems}
        visibleItemsMobile={visibleItemsMobile}
      >
        {!localEvents || localEvents.length === 0 ? (
          <div className="animate-pulse">No events received from relays</div>
        ) : (
          localEvents.map((e, index) => {
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
