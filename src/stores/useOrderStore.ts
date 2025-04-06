import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type NostrEvent } from '@nostr-dev-kit/ndk';
import { OrderUtils, type ProductListing } from 'nostr-commerce-schema';

export enum OrderEventType {
    ORDER = 'order',
    PAYMENT_REQUEST = 'payment_request',
    STATUS_UPDATE = 'status_update',
    SHIPPING_UPDATE = 'shipping_update',
    PAYMENT_RECEIPT = 'receipt'
}

// Status for order processing
export enum OrderProcessingStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    FAILED = 'failed'
}

export enum OrderErrorType {
    PAYMENT_FAILED = 'payment_failed',
    SHIPPING_FAILED = 'shipping_failed',
    OTHER = 'other'
}

// Interface for an order in our store
export interface OrderError {
    type: OrderErrorType
    message: string
    eventId?: string
}
export interface CM_Order {
    event: NostrEvent;    // The initial Order Creation event
    orderId: string;      // Order ID from the order tag
    timestamp: number;    // Event timestamp
    unread: boolean;      // Whether the order needs attention

    shippingEventId: string;     // Reference to shipping option
    address: string;             // Shipping address
    email?: string;              // Customer email
    phone?: string;              // Customer phone number
    items: ProductListing[];     // List of items in the order

    paymentRequest: CM_PaymentRequest; // Payment request
    statusUpdates: CM_StatusUpdate[];  // Status updates
    shippingUpdates: CM_ShippingUpdate[]; // Shipping updates
    receipts: NostrEvent[]; // Payment receipts

    processingStatus?: OrderProcessingStatus; // For tracking payment/shipping process
    errors?: OrderError[];       // Error messages
}

export interface CM_PaymentRequest {
    event: NostrEvent;    // The full Nostr event
    orderId: string;      // Order ID from the order tag
    timestamp: number;    // Event timestamp
    unread: boolean;      // Whether the order needs attention

    lightningInvoice?: string; // Lightning invoice for payment requests
}

export interface CM_StatusUpdate {
    event: NostrEvent;    // The full Nostr event
    orderId: string;      // Order ID from the order tag
    timestamp: number;    // Event timestamp
    unread: boolean;      // Whether the order needs attention

    message: string;      // Status update message
    status: OrderProcessingStatus; // Status of the order
}

export interface CM_ShippingUpdate {
    event: NostrEvent;    // The full Nostr event
    orderId: string;      // Order ID from the order tag
    timestamp: number;    // Event timestamp
    unread: boolean;      // Whether the order needs attention

    status: OrderProcessingStatus; // Status of the order

    message?: string;      // Shipping update message
    tracking?: string;   // Tracking number for shipping
    carrier?: string;    // Shipping carrier
    eta: number;         // Estimated time of arrival, unix timestamp
}

export interface CM_Receipt {
    event: NostrEvent;    // The full Nostr event
    orderId: string;      // Order ID from the order tag
    timestamp: number;    // Event timestamp
    unread: boolean;      // Whether the order needs attention

    paymentProof: string; // Payment proof
    amount: number;       // Amount paid
    currency: string;     // Currency code
}

interface OrderState {
    // Separate arrays for each message type instead of a single flat array
    orders: StoredOrderEvent[];
    paymentRequests: StoredOrderEvent[];
    statusUpdates: StoredOrderEvent[];
    shippingUpdates: StoredOrderEvent[];
    receipts: StoredOrderEvent[];

    // State
    isSubscribed: boolean;
    isLoading: boolean;
    error: string | null;
    selectedOrderId: string | null;

    // Methods for state management
    setIsSubscribed: (value: boolean) => void;
    setIsLoading: (value: boolean) => void;
    setError: (error: string | null) => void;
    addOrderEvent: (order: StoredOrderEvent) => void;

    // Methods for user interactions
    markAsRead: (orderId: string, type: OrderEventType) => void;
    markAllAsRead: () => void;
    setSelectedOrderEvent: (orderId: string | null) => void;
    setOrderProcessingStatus: (orderId: string, status: OrderProcessingStatus, type: OrderEventType) => void;

