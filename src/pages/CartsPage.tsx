import MerchantCartCard from '@/components/Cards/MerchantCartCard'
import RelatedProducts from '@/components/RelatedProducts'
import PageSection from '@/layouts/PageSection'
import { useCartStore } from '@/stores/useCartStore'
import React from 'react'

const CartsPage: React.FC = () => {
  const { carts, getCartsItemsCount } = useCartStore()

  const totalItems = getCartsItemsCount()
  const cartCount = carts.length

  return (
    <PageSection>
      <div className="grid gap-8 lg:flex lg:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap justify-between items-end">
            <h1 className="voice-4l">All Carts Page</h1>

            <p className="voice-sm font-bold">
              {cartCount} stores <span className="inline-block mx-2">/</span>{' '}
              {totalItems} items
            </p>
          </div>

          <ul className="mt-8 grid gap-4">
            {carts.map((cart) => (
              <li key={cart.merchantPubkey}>
                <MerchantCartCard merchantPubkey={cart.merchantPubkey} />
              </li>
            ))}
          </ul>
        </div>

        <RelatedProducts />
      </div>
    </PageSection>
  )
}

export default CartsPage
