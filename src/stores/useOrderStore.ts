import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { type NostrEvent } from '@nostr-dev-kit/ndk'

export enum OrderEventType {
  ORDER = 'order',
  PAYMENT_REQUEST = 'payment_request',
  STATUS_UPDATE = 'status_update',
  SHIPPING_UPDATE = 'shipping_update',
  PAYMENT_RECEIPT = 'receipt'
}

export enum OrderProcessingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

export interface StoredOrderEvent {
  id: string // Event ID
  orderId: string // Order ID from the order tag
  event: NostrEvent // The full Nostr event
  type: OrderEventType // Type of order event
  unread: boolean // Whether the order needs attention
  timestamp: number // Event timestamp
  processingStatus?: OrderProcessingStatus // For tracking payment/shipping process
  error?: string // Error message if any
}

interface OrderState {
  orders: StoredOrderEvent[]
  paymentRequests: StoredOrderEvent[]
  statusUpdates: StoredOrderEvent[]
  shippingUpdates: StoredOrderEvent[]
  receipts: StoredOrderEvent[]

  isSubscribed: boolean
  isLoading: boolean
  error: string | null
  selectedOrderId: string | null

  setIsSubscribed: (value: boolean) => void
  setIsLoading: (value: boolean) => void
  setError: (error: string | null) => void
  addOrderEvent: (order: StoredOrderEvent) => void

  markAsRead: (orderId: string, type: OrderEventType) => void
  markAllAsRead: () => void
  clearAllOrders: () => void
  setSelectedOrderEvent: (orderId: string | null) => void
  setOrderProcessingStatus: (
    orderId: string,
    status: OrderProcessingStatus,
    type: OrderEventType
  ) => void

  getUnreadCount: (type: OrderEventType) => number
  getOrders: () => StoredOrderEvent[]
  getPaymentRequests: () => StoredOrderEvent[]
  getStatusUpdates: () => StoredOrderEvent[]
  getShippingUpdates: () => StoredOrderEvent[]
  getReceipts: () => StoredOrderEvent[]
  getOrderById: (
    orderId: string,
    type: OrderEventType
  ) => StoredOrderEvent | undefined
  getAllOrderEventsOfType: (type: OrderEventType) => StoredOrderEvent[] // For backward compatibility
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      paymentRequests: [],
      statusUpdates: [],
      shippingUpdates: [],
      receipts: [],

      isSubscribed: false,
      isLoading: false,
      error: null,
      selectedOrderId: null,

      setIsSubscribed: (value: boolean) => set({ isSubscribed: value }),
      setIsLoading: (value: boolean) => set({ isLoading: value }),
      setError: (error: string | null) => set({ error }),

      addOrderEvent: (order: StoredOrderEvent) => {
        set((state) => {
          switch (order.type) {
            case OrderEventType.ORDER:
              if (state.orders.some((o) => o.orderId === order.orderId)) {
                return state
              }
              return {
                ...state,
                orders: [...state.orders, order]
              }
            case OrderEventType.PAYMENT_REQUEST:
              const isDuplicate = state.paymentRequests.some(
                (o) => o.orderId === order.orderId
              )
              if (isDuplicate) {
                return state
              }
              return {
                ...state,
                paymentRequests: [...state.paymentRequests, order]
              }
            case OrderEventType.STATUS_UPDATE:
              if (
                state.statusUpdates.some((o) => o.orderId === order.orderId)
              ) {
                return state
              }
              return {
                ...state,
                statusUpdates: [...state.statusUpdates, order]
              }
            case OrderEventType.SHIPPING_UPDATE:
              if (
                state.shippingUpdates.some((o) => o.orderId === order.orderId)
              ) {
                return state
              }
              return {
                ...state,
                shippingUpdates: [...state.shippingUpdates, order]
              }
            case OrderEventType.PAYMENT_RECEIPT:
              if (state.receipts.some((o) => o.orderId === order.orderId)) {
                return state
              }
              return {
                ...state,
                receipts: [...state.receipts, order]
              }
            default:
              return state // Unknown type, do nothing
          }
        })
      },

