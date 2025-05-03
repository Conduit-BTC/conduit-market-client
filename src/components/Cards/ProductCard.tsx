import React, { useMemo, useState } from "react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import {
    type ProductListing,
    ProductListingUtils,
    validateProductListing,
} from "nostr-commerce-schema";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./CardComponents.tsx";
import Button from "@/components/Buttons/Button.tsx";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore.ts";

const PLACEHOLDER_IMAGE = "/api/placeholder/400/300";

interface ProductCardProps {
    event: NDKEvent;
}

const ProductCard: React.FC<ProductCardProps> = ({ event }) => {
    // Memoize the validation check so it only runs when the event changes
    const validationMemo = useMemo(() => {
        const validationResult = validateProductListing(event);

        if (!validationResult.success) {
            console.warn("Invalid product event:", validationResult.error);
            return { valid: false, productEvent: null };
        }

        // Now we can safely treat it as a ProductListing
        return {
            valid: true,
            productEvent: event as unknown as ProductListing,
        };
    }, [event.id, event.tags, event.content, event.pubkey]); // Dependencies that should trigger revalidation

    // Early return if validation failed
    if (!validationMemo.valid) {
        return null;
    }

    const productEvent = validationMemo.productEvent!;
    const { pubkey } = event;
    const { addToCart } = useCartStore();

    const [imageError, setImageError] = useState(false);

    // Use schema functions to extract data
    const productId = ProductListingUtils.getProductId(productEvent);
    const title = ProductListingUtils.getProductTitle(productEvent);
    const price = ProductListingUtils.getProductPrice(productEvent);
    const images = ProductListingUtils.getProductImages(productEvent);
    const stock = ProductListingUtils.getProductStock(productEvent);
    const summary = ProductListingUtils.getProductSummary(productEvent);

    // If any required field is missing, don't render the card
    if (!productId || !title || !price) {
        console.warn("Product missing required fields:", {
            productId,
            title,
            price,
        });
        return null;
    }

    // Format price with currency
    const formatPrice = () => {
        if (!price) return "Price not set";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: price.currency || "USD",
        }).format(parseFloat(price.amount));
    };

    const mainImage = images.length > 0 && !imageError
        ? images[0].url
        : PLACEHOLDER_IMAGE;

    const handleAddToCart = () => {
        addToCart({
            eventId: event.id,
            productId,
            tags: event.tags,
            image: mainImage,
            name: title,
            price: parseFloat(price.amount),
            currency: price.currency,
            quantity: 1,
            merchantPubkey: pubkey,
        });
    };

    return (
        <Card className="w-full max-w-sm overflow-hidden">
            <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                <img
                    src={mainImage}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                    loading="lazy"
                />
                {stock !== null && stock <= 5 && stock > 0 && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-xs font-bold px-2 py-1 rounded-sm">
                        Only {stock} left
                    </span>
                )}
                {stock === 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-xs font-bold px-2 py-1 rounded-sm">
                        Out of stock
                    </span>
                )}
            </div>
            <CardHeader>
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                <p className="text-xs text-gray-500">
                    {pubkey}
                </p>
                {summary && (
                    <CardDescription className="line-clamp-2">
                        {summary}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <div className="inline-flex px-3 py-1 text-sm font-medium bg-gray-700 text-gray-100 rounded-md mb-4">
                    {formatPrice()}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <Button
                    onClick={handleAddToCart}
                    disabled={stock === 0}
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
