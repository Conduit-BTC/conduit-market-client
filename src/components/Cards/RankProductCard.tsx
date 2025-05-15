import React from 'react'
import { Card, CardContent, CardHeader } from './CardComponents'
import { formatNumber } from '@/lib/utils'
import { NDKEvent } from '@nostr-dev-kit/ndk'
import { StorePill } from '../Pill'

interface RankProductCardProps {
  event: NDKEvent
}

const PLACEHOLDER_IMAGE = 'https://prd.place/600/400'

const RankProductCard: React.FC<RankProductCardProps> = ({ event }) => {
  //

  // #todo: remove this once we have a real event
  const rank = 1
  const image = PLACEHOLDER_IMAGE
  const name = 'Product Name'
  const sales = 1000
  const storeName = 'Store Name'

  return (
    <Card className="">
      <CardContent className="grid grid-cols-5 items-center justify-items-cendter gap-4">
        {/* Rank number */}
        <p className="firm-voice">{rank}</p>
        {/* Product image */}

        {/* Product info */}
        <div className="grid grid-cols-3 col-span-2 items-center gap-10">
          <picture className="aspect-square rounded-lg bg-ink overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </picture>
          <h3 className="col-span-2 font-semibold line-clamp-1">{name}</h3>
        </div>
        {/* Sales count */}
        <div className="">
          <p className="font-semibold">{formatNumber(sales)}</p>
        </div>
        <div className="">
          <StorePill storeName={storeName} />
        </div>
      </CardContent>
    </Card>
  )
}

export default RankProductCard