      markAsRead: (orderId: string, type: OrderEventType) => {
        set((state) => {
          switch (type) {
            case OrderEventType.ORDER: {
              const index = state.orders.findIndex((o) => o.orderId === orderId)
              if (index >= 0) {
                const orders = [...state.orders]
                orders[index] = { ...orders[index], unread: false }
                return { ...state, orders }
              }
              break
            }
            case OrderEventType.PAYMENT_REQUEST: {
              const index = state.paymentRequests.findIndex(
                (o) => o.orderId === orderId
              )
              if (index >= 0) {
                const paymentRequests = [...state.paymentRequests]
                paymentRequests[index] = {
                  ...paymentRequests[index],
                  unread: false
                }
                return { ...state, paymentRequests }
              }
              break
            }
            case OrderEventType.STATUS_UPDATE: {
              const index = state.statusUpdates.findIndex(
                (o) => o.orderId === orderId
              )
              if (index >= 0) {
                const statusUpdates = [...state.statusUpdates]
                statusUpdates[index] = {
                  ...statusUpdates[index],
                  unread: false
                }
                return { ...state, statusUpdates }
              }
              break
            }
            case OrderEventType.SHIPPING_UPDATE: {
              const index = state.shippingUpdates.findIndex(
                (o) => o.orderId === orderId
              )
              if (index >= 0) {
                const shippingUpdates = [...state.shippingUpdates]
                shippingUpdates[index] = {
                  ...shippingUpdates[index],
                  unread: false
                }
                return { ...state, shippingUpdates }
              }
              break
            }
            case OrderEventType.PAYMENT_RECEIPT: {
              const index = state.receipts.findIndex(
                (o) => o.orderId === orderId
              )
              if (index >= 0) {
                const receipts = [...state.receipts]
                receipts[index] = { ...receipts[index], unread: false }
                return { ...state, receipts }
              }
              break
            }
          }
          return state // No matching order found
        })
      },

      markAllAsRead: () => {
        set((state) => {
          const markAllRead = (messages: StoredOrderEvent[]) =>
            messages.map((order) => ({ ...order, unread: false }))

          return {
            ...state,
            orders: markAllRead(state.orders),
            paymentRequests: markAllRead(state.paymentRequests),
            statusUpdates: markAllRead(state.statusUpdates),
            shippingUpdates: markAllRead(state.shippingUpdates),
            receipts: markAllRead(state.receipts)
          }
        })
      },

      clearAllOrders: () => {
        set({
          orders: [],
          paymentRequests: [],
          statusUpdates: [],
          shippingUpdates: [],
          receipts: [],
          selectedOrderId: null
        })
      },

      setSelectedOrderEvent: (
        orderId: string | null,
        type?: OrderEventType
      ) => {
        set({ selectedOrderId: orderId })

        if (orderId && type) {
          get().markAsRead(orderId, type)
        } else if (orderId) {
          // Legacy behavior if type is not provided (for backward compatibility)
          // Find the message type by searching in all arrays
          const state = get()

          if (state.orders.some((o) => o.orderId === orderId)) {
            get().markAsRead(orderId, OrderEventType.ORDER)
          } else if (state.paymentRequests.some((o) => o.orderId === orderId)) {
            get().markAsRead(orderId, OrderEventType.PAYMENT_REQUEST)
          } else if (state.statusUpdates.some((o) => o.orderId === orderId)) {
            get().markAsRead(orderId, OrderEventType.STATUS_UPDATE)
          } else if (state.shippingUpdates.some((o) => o.orderId === orderId)) {
            get().markAsRead(orderId, OrderEventType.SHIPPING_UPDATE)
          } else if (state.receipts.some((o) => o.orderId === orderId)) {
            get().markAsRead(orderId, OrderEventType.PAYMENT_RECEIPT)
          }
        }
      },

