import React, { useState, useRef, useEffect } from 'react'
import {
  OrderEventType,
  type StoredOrderEvent,
  useOrderStore
} from '@/stores/useOrderStore'
import { useOrderSubscription } from '@/hooks/useOrderSubscription'
import { OrderUtils } from 'nostr-commerce-schema'
import PageSection from '@/layouts/PageSection'
import Icon from '@/components/Icon'
import Button from '@/components/Buttons/Button'
import OrderDetails from '@/components/OrderDetails'
import type { NostrEvent } from '@nostr-dev-kit/ndk'
import OrderPayQR from '@/components/OrderPayQR'
import Avatar from '@/components/Avatar'
import { useNostrProfile } from '@/hooks/useNostrProfile'

enum OrderTab {
  ALL = 'all',
  PAYMENT_REQUESTS = 'payment_requests',
  STATUS_UPDATES = 'status_updates',
  SHIPPING_UPDATES = 'shipping_updates',
  RECEIPTS = 'receipts'
}

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderTab>(OrderTab.ALL)
  const [selectedOrder, setSelectedOrder] = useState<StoredOrderEvent | null>(
    null
  )
  const [showQRModal, setShowQRModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const {
    getOrders,
    getPaymentRequests,
    getStatusUpdates,
    getShippingUpdates,
    getReceipts,
    getUnreadCount,
    getOrderById
  } = useOrderStore()

  // Use the subscription hook directly
  const { isLoading, error } = useOrderSubscription()

  // Get all orders for the current tab
  const getFilteredOrders = (): StoredOrderEvent[] => {
    switch (activeTab) {
      case OrderTab.PAYMENT_REQUESTS:
        return getPaymentRequests()
      case OrderTab.STATUS_UPDATES:
        return getStatusUpdates()
      case OrderTab.SHIPPING_UPDATES:
        return getShippingUpdates()
      case OrderTab.RECEIPTS:
        return getReceipts()
      case OrderTab.ALL:
      default:
        // Combine all orders and sort by timestamp
        const allOrders = [
          ...getOrders(),
          ...getPaymentRequests(),
          ...getStatusUpdates(),
          ...getShippingUpdates(),
          ...getReceipts()
        ]
        return allOrders.sort((a, b) => b.timestamp - a.timestamp)
    }
  }

  // Handler for Pay Now (always opens QR modal)
  const handlePayNow = (order: StoredOrderEvent) => {
    setSelectedOrder(order)
    setShowQRModal(true)
    setShowDetailsModal(false)
  }

  // Handler for View (opens details modal)
  const handleView = (order: StoredOrderEvent) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
    setShowQRModal(false)
  }

  // For payment requests, find the original order event
  const getOrderDetailsEvent = (order: StoredOrderEvent) => {
    if (order.type === OrderEventType.PAYMENT_REQUEST) {
      return getOrderById(order.orderId, OrderEventType.ORDER)?.event
    }
    return undefined
  }

  const getTabLabel = (tab: OrderTab): string => {
    switch (tab) {
      case OrderTab.ALL:
        return 'All Orders'
      case OrderTab.PAYMENT_REQUESTS:
        return 'Payment Requests'
      case OrderTab.STATUS_UPDATES:
        return 'Status Updates'
      case OrderTab.SHIPPING_UPDATES:
        return 'Shipping Updates'
      case OrderTab.RECEIPTS:
        return 'Receipts'
      default:
        return 'Orders'
    }
  }

  const getTabIcon = (tab: OrderTab) => {
    switch (tab) {
      case OrderTab.ALL:
        return <Icon.ShoppingBag />
      case OrderTab.PAYMENT_REQUESTS:
        return <Icon.Zap />
      case OrderTab.STATUS_UPDATES:
        return <Icon.Alert />
      case OrderTab.SHIPPING_UPDATES:
        return <Icon.ShoppingCart />
      case OrderTab.RECEIPTS:
        return <Icon.ReceiptText />
      default:
        return <Icon.ShoppingBag />
    }
  }

  const getUnreadCountForTab = (tab: OrderTab): number => {
    switch (tab) {
      case OrderTab.PAYMENT_REQUESTS:
        return getUnreadCount(OrderEventType.PAYMENT_REQUEST)
      case OrderTab.STATUS_UPDATES:
        return getUnreadCount(OrderEventType.STATUS_UPDATE)
      case OrderTab.SHIPPING_UPDATES:
        return getUnreadCount(OrderEventType.SHIPPING_UPDATE)
      case OrderTab.RECEIPTS:
        return getUnreadCount(OrderEventType.PAYMENT_RECEIPT)
      case OrderTab.ALL:
      default:
        return (
          getUnreadCount(OrderEventType.ORDER) +
          getUnreadCount(OrderEventType.PAYMENT_REQUEST) +
          getUnreadCount(OrderEventType.STATUS_UPDATE) +
          getUnreadCount(OrderEventType.SHIPPING_UPDATE) +
          getUnreadCount(OrderEventType.PAYMENT_RECEIPT)
        )
    }
  }

  const filteredOrders = getFilteredOrders()

  // Modal close on ESC
  useEffect(() => {
    if (!selectedOrder) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedOrder(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedOrder])

  return (
    <PageSection>
      <div className="grid gap-8 lg:flex lg:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap justify-between items-end">
            <h1 className="voice-4l">Orders</h1>
            <p className="voice-sm font-bold">
              {filteredOrders.length} order
              {filteredOrders.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-muted mt-8 overflow-x-auto">
            {Object.values(OrderTab).map((tab) => {
              const unreadCount = getUnreadCountForTab(tab)
              return (
                <button
                  key={tab}
                  className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-ink'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {getTabIcon(tab)}
                  <span>{getTabLabel(tab)}</span>
                  {unreadCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center p-12">
              <div className="text-lg text-muted-foreground">
                Loading orders...
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-6">
              Error: {error}
            </div>
          )}

          {/* Order list */}
          <div className="mt-8 space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Icon.ShoppingBag className="size-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="voice-2l text-muted-foreground mb-2">
                  No orders yet
                </h3>
                <p className="voice-base text-muted-foreground">
                  Your order notifications will appear here
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => handleView(order)}
                  onPayNow={() => handlePayNow(order)}
                />
              ))
            )}
          </div>
        </div>
      </div>
      {/* QR Modal for Pay Now */}
      {showQRModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setShowQRModal(false)}
          showQROnly={true}
        />
      )}
      {/* Details Modal for View */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setShowDetailsModal(false)}
          showQROnly={false}
          getOrderDetailsEvent={getOrderDetailsEvent}
          onPayNow={() => {
            setShowDetailsModal(false)
            setShowQRModal(true)
          }}
        />
      )}
    </PageSection>
  )
}

