import React from "react";
import { type StoredOrderEvent } from "@/stores/useOrderStore";
import { OrderUtils } from "nostr-commerce-schema";

interface ShippingUpdateItemProps {
    order: StoredOrderEvent;
    onClick: (order: StoredOrderEvent) => void;
}

const ShippingUpdateItem: React.FC<ShippingUpdateItemProps> = (
    { order, onClick },
) => {
    const { event, orderId, unread, timestamp } = order;
    const { tracking } = OrderUtils.getTrackingInfo(event);

    return (
        <div
            className={`border p-4 rounded-lg mb-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                unread ? "bg-blue-50 border-blue-200" : ""
            }`}
            onClick={() => onClick(order)}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-lg">
                        Shipping Update
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
                    {tracking && (
                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                            Track Package
                        </button>
                    )}
                </div>
            </div>

            {/* Display order content if available */}
            {event.content && (
                <div className="mt-2 p-3 bg-gray-100 rounded text-sm">
                    {event.content}
                </div>
            )}
        </div>
    );
};

export default ShippingUpdateItem;
