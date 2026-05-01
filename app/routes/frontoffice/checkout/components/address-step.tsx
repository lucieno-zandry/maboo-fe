// routes/checkout/components/address-step.tsx
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { useAddresses } from "~/hooks/use-addresses";
import useCheckoutStore from "../stores/use-checkout-store";
import AddressList from "./address/address-list";
import AddressListSkeleton from "./address/address-list-skeleton";
import AddAddressButton from "./address/add-address-button";
import { Button } from "~/components/ui/button";

export default function AddressStep() {
    const { addresses, loading } = useAddresses();
    const { selectedAddressId, setSelectedAddressId, setStep } = useCheckoutStore();
    const { t } = useTranslation("checkout");

    const handleSelect = (id: number) => setSelectedAddressId(id);
    const handleContinue = () => {
        if (selectedAddressId) setStep(2); // move to shipping
    };

    useEffect(() => {
        if (!addresses || loading) return;
        const defaultAddress = addresses.find(address => address.is_default) || addresses.at(0);
        if (defaultAddress && !selectedAddressId) setSelectedAddressId(defaultAddress.id);
    }, [addresses, loading, selectedAddressId, setSelectedAddressId]);

    return (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t("address.title", "Shipping Address")}
                    </h1>
                </div>
                <AddAddressButton />
            </div>

            <div className="rounded-2xl border bg-card p-2 shadow-sm sm:p-4">
                {loading && <AddressListSkeleton />}

                {addresses && !loading && (
                    <AddressList
                        addresses={addresses}
                        selectedId={selectedAddressId}
                        onSelect={handleSelect}
                    />
                )}
            </div>

            <div className="mt-10 flex flex-col-reverse items-center justify-between gap-4 border-t pt-6 sm:flex-row">
                <Button
                    variant="ghost"
                    className="w-full rounded-full sm:w-auto"
                    onClick={() => setStep(0)}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("common.back_to_cart", "Back to cart")}
                </Button>
                <Button
                    size="lg"
                    className="w-full rounded-full px-8 text-base transition-transform hover:scale-[1.02] sm:w-auto"
                    disabled={!selectedAddressId}
                    onClick={handleContinue}
                >
                    {t("address.continue_to_shipping", "Continue to shipping")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </section>
    );
}