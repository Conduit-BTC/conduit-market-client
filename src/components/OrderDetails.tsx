import React, { useState } from 'react'
import { type NostrEvent } from '@nostr-dev-kit/ndk'
import { OrderUtils } from 'nostr-commerce-schema'
import BitcoinQR from './BitcoinQR'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Avatar from './Avatar'
import { useNostrProfile } from '@/hooks/useNostrProfile'

interface OrderDetailsProps {
  event: NostrEvent
  orderDetailsEvent?: NostrEvent // for payment requests, show the original order details
  onClose?: () => void
  onPayNow?: () => void
  orderNotFound?: boolean // if true, show a message
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  event,
  orderDetailsEvent,
  onPayNow,
  orderNotFound
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const {
    formatSats,
    getOrderContactDetails,
    getOrderItems,
    getPaymentMethod,
    getTrackingInfo
  } = OrderUtils

  // Use the order details event if provided (for payment requests)
  const detailsEvent = orderDetailsEvent || event

  const orderIdTag = detailsEvent.tags.find((tag) => tag[0] === 'order')
  const orderId = orderIdTag && orderIdTag[1] ? orderIdTag[1] : 'Unknown'

  const amountTag = detailsEvent.tags.find((tag) => tag[0] === 'amount')
  const amount = amountTag && amountTag[1] ? amountTag[1] : null

  const typeTag = detailsEvent.tags.find((tag) => tag[0] === 'type')
  const type = typeTag && typeTag[1] ? typeTag[1] : null

  // For payment requests
  const paymentMethod = getPaymentMethod(event)

  // For shipping updates
  const trackingInfo = getTrackingInfo(detailsEvent)
  // Extract status from tags for shipping/status updates
  const statusTag = detailsEvent.tags.find((tag) => tag[0] === 'status')
  const status = statusTag && statusTag[1] ? statusTag[1] : undefined

  // For orders
  const items = type === '1' ? getOrderItems(detailsEvent as any) : []
  const contactDetails =
    type === '1' ? getOrderContactDetails(detailsEvent as any) : null

  // For payment receipts
  const paymentTags =
    detailsEvent.kind === 17
      ? detailsEvent.tags.filter((tag) => tag[0] === 'payment')
      : []

  // Show QR for payment requests with lightning invoice
  const showLightningQR = event && getPaymentMethod(event)?.type === 'lightning'

  // Find merchant info (for payment requests, use event.pubkey)
  const merchantPubkey = event.pubkey
  const merchant = useNostrProfile(merchantPubkey)

