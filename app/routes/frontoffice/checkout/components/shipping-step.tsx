// routes/checkout/components/shipping-step.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router";
import { fetchAvailableShippingMethods } from "~/api/http-requests";
import { useAddresses } from "~/hooks/use-addresses";
import ShippingMethodList from "./shipping/shipping-method-list";
import ShippingMethodSkeleton from "./shipping/shipping-method-skeleton";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { HttpException } from "~/api/app-fetch";
import useCheckoutStore from "../stores/use-checkout-store";

export default function ShippingStep() {
    const { t } = useTranslation("checkout");
    const { selectedAddressId, selectedShippingMethodId, setSelectedShippingMethodId, setStep } = useCheckoutStore();
    const { addresses } = useAddresses();
    const loaderData = useLoaderData() as { cart_items: CartItem[] }; // from loader
    const [available, setAvailable] = useState<{ method: ShippingMethod; cost: number }[] | null>(null);
    const [loading, setLoading] = useState(false);

    const selectedAddress = addresses?.find(a => a.id === selectedAddressId) ?? null;

    useEffect(() => {
        if (!selectedAddressId || !selectedAddress || !loaderData?.cart_items) {
            setAvailable(null);
            return;
        }

        const cartItems = loaderData.cart_items.map(item => ({
            weight: item.variant_snapshot.weight_kg ?? 0,
            quantity: item.count,
            price: item.unit_price,
        }));

        setLoading(true);
        fetchAvailableShippingMethods({
            address_id: selectedAddressId,
            cart_items: cartItems,
        })
            .then(response => {
                setAvailable(response.data?.available ?? []);
                // if no method selected yet, maybe auto-select cheapest? We'll leave for now.
            })
            .catch(err => {
                if (err instanceof HttpException) {
                    toast.error(err.data?.message || "Failed to load shipping methods");
                }
                setAvailable([]);
            })
            .finally(() => setLoading(false));
    }, [selectedAddressId, selectedAddress, loaderData.cart_items]);

    const handleContinue = () => {
        if (selectedShippingMethodId) setStep(3);
    };

    return (
        <section>
            <h1 className="text-2xl font-bold tracking-tight mb-6">
                {t("shipping.title")}
            </h1>

            {loading ? (
                <ShippingMethodSkeleton />
            ) : available ? (
                <ShippingMethodList
                    methods={available}
                    selectedId={selectedShippingMethodId}
                    onSelect={setSelectedShippingMethodId}
                />
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    {t("shipping.select_address_first")}
                </div>
            )}

            <div className="mt-8 flex justify-end">
                <Button
                    size="lg"
                    disabled={!selectedShippingMethodId}
                    onClick={handleContinue}
                >
                    {t("shipping.continue_to_payment")}
                </Button>
            </div>
        </section>
    );
}