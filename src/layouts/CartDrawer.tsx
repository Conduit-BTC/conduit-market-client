import { useCartStore } from "@/stores/useCartStore";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import ZapoutButton from "@/components/Buttons/ZapoutButton.tsx";

export const CartDrawer = () => {
    const {
        cart,
        decreaseQuantity,
        addToCart,
        isCartOpen,
        closeCart,
    } = useCartStore();

    const [cartTotal, setCartTotal] = useState(0);

    // Calculate cart total whenever cart changes
    useEffect(() => {
        const total = cart.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0,
        );
        setCartTotal(total);
    }, [cart]);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 bg-opacity-50 transition-opacity z-10 ${
                    isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={closeCart}
            />

            <section
                className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-neutral-800 shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                } flex flex-col`}
            >
                <header className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-lg font-bold text-primary">
                        Your Cart
                    </h2>
                    <button
                        onClick={closeCart}
                        className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        aria-label="Close cart"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="grow overflow-y-auto">
                    {cart.length === 0
                        ? (
                            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                <ShoppingCart
                                    size={48}
                                    className="text-neutral-400 mb-4"
                                />
                                <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                                    Your cart is empty
                                </p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-500">
                                    Add some products to get started!
                                </p>
                            </div>
                        )
                        : (
                            <div className="p-4 flex flex-col gap-4">
                                {cart.map((product, i) => (
                                    <div
                                        key={product.id + `-${i}`}
                                        className="flex items-center p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 shadow-xs"
                                    >
                                        <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-white mr-3">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="grow mr-2">
                                            <h3 className="font-medium text-neutral-900 dark:text-white text-sm">
                                                {product.name}
                                            </h3>
                                            <div className="text-primary font-bold text-sm">
                                                {formatCurrency(product.price)}
                                            </div>
                                        </div>
                                        <div className="flex items-center border border-neutral-200 dark:border-neutral-600 rounded-md overflow-hidden h-8">
                                            <button
                                                onClick={() =>
                                                    decreaseQuantity(product)}
                                                className="px-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors h-full"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="px-2 text-center min-w-[30px]">
                                                {product.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    addToCart(product)}
                                                className="px-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors h-full"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>

                {cart.length > 0 && (
                    <div className="border-t border-neutral-200 dark:border-neutral-700 p-4">
                        <div className="flex justify-between mb-4">
                            <span className="font-medium">Subtotal:</span>
                            <span className="font-bold">
                                {formatCurrency(cartTotal)}
                            </span>
                        </div>
                        <ZapoutButton
                            onClick={closeCart}
                            className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors"
                        >
                            Proceed to Checkout
                        </ZapoutButton>
                    </div>
                )}
            </section>
        </>
    );
};
