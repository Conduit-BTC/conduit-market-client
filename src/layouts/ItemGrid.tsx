import React, { useEffect, useState } from 'react'
import ProductCard from '@/components/Cards/ProductCard.tsx'
import SkeletonCard from '@/components/Cards/SkeletonCard'
import PageSection from '@/layouts/PageSection'
import { useSubscribe } from '@nostr-dev-kit/ndk-hooks'
import { useRelayState } from '@/stores/useRelayState'
import type { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk'
import ArticleCard from '@/components/Cards/ArticleCard'
import CollectionCard from '@/components/Cards/CollectionCard'
import PromoCard from '@/components/Cards/PromoCard'
import StoreCard from '@/components/Cards/StoreCard'
import { isValidProductEvent } from '@/lib/utils/productValidation'
import Icon from '@/components/Icon'

const CardType = {
	ArticleCard: ArticleCard,
	CollectionCard: CollectionCard,
	ProductCard: ProductCard,
	PromoCard: PromoCard,
	StoreCard: StoreCard,
} as const

interface ItemGridProps {
	type: keyof typeof CardType
	filters: NDKFilter[]
	variant?: string
	name?: string
}

const ItemGrid: React.FC<ItemGridProps> = ({ filters, type, variant, name = 'Items' }) => {
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
	const validEvents = type === 'ProductCard' 
		? localEvents.filter(isValidProductEvent)
		: localEvents

	const isLoading = !localEvents.length


	function renderCard(event?: NDKEvent) {
		if (!event) {
			return <SkeletonCard />
		}
		const CardComponent = CardType[type]
		const card = <CardComponent event={event} variant={variant as undefined} />
		return card
	}

	if (isLoading) {
		return (
			<PageSection>
          <h2 className="voice-3l">{name}</h2>
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

  // Show "no valid items" message if all items were filtered out
  if (validEvents.length === 0) {
    return (
      <PageSection>
        <div className="flex items-center justify-center">
          <p className="text-lg text-gray-500">
            No valid {name.toLowerCase()} found.
          </p>
        </div>
      </PageSection>
    )
  }

  return (
    <PageSection>
      <h2 className="voice-3l">{name} </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
        {validEvents.map((event) => (
          <li key={event.id}>
            {renderCard(event)}
          </li>
        ))}
      </ul>
    </PageSection>
  )
}

export default ItemGrid
