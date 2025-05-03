import { useCartStore } from "@/stores/useCartStore";
import ShippingForm from "@/layouts/ShippingForm.tsx";
import { createOrder } from "@/lib/nostr/createOrder.ts";
import { useCallback, useEffect } from "react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import postOrder from "@/lib/nostr/postOrder.ts";
import { useAccountStore } from "@/stores/useAccountStore";
import useWindowState, { WindowTypes } from "@/stores/useWindowState";
import BackButton from "@/components/Buttons/BackButton";

interface CartItem {
    eventId: string;
    productId: string;
    merchantPubkey: string;
    quantity: number;
    price: number;
    name: string;
    image: string;
}

interface OrderData {
    items: Array<{
        eventId: string;
        productId: string;
        quantity: number;
        price: number;
    }>;
    shipping?: {
        eventId: string;
        methodId: string;
    };
    address?: string;
    phone?: string;
    email?: string;
    message?: string;
}

async function prepareOrder(
    cart: CartItem[],
    shippingInfo: unknown,
    pubkey: string,
) {
    const isMultiMerchantCart = cart.some(
        (item) => item.merchantPubkey !== cart[0].merchantPubkey,
    );

    if (isMultiMerchantCart) {
        console.error("TODO: Process multi-merchant carts");
        return;
    }

    const addressString = typeof shippingInfo === "string"
        ? shippingInfo
        : JSON.stringify(shippingInfo);

    const orderData: OrderData = {
        items: cart.map((item) => ({
            eventId: item.eventId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        })),
        address: addressString,
        message: `Order from Pubkey: ${pubkey}`,
    };

    const order = await createOrder(orderData, cart[0].merchantPubkey);

    if (!order || !(order instanceof NDKEvent)) {
        console.error(
            "[ZapoutPage.prepareOrder] Failed to create order. Error:",
            order?.message || "Unknown error",
        );
        // TODO: Display error to user
        return;
    }

    postOrder(order, cart[0].merchantPubkey);
}

export default function ZapoutPage() {
    const { cart } = useCartStore();
    const { user, isLoggedIn, fetchUser } = useAccountStore();
    const { pushWindow } = useWindowState();

    // Format functions
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatPubkey = (pubkey) => {
        if (!pubkey) return "";
        return `${pubkey.substring(0, 8)}...${
            pubkey.substring(pubkey.length - 4)
        }`;
    };

    // Calculate cart totals
    const subtotal = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );

    const handleSubmit = useCallback((shippingInfo: unknown) => {
        if (user && isLoggedIn) {
            prepareOrder(cart, shippingInfo, user.npub);
        } else {
            console.error(
                "[ZapoutPage.handleSubmit] No active user, cannot submit order",
            );
        }
    }, [user, isLoggedIn, cart]);

    // Open login window function
    const openLoginWindow = () => {
        pushWindow(WindowTypes.LOGIN, {
            title: "Lock In",
            isFullScreen: true,
            disableClickOutside: true,
        });
    };

    // Refresh auth state and listen for changes
    useEffect(() => {
        // Check auth state immediately
        if (isLoggedIn) {
            fetchUser();
        }

        // Monitor localStorage for changes
        const handleStorageChange = (event) => {
            if (event.key === "nostr-merchant-auth") {
                console.log("Auth storage changed, refreshing state");
                // Re-fetch user if logged in
                if (isLoggedIn) {
                    fetchUser();
                }
            }
        };

        // Set up listeners
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [fetchUser, isLoggedIn]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <BackButton text="Back to Shopping" />
            <h1 className="text-3xl font-bold mb-8 text-primary">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items Section */}
                <div className="lg:col-span-2">
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 text-secondary">
                            Your Cart
                        </h2>

                        {cart.length === 0
                            ? (
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Your cart is empty.
                                </p>
                            )
                            : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div
                                            key={item.productId}
                                            className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-700 rounded-md shadow-xs"
                                        >
                                            <div className="w-16 h-16 shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            </div>
                                            <div className="grow">
                                                <h3 className="font-medium text-lg">
                                                    {item.name}
                                                </h3>
                                                <div className="text-neutral-600 dark:text-neutral-400 text-sm">
                                                    Quantity: {item.quantity}
                                                </div>
                                            </div>
                                            <div className="font-bold text-lg">
                                                {formatCurrency(item.price)}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex justify-between pt-4 border-t border-neutral-200 dark:border-neutral-600">
                                        <span className="font-medium">
                                            Subtotal:
                                        </span>
                                        <span className="font-bold">
                                            {formatCurrency(subtotal)}
                                        </span>
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* User Info Section */}
                    {isLoggedIn && user
                        ? (
                            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                                        N
                                    </div>
                                    <div>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Logged in as:
                                        </p>
                                        <p className="font-medium">
                                            {formatPubkey(user.npub)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                        : null}
                </div>

                {/* Shipping Form Section - without the constant re-rendering */}
                <div className="lg:col-span-1">
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6 sticky top-4">
                        {isLoggedIn && user
                            ? (
                                <>
                                    <h2 className="text-xl font-bold mb-4">
                                        Shipping Details
                                    </h2>
                                    <ShippingForm
                                        onSubmit={handleSubmit}
                                        cartPriceUsd={subtotal}
                                        onShippingCostUpdate={() => {
                                            console.log(
                                                "Shipping cost updated",
                                            );
                                        }}
                                    />
                                </>
                            )
                            : (
                                <div className="text-center py-6">
                                    <h2 className="text-xl font-bold mb-4">
                                        Sign In to Continue
                                    </h2>
                                    <p className="mb-6 text-neutral-600 dark:text-neutral-400">
                                        Please login with your Nostr account to
                                        complete your purchase.
                                    </p>
                                    <div className="inline-block">
                                        <button
                                            onClick={openLoginWindow}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-sm transition-colors"
                                        >
                                            Login with Nostr Signer Extension
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