  if (orderNotFound) {
    return (
      <div className="bg-primary-900 text-primary-100 rounded-lg shadow-sm p-8 text-center">
        <div className="text-2xl font-bold mb-4 text-primary-300">
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
              picture={merchant.picture}
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
              className="text-primary-400 text-xs hover:underline"
            >
              {merchant.npub}
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-primary-900 text-primary-100 rounded-lg shadow-sm p-6">
      {showLightningQR && paymentMethod && (
        <div className="mb-8">
          <BitcoinQR lightningInvoice={paymentMethod.value} width={300} />
        </div>
      )}
      {/* Advanced toggle */}
      <div className="flex justify-end mb-2">
        <button
          className="flex items-center gap-1 text-primary-400 hover:text-primary-200 transition-colors text-sm font-medium"
          onClick={() => setShowAdvanced((v) => !v)}
        >
          {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>
      {showAdvanced && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Order Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-primary-200 mb-2">
                Basic Information
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="text-primary-400">Order ID:</span> {orderId}
                </p>
                {/* Merchant info for payment requests, below Order ID */}
                <div className="flex flex-col gap-1 mt-1 mb-2">
                  <span className="text-primary-400 text-xs font-semibold">
                    Merchant:
                  </span>
                  <div className="flex items-center gap-2">
                    <Avatar
                      picture={merchant.picture}
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
                      className="text-primary-400 text-xs hover:underline"
                    >
                      {merchant.npub}
                    </a>
                  </div>
                </div>
                {amount && (
                  <p>
                    <span className="text-primary-400">Amount:</span>{' '}
                    {formatSats(amount)}
                  </p>
                )}
                <p>
                  <span className="text-primary-400">Type:</span>{' '}
                  {type === '1'
                    ? 'Order Creation'
                    : type === '2'
                    ? 'Payment Request'
                    : type === '3'
                    ? 'Status Update'
                    : type === '4'
                    ? 'Shipping Update'
                    : detailsEvent.kind === 17
                    ? 'Payment Receipt'
                    : 'Unknown'}
                </p>
                <p>
                  <span className="text-primary-400">Date:</span>{' '}
                  {detailsEvent.created_at
                    ? new Date(detailsEvent.created_at * 1000).toLocaleString()
                    : 'Unknown'}
                </p>
              </div>
            </div>

            <div>
              {/* Show relevant details based on order type */}
              {type === '1' && items.length > 0 && (
                <>
                  <h3 className="font-medium text-primary-200 mb-2">Items</h3>
                  <ul className="space-y-2">
                    {items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.productRef}</span>
                        <span>Qty: {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {contactDetails && (
                <>
                  <h3 className="font-medium text-primary-200 mt-4 mb-2">
                    Contact Details
                  </h3>
                  {contactDetails.address && (
                    <p>
                      <span className="text-primary-400">Address:</span>{' '}
                      {contactDetails.address}
                    </p>
                  )}
                  {contactDetails.email && (
                    <p>
                      <span className="text-primary-400">Email:</span>{' '}
                      {contactDetails.email}
                    </p>
                  )}
                  {contactDetails.phone && (
                    <p>
                      <span className="text-primary-400">Phone:</span>{' '}
                      {contactDetails.phone}
                    </p>
                  )}
                </>
              )}

              {(type === '3' || type === '4') && (
                <>
                  <h3 className="font-medium text-primary-200 mb-2">
                    {type === '3'
                      ? 'Order Status Update'
                      : 'Shipping Information'}
                  </h3>
                  {status && (
                    <p>
                      <span className="text-primary-400">Status:</span> {status}
                    </p>
                  )}
                  {trackingInfo.tracking && (
                    <p>
                      <span className="text-primary-400">Tracking:</span>{' '}
                      {trackingInfo.tracking}
                    </p>
                  )}
                  {trackingInfo.carrier && (
                    <p>
                      <span className="text-primary-400">Carrier:</span>{' '}
                      {trackingInfo.carrier}
                    </p>
                  )}
                  {trackingInfo.eta && (
                    <p>
                      <span className="text-primary-400">ETA:</span>{' '}
                      {trackingInfo.eta.toLocaleString()}
                    </p>
                  )}
                </>
              )}

              {detailsEvent.kind === 17 && paymentTags.length > 0 && (
                <>
                  <h3 className="font-medium text-primary-200 mb-2">
                    Payment Receipt
                  </h3>
                  {paymentTags.map((tag, index) => (
                    <div key={index} className="mb-2">
                      <p>
                        <span className="text-primary-400">Method:</span>{' '}
                        {tag[1]}
                      </p>
                      <p>
                        <span className="text-primary-400">Reference:</span>{' '}
                        {tag[2]}
                      </p>
                      {tag[3] && (
                        <p>
                          <span className="text-primary-400">Proof:</span>{' '}
                          {tag[3]}
                        </p>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Show the message content if present */}
          {detailsEvent.content && (
            <div className="mt-6">
              <h3 className="font-medium text-primary-200 mb-2">Message</h3>
              <div className="bg-primary-800 p-4 rounded-sm whitespace-pre-wrap">
                {detailsEvent.content}
              </div>
            </div>
          )}
        </div>
      )}
      {/* If this is a payment request and onPayNow is provided, show a Pay Now button in the advanced view */}
      {showAdvanced && onPayNow && (
        <div className="mt-6 flex justify-end">
          <button
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            onClick={onPayNow}
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