    // Getters for different order types
    getUnreadCount: (type: OrderEventType) => number;
    getOrders: () => StoredOrderEvent[];
    getPaymentRequests: () => StoredOrderEvent[];
    getStatusUpdates: () => StoredOrderEvent[];
    getShippingUpdates: () => StoredOrderEvent[];
    getReceipts: () => StoredOrderEvent[];
    getOrderById: (orderId: string, type: OrderEventType) => StoredOrderEvent | undefined;
    getAllOrderEventsOfType: (type: OrderEventType) => StoredOrderEvent[]; // For backward compatibility
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            // Separate arrays for each message type
            orders: [],
            paymentRequests: [],
            statusUpdates: [],
            shippingUpdates: [],
            receipts: [],

            isSubscribed: false,
            isLoading: false,
            error: null,
            selectedOrderId: null,

            // Update state methods
            setIsSubscribed: (value: boolean) => set({ isSubscribed: value }),
            setIsLoading: (value: boolean) => set({ isLoading: value }),
            setError: (error: string | null) => set({ error }),

            // Add a new order message to the appropriate array
            addOrderEvent: (order: StoredOrderEvent) => {
                set(state => {
                    switch (order.type) {
                        case OrderEventType.ORDER:
                            if (state.orders.some(o => o.id === order.id)) return state;
                            return {
                                ...state,
                                orders: [...state.orders, order]
                            };
                        case OrderEventType.PAYMENT_REQUEST:
                            if (state.paymentRequests.some(o => o.id === order.id)) return state;
                            console.log("Payment request order:", order.event);
                            const lightningInvoice = OrderUtils.getPaymentMethod(order.event)?.value;
                            return {
                                ...state,
                                paymentRequests: [...state.paymentRequests, { ...order, lightningInvoice }]
                            };
                        case OrderEventType.STATUS_UPDATE:
                            if (state.statusUpdates.some(o => o.id === order.id)) return state;
                            return {
                                ...state,
                                statusUpdates: [...state.statusUpdates, order]
                            };
                        case OrderEventType.SHIPPING_UPDATE:
                            if (state.shippingUpdates.some(o => o.id === order.id)) return state;
                            return {
                                ...state,
                                shippingUpdates: [...state.shippingUpdates, order]
                            };
                        case OrderEventType.PAYMENT_RECEIPT:
                            if (state.receipts.some(o => o.id === order.id)) return state;
                            return {
                                ...state,
                                receipts: [...state.receipts, order]
                            };
                        default:
                            return state; // Unknown type, do nothing
                    }
                });
            },

            // Methods for user interactions
            markAsRead: (orderId: string, type: OrderEventType) => {
                set(state => {
                    switch (type) {
                        case OrderEventType.ORDER: {
                            const index = state.orders.findIndex(o => o.orderId === orderId);
                            if (index >= 0) {
                                const orders = [...state.orders];
                                orders[index] = { ...orders[index], unread: false };
                                return { ...state, orders };
                            }
                            break;
                        }
                        case OrderEventType.PAYMENT_REQUEST: {
                            const index = state.paymentRequests.findIndex(o => o.orderId === orderId);
                            if (index >= 0) {
                                const paymentRequests = [...state.paymentRequests];
                                paymentRequests[index] = { ...paymentRequests[index], unread: false };
                                return { ...state, paymentRequests };
                            }
                            break;
                        }
                        case OrderEventType.STATUS_UPDATE: {
                            const index = state.statusUpdates.findIndex(o => o.orderId === orderId);
                            if (index >= 0) {
                                const statusUpdates = [...state.statusUpdates];
                                statusUpdates[index] = { ...statusUpdates[index], unread: false };
                                return { ...state, statusUpdates };
                            }
                            break;
                        }
                        case OrderEventType.SHIPPING_UPDATE: {
                            const index = state.shippingUpdates.findIndex(o => o.orderId === orderId);
                            if (index >= 0) {
                                const shippingUpdates = [...state.shippingUpdates];
                                shippingUpdates[index] = { ...shippingUpdates[index], unread: false };
                                return { ...state, shippingUpdates };
                            }
                            break;
                        }
                        case OrderEventType.PAYMENT_RECEIPT: {
                            const index = state.receipts.findIndex(o => o.orderId === orderId);
                            if (index >= 0) {
                                const receipts = [...state.receipts];
                                receipts[index] = { ...receipts[index], unread: false };
                                return { ...state, receipts };
                            }
                            break;
                        }
                    }
                    return state; // No matching order found
                });
            },

