import {
    Form,
    redirect,
    useActionData,
    useLoaderData,
    useNavigation,
} from "react-router"

import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router"
import { useEffect, useState } from "react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"

import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
} from "lucide-react"
import { createAddress, getAuthAddresses, removeAddress, updateAddress } from "~/api/http-requests"
import AddressDialog from "~/components/address/address-dialog"
import { toast } from "sonner"
import AddressCard from "~/components/address/address-card"
import { useUserStore } from "~/hooks/use-user"
import type { FormatedResponse } from "~/api/app-fetch"

/* ----------------------------------------
   Loader
---------------------------------------- */
export async function clientLoader() {
    const response = await getAuthAddresses();
    return response.data?.addresses;
}

/* ----------------------------------------
   Action
---------------------------------------- */
export async function clientAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const intent = formData.get("_intent");
    const isDefault = formData.get("is_default");
    const { setUser } = useUserStore.getState();

    let response: FormatedResponse<{
        address: Address;
        user: User;
    }>;

    formData.set("is_default", isDefault === "on" ? "1" : "0");

    try {
        if (intent === "create") {
            response = await createAddress(formData);

            if (response.data?.user)
                setUser(response.data.user);

            toast.success("Address created successfully");
            return redirect("/addresses")
        }

        if (intent === "update") {
            const id = formData.get("id")

            response = await updateAddress(Number(id), formData);

            if (response.data?.user)
                setUser(response.data.user);

            toast.success("Address updated successfully");

            return redirect("/addresses")
        }

        if (intent === "delete") {
            const id = formData.get("id");
            response = await removeAddress([Number(id)]);
            
            if (response.data?.user)
                setUser(response.data.user);

            toast.success("Address removed successfully");
            return redirect("/addresses")
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
    const { user } = useUserStore();

    const [editing, setEditing] = useState<Address>();
    const actionData = useActionData<{ error?: string }>();

    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        // When navigation goes idle AND no error was returned, close dialog
        if (navigation.state === "idle" && !actionData?.error) {
            setDialogOpen(false);
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
                <div className="grid gap-4">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            onEdit={(addr) => {
                                setEditing(addr);
                                setDialogOpen(true);
                            }}
                            isDefault={user ? address.id === user.address_id : false}
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