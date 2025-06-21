import ProductCard from '@/components/Cards/ProductCard'
import PromoCard from '@/components/Cards/PromoCard'
import Carousel from '@/components/Carousel'
import Hero from '@/components/HomePage/Hero'
import PageSection from '@/layouts/PageSection'
import CollectionCard from '@/components/Cards/CollectionCard'
import StoreCard from '@/components/Cards/StoreCard'
import ArticleCard from '@/components/Cards/ArticleCard'
import { DualRankingTable } from '@/components/RankingTable'
import Banner from '@/components/Banner'
import type { NDKFilter } from '@nostr-dev-kit/ndk'
import { useSubscription } from 'nostr-hooks'
import Skeleton from '@/components/Skeleton'
import { useEffect } from 'react'

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />

      <CarouselSection
        name="For You"
        type={CardType.PromoCard}
        variant="1item"
        filters={[
          {
            kinds: [30402],
            limit: 20
          }
        ]}
      />

      {/* <PageSection>
        <h2 className="voice-3l">What's Hot</h2>
        <DualRankingTable />
      </PageSection> */}

      <CarouselSection
        name="Holiday discounts"
        type={CardType.ProductCard}
        variant="home"
        visibleItems={6}
        filters={[
          {
            kinds: [30402],
            limit: 20
          }
        ]}
      />

      <CarouselSection
        name="Curated by the community"
        type={CardType.CollectionCard}
        filters={[
          {
            kinds: [30402],
            limit: 20
          }
        ]}
      />

      <CarouselSection
        name="Curated by the community"
        type={CardType.CollectionCard}
        filters={[
          {
            kinds: [30402],
            limit: 20
          }
        ]}
      />

      <CarouselSection
        name="Trending stores"
        type={CardType.StoreCard}
        filters={[
          {
            kinds: [30402],
            limit: 20
          }
        ]}
      />

      <CarouselSection
        name="Real Coffee Beans"
        type={CardType.CollectionCard}
        filters={[
          {
            kinds: [30402],
            limit: 20
          }
        ]}
      />

      <CarouselSection
        name="Handmade Goods"
        type={CardType.ProductCard}
        variant="home"
        visibleItems={6}
        visibleItemsMobile={2}
        filters={[
          {
            kinds: [30402],
            limit: 20
          }
        ]}
      />

      <CarouselSection
        name="Tech Gadgets"
        type={CardType.PromoCard}
        variant="1item"
        filters={[
          {
            kinds: [30402],
            limit: 20
          }
        ]}
      />

      <CarouselSection
        name="Nostr 101"
        type={CardType.ArticleCard}
        filters={[
          {
            kinds: [30402],
            limit: 20
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
  const { events, isLoading, createSubscription } = useSubscription(
    `${name.toLowerCase().replace(' ', '_')}-${crypto.randomUUID()}`
  )

  useEffect(() => {
    console.log('Creating new subscription: ', name)
    createSubscription({ filters })
  }, [createSubscription])

  useEffect(() => {
    console.log('New subscription received: ')
    console.log(events)
  }, [events])

  return (
    <PageSection>
      <h2 className="voice-3l">{name}</h2>
      <Carousel
        visibleItems={visibleItems}
        visibleItemsMobile={visibleItemsMobile}
      >
        {isLoading && <Skeleton className="h-64 w-full" />}
        {events &&
          events.map((e, index) => {
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
          })}
        {!isLoading && !events && (
          <div className="animate-pulse">No events received from relays</div>
        )}
      </Carousel>
    </PageSection>
  )
}
