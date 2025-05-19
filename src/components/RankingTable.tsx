import React from 'react'
import RankProductCard from './Cards/RankProductCard'
import { NDKEvent } from '@nostr-dev-kit/ndk'
import { ProductListingMocks } from 'nostr-commerce-schema'

interface RankingTableProps {
  limit?: number
}

const RankingTable: React.FC<RankingTableProps> = ({ limit = 5 }) => {
  // Take only the specified number of events
  const products = ProductListingMocks.generateEventsArray(
    limit
  ) as unknown as NDKEvent[]

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid gap-4">
        {/* header */}
        <div className="grid grid-cols-5 items-center justify-items-cendter gap-4 border-b border-ink-500 pb-2 mb-2">
          <p className="solid-voice">Rank</p>
          <p className="solid-voice col-span-2">Product</p>
          <p className="solid-voice">Sales</p>
          <p className="solid-voice">Store</p>
        </div>
        {/* rows */}
        {products.map((event, index) => (
          <RankProductCard key={index} event={event} />
        ))}
      </div>
    </div>
  )
}

export default RankingTable
