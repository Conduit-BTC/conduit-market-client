import { useState } from "react";
import { z } from "zod";
// import ShippingCostCalculator from "./ShippingCostCalculator";

export const ShippingFormSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    address1: z.string().min(1, "Street address is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(5, "Valid zip code is required"),
    special_instructions: z.string().optional(),
});

const ShippingFormPropsSchema = z.object({
    onSubmit: z.function(),
    cartPriceUsd: z.number().positive(),
    error: z.string().optional(),
    onShippingCostUpdate: z.function()
        .args(z.number())
        .returns(z.void()),
});

// Infer the types from the schemas
// type ShippingFormData = z.infer<typeof ShippingFormSchema>;
type ShippingFormProps = z.infer<typeof ShippingFormPropsSchema>;

const ShippingForm = (
    { onSubmit, error, onShippingCostUpdate }: ShippingFormProps,
) => {
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError(null);

        try {
            const formData = {
                first_name: (e.target as any)["checkout-first_name"].value,
                last_name: (e.target as any)["checkout-last_name"].value,
                address1: (e.target as any)["checkout-address-1"].value,
                address2: (e.target as any)["checkout-address-2"].value,
                city: (e.target as any)["checkout-city"].value,
                state: (e.target as any)["checkout-state"].value,
                zip: (e.target as any)["checkout-zip"].value,
                special_instructions:
                    (e.target as any)["checkout-special-instructions"].value,
            };

            const validatedData = ShippingFormSchema.parse(formData);
            await onSubmit(validatedData);
        } catch (error) {
            console.error("Form submission error:", error);
            if (error instanceof z.ZodError) {
                setSubmitError(error.errors[0].message);
            } else {
                setSubmitError(
                    (error as Error).message ||
                        "Unable to connect to payment server",
                );
            }

            setTimeout(() => {
                setSubmitError(null);
            }, 5000);
        }
    };

    const displayError = error || submitError;

    return (
        <div className="p-4 md:p-8">
            {
                /* <ShippingCostCalculator
                onShippingCostCalculated={handleShippingCalculated}
            /> */
            }
            <div className="w-full h-1 bg-gray-600 my-8" />

            {displayError && (
                <div className="sticky top-0 z-50 w-full p-4 mb-8 bg-red-100 border-2 border-red-500 text-red-700 text-center rounded-sm text-lg font-bold">
                    {displayError} ❌
                </div>
            )}

            <h3 className="mb-2">{`Shipping Address`}</h3>
            <h6>
                {`We don't need to know you, we just need a place to send your coffee.`}
            </h6>

            <form onSubmit={handleSubmit}>
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="First Name"
                    id="checkout-first_name"
                    name="checkout-first_name"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="Last Name"
                    id="checkout-last_name"
                    name="checkout-last_name"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="Street Address"
                    id="checkout-address-1"
                    name="checkout-address-1"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="Street Address (line 2)"
                    id="checkout-address-2"
                    name="checkout-address-2"
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="City"
                    id="checkout-city"
                    name="checkout-city"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="State"
                    id="checkout-state"
                    name="checkout-state"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="Zip Code"
                    id="checkout-zip"
                    name="checkout-zip"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="Special Instructions?"
                    id="checkout-special-instructions"
                    name="checkout-special-instructions"
                />
                <button
                    type="submit"
                    className="w-full mt-8 bg-orange-600 hover:bg-orange-700 p-6 text-xl text-(--main-text-color) font-bold disabled:opacity-50"
                >
                    {`>> Pay With Lightning <<`}
                </button>
            </form>
        </div>
    );
};

export default ShippingForm;
