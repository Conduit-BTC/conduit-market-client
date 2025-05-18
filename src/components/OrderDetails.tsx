import React from "react";
import { type NostrEvent } from "@nostr-dev-kit/ndk";
import { OrderUtils } from "nostr-commerce-schema";

interface OrderDetailsProps {
    event: NostrEvent;
    onClose?: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ event, onClose }) => {
    const {
        formatSats,
        getOrderContactDetails,
        getOrderItems,
        getPaymentMethod,
        getTrackingInfo,
    } = OrderUtils;

    const orderIdTag = event.tags.find((tag) => tag[0] === "order");
    const orderId = orderIdTag && orderIdTag[1] ? orderIdTag[1] : "Unknown";

    const amountTag = event.tags.find((tag) => tag[0] === "amount");
    const amount = amountTag && amountTag[1] ? amountTag[1] : null;

    const typeTag = event.tags.find((tag) => tag[0] === "type");
    const type = typeTag && typeTag[1] ? typeTag[1] : null;

    // For payment requests
    const paymentMethod = getPaymentMethod(event);

    // For shipping updates
    const trackingInfo = getTrackingInfo(event);

    // For orders
    const items = type === "1" ? getOrderItems(event) : [];
    const contactDetails = type === "1" ? getOrderContactDetails(event) : null;

    // For payment receipts
    const paymentTags = event.kind === 17
        ? event.tags.filter((tag) => tag[0] === "payment")
        : [];

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Order Details</h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-medium text-gray-700 mb-2">
                        Basic Information
                    </h3>
                    <div className="space-y-2">
                        <p>
                            <span className="text-gray-500">Order ID:</span>
                            {" "}
                            {orderId}
                        </p>
                        {amount && (
                            <p>
                                <span className="text-gray-500">Amount:</span>
                                {" "}
                                {formatSats(amount)}
                            </p>
                        )}
                        <p>
                            <span className="text-gray-500">Type:</span>{" "}
                            {type === "1"
                                ? "Order Creation"
                                : type === "2"
                                ? "Payment Request"
                                : type === "3"
                                ? "Status Update"
                                : type === "4"
                                ? "Shipping Update"
                                : event.kind === 17
                                ? "Payment Receipt"
                                : "Unknown"}
                        </p>
                        <p>
                            <span className="text-gray-500">Date:</span>{" "}
                            {new Date(event.created_at * 1000).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div>
                    {/* Show relevant details based on order type */}
                    {type === "1" && items.length > 0 && (
                        <>
                            <h3 className="font-medium text-gray-700 mb-2">
                                Items
                            </h3>
                            <ul className="space-y-2">
                                {items.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between"
                                    >
                                        <span>{item.productRef}</span>
                                        <span>Qty: {item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {contactDetails && (
                        <>
                            <h3 className="font-medium text-gray-700 mt-4 mb-2">
                                Contact Details
                            </h3>
                            {contactDetails.address && (
                                <p>
                                    <span className="text-gray-500">
                                        Address:
                                    </span>{" "}
                                    {contactDetails.address}
                                </p>
                            )}
                            {contactDetails.email && (
                                <p>
                                    <span className="text-gray-500">
                                        Email:
                                    </span>{" "}
                                    {contactDetails.email}
                                </p>
                            )}
                            {contactDetails.phone && (
                                <p>
                                    <span className="text-gray-500">
                                        Phone:
                                    </span>{" "}
                                    {contactDetails.phone}
                                </p>
                            )}
                        </>
                    )}

                    {type === "2" && paymentMethod && (
                        <>
                            <h3 className="font-medium text-gray-700 mb-2">
                                Payment Information
                            </h3>
                            <p>
                                <span className="text-gray-500">Method:</span>
                                {" "}
                                {paymentMethod.type}
                            </p>
                            <div className="mt-2 p-2 bg-gray-100 rounded-sm text-sm break-all">
                                {paymentMethod.value}
                            </div>
                        </>
                    )}

                    {type === "4" && (
                        <>
                            <h3 className="font-medium text-gray-700 mb-2">
                                Shipping Information
                            </h3>
                            {trackingInfo.status && (
                                <p>
                                    <span className="text-gray-500">
                                        Status:
                                    </span>{" "}
                                    {trackingInfo.status}
                                </p>
                            )}
                            {trackingInfo.tracking && (
                                <p>
                                    <span className="text-gray-500">
                                        Tracking:
                                    </span>{" "}
                                    {trackingInfo.tracking}
                                </p>
                            )}
                            {trackingInfo.carrier && (
                                <p>
                                    <span className="text-gray-500">
                                        Carrier:
                                    </span>{" "}
                                    {trackingInfo.carrier}
                                </p>
                            )}
                            {trackingInfo.eta && (
                                <p>
                                    <span className="text-gray-500">ETA:</span>
                                    {" "}
                                    {trackingInfo.eta.toLocaleString()}
                                </p>
                            )}
                        </>
                    )}

                    {event.kind === 17 && paymentTags.length > 0 && (
                        <>
                            <h3 className="font-medium text-gray-700 mb-2">
                                Payment Receipt
                            </h3>
                            {paymentTags.map((tag, index) => (
                                <div key={index} className="mb-2">
                                    <p>
                                        <span className="text-gray-500">
                                            Method:
                                        </span>{" "}
                                        {tag[1]}
                                    </p>
                                    <p>
                                        <span className="text-gray-500">
                                            Reference:
                                        </span>{" "}
                                        {tag[2]}
                                    </p>
                                    {tag[3] && (
                                        <p>
                                            <span className="text-gray-500">
                                                Proof:
                                            </span>{" "}
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
            {event.content && (
                <div className="mt-6">
                    <h3 className="font-medium text-gray-700 mb-2">Message</h3>
                    <div className="bg-gray-100 p-4 rounded-sm whitespace-pre-wrap">
                        {event.content}
                    </div>
                </div>
            )}

            {/* Action buttons */}
            <div className="mt-6 flex justify-end space-x-3">
                {type === "2" && (
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-sm">
                        Process Payment
                    </button>
                )}
                {type === "1" && (
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-sm">
                        Send Payment Request
                    </button>
                )}
                {type === "4" && trackingInfo.tracking && (
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-sm">
                        Track Package
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;
