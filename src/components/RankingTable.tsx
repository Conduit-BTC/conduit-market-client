import React, { useState, useEffect } from 'react'
import RankProductCard from './Cards/RankProductCard'
import { NDKEvent } from '@nostr-dev-kit/ndk'
import { ProductListingMocks } from 'nostr-commerce-schema'

interface RankingTableProps {
  limit?: number
}

const RankingTable: React.FC<RankingTableProps> = ({ limit = 5 }) => {
  const [products, setProducts] = useState<NDKEvent[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const events = (await ProductListingMocks.generateEventsArray(
          5
        )) as unknown as NDKEvent[]
        setProducts(events)
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="w-full max-w-5xl mx-auto overflow-x-auto">
      <ul className="grid gap-4 min-w-[650px]">
        {/* header */}
        <li className="grid grid-cols-5 items-center justify-items-cendter gap-4 border-b border-ink-500 pb-2 mb-2">
          <p className="voice-sm font-bold">Rank</p>
          <p className="voice-sm font-bold col-span-2">Product</p>
          <p className="voice-sm font-bold">Sales</p>
          <p className="voice-sm font-bold">Store</p>
        </li>
        {/* rows */}
        {products.map((event, index) => (
          <li key={index}>
            <RankProductCard event={event} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export const DualRankingTable: React.FC = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <RankingTable />
      <RankingTable />
    </div>
  )
}

export default RankingTable