      setOrderProcessingStatus: (
        orderId: string,
        status: OrderProcessingStatus,
        type: OrderEventType
      ) => {
        set((state) => {
          switch (type) {
            case OrderEventType.ORDER: {
              const index = state.orders.findIndex((o) => o.orderId === orderId)
              if (index >= 0) {
                const orders = [...state.orders]
                orders[index] = { ...orders[index], processingStatus: status }
                return { ...state, orders }
              }
              break
            }
            case OrderEventType.PAYMENT_REQUEST: {
              const index = state.paymentRequests.findIndex(
                (o) => o.orderId === orderId
              )
              if (index >= 0) {
                const paymentRequests = [...state.paymentRequests]
                paymentRequests[index] = {
                  ...paymentRequests[index],
                  processingStatus: status
                }
                return { ...state, paymentRequests }
              }
              break
            }
            case OrderEventType.STATUS_UPDATE: {
              const index = state.statusUpdates.findIndex(
                (o) => o.orderId === orderId
              )
              if (index >= 0) {
                const statusUpdates = [...state.statusUpdates]
                statusUpdates[index] = {
                  ...statusUpdates[index],
                  processingStatus: status
                }
                return { ...state, statusUpdates }
              }
              break
            }
            case OrderEventType.SHIPPING_UPDATE: {
              const index = state.shippingUpdates.findIndex(
                (o) => o.orderId === orderId
              )
              if (index >= 0) {
                const shippingUpdates = [...state.shippingUpdates]
                shippingUpdates[index] = {
                  ...shippingUpdates[index],
                  processingStatus: status
                }
                return { ...state, shippingUpdates }
              }
              break
            }
            case OrderEventType.PAYMENT_RECEIPT: {
              const index = state.receipts.findIndex(
                (o) => o.orderId === orderId
              )
              if (index >= 0) {
                const receipts = [...state.receipts]
                receipts[index] = {
                  ...receipts[index],
                  processingStatus: status
                }
                return { ...state, receipts }
              }
              break
            }
          }
          return state // No matching order found
        })
      },

      getUnreadCount: (type: OrderEventType) => {
        const state = get()

        switch (type) {
          case OrderEventType.ORDER:
            return state.orders.filter((o) => o.unread).length
          case OrderEventType.PAYMENT_REQUEST:
            return state.paymentRequests.filter((o) => o.unread).length
          case OrderEventType.STATUS_UPDATE:
            return state.statusUpdates.filter((o) => o.unread).length
          case OrderEventType.SHIPPING_UPDATE:
            return state.shippingUpdates.filter((o) => o.unread).length
          case OrderEventType.PAYMENT_RECEIPT:
            return state.receipts.filter((o) => o.unread).length
          default:
            return 0
        }
      },

      getOrders: () => {
        return get().orders.sort((a, b) => b.timestamp - a.timestamp)
      },

      getPaymentRequests: () => {
        return get().paymentRequests.sort((a, b) => b.timestamp - a.timestamp)
      },

      getStatusUpdates: () => {
        return get().statusUpdates.sort((a, b) => b.timestamp - a.timestamp)
      },

      getShippingUpdates: () => {
        return get().shippingUpdates.sort((a, b) => b.timestamp - a.timestamp)
      },

      getReceipts: () => {
        return get().receipts.sort((a, b) => b.timestamp - a.timestamp)
      },

      getOrderById: (orderId: string, type: OrderEventType) => {
        const state = get()

        switch (type) {
          case OrderEventType.ORDER:
            return state.orders.find((order) => order.orderId === orderId)
          case OrderEventType.PAYMENT_REQUEST:
            return state.paymentRequests.find(
              (order) => order.orderId === orderId
            )
          case OrderEventType.STATUS_UPDATE:
            return state.statusUpdates.find(
              (order) => order.orderId === orderId
            )
          case OrderEventType.SHIPPING_UPDATE:
            return state.shippingUpdates.find(
              (order) => order.orderId === orderId
            )
          case OrderEventType.PAYMENT_RECEIPT:
            return state.receipts.find((order) => order.orderId === orderId)
          default:
            return undefined
        }
      },

      getAllOrderEventsOfType: (type: OrderEventType) => {
        const state = get()
        switch (type) {
          case OrderEventType.ORDER:
            return state.orders.sort((a, b) => b.timestamp - a.timestamp)
          case OrderEventType.PAYMENT_REQUEST:
            return state.paymentRequests.sort(
              (a, b) => b.timestamp - a.timestamp
            )
          case OrderEventType.STATUS_UPDATE:
            return state.statusUpdates.sort((a, b) => b.timestamp - a.timestamp)
          case OrderEventType.SHIPPING_UPDATE:
            return state.shippingUpdates.sort(
              (a, b) => b.timestamp - a.timestamp
            )
          case OrderEventType.PAYMENT_RECEIPT:
            return state.receipts.sort((a, b) => b.timestamp - a.timestamp)
          default:
            return []
        }
      }
    }),
    {
      name: 'conduit-customer-orders',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        orders: state.orders,
        paymentRequests: state.paymentRequests,
        statusUpdates: state.statusUpdates,
        shippingUpdates: state.shippingUpdates,
        receipts: state.receipts,
        selectedOrderId: state.selectedOrderId
      })
    }
  )
)
