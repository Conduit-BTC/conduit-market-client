import React, { useState } from "react";
import { type StoredOrderEvent } from "@/stores/useOrderStore";
import { OrderUtils } from "nostr-commerce-schema";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Gift, Zap } from "lucide-react";

interface PaymentRequestItemProps {
    order: StoredOrderEvent;
    onClick: (order: StoredOrderEvent) => void;
    onSubmitPayment?: () => void;
}

const PaymentRequestItem: React.FC<PaymentRequestItemProps> = ({
    order,
    onClick,
    onSubmitPayment,
}) => {
    const { event, orderId, unread, timestamp, lightningInvoice } = order;
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(lightningInvoice || "");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // If we have a lightning invoice, display the payment interface
    if (lightningInvoice) {
        const lightningUri = `lightning:${lightningInvoice}`;

        return (
            <div
                className="w-full border border-blue-500 rounded-lg overflow-hidden"
                onClick={() => onClick(order)}
            >
                <div className="p-4 border-b border-gray-800 bg-gray-900">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-lg text-white flex items-center">
                                Payment Request
                                {unread && (
                                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        New
                                    </span>
                                )}
                            </h3>
                            <p className="text-gray-400">
                                {OrderUtils.getOrderSummary(event)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">
                                {OrderUtils.formatOrderTime(timestamp)}
                            </p>
                            <p className="text-sm text-gray-400">
                                Order ID: {orderId.substring(0, 12)}...
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-slate-900 p-6 relative overflow-hidden">
                    {/* Cyber corner decorations */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400/50 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-400/50 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400/50 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-400/50 rounded-br-lg" />

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                            <Zap className="text-yellow-400 w-5 h-5 animate-pulse" />
                            <span className="text-blue-400 font-mono text-lg">
                                Zap the Merchant
                            </span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Gift className="text-orange-400 w-5 h-5" />
                            <span className="text-orange-400 font-mono text-lg">
                                Get the Stuff!
                            </span>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="grid md:grid-cols-[1fr_2fr] gap-6 bg-slate-800/50 p-4 rounded-lg border border-blue-400/30">
                        <div className="relative group flex items-center justify-center">
                            <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors rounded-lg" />
                            <QRCodeSVG
                                value={lightningUri}
                                size={300}
                                className="bg-white p-3 rounded-lg"
                                level="M"
                            />
                        </div>
                        <div className="relative">
                            <div className="font-mono text-xs break-all text-slate-300 p-4 bg-slate-900 rounded-lg h-full border border-blue-400/20 overflow-hidden">
                                {lightningInvoice}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy();
                                    }}
                                    className="absolute bottom-2 right-2 p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                                    aria-label="Copy invoice"
                                >
                                    <Copy
                                        className={`w-4 h-4 ${
                                            copied
                                                ? "text-green-400"
                                                : "text-blue-400"
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="text-green-500 w-full text-center mt-4 animate-pulse">
                        ⚡ Waiting for payment...⚡
                    </div>
                    <div className="text-center mt-4 text-sm text-gray-300 w-full">
                        If your wallet has confirmed the payment, then your
                        purchase was a success. Keep a copy of your Lightning
                        invoice in case you need to contact us for order
                        support.
                    </div>
                </div>
            </div>
        );
    }

    // Initial state (no lightning invoice yet)
    return (
        <div
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md"
            onClick={() => onClick(order)}
        >
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg dark:text-white flex items-center">
                            Payment Request
                            {unread && (
                                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    New
                                </span>
                            )}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            {OrderUtils.getOrderSummary(event)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Order ID: {orderId.substring(0, 16)}...
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {OrderUtils.formatOrderTime(timestamp)}
                        </p>
                    </div>
                    <button
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onSubmitPayment) onSubmitPayment();
                        }}
                    >
                        Pay With Lightning
                    </button>
                </div>

                {/* Display order content if available */}
                {event.content && (
                    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm dark:text-gray-200">
                        {event.content}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentRequestItem;
