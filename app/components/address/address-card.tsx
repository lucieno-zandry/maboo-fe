import { Form, useNavigation } from "react-router";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import useAddressStore from "~/hooks/use-address-store";
import { Checkbox } from "../ui/checkbox";
import ConfirmDeleteDialog from "./confirm-delete-dialog";

type AddressCardProps = {
    address: Address;
    onEdit: (address: Address) => void;
};

export default function AddressCard({ address, onEdit }: AddressCardProps) {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const selectedAddresses = useAddressStore((s) => s.selectedAddresses);
    const setSelectedAddresses = useAddressStore((s) => s.setSelectedAddresses);

    const isChecked = selectedAddresses.some((a) => a.id === address.id);

    const toggleSelected = () => {
        if (isChecked) {
            setSelectedAddresses(selectedAddresses.filter((a) => a.id !== address.id));
        } else {
            setSelectedAddresses([...selectedAddresses, address]);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-start gap-3">
                    <Checkbox
                        checked={isChecked}
                        onCheckedChange={toggleSelected}
                    />

                    <div>
                        <div className="flex items-center gap-2">
                            <CardTitle>{address.fullname}</CardTitle>
                            {address.is_default ? (
                                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                    Default
                                </span>
                            ) : null}
                        </div>
                        <CardDescription>
                            {address.line1}
                            {address.line2 && `, ${address.line2}`}
                            {address.line3 && `, ${address.line3}`}
                        </CardDescription>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onEdit(address)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>

                    <ConfirmDeleteDialog
                        ids={[address.id]}
                        isLoading={isSubmitting}
                        trigger={
                            <Button
                                size="icon"
                                variant="destructive"
                                disabled={isSubmitting}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        }
                    />
                </div>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground">
                📞 {address.phone_number}
            </CardContent>
        </Card>
    );
}