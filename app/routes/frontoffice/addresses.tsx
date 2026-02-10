import {
    redirect,
    useActionData,
    useLoaderData,
    useNavigation,
} from "react-router"
import type { ActionFunctionArgs } from "react-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"; // 1. Import hook

import {
    Card,
    CardContent,
} from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"

import {
    Plus,
    Trash2,
} from "lucide-react"

import { createAddress, getAuthAddresses, removeAddresses, updateAddress } from "~/api/http-requests"
import AddressDialog from "~/components/addresses/address-dialog"
import { toast } from "sonner"
import AddressCard from "~/components/addresses/address-card"
import { useUserStore } from "~/hooks/use-user"
import useAddressStore from "~/hooks/use-address-store"
import ConfirmDeleteDialog from "~/components/addresses/confirm-delete-dialog"
import { HttpException, ValidationException } from "~/api/app-fetch"
import i18next from "i18next";
import i18n from "~/i18n/i18n";

/* ----------------------------------------
   Loader & Action (Logic remains same)
---------------------------------------- */
// Note: In clientAction, consider using i18next.t() if you need 
// server-side-style translations for toasts.

export async function clientLoader() {
    const { authAddresses, setAuthAddresses } = useAddressStore.getState();
    if (authAddresses) return authAddresses;

    const response = await getAuthAddresses();

    if (response.data?.addresses) {
        setAuthAddresses(response.data.addresses);
    }

    return response.data?.addresses;
}

export async function clientAction({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData()
    const intent = formData.get("_intent");
    const { setUser, user } = useUserStore.getState();
    const { setAuthAddresses } = useAddressStore.getState();
    const { lang } = params;

    const isDefault = formData.get('is_default');
    if (!isDefault) formData.set("is_default", "0");

    try {
        if (intent === "create-address") {
            const response = await createAddress(formData);
            if (response.data) setUser(response.data.user);
            setAuthAddresses(null);
            toast.success(i18next.t('addresses:notifications.created')); // Simplified for brevity
            return redirect(`/${lang}/addresses`)
        }

        if (intent === "update-address") {
            const id = Number(formData.get("id"));
            const response = await updateAddress(id, formData);
            if (response.data) setUser(response.data.user);
            setAuthAddresses(null);
            toast.success(i18next.t('addresses:notifications.updated')); // Simplified for brevity
            return redirect(`/${lang}/addresses`)
        }

        if (intent === "delete") {
            const id = Number(formData.get("id"));
            await removeAddresses([id]);
            if (user?.address_id === id) setUser({ ...user, address_id: undefined });
            setAuthAddresses(null);
            toast.success(i18next.t('addresses:notifications.deleted')); // Simplified for brevity

            return redirect(`/${lang}/addresses`)
        }

        if (intent === "bulk-delete") {
            const ids = formData.getAll("ids[]").map((v) => Number(v));
            await removeAddresses(ids as number[]);
            setAuthAddresses(null);
            toast.success(i18next.t('addresses:notifications.bulk_deleted')); // Simplified for brevity
            return redirect(`/${lang}/addresses`)
        }
    } catch (error) {
        return error;
    }
    return null
}

export default function AddressesPage() {
    const { t } = useTranslation(["addresses", "common"]);
    const addresses = useLoaderData<Address[]>();
    const navigation = useNavigation();

    const selectedAddresses = useAddressStore((s) => s.selectedAddresses);
    const setSelectedAddresses = useAddressStore((s) => s.setSelectedAddresses);

    const [editing, setEditing] = useState<Address>();
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const actionData = useActionData();

    useEffect(() => {
        if (navigation.state === "idle" && !(actionData instanceof HttpException || actionData instanceof ValidationException)) {
            setDialogOpen(false);
            setConfirmDeleteDialogOpen(false);
            setSelectedAddresses([]);
        }
    }, [navigation.state, actionData, setSelectedAddresses]);

    return (
        <>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">{t("addresses:title")}</h1>
                    <Button
                        onClick={() => {
                            setEditing(undefined);
                            setDialogOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {t("addresses:new_address")}
                    </Button>
                </div>

                {/* List Toolbar */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={addresses.length > 0 && selectedAddresses.length === addresses.length}
                            onCheckedChange={(v) => {
                                v ? setSelectedAddresses(addresses) : setSelectedAddresses([]);
                            }}
                            aria-label={t("addresses:select_all")}
                        />
                        <span className="text-sm text-muted-foreground">{t("addresses:select_all")}</span>
                    </div>

                    <ConfirmDeleteDialog
                        ids={selectedAddresses.map((a) => a.id)}
                        open={confirmDeleteDialogOpen}
                        onOpenChange={setConfirmDeleteDialogOpen}
                        trigger={
                            <Button type="button" variant="destructive" disabled={selectedAddresses.length === 0}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("addresses:delete_selected")}
                            </Button>
                        }
                        isLoading={navigation.state === "submitting"}
                    />
                </div>

                <div className="grid gap-4">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            onEdit={(addr) => {
                                setEditing(addr);
                                setDialogOpen(true);
                            }}
                        />
                    ))}

                    {addresses.length === 0 && (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                {t("addresses:no_addresses")}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <AddressDialog
                onOpenChange={setDialogOpen}
                open={dialogOpen}
                address={editing}
            />
        </>
    );
}