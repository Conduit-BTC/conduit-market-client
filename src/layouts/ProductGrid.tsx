import React, { useEffect } from 'react'
import { useSubscription } from 'nostr-hooks'
import ProductCard from '@/components/Cards/ProductCard.tsx'
import SkeletonCard from '@/components/Cards/SkeletonCard'
import PageSection from '@/layouts/PageSection'

const ProductGrid: React.FC = () => {
  const subId = 'all-events'
  const { events, isLoading, createSubscription } = useSubscription(subId)

  useEffect(() => {
    // Create subscription with proper filters
    const filters = {
      filters: [
        {
          kinds: [30402],
          limit: 50
        }
      ]
    }

    createSubscription(filters)
  }, [createSubscription])

  if (isLoading) {
    return (
      <PageSection>
        <h1 className="voice-3l">Products</h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
          {[...Array(6)].map((_, index) => (
            <li key={index}>
              <SkeletonCard />
            </li>
          ))}
        </ul>
      </PageSection>
    )
  }

  if (!events || events.length === 0) {
    return (
      <PageSection>
        <div className="flex items-center justify-center">
          <p className="text-lg text-gray-500">
            No events found. Try posting a note!
          </p>
        </div>
      </PageSection>
    )
  }

  return (
    <PageSection>
      <h1 className="voice-3l">Products</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
        {events.map((event) => (
          <li key={event.id}>
            <ProductCard event={event} />
          </li>
        ))}
      </ul>
    </PageSection>
  )
}

export default ProductGrid
