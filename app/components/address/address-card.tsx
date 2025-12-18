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

type AddressCardProps = {
    address: Address;
    onEdit: (address: Address) => void;
    isDefault: boolean;
};

export default function AddressCard({ address, onEdit, isDefault = false }: AddressCardProps) {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <CardTitle>{address.fullname}</CardTitle>
                        {isDefault ? (
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

                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onEdit(address)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>

                    <Form method="post">
                        <input type="hidden" name="_intent" value="delete" />
                        <input type="hidden" name="id" value={address.id} />
                        <Button
                            size="icon"
                            variant="destructive"
                            disabled={isSubmitting}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </Form>
                </div>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground">
                📞 {address.phone_number}
            </CardContent>
        </Card>
    );
}