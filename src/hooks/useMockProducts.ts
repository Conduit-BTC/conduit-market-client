import { useState, useEffect } from 'react'
import { ProductListingMocks } from 'nostr-commerce-schema'
import type { NDKEvent } from '@nostr-dev-kit/ndk'

interface UseMockProductsOptions {
  count?: number
  modifyStock?: boolean
  storeCount?: number
}

const mockStores = Array.from({ length: 10 }, (_, i) => ({
  pubkey: `1234567${i.toString().padStart(3, '0')}-Store-${i + 1}`
}))

export function useMockProducts({
  count = 9,
  modifyStock = true,
  storeCount = 4
}: UseMockProductsOptions = {}) {
  const [products, setProducts] = useState<NDKEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Calculate total products needed (count per store * number of stores)
        const totalProducts = count * storeCount
        const events = (await ProductListingMocks.generateEventsArray(
          totalProducts
        )) as unknown as NDKEvent[]

        // Assign store pubkeys to products, ensuring each store gets 'count' number of products
        events.forEach((event, index) => {
          const storeIndex = Math.floor(index / count) % storeCount
          event.pubkey = mockStores[storeIndex].pubkey
        })

        if (modifyStock) {
          // Modify stock for specific products after fetching
          const modifiedEvents = [...events]
          if (modifiedEvents[1]) {
            modifiedEvents[1].tags = modifiedEvents[1].tags.map(
              (tag: string[]) => (tag[0] === 'stock' ? ['stock', '0'] : tag)
            )
          }
          if (modifiedEvents[2]) {
            modifiedEvents[2].tags = modifiedEvents[2].tags.map(
              (tag: string[]) => (tag[0] === 'stock' ? ['stock', '4'] : tag)
            )
          }

          setProducts(modifiedEvents)
        } else {
          setProducts(events)
        }
      } catch (error) {
        console.error('Error fetching mock products:', error)
        setError(error instanceof Error ? error : new Error('Unknown error'))
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [count, modifyStock, storeCount])

  return { products, loading, error }
}
