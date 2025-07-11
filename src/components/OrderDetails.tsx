import React, { useState, useEffect } from 'react'
import { type NostrEvent } from '@nostr-dev-kit/ndk'
import { OrderUtils } from 'nostr-commerce-schema'
import Avatar from './Avatar'
import { useNostrProfile, type NostrProfile } from '@/hooks/useNostrProfile'
import { useOrderProductListings } from '@/hooks/useOrderProductListings'
import ProductCard from './Cards/ProductCard'

interface OrderDetailsProps {
  event: NostrEvent
  onClose?: () => void
  orderNotFound?: boolean
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  event,
  orderNotFound
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { formatSats, getOrderContactDetails, getOrderItems } = OrderUtils

  const orderIdTag = event.tags.find((tag) => tag[0] === 'order')
  const orderId = orderIdTag && orderIdTag[1] ? orderIdTag[1] : 'Unknown'

  const amountTag = event.tags.find((tag) => tag[0] === 'amount')
  const amount = amountTag && amountTag[1] ? amountTag[1] : null

  const typeTag = event.tags.find((tag) => tag[0] === 'type')
  const type = typeTag && typeTag[1] ? typeTag[1] : null

  const rawItems = type === '1' ? getOrderItems(event as any) : []
  const items =
    type === '1'
      ? rawItems.map((item: any) => ({
          productId: OrderUtils.getProductIdFromOrderItem(item),
          type: '30402',
          quantity: item.quantity,
          productRef: item.productRef
        }))
      : []
  const contactDetails =
    type === '1' ? getOrderContactDetails(event as any) : null

  const { productListings, loading: loadingProducts } =
    useOrderProductListings(items)

  const merchantPubkey = event.pubkey
  const merchant = useNostrProfile(merchantPubkey)

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  if (orderNotFound) {
    return <OrderNotFoundComponent merchant={merchant} />
  }

  // Show details by default for type 1 (Order Placed), otherwise use showAdvanced
  const showDetails = type === '1' || showAdvanced

