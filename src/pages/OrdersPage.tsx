import React, { useState } from "react";
import {
    OrderEventType,
    type StoredOrderEvent,
    useOrderStore,
} from "@/stores/useOrderStore";
import { useOrderSubscription } from "@/hooks/useOrderSubscription";
import { OrderUtils } from "nostr-commerce-schema";
import BackButton from "@/components/Buttons/BackButton";

enum OrderTab {
    PAYMENT_REQUESTS = "payment_requests",
    SHIPPING_UPDATES = "shipping_updates",
    RECEIPTS = "receipts",
}

const OrdersPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<OrderTab>(
        OrderTab.PAYMENT_REQUESTS,
    );

    const {
        getOrders,
        getPaymentRequests,
        getShippingUpdates,
        getReceipts,
        markAsRead,
    } = useOrderStore();

    // Use the subscription hook directly
    const { isLoading, error } = useOrderSubscription();

    // Get all orders
    const orders = getOrders();

    // Get the relevant orders based on the active tab
    const getFilteredOrders = (): StoredOrderEvent[] => {
        switch (activeTab) {
            case OrderTab.PAYMENT_REQUESTS:
                return getPaymentRequests();
            case OrderTab.SHIPPING_UPDATES:
                return getShippingUpdates();
            case OrderTab.RECEIPTS:
                return getReceipts();
            default:
                return orders.sort((a, b) => b.timestamp - a.timestamp);
        }
    };

    const handleOrderClick = (order: StoredOrderEvent) => {
        // Mark the order as read when clicked
        markAsRead(order.orderId, order.type);
    };

    // Render a single order item
    const renderOrderItem = (order: StoredOrderEvent) => {
        const { event, orderId, type, unread, timestamp } = order;

        return (
            <div
                key={order.id}
                className={`border p-4 rounded-lg mb-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    unread ? "bg-blue-50 border-blue-200" : ""
                }`}
                onClick={() => handleOrderClick(order)}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg">
                            {type === OrderEventType.ORDER && "New Order"}
                            {type === OrderEventType.PAYMENT_REQUEST &&
                                "Payment Request"}
                            {type === OrderEventType.SHIPPING_UPDATE &&
                                "Shipping Update"}
                            {type === OrderEventType.PAYMENT_RECEIPT &&
                                "Payment Receipt"}
                            {unread && (
                                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    New
                                </span>
                            )}
                        </h3>
                        <p className="text-gray-600">
                            {OrderUtils.getOrderSummary(event)}
                        </p>
                        <p className="text-sm text-gray-500">
                            Order ID: {orderId}
                        </p>
                        <p className="text-sm text-gray-500">
                            {OrderUtils.formatOrderTime(timestamp)}
                        </p>
                    </div>
                    <div>
                        {/* Add action buttons based on order type */}
                        {type === OrderEventType.PAYMENT_REQUEST && (
                            <button className="bg-green-500 text-white px-3 py-1 rounded-sm hover:bg-green-600">
                                Pay Now
                            </button>
                        )}
                        {type === OrderEventType.SHIPPING_UPDATE && (() => {
                            const { tracking } = OrderUtils.getTrackingInfo(
                                event,
                            );
                            return tracking
                                ? (
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded-sm hover:bg-blue-600">
                                        Track Package
                                    </button>
                                )
                                : null;
                        })()}
                    </div>
                </div>

                {/* Display order content if available */}
                {event.content && (
                    <div className="mt-2 p-3 bg-gray-100 rounded-sm text-sm">
                        {event.content}
                    </div>
                )}
            </div>
        );
    };

    const filteredOrders = getFilteredOrders();

    return (
        <div className="container mx-auto p-4">
            <BackButton text="Back to Shopping" />
            <h1 className="text-2xl font-bold mb-6">Orders</h1>

            {/* Tab navigation */}
            <div className="flex border-b mb-6">
                <button
                    className={`px-4 py-2 ${
                        activeTab === OrderTab.PAYMENT_REQUESTS
                            ? "border-b-2 border-blue-500 text-blue-500"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab(OrderTab.PAYMENT_REQUESTS)}
                >
                    Payment Requests
                </button>
                <button
                    className={`px-4 py-2 ${
                        activeTab === OrderTab.SHIPPING_UPDATES
                            ? "border-b-2 border-blue-500 text-blue-500"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab(OrderTab.SHIPPING_UPDATES)}
                >
                    Shipping Updates
                </button>
                <button
                    className={`px-4 py-2 ${
                        activeTab === OrderTab.RECEIPTS
                            ? "border-b-2 border-blue-500 text-blue-500"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab(OrderTab.RECEIPTS)}
                >
                    Receipts
                </button>
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="flex items-center justify-center p-8">
                    <div className="text-lg text-gray-500">
                        Loading orders...
                    </div>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-sm mb-4">
                    Error: {error}
                </div>
            )}

            {/* Order list */}
            <div className="space-y-4">
                {filteredOrders.map(renderOrderItem)}
            </div>
        </div>
    );
};

export default OrdersPage;
