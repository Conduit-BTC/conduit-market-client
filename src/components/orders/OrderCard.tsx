import React from 'react'
import Button from '@/components/Buttons/Button'
import Icon from '@/components/Icon'
import Avatar from '@/components/Avatar'
import { useNostrProfile } from '@/hooks/useNostrProfile'
import { usePaymentExpiration } from '@/hooks/usePaymentExpiration'
import { OrderEventType, type StoredOrderEvent } from '@/stores/useOrderStore'
import { OrderUtils } from 'nostr-commerce-schema'

const OrderCard: React.FC<{
  order: StoredOrderEvent
  onClick: () => void
  onPayNow?: () => void
  receipts?: StoredOrderEvent[]
}> = ({ order, onClick, onPayNow, receipts }) => {
  const { event, orderId, type, unread, timestamp } = order

  const isPaidInvoice =
    type === OrderEventType.PAYMENT_REQUEST &&
    receipts &&
    receipts.some((r) => r.orderId === orderId)

  const getOrderTypeInfo = () => {
    if (isPaidInvoice) {
      return {
        title: 'Paid Invoice',
        icon: <Icon.ReceiptText className="size-5" />,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200'
      }
    }
    switch (type) {
      case OrderEventType.ORDER:
        return {
          title: 'Order',
          icon: <Icon.ShoppingBag className="size-5" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        }
      case OrderEventType.PAYMENT_REQUEST:
        return {
          title: 'Payment Request',
          icon: <Icon.Zap className="size-5" />,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        }
      case OrderEventType.STATUS_UPDATE:
        return {
          title: 'Status Update',
          icon: <Icon.Alert className="size-5" />,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        }
      case OrderEventType.SHIPPING_UPDATE:
        return {
          title: 'Shipping Update',
          icon: <Icon.ShoppingCart className="size-5" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        }
      case OrderEventType.PAYMENT_RECEIPT:
        return {
          title: 'Receipt',
          icon: <Icon.ReceiptText className="size-5" />,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200'
        }
      default:
        return {
          title: 'Order Notification',
          icon: <Icon.ShoppingBag className="size-5" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        }
    }
  }

  const typeInfo = getOrderTypeInfo()
  const amount = OrderUtils.getOrderAmount(event as any)
  const formattedTime = OrderUtils.formatOrderTime(timestamp)

  // Add merchant info and expiration for payment requests
  let merchantInfo = null
  let expirationInfo = null
  if (type === OrderEventType.PAYMENT_REQUEST) {
    // Always use the DM's pubkey (event.pubkey, the 'rumor' sender) for merchant info
    const merchant = useNostrProfile(event.pubkey)
    const username = merchant.displayName || merchant.name
    const npub = merchant.npub
    const avatar = (
      <Avatar
        imageUrl={merchant.picture}
        alt={username || npub}
        size="sm"
        npub={npub}
        href={`https://njump.me/${npub}`}
      />
    )
    merchantInfo = (
      <div className="flex items-center gap-2 text-sm mt-1 mb-1">
        <span className="text-primary-400 font-semibold">Merchant:</span>
        {avatar}
        {username && (
          <span className="text-primary-100 font-bold">{username}</span>
        )}
        <a
          href={`https://njump.me/${npub}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-400 text-xs hover:underline font-mono"
        >
          {npub}
        </a>
      </div>
    )

    // Only show expiration if not paid
    if (!isPaidInvoice) {
      const {
        formattedTime: expirationTime,
        isExpired,
        expirationSource
      } = usePaymentExpiration(event)
      expirationInfo = (
        <div
          className={`font-mono text-base mb-2 mt-2 px-2 py-1 rounded-lg shadow-sm ${
            isExpired
              ? 'bg-red-900 text-red-300'
              : 'bg-orange-900 text-orange-300'
          }`}
        >
          <span className="font-bold">
            {isExpired ? 'Expired' : 'Expires:'}
          </span>{' '}
          {isExpired
            ? expirationTime || 'Expired'
            : expirationTime || 'No expiration'}
          {expirationSource !== 'none' && (
            <span className="ml-2 text-xs opacity-75">
              (Source:{' '}
              {expirationSource === 'lightning'
                ? 'Lightning Invoice'
                : 'Nostr Event'}
              )
            </span>
          )}
        </div>
      )
    }
  }

  // Handler: clicking Payment Request opens Pay Now, others open View
  const handleCardClick = () => {
    if (type === OrderEventType.PAYMENT_REQUEST && onPayNow) {
      onPayNow()
    } else {
      onClick()
    }
  }

  return (
    <div
      className={`border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md bg-paper border-muted`}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Order Type Icon */}
          <div className={`${typeInfo.color} mt-1`}>{typeInfo.icon}</div>

          {/* Order Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`voice-2l font-semibold ${typeInfo.color}`}>
                {typeInfo.title}
              </h3>
              {isPaidInvoice && (
                <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                  Paid
                </span>
              )}
              {!isPaidInvoice && unread && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  New
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground my-1">
              <span>{formattedTime}</span>
            </div>
            {amount && (
              <h4 className="voice-base font-semibold text-orange-600 mb-1">
                {OrderUtils.formatSats(amount)}
              </h4>
            )}
            {/* Order ID on its own line, purple label */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span className="text-primary-400 font-semibold">Order ID:</span>
              <span className="text-primary-100">{orderId}</span>
            </div>
            {/* Merchant info on its own line, inline */}
            {type === OrderEventType.PAYMENT_REQUEST && merchantInfo}
            {/* Show expiration only if not paid */}
            {type === OrderEventType.PAYMENT_REQUEST &&
              !isPaidInvoice &&
              expirationInfo}
            {/* Show tracking info for shipping updates */}
            {type === OrderEventType.SHIPPING_UPDATE && (
              <div className="mt-3">
                {(() => {
                  const { tracking, carrier } =
                    OrderUtils.getTrackingInfo(event)
                  return (
                    <div className="flex items-center gap-2 text-sm">
                      {carrier && (
                        <span className="font-medium">{carrier}</span>
                      )}
                      {tracking && (
                        <>
                          <span>•</span>
                          <span className="font-mono">{tracking}</span>
                        </>
                      )}
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 ml-4">
          {/* Only show Pay Now if not paid */}
          {type === OrderEventType.PAYMENT_REQUEST && !isPaidInvoice && (
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                if (e) e.stopPropagation()
                onPayNow && onPayNow()
              }}
            >
              <Icon.Zap className="size-4" />
              Pay Now
            </Button>
          )}

          {type === OrderEventType.SHIPPING_UPDATE &&
            (() => {
              const { tracking } = OrderUtils.getTrackingInfo(event)
              return tracking ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    if (e) e.stopPropagation()
                    onClick()
                  }}
                >
                  <Icon.Link className="size-4" />
                  Track
                </Button>
              ) : null
            })()}

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              if (e) e.stopPropagation()
              onClick()
            }}
          >
            <Icon.Search className="size-4" />
            View
          </Button>
        </div>
      </div>
      {/* Remove event.content preview for payment requests */}
      {event.content && type !== OrderEventType.PAYMENT_REQUEST && (
        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
          <p className="voice-sm text-muted-foreground line-clamp-2">
            {event.content}
          </p>
        </div>
      )}
    </div>
  )
}

export default OrderCard
