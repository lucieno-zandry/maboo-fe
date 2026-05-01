// routes/checkout/components/address/add-address-button.tsx
import { useCallback, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import AddressDialog from "~/components/address-dialog";
import { useAddresses } from "~/hooks/use-addresses";

export default function AddAddressButton() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { t } = useTranslation("checkout");
    const { addAddress, errors, submitting } = useAddresses();

    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        addAddress(formData, { onSuccess: () => setDialogOpen(false) });
    }, [addAddress]);

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="rounded-full shadow-sm transition-colors hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                onClick={() => setDialogOpen(true)}
            >
                <Plus className="mr-2 h-4 w-4" />
                {t("address.add_new", "Add New Address")}
            </Button>
            <AddressDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                errors={errors}
                loading={submitting}
            />
        </>
    );
}