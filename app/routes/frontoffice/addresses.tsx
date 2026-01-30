import {
    redirect,
    useActionData,
    useLoaderData,
    useNavigation,
} from "react-router"

import type { ActionFunctionArgs } from "react-router"
import { useEffect, useState } from "react"

import {
    Card,
    CardContent,
} from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"

import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
} from "lucide-react"

import { createAddress, getAuthAddresses, removeAddresses, updateAddress } from "~/api/http-requests"
import AddressDialog from "~/components/address/address-dialog"
import { toast } from "sonner"
import AddressCard from "~/components/address/address-card"
import { useUserStore } from "~/hooks/use-user"
import useAddressStore from "~/hooks/use-address-store"
import ConfirmDeleteDialog from "~/components/address/confirm-delete-dialog"
import { HttpException, ValidationException, type FormatedResponse } from "~/api/app-fetch"

/* ----------------------------------------
   Loader
---------------------------------------- */
export async function clientLoader() {
    const { authAddresses, setAuthAddresses } = useAddressStore.getState();
    if (authAddresses) return authAddresses;

    const response = await getAuthAddresses();

    if (response.data?.addresses) {
        setAuthAddresses(response.data.addresses);
    }

    return response.data?.addresses;
}

/* ----------------------------------------
   Action
---------------------------------------- */
export async function clientAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const intent = formData.get("_intent");
    const { setUser, user } = useUserStore.getState();
    const { setAuthAddresses, authAddresses } = useAddressStore.getState();

    const isDefault = formData.get('is_default');

    if (!isDefault)
        formData.set("is_default", "0");

    try {
        if (intent === "create-address") {
            const response = await createAddress(formData);

            if (response.data)
                setUser(response.data.user);

            setAuthAddresses(null);

            toast.success("Address created successfully");
            return redirect("addresses")
        }

        if (intent === "update-address") {
            const id = Number(formData.get("id"));

            const response = await updateAddress(id, formData);

            if (response.data)
                setUser(response.data.user);

            setAuthAddresses(null);

            toast.success("Address updated successfully");
            return redirect("addresses")
        }

        if (intent === "delete") {
            const id = Number(formData.get("id"));
            await removeAddresses([id]);

            if (user?.address_id === id)
                setUser({ ...user, address_id: null });

            setAuthAddresses(null);

            toast.success("Address removed successfully");
            return redirect("addresses")
        }

        if (intent === "bulk-delete") {
            // form inputs named `ids[]`
            const ids = formData.getAll("ids[]").map((v) => Number(v));
            await removeAddresses(ids as number[]);

            setAuthAddresses(null);

            toast.success("Selected addresses removed successfully");
            return redirect("addresses")
        }
    } catch (error) {
        return error;
    }

    return null
}

/* ----------------------------------------
   Component
---------------------------------------- */
export default function AddressesPage() {
    const addresses = useLoaderData<Address[]>();
    const navigation = useNavigation()

    const selectedAddresses = useAddressStore((s) => s.selectedAddresses);
    const setSelectedAddresses = useAddressStore((s) => s.setSelectedAddresses);

    const [editing, setEditing] = useState<Address>();
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

    const actionData = useActionData();

    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        // When navigation goes idle AND no error was returned, close dialog
        if (navigation.state === "idle" && !(actionData instanceof HttpException || actionData instanceof ValidationException)) {
            setDialogOpen(false);
            setConfirmDeleteDialogOpen(false);
            // clear selections after successful actions
            setSelectedAddresses([]);
        }
    }, [navigation.state, actionData]);

    return (
        <>
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Addresses</h1>
                    <Button
                        onClick={() => {
                            setEditing(undefined);
                            setDialogOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New address
                    </Button>
                </div>

                {/* List */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={selectedAddresses.length > 0 && selectedAddresses.length === addresses.length}
                            onCheckedChange={(v) => {
                                if (v) {
                                    setSelectedAddresses(addresses);
                                } else {
                                    setSelectedAddresses([]);
                                }
                            }}
                            aria-label="Select all addresses"
                        />
                        <span className="text-sm text-muted-foreground">Select all</span>
                    </div>

                    {/* Bulk delete confirm dialog */}
                    <ConfirmDeleteDialog
                        ids={selectedAddresses.map((a) => a.id)}
                        open={confirmDeleteDialogOpen}
                        onOpenChange={setConfirmDeleteDialogOpen}
                        trigger={
                            <Button type="button" variant="destructive" disabled={selectedAddresses.length === 0}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete selected
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
                                No addresses yet
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