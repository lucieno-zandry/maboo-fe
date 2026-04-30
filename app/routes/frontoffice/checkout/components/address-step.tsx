// routes/checkout/components/address-step.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAddresses } from "~/hooks/use-addresses";
import useCheckoutStore from "../stores/use-checkout-store";
import AddressList from "./address/address-list";
import AddressListSkeleton from "./address/address-list-skeleton";
import AddAddressButton from "./address/add-address-button";
import { Button } from "~/components/ui/button";

export default function AddressStep() {
    const { addresses, loading } = useAddresses();
    const { selectedAddressId, setSelectedAddressId, setStep, } = useCheckoutStore();
    const { t } = useTranslation("checkout");

    const handleSelect = (id: number) => setSelectedAddressId(id);
    const handleContinue = () => {
        if (selectedAddressId) setStep(2); // move to shipping
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold tracking-tight">
                    {t("address.title")}
                </h1>
                <AddAddressButton />
            </div>

            {loading && (
                <AddressListSkeleton />
            )}

            {addresses && !loading &&
                <AddressList
                    addresses={addresses}
                    selectedId={selectedAddressId}
                    onSelect={handleSelect}
                />}

            <div className="mt-8 flex justify-end">
                <Button
                    size="lg"
                    disabled={!selectedAddressId}
                    onClick={handleContinue}
                >
                    {t("address.continue_to_shipping")}
                </Button>
            </div>
        </section>
    );
}