  return (
    <div className="flex flex-col p-6 w-full relative max-h-[100vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-center text-primary-100 mb-8">
        Order Details
      </h2>

      {/* Basic Info */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-primary-200 border-b border-primary-700 pb-2">
          Basic Information
        </h3>
        <div className="space-y-4">
          <div>
            <span className="text-primary-400 font-semibold">Order ID:</span>
            <span className="ml-2 font-mono text-primary-100 break-all text-sm">
              {orderId}
            </span>
          </div>
          <div>
            <span className="text-primary-400 font-semibold mb-2 block">
              Merchant:
            </span>
            <div className="flex items-center gap-3 ml-2">
              <Avatar
                imageUrl={merchant.picture}
                alt={merchant.name || merchant.npub}
                size="sm"
                npub={merchant.npub}
                href={`https://njump.me/${merchant.npub}`}
              />
              <span className="text-primary-100 font-medium">
                {merchant.displayName || merchant.name || merchant.npub}
              </span>
              <a
                href={`https://njump.me/${merchant.npub}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 text-xs hover:underline break-all"
              >
                {merchant.npub}
              </a>
            </div>
          </div>
          {amount && (
            <div>
              <span className="text-primary-400 font-semibold">Amount:</span>
              <span className="ml-2 font-bold text-primary-200 text-lg">
                {formatSats(amount)}
              </span>
            </div>
          )}
          <div>
            <span className="text-primary-400 font-semibold">Type:</span>
            <span className="ml-2 text-primary-100">
              {type === '1'
                ? 'Order Creation'
                : type === '2'
                ? 'Payment Request'
                : type === '3'
                ? 'Status Update'
                : type === '4'
                ? 'Shipping Update'
                : event.kind === 17
                ? 'Receipt'
                : 'Unknown'}
            </span>
          </div>
          <div>
            <span className="text-primary-400 font-semibold">Date:</span>
            <span className="ml-2 text-primary-100">
              {event.created_at
                ? new Date(event.created_at * 1000).toLocaleString()
                : 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Items Section */}
      {items?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-primary-200 border-b border-primary-700 pb-2">
            Items
          </h3>
          <div className="space-y-6">
            {items.map((item, index) => {
              const productEvent = productListings[item.productId]
              return (
                <div
                  key={index}
                  className="flex flex-col gap-3 items-center bg-primary-800/10 rounded-lg p-4"
                >
                  {productEvent ? (
                    <div className="w-full max-w-xs">
                      <ProductCard event={productEvent} variant="home" />
                    </div>
                  ) : (
                    <div className="w-full max-w-xs h-32 flex items-center justify-center bg-primary-800/20 rounded-lg text-sm text-primary-400">
                      {loadingProducts
                        ? 'Loading product details...'
                        : 'Product not found'}
                    </div>
                  )}
                  <div className="text-center">
                    <span className="text-primary-400">Quantity: </span>
                    <span className="font-bold text-primary-100 text-lg">
                      {item.quantity}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Contact Details Section */}
      {contactDetails && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-primary-200 border-b border-primary-700 pb-2">
            Contact Details
          </h3>
          <div className="space-y-4 bg-primary-800/10 rounded-lg p-4">
            {contactDetails.address && (
              <div>
                <span className="text-primary-400 font-semibold">Address:</span>
                <div className="ml-2 mt-2 text-primary-100">
                  {formatAddress(
                    typeof contactDetails.address === 'string'
                      ? (() => {
                          try {
                            return JSON.parse(contactDetails.address)
                          } catch {
                            return contactDetails.address
                          }
                        })()
                      : contactDetails.address
                  )}
                </div>
              </div>
            )}
            {contactDetails.email && (
              <div>
                <span className="text-primary-400 font-semibold">Email:</span>
                <span className="ml-2 text-primary-100">
                  {contactDetails.email}
                </span>
              </div>
            )}
            {contactDetails.phone && (
              <div>
                <span className="text-primary-400 font-semibold">Phone:</span>
                <span className="ml-2 text-primary-100">
                  {contactDetails.phone}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message Section */}
      {event.content && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-primary-200 border-b border-primary-700 pb-2">
            Message
          </h3>
          <div className="bg-primary-800/20 p-4 rounded-lg whitespace-pre-wrap text-primary-100">
            {event.content}
          </div>
        </div>
      )}
    </div>
  )
}

const OrderNotFoundComponent: React.FC<{ merchant: NostrProfile }> = ({
  merchant
}) => {
  return (
    <div className="text-center p-8 w-full relative">
      <div className="text-2xl font-bold mb-4 text-primary-200">
        Order details not found
      </div>
      <div className="text-primary-400 mb-2">
        We could not find the original order for this payment request.
      </div>
      <div className="text-primary-400 mb-4">
        This may be due to relay sync issues or missing data.
      </div>
      {/* Merchant info for payment requests */}
      <div className="flex flex-col items-center gap-1 mt-4">
        <span className="text-primary-400 text-xs font-semibold">
          Merchant:
        </span>
        <div className="flex items-center gap-2 justify-center">
          <Avatar
            imageUrl={merchant.picture}
            alt={merchant.name || merchant.npub}
            size="sm"
            npub={merchant.npub}
            href={`https://njump.me/${merchant.npub}`}
          />
          <span className="text-primary-100 font-medium text-sm">
            {merchant.displayName || merchant.name || merchant.npub}
          </span>
          <a
            href={`https://njump.me/${merchant.npub}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 text-xs hover:underline break-all"
          >
            {merchant.npub}
          </a>
        </div>
      </div>
    </div>
  )
}

function formatAddress(address: any) {
  if (!address || typeof address !== 'object') return null
  return (
    <div className="space-y-1">
      {address.firstName || address.lastName ? (
        <div>
          <span className="font-semibold">
            {address.firstName} {address.lastName}
          </span>
        </div>
      ) : null}
      {address.addressLine1 && <div>{address.addressLine1}</div>}
      {address.addressLine2 && <div>{address.addressLine2}</div>}
      {address.city && address.region && (
        <div>
          {address.city}, {address.region}
        </div>
      )}
      {address.postalCode && <div>{address.postalCode}</div>}
      {address.country && <div>{address.country}</div>}
      {address.street && !address.addressLine1 && <div>{address.street}</div>}
      {/* fallback for any other fields */}
    </div>
  )
}

export default OrderDetails
