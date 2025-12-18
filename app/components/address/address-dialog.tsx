import { Form, useNavigation } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import FormField from "../custom-components/form-field";
import Button from "../custom-components/button";
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { useUserStore } from "~/hooks/use-user";

type AddressDialogProps = {
    address?: Address;
    isLoading?: boolean;
    isEdit: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isDefault?: boolean;
}


export function AddressDialog({
    address,
    isEdit,
    isLoading = false,
    onOpenChange,
    open,
    isDefault
}: AddressDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit address" : "New address"}
                    </DialogTitle>
                </DialogHeader>

                <Form method="post" className="space-y-4">
                    <input
                        type="hidden"
                        name="_intent"
                        value={isEdit ? "update" : "create"}
                    />

                    {isEdit && (
                        <input type="hidden" name="id" value={address!.id} />
                    )}

                    <FormField
                        name="fullname"
                        label="Full name"
                        defaultValue={address?.fullname}
                        required
                    />

                    <FormField
                        name="line1"
                        label="Address line 1"
                        defaultValue={address?.line1}
                        required
                    />

                    <FormField
                        name="line2"
                        label="Address line 2"
                        defaultValue={address?.line2 ?? ""}
                    />

                    <FormField
                        name="line3"
                        label="Address line 3"
                        defaultValue={address?.line3 ?? ""}
                    />

                    <FormField
                        name="phone_number"
                        label="Phone number"
                        defaultValue={address?.phone_number}
                        required
                    />

                    {/* New Switch for is_default */}
                    <div className="flex items-center justify-between rounded-md border p-3">
                        <Label htmlFor="is_default">Set as default</Label>
                        <Switch
                            id="is_default"
                            name="is_default"
                            defaultChecked={isDefault ?? false}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="submit" isLoading={isLoading}>
                            {isEdit ? "Save changes" : "Create address"}
                        </Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default function ({ address, ...props }: Pick<AddressDialogProps, "address" | "open" | "onOpenChange">) {
    const isEdit = Boolean(address);
    const navigation = useNavigation();
    const isLoading = navigation.state === "submitting";
    const { user } = useUserStore();

    const isDefault = address && user ? address.id === user.address_id : false;

    return <AddressDialog
        address={address}
        isEdit={isEdit}
        isLoading={isLoading}
        isDefault={isDefault}
        {...props} />
}