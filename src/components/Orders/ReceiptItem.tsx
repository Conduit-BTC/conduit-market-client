import React from "react";
import { type StoredOrderEvent } from "@/stores/useOrderStore";
import { OrderUtils } from "nostr-commerce-schema";

interface ReceiptItemProps {
    order: StoredOrderEvent;
    onClick: (order: StoredOrderEvent) => void;
}

const ReceiptItem: React.FC<ReceiptItemProps> = ({ order, onClick }) => {
    const { event, orderId, unread, timestamp } = order;

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
                        Payment Receipt
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
                    <button className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                        Download
                    </button>
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

export default ReceiptItem;
