import React from 'react'
import RankProductCard from './Cards/RankProductCard'
import { NDKEvent } from '@nostr-dev-kit/ndk'
import { ProductListingMocks } from 'nostr-commerce-schema'

interface RankingTableProps {
  limit?: number
}

const RankingTable: React.FC<RankingTableProps> = ({ limit = 5 }) => {
  // Take only the specified number of events
  const events = ProductListingMocks.getEventsArray() as unknown as NDKEvent[]
  const displayEvents = events.slice(0, limit)

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid gap-4">
        {/* header */}
        <div className="grid grid-cols-5 items-center justify-items-cendter gap-4">
          <p className="solid-voice">Rank</p>
          <p className="solid-voice col-span-2">Product</p>
          <p className="solid-voice">Sales</p>
          <p className="solid-voice">Store</p>
        </div>
        {/* rows */}
        {displayEvents.map((event, index) => (
          <RankProductCard key={event.id + index} event={event} />
        ))}
      </div>
    </div>
  )
}

export default RankingTable