// Modal implementation
const OrderDetailsModal: React.FC<{
  order: StoredOrderEvent
  onClose: () => void
  showQROnly?: boolean
  getOrderDetailsEvent?: (order: StoredOrderEvent) => NostrEvent | undefined
  onPayNow?: () => void
}> = ({ order, onClose, showQROnly, getOrderDetailsEvent, onPayNow }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  // For payment requests, get the original order details event
  const orderDetailsEvent = getOrderDetailsEvent
    ? getOrderDetailsEvent(order)
    : undefined
  if (order.type === OrderEventType.PAYMENT_REQUEST) {
    if (orderDetailsEvent) {
      // Debug log: found associated order
      // eslint-disable-next-line no-console
      console.log(
        '[OrderDetailsModal] Matched Payment Request to Order:',
        order.orderId,
        orderDetailsEvent
      )
    } else {
      // Debug log: order not found
      // eslint-disable-next-line no-console
      console.warn(
        '[OrderDetailsModal] No associated Order found for Payment Request:',
        order.orderId
      )
    }
  }
  // For the details modal, show the associated order event (not the payment request event)
  const detailsEventToShow =
    order.type === OrderEventType.PAYMENT_REQUEST && orderDetailsEvent
      ? orderDetailsEvent
      : order.event

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        ref={modalRef}
        className="bg-paper rounded-lg shadow-lg max-w-2xl w-full p-0 relative animate-fade-in"
      >
        <button
          className="absolute top-4 right-4 text-2xl text-muted-foreground hover:text-ink"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {/* QR modal: only show QR and invoice */}
        {showQROnly ? (
          <OrderPayQR event={order.event} />
        ) : (
          <OrderDetails
            event={detailsEventToShow}
            orderDetailsEvent={undefined}
            onPayNow={onPayNow}
            orderNotFound={
              order.type === OrderEventType.PAYMENT_REQUEST &&
              !orderDetailsEvent
            }
          />
        )}
      </div>
    </div>
  )
}

// OrderCard Component
interface OrderCardProps {
  order: StoredOrderEvent
  onClick: () => void
  onPayNow?: () => void
}

function useExpirationCountdown(expiration?: number) {
  const [remaining, setRemaining] = React.useState<number | null>(null)
  React.useEffect(() => {
    if (!expiration) return
    const update = () => {
      const now = Math.floor(Date.now() / 1000)
      setRemaining(Math.max(0, expiration - now))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [expiration])
  if (remaining === null) return null
  if (remaining <= 0) return 'Expired'
  const m = Math.floor(remaining / 60)
  const s = remaining % 60
  return `${m > 0 ? m + 'm ' : ''}${s}s` + ' left'
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick, onPayNow }) => {
  const { event, orderId, type, unread, timestamp } = order

  const getOrderTypeInfo = () => {
    switch (type) {
      case OrderEventType.ORDER:
        return {
          title: 'New Order',
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
          title: 'Payment Receipt',
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
  console.log('Event: ')
  console.log(JSON.stringify(event))
  const formattedTime = OrderUtils.formatOrderTime(timestamp)

  // Add merchant info and expiration for payment requests
  let merchantInfo = null
  let expirationCountdown = null
  if (type === OrderEventType.PAYMENT_REQUEST) {
    // Always use the DM's pubkey (event.pubkey, the 'rumor' sender) for merchant info
    const merchant = useNostrProfile(event.pubkey)
    const username = merchant.displayName || merchant.name
    const npub = merchant.npub
    const avatar = (
      <Avatar
        picture={merchant.picture}
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
    const expirationTag = event.tags.find((t) => t[0] === 'expiration')
    const expiration = expirationTag ? parseInt(expirationTag[1]) : undefined
    expirationCountdown = useExpirationCountdown(expiration)
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
              {unread && (
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
            {/* Expiration countdown for payment requests */}
            {type === OrderEventType.PAYMENT_REQUEST && expirationCountdown && (
              <div className="text-orange-400 font-mono text-xs mb-1 mt-1">
                Expires: {expirationCountdown}
              </div>
            )}
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
          {type === OrderEventType.PAYMENT_REQUEST && (
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

export default OrdersPage