            markAllAsRead: () => {
                set(state => {
                    // Function to mark all as read in any array
                    const markAllRead = (messages: StoredOrderEvent[]) =>
                        messages.map(order => ({ ...order, unread: false }));

                    return {
                        ...state,
                        orders: markAllRead(state.orders),
                        paymentRequests: markAllRead(state.paymentRequests),
                        statusUpdates: markAllRead(state.statusUpdates),
                        shippingUpdates: markAllRead(state.shippingUpdates),
                        receipts: markAllRead(state.receipts)
                    };
                });
            },

            setSelectedOrderEvent: (orderId: string | null, type?: OrderEventType) => {
                set({ selectedOrderId: orderId });

                if (orderId && type) {
                    // Mark as read when selected
                    get().markAsRead(orderId, type);
                } else if (orderId) {
                    // Legacy behavior if type is not provided (for backward compatibility)
                    // Find the message type by searching in all arrays
                    const state = get();

                    if (state.orders.some(o => o.orderId === orderId)) {
                        get().markAsRead(orderId, OrderEventType.ORDER);
                    } else if (state.paymentRequests.some(o => o.orderId === orderId)) {
                        get().markAsRead(orderId, OrderEventType.PAYMENT_REQUEST);
                    } else if (state.statusUpdates.some(o => o.orderId === orderId)) {
                        get().markAsRead(orderId, OrderEventType.STATUS_UPDATE);
                    } else if (state.shippingUpdates.some(o => o.orderId === orderId)) {
                        get().markAsRead(orderId, OrderEventType.SHIPPING_UPDATE);
                    } else if (state.receipts.some(o => o.orderId === orderId)) {
                        get().markAsRead(orderId, OrderEventType.PAYMENT_RECEIPT);
                    }
                }
            },

            setOrderProcessingStatus: (orderId: string, status: OrderProcessingStatus, type: OrderEventType) => {
                set(state => {
                    switch (type) {
                        case OrderEventType.ORDER: {
                            const index = state.orders.findIndex(o => o.orderId === orderId);
                            if (index >= 0) {
                                const orders = [...state.orders];
                                orders[index] = { ...orders[index], processingStatus: status };
                                return { ...state, orders };
                            }
                            break;
                        }
                        case OrderEventType.PAYMENT_REQUEST: {
                            const index = state.paymentRequests.findIndex(o => o.orderId === orderId);
                            if (index >= 0) {
                                const paymentRequests = [...state.paymentRequests];
                                paymentRequests[index] = { ...paymentRequests[index], processingStatus: status };
                                return { ...state, paymentRequests };
                            }
                            break;
                        }
                        case OrderEventType.STATUS_UPDATE: {
                            const index = state.statusUpdates.findIndex(o => o.orderId === orderId);
                            if (index >= 0) {
                                const statusUpdates = [...state.statusUpdates];
                                statusUpdates[index] = { ...statusUpdates[index], processingStatus: status };
                                return { ...state, statusUpdates };
                            }
                            break;
                        }
                        case OrderEventType.SHIPPING_UPDATE: {
                            const index = state.shippingUpdates.findIndex(o => o.orderId === orderId);
                            if (index >= 0) {
                                const shippingUpdates = [...state.shippingUpdates];
                                shippingUpdates[index] = { ...shippingUpdates[index], processingStatus: status };
                                return { ...state, shippingUpdates };
                            }
                            break;
                        }
                        case OrderEventType.PAYMENT_RECEIPT: {
                            const index = state.receipts.findIndex(o => o.orderId === orderId);
                            if (index >= 0) {
                                const receipts = [...state.receipts];
                                receipts[index] = { ...receipts[index], processingStatus: status };
                                return { ...state, receipts };
                            }
                            break;
                        }
                    }
                    return state; // No matching order found
                });
            },

