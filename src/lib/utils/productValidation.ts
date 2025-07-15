import { ProductListingUtils, validateProductListing } from 'nostr-commerce-schema'
import type { NDKEvent } from '@nostr-dev-kit/ndk'

/**
 * Validates if an NDK event can be rendered as a ProductCard
 * This replicates the validation logic from ProductCard component
 */
export function isValidProductEvent(event: NDKEvent): boolean {
  try {
    // First check the schema validation (currently commented out in ProductCard)
    const validationResult = validateProductListing(event)
    
    // Skip the validateProductListing check for now (same as ProductCard)
    // if (!validationResult.success) {
    //   return false
    // }

    // Cast to ProductListing type like ProductCard does
    const productEvent = event as unknown as any // ProductListing type
    
    // Extract required fields using the same methods as ProductCard
    const productId = ProductListingUtils.getProductId(productEvent)
    const title = ProductListingUtils.getProductTitle(productEvent)
    const price = ProductListingUtils.getProductPrice(productEvent)
    
    // Check if required fields exist (same logic as ProductCard)
    return !!(productId && title && price)
  } catch (error) {
    // If any error occurs during field extraction, consider it invalid
    return false
  }
}