            // Getter methods - now they just return the arrays directly
            getUnreadCount: (type: OrderEventType) => {
                const state = get();

                // Return unread count for specific type
                switch (type) {
                    case OrderEventType.ORDER:
                        return state.orders.filter(o => o.unread).length;
                    case OrderEventType.PAYMENT_REQUEST:
                        return state.paymentRequests.filter(o => o.unread).length;
                    case OrderEventType.STATUS_UPDATE:
                        return state.statusUpdates.filter(o => o.unread).length;
                    case OrderEventType.SHIPPING_UPDATE:
                        return state.shippingUpdates.filter(o => o.unread).length;
                    case OrderEventType.PAYMENT_RECEIPT:
                        return state.receipts.filter(o => o.unread).length;
                    default:
                        return 0;
                }
            },

            getOrders: () => {
                return get().orders.sort((a, b) => b.timestamp - a.timestamp);
            },

            getPaymentRequests: () => {
                return get().paymentRequests.sort((a, b) => b.timestamp - a.timestamp);
            },

            getStatusUpdates: () => {
                return get().statusUpdates.sort((a, b) => b.timestamp - a.timestamp);
            },

            getShippingUpdates: () => {
                return get().shippingUpdates.sort((a, b) => b.timestamp - a.timestamp);
            },

            getReceipts: () => {
                return get().receipts.sort((a, b) => b.timestamp - a.timestamp);
            },

            getOrderById: (orderId: string, type: OrderEventType) => {
                const state = get();

                // Search in the specific array specified by type
                switch (type) {
                    case OrderEventType.ORDER:
                        return state.orders.find(order => order.orderId === orderId);
                    case OrderEventType.PAYMENT_REQUEST:
                        return state.paymentRequests.find(order => order.orderId === orderId);
                    case OrderEventType.STATUS_UPDATE:
                        return state.statusUpdates.find(order => order.orderId === orderId);
                    case OrderEventType.SHIPPING_UPDATE:
                        return state.shippingUpdates.find(order => order.orderId === orderId);
                    case OrderEventType.PAYMENT_RECEIPT:
                        return state.receipts.find(order => order.orderId === orderId);
                    default:
                        return undefined;
                }
            },

            // Helper method to get all messages of a specific type, with sorting
            getAllOrderEventsOfType: (type: OrderEventType) => {
                const state = get();
                switch (type) {
                    case OrderEventType.ORDER:
                        return state.orders.sort((a, b) => b.timestamp - a.timestamp);
                    case OrderEventType.PAYMENT_REQUEST:
                        return state.paymentRequests.sort((a, b) => b.timestamp - a.timestamp);
                    case OrderEventType.STATUS_UPDATE:
                        return state.statusUpdates.sort((a, b) => b.timestamp - a.timestamp);
                    case OrderEventType.SHIPPING_UPDATE:
                        return state.shippingUpdates.sort((a, b) => b.timestamp - a.timestamp);
                    case OrderEventType.PAYMENT_RECEIPT:
                        return state.receipts.sort((a, b) => b.timestamp - a.timestamp);
                    default:
                        return [];
                }
            },
        }),
        {
            name: 'nostr-merchant-OrderEvents',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Persist all message arrays and selected order ID
                orders: state.orders,
                paymentRequests: state.paymentRequests,
                statusUpdates: state.statusUpdates,
                shippingUpdates: state.shippingUpdates,
                receipts: state.receipts,
                selectedOrderId: state.selectedOrderId
            }),
        }
    )
);
